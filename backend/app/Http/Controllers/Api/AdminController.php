<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DiagnosticHistory;

class AdminController extends Controller
{
    /**
     * Executive KPI Statistics for Admin Dashboard
     */
    public function stats()
    {
        $totalUsers = User::count();
        
        // Single query for numerical aggregations (reduces 4 queries to 1)
        $stats = DiagnosticHistory::selectRaw('
            COUNT(*) as total_diagnostics,
            AVG(total_score) as avg_score,
            SUM(CASE WHEN total_score < 60 THEN 1 ELSE 0 END) as critical_count,
            SUM(CASE WHEN total_score >= 80 THEN 1 ELSE 0 END) as healthy_count
        ')->first();

        // Single query for grade distribution (reduces 5 queries to 1)
        $grades = DiagnosticHistory::selectRaw('grade, COUNT(*) as count')
            ->groupBy('grade')
            ->pluck('count', 'grade')
            ->toArray();
            
        $gradeDistribution = [
            'A' => $grades['A'] ?? 0,
            'B' => $grades['B'] ?? 0,
            'C' => $grades['C'] ?? 0,
            'D' => $grades['D'] ?? 0,
            'E' => $grades['E'] ?? 0,
        ];

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get();
        $recentDiagnostics = DiagnosticHistory::with('user:id,name,email,avatar')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_diagnostics' => (int) ($stats->total_diagnostics ?? 0),
                'avg_score' => round($stats->avg_score ?? 0, 1),
                'critical_count' => (int) ($stats->critical_count ?? 0),
                'healthy_count' => (int) ($stats->healthy_count ?? 0),
                'grade_distribution' => $gradeDistribution,
                'recent_users' => $recentUsers,
                'recent_diagnostics' => $recentDiagnostics,
            ]
        ]);
    }

    /**
     * List all users with diagnostic count and search
     */
    public function users(Request $request)
    {
        $query = User::withCount('diagnosticHistories');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        // Always pin admins on top, then newest users
        $users = $query->orderByRaw("CASE WHEN role = 'admin' THEN 0 ELSE 1 END")
                       ->orderBy('created_at', 'desc')
                       ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Create a new user from Admin Panel (Full CRUD - Create)
     */
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|string|in:user,admin',
            'annual_target' => 'nullable|numeric',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? 'user',
            'annual_target' => $validated['annual_target'] ?? 120000000,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Pengguna {$user->name} berhasil ditambahkan!",
            'data' => $user,
        ], 201);
    }

    /**
     * Update an existing user details from Admin Panel (Full CRUD - Update)
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|string|in:user,admin',
            'annual_target' => 'nullable|numeric',
            'password' => 'nullable|string|min:6',
        ]);

        $dataToUpdate = [
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? $user->phone,
            'role' => $validated['role'] ?? $user->role,
            'annual_target' => $validated['annual_target'] ?? $user->annual_target,
        ];

        if (!empty($validated['password'])) {
            $dataToUpdate['password'] = bcrypt($validated['password']);
        }

        $user->update($dataToUpdate);

        return response()->json([
            'success' => true,
            'message' => "Data pengguna {$user->name} berhasil diperbarui!",
            'data' => $user,
        ]);
    }

    /**
     * Bulk delete users
     */
    public function bulkDeleteUsers(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        // Protect root Super Admin from deletion
        $safeIds = User::whereIn('id', $validated['ids'])
            ->where('email', '!=', 'admin@financialhealth.com')
            ->pluck('id');

        $deletedCount = User::whereIn('id', $safeIds)->delete();

        return response()->json([
            'success' => true,
            'message' => "{$deletedCount} pengguna berhasil dihapus.",
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * Bulk update user roles
     */
    public function bulkUpdateUserRole(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'role' => 'required|in:user,admin',
        ]);

        $updatedCount = User::whereIn('id', $validated['ids'])->update(['role' => $validated['role']]);

        return response()->json([
            'success' => true,
            'message' => "Peran {$updatedCount} pengguna berhasil diubah menjadi {$validated['role']}.",
            'updated_count' => $updatedCount,
        ]);
    }

    /**
     * Promote or Demote user role (user/admin)
     */
    public function updateUserRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json([
            'success' => true,
            'message' => "User {$user->name} role updated to {$validated['role']}",
            'user' => $user,
        ]);
    }

    /**
     * Delete user and cascade their history
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting current super admin
        if ($user->email === 'admin@financialhealth.com') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete primary root administrator account',
            ], 403);
        }

        // Delete Avatar from Cloudinary if it exists
        if ($user->avatar && str_contains($user->avatar, 'cloudinary.com')) {
            try {
                // Extract public_id from URL: e.g. https://res.cloudinary.com/cloud_name/image/upload/v1234/folder/filename.jpg
                // The public_id is "folder/filename" without extension
                $urlParts = parse_url($user->avatar);
                $path = $urlParts['path'] ?? '';
                $pathParts = explode('/upload/', $path);
                if (count($pathParts) > 1) {
                    $afterUpload = $pathParts[1];
                    // Remove version number if present (e.g. v1234/)
                    $afterUpload = preg_replace('/^v\d+\//', '', $afterUpload);
                    // Remove file extension
                    $publicId = preg_replace('/\.[^.]+$/', '', $afterUpload);

                    $cloudName = env('CLOUDINARY_CLOUD_NAME');
                    $apiKey = env('CLOUDINARY_API_KEY');
                    $apiSecret = env('CLOUDINARY_API_SECRET');

                    if ($cloudName && $apiKey && $apiSecret) {
                        $timestamp = time();
                        // Cloudinary signature for destroy: public_id, timestamp
                        $paramsToSign = [
                            'public_id' => $publicId,
                            'timestamp' => $timestamp,
                        ];
                        ksort($paramsToSign);
                        $paramString = '';
                        foreach ($paramsToSign as $key => $value) {
                            $paramString .= "{$key}={$value}&";
                        }
                        $paramString = rtrim($paramString, '&') . $apiSecret;
                        $signature = sha1($paramString);

                        \Illuminate\Support\Facades\Http::post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                            'api_key' => $apiKey,
                            'public_id' => $publicId,
                            'timestamp' => $timestamp,
                            'signature' => $signature,
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Failed to delete Cloudinary avatar: " . $e->getMessage());
            }
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User, avatar, and associated diagnostic data deleted successfully',
        ]);
    }

    /**
     * List all diagnostic submissions across all users with filters
     */
    public function diagnostics(Request $request)
    {
        $query = DiagnosticHistory::with('user:id,name,email,phone,avatar');

        if ($grade = $request->query('grade')) {
            $query->where('grade', strtoupper($grade));
        }

        if ($search = $request->query('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $diagnostics = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $diagnostics,
        ]);
    }

    /**
     * Delete a specific diagnostic record
     */
    public function deleteDiagnostic($id)
    {
        $diag = DiagnosticHistory::findOrFail($id);
        $diag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Diagnostic submission record deleted successfully',
        ]);
    }
}
