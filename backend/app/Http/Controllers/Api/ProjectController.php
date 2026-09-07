<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('jobs')->orderBy('created_at', 'desc');
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $query->where('company_id', $request->company_id);
        }
        $projects = $query->get();
        return response()->json(['success' => true, 'data' => $projects]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'owner_id' => 'nullable|string',
        ]);

        $project = Project::create([
            'id' => 'proj' . time(),
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'status' => 'Active',
            'owner_id' => $data['owner_id'] ?? 'int01',
            'created_date' => now()->toISOString(),
        ]);

        return response()->json(['success' => true, 'data' => $project], 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['success' => false, 'message' => 'Project not found'], 404);
        }
        $project->update($request->all());
        return response()->json(['success' => true, 'data' => $project]);
    }
}