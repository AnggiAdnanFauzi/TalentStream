<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $feedbacks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'tool_category' => 'nullable|string',
            'feedback_type' => 'nullable|string',
        ]);

        $feedback = Feedback::create([
            'id' => 'fb-' . time() . '-' . rand(100, 999),
            'user_id' => $request->user_id ?? 'guest',
            'user_name' => $request->user_name ?? 'Anonymous Recruiter',
            'user_email' => $request->user_email ?? 'anonymous@talentstream.com',
            'tool_category' => $request->tool_category ?? 'general',
            'rating' => (int)$request->rating,
            'feedback_type' => $request->feedback_type ?? 'suggestion',
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback submitted successfully',
            'data' => $feedback
        ], 201);
    }
}
