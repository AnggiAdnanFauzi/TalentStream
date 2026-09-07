<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Stages
        Schema::create('stages', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('name');
            $table->string('color')->default('#3b82f6');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 2. Interviewers
        Schema::create('interviewers', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('name');
            $table->string('role');
            $table->timestamps();
        });

        // 3. Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('Active'); // Active, On Hold, Completed
            $table->string('owner_id', 100)->nullable();
            $table->string('created_date')->nullable();
            $table->timestamps();
        });

        // 4. Requisitions
        Schema::create('requisitions', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('title');
            $table->string('department');
            $table->string('location');
            $table->string('employment_type')->default('Full-time');
            $table->integer('headcount')->default(1);
            $table->string('experience_level')->nullable();
            $table->bigInteger('salary_min')->default(0);
            $table->bigInteger('salary_max')->default(0);
            $table->string('deadline')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->string('job_id', 100)->nullable();
            $table->timestamps();
        });

        // 5. Job Postings
        Schema::create('job_postings', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('title');
            $table->string('department');
            $table->string('level');
            $table->string('location');
            $table->string('status')->default('Open'); // Open, On Hold, Closed
            $table->string('employment_type')->default('Full-time');
            $table->integer('total_applicants')->default(0);
            $table->integer('days_open')->default(0);
            $table->bigInteger('salary_min')->default(0);
            $table->bigInteger('salary_max')->default(0);
            $table->string('deadline')->nullable();
            $table->string('project_id', 100)->nullable();
            $table->longText('job_description')->nullable();
            $table->json('competencies')->nullable();
            $table->json('interview_questions')->nullable();
            $table->timestamps();
        });

        // 6. Candidates
        Schema::create('candidates', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('name');
            $table->text('avatar_url')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->integer('experience_years')->default(0);
            $table->bigInteger('expected_salary')->default(0);
            $table->text('portfolio_url')->nullable();
            $table->text('cv_url')->nullable();
            $table->text('address')->nullable();
            $table->string('date_of_birth')->nullable();
            $table->string('major')->nullable();
            $table->text('skills')->nullable();
            $table->text('hobbies')->nullable();
            $table->text('aspirations')->nullable();
            $table->text('strengths')->nullable();
            $table->text('weaknesses')->nullable();
            $table->text('linkedin_url')->nullable();
            $table->timestamps();
        });

        // 7. Applications
        Schema::create('applications', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('candidate_id', 100);
            $table->string('job_id', 100);
            $table->string('stage_id', 100)->default('applied');
            $table->string('applied_date');
            $table->json('scorecard')->nullable();
            $table->integer('total_score')->default(0);
            $table->string('source')->default('Career Site');
            $table->boolean('knocked_out')->default(false);
            $table->json('notes')->nullable();
            $table->json('stage_history')->nullable();
            $table->timestamps();
        });

        // 8. Interviews
        Schema::create('interviews', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('application_id', 100);
            $table->string('type')->default('Recruiter Screen');
            $table->string('date_time');
            $table->json('interviewers')->nullable();
            $table->text('location_or_link')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('Scheduled'); // Scheduled, Completed
            $table->json('scorecard')->nullable();
            $table->string('recommendation')->nullable(); // Strong Hire, Hire, No Hire
            $table->timestamps();
        });

        // 9. Tasks
        Schema::create('tasks', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('application_id', 100)->nullable();
            $table->string('title');
            $table->string('due_date')->nullable();
            $table->string('assignee_id', 100)->nullable();
            $table->string('status')->default('To Do'); // To Do, Completed
            $table->timestamps();
        });

        // 10. Transactions (SaaS Billing)
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('user_id', 100);
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('plan')->default('pro');
            $table->string('date');
            $table->string('status')->default('success'); // success, pending, failed
            $table->text('invoice_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('requisitions');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('interviewers');
        Schema::dropIfExists('stages');
    }
};
