<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $companyId = $request->company_id;
            $query->whereHas('application', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }
        $tasks = $query->get();
        return response()->json(['success' => true, 'data' => $tasks]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'application_id' => 'nullable|string',
            'due_date' => 'nullable|string',
            'assignee_id' => 'nullable|string',
        ]);

        $task = Task::create([
            'id' => 'task' . time(),
            'title' => $data['title'],
            'application_id' => $data['application_id'] ?? null,
            'due_date' => $data['due_date'] ?? null,
            'assignee_id' => $data['assignee_id'] ?? null,
            'status' => 'To Do',
        ]);

        return response()->json(['success' => true, 'data' => $task], 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Task not found'], 404);
        }
        $task->update($request->all());
        return response()->json(['success' => true, 'data' => $task]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        if ($task) {
            $task->delete();
        }
        return response()->json(['success' => true, 'message' => 'Task deleted']);
    }
}