<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add company_name and status to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'company_name')) {
                $table->string('company_name', 150)->nullable()->after('name');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status', 50)->default('active')->after('role'); // active, archived
            }
        });

        // 2. Add company_id to job_postings table
        Schema::table('job_postings', function (Blueprint $table) {
            if (!Schema::hasColumn('job_postings', 'company_id')) {
                $table->string('company_id', 100)->nullable()->index()->after('project_id');
            }
        });

        // 3. Add company_id to applications table
        Schema::table('applications', function (Blueprint $table) {
            if (!Schema::hasColumn('applications', 'company_id')) {
                $table->string('company_id', 100)->nullable()->index()->after('job_id');
            }
        });

        // 4. Add company_id to projects table
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'company_id')) {
                $table->string('company_id', 100)->nullable()->index()->after('owner_id');
            }
        });

        // 5. Add company_id to requisitions table
        Schema::table('requisitions', function (Blueprint $table) {
            if (!Schema::hasColumn('requisitions', 'company_id')) {
                $table->string('company_id', 100)->nullable()->index()->after('job_id');
            }
        });

        // 6. Update existing users with their company names
        DB::table('users')->where('id', 'super-admin-01')->update([
            'company_name' => 'TalentStream Global Platform',
            'status' => 'active'
        ]);
        DB::table('users')->where('id', 'demo-user')->update([
            'company_name' => 'TalentStream Demo Corp',
            'status' => 'active'
        ]);
        DB::table('users')->where('id', 'user-02')->update([
            'company_name' => 'TechCorp Solutions',
            'status' => 'active'
        ]);
        DB::table('users')->where('id', 'user-03')->update([
            'company_name' => 'Nusantara Tech Startup',
            'status' => 'active'
        ]);
        DB::table('users')->where('id', 'user-04')->update([
            'company_name' => 'Global Innovations Ltd',
            'status' => 'active'
        ]);
        DB::table('users')->where('id', 'user-05')->update([
            'company_name' => 'Fintech Prima Indonesia',
            'status' => 'active'
        ]);

        // 7. Seed company_id on existing jobs so each company has their own jobs
        // user-03 (Budi Santoso - Nusantara Tech Startup)
        DB::table('job_postings')->whereIn('id', ['fsd01', 'css01'])->update(['company_id' => 'user-03']);
        // user-02 (Sarah Jenkins - TechCorp Solutions)
        DB::table('job_postings')->whereIn('id', ['pm01', 'ux01'])->update(['company_id' => 'user-02']);
        // user-04 (Alex Rivera - Global Innovations Ltd)
        DB::table('job_postings')->where('id', 'dm01')->update(['company_id' => 'user-04']);
        // fallback for any other jobs
        DB::table('job_postings')->whereNull('company_id')->update(['company_id' => 'user-03']);

        // 8. Update applications to inherit the company_id from their job
        $jobs = DB::table('job_postings')->select('id', 'company_id')->get();
        foreach ($jobs as $job) {
            DB::table('applications')->where('job_id', $job->id)->update(['company_id' => $job->company_id]);
        }
        DB::table('applications')->whereNull('company_id')->update(['company_id' => 'user-03']);

        // 9. Update projects and requisitions
        DB::table('projects')->whereNull('company_id')->update(['company_id' => 'user-03']);
        DB::table('requisitions')->whereNull('company_id')->update(['company_id' => 'user-03']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'company_name')) {
                $table->dropColumn('company_name');
            }
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }
        });

        Schema::table('job_postings', function (Blueprint $table) {
            if (Schema::hasColumn('job_postings', 'company_id')) {
                $table->dropColumn('company_id');
            }
        });

        Schema::table('applications', function (Blueprint $table) {
            if (Schema::hasColumn('applications', 'company_id')) {
                $table->dropColumn('company_id');
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'company_id')) {
                $table->dropColumn('company_id');
            }
        });

        Schema::table('requisitions', function (Blueprint $table) {
            if (Schema::hasColumn('requisitions', 'company_id')) {
                $table->dropColumn('company_id');
            }
        });
    }
};
