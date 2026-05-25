<?php
// TEMPORAL — BORRAR DESPUÉS DE USARLO
define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";
echo "=== MIGRACIONES ===\n";
$kernel->call('migrate', ['--force' => true]);
echo $kernel->output();

echo "\n=== SEEDERS ===\n";
$kernel->call('db:seed', ['--force' => true]);
echo $kernel->output();

echo "\n=== CONFIG CACHE ===\n";
$kernel->call('config:cache');
echo $kernel->output();

echo "\n✅ LISTO — BORRA ESTE ARCHIVO AHORA\n";
echo "</pre>";
