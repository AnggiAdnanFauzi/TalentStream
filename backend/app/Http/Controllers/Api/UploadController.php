<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UploadController extends Controller
{
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // max 20MB
        ]);

        $file = $request->file('file');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Cloudinary credentials not configured',
            ], 500);
        }

        $timestamp = time();
        $folder = 'talentstream_uploads';

        $paramsToSign = [
            'folder' => $folder,
            'timestamp' => $timestamp,
        ];
        ksort($paramsToSign);

        $paramString = '';
        foreach ($paramsToSign as $key => $value) {
            $paramString .= "{$key}={$value}&";
        }
        $paramString = rtrim($paramString, '&') . $apiSecret;
        $signature = sha1($paramString);

        try {
            $response = Http::attach(
                'file',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/auto/upload", [
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => $folder,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $secureUrl = $data['secure_url'] ?? $data['url'];

                return response()->json([
                    'success' => true,
                    'message' => 'File successfully uploaded to Cloudinary CDN',
                    'url' => $secureUrl,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Cloudinary upload rejected',
                'details' => $response->json(),
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload error: ' . $e->getMessage(),
            ], 500);
        }
    }
}