<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Requisition;

class RequisitionController extends Controller
{
    public function index(Request $request)
    {
        $query = Requisition::with('job')->orderBy('created_at', 'desc');
        if ($request->has('company_id') && $request->company_id !== 'all' && !empty($request->company_id)) {
            $query->where('company_id', $request->company_id);
        }
        $requisitions = $query->get();
        return response()->json(['success' => true, 'data' => $requisitions]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'location' => 'required|string',
            'employment_type' => 'required|string',
            'headcount' => 'required|integer',
            'experience_level' => 'nullable|string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric',
            'deadline' => 'nullable|string',
        ]);

        $requisition = Requisition::create(array_merge($data, [
            'id' => 'req' . time(),
            'status' => 'Pending',
        ]));

        return response()->json(['success' => true, 'data' => $requisition], 201);
    }

    public function update(Request $request, $id)
    {
        $requisition = Requisition::find($id);
        if (!$requisition) {
            return response()->json(['success' => false, 'message' => 'Requisition not found'], 404);
        }
        $requisition->update($request->all());
        return response()->json(['success' => true, 'data' => $requisition]);
    }
}