<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;
use App\Models\User;

class PaymentController extends Controller
{
    /**
     * Create Midtrans Snap Token
     */
    public function createSnapToken(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:pro,enterprise',
            'period' => 'nullable|string|in:monthly,yearly',
        ]);

        $plan = strtolower($request->plan);
        $period = $request->input('period', 'monthly');

        // Determine price in IDR (gross_amount)
        if ($plan === 'pro') {
            $amount = $period === 'yearly' ? 7500000 : 750000; // Rp 750.000 / bln
            $planName = 'TalentStream Pro Plan (' . ucfirst($period) . ')';
        } else {
            $amount = $period === 'yearly' ? 35000000 : 3500000; // Rp 3.500.000 / bln
            $planName = 'TalentStream Enterprise Plan (' . ucfirst($period) . ')';
        }

        // Get authenticated user from token or request
        $bearer = $request->bearerToken();
        $user = null;
        if ($bearer) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($bearer);
            if ($token) {
                $user = $token->tokenable;
            }
        }

        $userId = $user ? $user->id : ($request->input('user_id', 'user-02'));
        $userName = $user ? $user->name : ($request->input('user_name', 'Client Admin'));
        $userEmail = $user ? $user->email : ($request->input('user_email', 'admin@talentstream.com'));
        $userPhone = $user ? $user->phone : ($request->input('user_phone', '+62 812-3456-7890'));

        $orderId = 'TS-INV-' . time() . '-' . rand(100, 999);

        // Record pending transaction in DB
        $transaction = Transaction::create([
            'id' => $orderId,
            'user_id' => $userId,
            'amount' => $amount,
            'plan' => $plan,
            'date' => now()->toDateString(),
            'status' => 'pending',
            'invoice_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $orderId,
        ]);

        // Midtrans Snap Configuration
        $serverKey = env('MIDTRANS_SERVER_KEY', config('services.midtrans.server_key', 'SB-Mid-server-talentstream-demo'));
        $isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        $snapApiUrl = $isProduction 
            ? 'https://app.midtrans.com/snap/v1/transactions' 
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $amount,
            ],
            'customer_details' => [
                'first_name' => $userName,
                'email' => $userEmail,
                'phone' => $userPhone,
            ],
            'item_details' => [
                [
                    'id' => $plan,
                    'price' => (int) $amount,
                    'quantity' => 1,
                    'name' => $planName,
                ]
            ],
            'callbacks' => [
                'finish' => 'http://localhost:3000/?payment_status=finish',
            ]
        ];

        $snapToken = null;
        $redirectUrl = null;

        // Try calling real Midtrans Snap API if valid server key is configured
        if ($serverKey && strpos($serverKey, 'demo') === false) {
            try {
                $response = Http::withBasicAuth($serverKey, '')
                    ->withHeaders(['Content-Type' => 'application/json', 'Accept' => 'application/json'])
                    ->timeout(8)
                    ->post($snapApiUrl, $params);

                if ($response->successful()) {
                    $resData = $response->json();
                    $snapToken = $resData['token'] ?? null;
                    $redirectUrl = $resData['redirect_url'] ?? null;
                } else {
                    Log::warning('Midtrans Snap request warning: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::warning('Midtrans API connection failed: ' . $e->getMessage());
            }
        }

        // Sandbox simulator fallback token if API key is in sandbox offline mode
        if (!$snapToken) {
            $snapToken = 'SANDBOX-TOKEN-' . md5($orderId . $amount . $serverKey);
            $redirectUrl = 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $snapToken;
        }

        return response()->json([
            'success' => true,
            'order_id' => $orderId,
            'snap_token' => $snapToken,
            'redirect_url' => $redirectUrl,
            'amount' => $amount,
            'plan' => $plan,
            'client_key' => env('MIDTRANS_CLIENT_KEY', 'Mid-client-JTfZ9mV9UV7ak3DY')
        ]);
    }

    /**
     * Handle Webhook / Notification from Midtrans
     */
    public function handleNotification(Request $request)
    {
        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $grossAmount = $request->input('gross_amount');
        $serverKey = env('MIDTRANS_SERVER_KEY', config('services.midtrans.server_key', 'SB-Mid-server-talentstream-demo'));
        $signatureKey = $request->input('signature_key');

        // Verify SHA512 signature if server key is present and not demo
        if ($serverKey && $signatureKey && strpos($serverKey, 'demo') === false) {
            $mySignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
            if ($mySignature !== $signatureKey) {
                return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
            }
        }

        $transactionStatus = $request->input('transaction_status');
        $fraudStatus = $request->input('fraud_status');

        $transaction = Transaction::find($orderId);
        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        $isSuccess = false;

        if ($transactionStatus == 'capture') {
            if ($fraudStatus == 'challenge') {
                $transaction->status = 'challenge';
            } else if ($fraudStatus == 'accept') {
                $transaction->status = 'success';
                $isSuccess = true;
            }
        } else if ($transactionStatus == 'settlement') {
            $transaction->status = 'success';
            $isSuccess = true;
        } else if ($transactionStatus == 'pending') {
            $transaction->status = 'pending';
        } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            $transaction->status = 'failed';
        }

        $transaction->save();

        // If payment succeeded, upgrade user subscription
        if ($isSuccess) {
            $user = User::find($transaction->user_id);
            if ($user) {
                $plan = $transaction->plan ?: 'pro';
                $user->subscription = [
                    'type' => $plan,
                    'status' => 'active',
                    'expiryDate' => now()->addDays(30)->toISOString(),
                    'limitJobs' => $plan === 'enterprise' ? 9999 : 999,
                    'limitCandidates' => $plan === 'enterprise' ? 99999 : 9999,
                ];
                $user->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification processed successfully',
            'status' => $transaction->status,
        ]);
    }

    /**
     * Get transaction list for current user
     */
    public function getTransactions(Request $request)
    {
        $bearer = $request->bearerToken();
        $user = null;
        if ($bearer) {
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($bearer);
            if ($token) {
                $user = $token->tokenable;
            }
        }

        $query = Transaction::orderBy('created_at', 'desc');

        // If not super admin, scope to user transactions
        if ($user && $user->role !== 'super_admin') {
            $query->where('user_id', $user->id);
        } elseif (!$user && $request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $transactions = $query->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Simulator Endpoint for Testing Midtrans Sandbox Success
     */
    public function simulatePaymentSuccess(Request $request)
    {
        $orderId = $request->input('order_id');
        $transaction = Transaction::find($orderId);

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
        }

        $transaction->status = 'success';
        $transaction->save();

        $user = User::find($transaction->user_id);
        if ($user) {
            $plan = $transaction->plan ?: 'pro';
            $user->subscription = [
                'type' => $plan,
                'status' => 'active',
                'expiryDate' => now()->addDays(30)->toISOString(),
                'limitJobs' => $plan === 'enterprise' ? 9999 : 999,
                'limitCandidates' => $plan === 'enterprise' ? 99999 : 9999,
            ];
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran simulasi Midtrans berhasil diverifikasi!',
            'transaction' => $transaction,
            'user' => $user
        ]);
    }
}
