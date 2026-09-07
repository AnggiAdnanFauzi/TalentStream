<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Application;
use App\Models\Stage;

class AnalyticsController extends Controller
{
    public function index()
    {
        $totalApplicants = Application::count();
        $totalHired = Application::where('stage_id', 'hired')->count();
        $avgScore = Application::avg('total_score') ?? 0;
        $acceptanceRate = $totalApplicants > 0 ? round(($totalHired / $totalApplicants) * 100, 1) : 0;

        // Funnel data
        $stages = Stage::orderBy('order')->get();
        $funnelData = [];
        foreach ($stages as $stage) {
            $count = Application::where('stage_id', $stage->id)->count();
            $funnelData[] = [
                'name' => $stage->name,
                'value' => $count,
                'fill' => $stage->color,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'totalApplicants' => $totalApplicants,
                'totalHired' => $totalHired,
                'averageScore' => round($avgScore, 1),
                'acceptanceRate' => $acceptanceRate,
                'funnelData' => $funnelData,
            ]
        ]);
    }
}