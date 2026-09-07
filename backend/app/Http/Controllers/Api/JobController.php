<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Requisition;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with('project')->orderBy('created_at', 'desc');

        // Multi-tenant scoping: if company_id is provided and not 'all', filter by company
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $query->where('company_id', $request->company_id);
        }

        $jobs = $query->get();
        return response()->json(['success' => true, 'data' => $jobs]);
    }

    public function show($id)
    {
        $job = Job::with('project')->find($id);
        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Job not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $job]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'level' => 'required|string',
            'location' => 'required|string',
            'employment_type' => 'required|string',
            'salary_min' => 'numeric',
            'salary_max' => 'numeric',
            'job_description' => 'nullable|string',
            'deadline' => 'nullable|string',
            'project_id' => 'nullable|string',
            'company_id' => 'nullable|string',
            'requisition_id' => 'nullable|string',
            'competencies' => 'nullable|array',
            'interview_questions' => 'nullable|array',
        ]);

        $companyId = $data['company_id'] ?? auth()->id() ?? 'demo-user';

        $jobId = 'job' . time();
        $job = Job::create([
            'id' => $jobId,
            'title' => $data['title'],
            'department' => $data['department'],
            'level' => $data['level'],
            'location' => $data['location'],
            'status' => 'Open',
            'employment_type' => $data['employment_type'],
            'salary_min' => $data['salary_min'] ?? 0,
            'salary_max' => $data['salary_max'] ?? 0,
            'deadline' => $data['deadline'] ?? null,
            'project_id' => $data['project_id'] ?? null,
            'company_id' => $companyId,
            'job_description' => $data['job_description'] ?? '',
            'competencies' => $data['competencies'] ?? [],
            'interview_questions' => $data['interview_questions'] ?? [],
        ]);

        if (!empty($data['requisition_id'])) {
            Requisition::where('id', $data['requisition_id'])->update([
                'status' => 'Approved',
                'job_id' => $job->id,
            ]);
        }

        return response()->json(['success' => true, 'data' => $job], 201);
    }

    public function update(Request $request, $id)
    {
        $job = Job::find($id);
        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Job not found'], 404);
        }
        $job->update($request->all());
        return response()->json(['success' => true, 'data' => $job]);
    }

    public function destroy($id)
    {
        $job = Job::find($id);
        if ($job) {
            $job->delete();
        }
        return response()->json(['success' => true, 'message' => 'Job deleted']);
    }
}
