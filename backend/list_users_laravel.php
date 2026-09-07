<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$users = DB::table('users')->get();

echo "ID | Nama | Email | Role | Company\n";
echo str_repeat("-", 50) . "\n";
foreach ($users as $user) {
    echo "{$user->id} | {$user->name} | {$user->email} | {$user->role} | {$user->company_name}\n";
}
