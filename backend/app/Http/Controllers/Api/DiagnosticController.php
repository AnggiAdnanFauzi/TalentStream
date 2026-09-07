<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\DiagnosticHistory;
use App\Models\User;

class DiagnosticController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth('sanctum')->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $query = DiagnosticHistory::query();
        if ($userId) {
            $query->where('user_id', $userId);
        }

        $histories = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $histories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_score' => 'required|numeric',
            'grade' => 'required|string|max:5',
            'net_cashflow' => 'required|numeric',
            'runway_months' => 'required|numeric',
            'inputs' => 'nullable|array',
            'sub_scores' => 'nullable|array',
            'action_plan' => 'nullable|array',
            'email' => 'nullable|string|email',
        ]);

        $userId = auth('sanctum')->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $history = DiagnosticHistory::create([
            'user_id' => $userId,
            'total_score' => $validated['total_score'],
            'grade' => $validated['grade'],
            'net_cashflow' => $validated['net_cashflow'],
            'runway_months' => $validated['runway_months'],
            'inputs' => $validated['inputs'] ?? null,
            'sub_scores' => $validated['sub_scores'] ?? null,
            'action_plan' => $validated['action_plan'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Diagnostic result saved successfully to MySQL',
            'data' => $history,
        ], 201);
    }

    public function clear(Request $request)
    {
        $userId = auth('sanctum')->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        DiagnosticHistory::where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Diagnostic history cleared successfully',
        ]);
    }
}
