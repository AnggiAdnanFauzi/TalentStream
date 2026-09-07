<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = Candidate::with('applications')->orderBy('created_at', 'desc');

        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $companyId = $request->company_id;
            $query->whereHas('applications', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }

        $candidates = $query->get();
        return response()->json(['success' => true, 'data' => $candidates]);
    }

    public function show($id)
    {
        $candidate = Candidate::with('applications.job', 'applications.interviews')->find($id);
        if (!$candidate) {
            return response()->json(['success' => false, 'message' => 'Candidate not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $candidate]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'experience_years' => 'nullable|numeric',
            'expected_salary' => 'nullable|numeric',
            'portfolio_url' => 'nullable|string',
            'cv_url' => 'nullable|string',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|string',
            'major' => 'nullable|string',
            'skills' => 'nullable|string',
            'hobbies' => 'nullable|string',
            'aspirations' => 'nullable|string',
            'strengths' => 'nullable|string',
            'weaknesses' => 'nullable|string',
            'linkedin_url' => 'nullable|string',
        ]);

        $candidateId = 'cand' . time();
        $avatarUrl = 'https://picsum.photos/seed/' . urlencode($data['name']) . '/100';

        $candidate = Candidate::create(array_merge($data, [
            'id' => $candidateId,
            'avatar_url' => $avatarUrl,
        ]));

        return response()->json(['success' => true, 'data' => $candidate], 201);
    }

    public function update(Request $request, $id)
    {
        $candidate = Candidate::find($id);
        if (!$candidate) {
            return response()->json(['success' => false, 'message' => 'Candidate not found'], 404);
        }
        $candidate->update($request->all());
        return response()->json(['success' => true, 'data' => $candidate]);
    }
}