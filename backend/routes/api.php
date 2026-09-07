<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\PaymentController;

// Auth routes
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);
Route::post("/profile", [AuthController::class, "updateProfile"]);
Route::get("/admin/users", [AuthController::class, "listUsers"]);
Route::put("/admin/users/{id}", [AuthController::class, "updateUser"]);
Route::delete("/admin/users/{id}", [AuthController::class, "deleteUser"]); // Soft delete / archive
Route::post("/admin/users/{id}/restore", [AuthController::class, "restoreUser"]); // Restore archived user

// Public routes for candidate application & job view
Route::get("/jobs", [JobController::class, "index"]);
Route::get("/jobs/{id}", [JobController::class, "show"]);
Route::post("/applications", [ApplicationController::class, "store"]); // Public application form submit
Route::post("/upload", [UploadController::class, "uploadFile"]);
Route::get("/feedbacks", [FeedbackController::class, "index"]);
Route::post("/feedbacks", [FeedbackController::class, "store"]); // Cloudinary upload (CV, PDF, Avatar)

// Pipeline & Data endpoints
Route::get("/stages", [StageController::class, "index"]);
Route::get("/projects", [ProjectController::class, "index"]);
Route::get("/candidates", [CandidateController::class, "index"]);
Route::get("/applications", [ApplicationController::class, "index"]);
Route::get("/interviews", [InterviewController::class, "index"]);
Route::get("/requisitions", [RequisitionController::class, "index"]);
Route::get("/tasks", [TaskController::class, "index"]);
Route::get("/analytics", [AnalyticsController::class, "index"]);

// Recruiter actions (CRUD)
Route::post("/jobs", [JobController::class, "store"]);
Route::put("/jobs/{id}", [JobController::class, "update"]);
Route::delete("/jobs/{id}", [JobController::class, "destroy"]);

Route::put("/applications/{id}", [ApplicationController::class, "update"]);
Route::delete("/applications/{id}", [ApplicationController::class, "destroy"]);

Route::post("/candidates", [CandidateController::class, "store"]);
Route::put("/candidates/{id}", [CandidateController::class, "update"]);

Route::post("/interviews", [InterviewController::class, "store"]);
Route::put("/interviews/{id}", [InterviewController::class, "update"]);

Route::post("/requisitions", [RequisitionController::class, "store"]);
Route::put("/requisitions/{id}", [RequisitionController::class, "update"]);

Route::post("/projects", [ProjectController::class, "store"]);
Route::put("/projects/{id}", [ProjectController::class, "update"]);

Route::post("/tasks", [TaskController::class, "store"]);
Route::put("/tasks/{id}", [TaskController::class, "update"]);
Route::delete("/tasks/{id}", [TaskController::class, "destroy"]);

Route::middleware("auth:sanctum")->group(function () {
    Route::get("/user", [AuthController::class, "me"]);
    Route::post("/logout", [AuthController::class, "logout"]);
});

// Midtrans Payment & Billing Routes
Route::post("/payment/snap-token", [PaymentController::class, "createSnapToken"]);
Route::post("/payment/notification", [PaymentController::class, "handleNotification"]);
Route::get("/payment/transactions", [PaymentController::class, "getTransactions"]);
Route::post("/payment/simulate-success", [PaymentController::class, "simulatePaymentSuccess"]);
