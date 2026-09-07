<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\Job;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::with(['candidate', 'job', 'stage', 'interviews'])->orderBy('created_at', 'desc');

        // Multi-tenant scoping: if company_id is provided, filter by company
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $query->where('company_id', $request->company_id);
        }

        $applications = $query->get();
        return response()->json(['success' => true, 'data' => $applications]);
    }

    public function store(Request $request)
    {
        // Used when candidate submits public form or HR adds manually
        $request->validate([
            'job_id' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
        ]);

        // Automatically determine company_id from the job posting
        $job = Job::find($request->input('job_id'));
        $companyId = $job && $job->company_id ? $job->company_id : $request->input('company_id', 'demo-user');

        // 1. Create or update Candidate
        $candidateId = 'cand' . time() . rand(10, 99);
        $candidate = Candidate::create([
            'id' => $candidateId,
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'avatar_url' => 'https://picsum.photos/seed/' . urlencode($request->input('name')) . '/100',
            'experience_years' => $request->input('experience_years', $request->input('experienceYears', 0)),
            'expected_salary' => $request->input('expected_salary', $request->input('expectedSalary', 0)),
            'portfolio_url' => $request->input('portfolio_url', $request->input('portfolioUrl')),
            'cv_url' => $request->input('cv_url', $request->input('cvUrl')),
            'address' => $request->input('address'),
            'date_of_birth' => $request->input('date_of_birth', $request->input('dateOfBirth')),
            'major' => $request->input('major'),
            'skills' => is_array($request->input('skills')) ? implode(', ', $request->input('skills')) : $request->input('skills'),
            'hobbies' => $request->input('hobbies'),
            'aspirations' => $request->input('aspirations'),
            'strengths' => $request->input('strengths'),
            'weaknesses' => $request->input('weaknesses'),
            'linkedin_url' => $request->input('linkedin_url', $request->input('linkedinUrl')),
        ]);

        // 2. Scorecard default generator
        $scorecard = [
            ['name' => 'Experience Match', 'weight' => 0.4, 'score' => rand(70, 95)],
            ['name' => 'Technical Skills', 'weight' => 0.4, 'score' => rand(70, 95)],
            ['name' => 'Cultural Fit', 'weight' => 0.2, 'score' => rand(80, 98)],
        ];
        $totalScore = intval(
            $scorecard[0]['score'] * 0.4 +
            $scorecard[1]['score'] * 0.4 +
            $scorecard[2]['score'] * 0.2
        );

        // 3. Create Application with isolated company_id
        $applicationId = 'app' . time() . rand(10, 99);
        $application = Application::create([
            'id' => $applicationId,
            'candidate_id' => $candidate->id,
            'job_id' => $request->input('job_id'),
            'company_id' => $companyId,
            'stage_id' => 'applied',
            'applied_date' => now()->toISOString(),
            'source' => $request->input('source', 'Career Site'),
            'scorecard' => $scorecard,
            'total_score' => $totalScore,
            'stage_history' => [
                ['stageId' => 'applied', 'date' => now()->toISOString(), 'changedBy' => 'Applicant Submission']
            ],
        ]);

        // Increment total applicants count on job
        Job::where('id', $request->input('job_id'))->increment('total_applicants');

        return response()->json([
            'success' => true,
            'data' => $application->load(['candidate', 'job', 'stage'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $application = Application::find($id);
        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        $data = $request->all();

        // If stage changed, append to stage history
        if (isset($data['stage_id']) && $data['stage_id'] !== $application->stage_id) {
            $history = $application->stage_history ?? [];
            $history[] = [
                'stageId' => $data['stage_id'],
                'date' => now()->toISOString(),
                'changedBy' => auth()->user()?->name ?? 'HR Team'
            ];
            $data['stage_history'] = $history;
        }

        $application->update($data);
        return response()->json(['success' => true, 'data' => $application->load(['candidate', 'job', 'stage'])]);
    }

    public function destroy($id)
    {
        $application = Application::find($id);
        if ($application) {
            $application->delete();
        }
        return response()->json(['success' => true, 'message' => 'Application deleted']);
    }
}
