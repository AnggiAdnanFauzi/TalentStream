<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Interview;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Interview::with('application.candidate', 'application.job');
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $companyId = $request->company_id;
            $query->whereHas('application', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }
        $interviews = $query->get();
        return response()->json(['success' => true, 'data' => $interviews]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'application_id' => 'required|string',
            'type' => 'required|string',
            'date_time' => 'required|string',
            'location_or_link' => 'nullable|string',
            'interviewers' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $interview = Interview::create([
            'id' => 'iv' . time(),
            'application_id' => $data['application_id'],
            'type' => $data['type'],
            'date_time' => $data['date_time'],
            'location_or_link' => $data['location_or_link'] ?? 'Online Meeting',
            'interviewers' => $data['interviewers'] ?? [],
            'notes' => $data['notes'] ?? '',
            'status' => 'Scheduled',
        ]);

        return response()->json(['success' => true, 'data' => $interview], 201);
    }

    public function update(Request $request, $id)
    {
        $interview = Interview::find($id);
        if (!$interview) {
            return response()->json(['success' => false, 'message' => 'Interview not found'], 404);
        }
        $interview->update($request->all());
        return response()->json(['success' => true, 'data' => $interview]);
    }
}