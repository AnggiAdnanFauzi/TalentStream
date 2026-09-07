<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stage;

class StageController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Stage::orderBy('order')->get()]);
    }
}