<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exercise;
use App\Models\ExerciseFile;
use Illuminate\Support\Facades\Http;

class ExerciseDbSeeder extends Seeder
{
    private const DATA_URL   = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
    private const IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

    private const MUSCLE_MAP = [
        'abdominals'       => 'Abdomen',
        'abductors'        => 'Abductores',
        'adductors'        => 'Aductores',
        'biceps'           => 'Bíceps',
        'calves'           => 'Pantorrilla',
        'cardiovascular'   => 'Cardio',
        'chest'            => 'Pecho',
        'forearms'         => 'Antebrazo',
        'glutes'           => 'Glúteos',
        'hamstrings'       => 'Cuádriceps',
        'hip flexors'      => 'Abdomen',
        'lats'             => 'Espalda',
        'lower back'       => 'Espalda',
        'middle back'      => 'Espalda',
        'neck'             => 'Espalda',
        'quadriceps'       => 'Cuádriceps',
        'shoulders'        => 'Hombro',
        'traps'            => 'Espalda',
        'triceps'          => 'Tríceps',
    ];

    private const CATEGORY_MAP = [
        'cardio'           => 'Cardio',
        'olympic weightlifting' => 'Espalda',
        'plyometrics'      => 'Core',
        'powerlifting'     => 'Pecho',
        'strength'         => 'Core',
        'stretching'       => 'Core',
        'strongman'        => 'Core',
    ];

    public function run(): void
    {
        $this->command->info('Descargando dataset de ejercicios...');

        $response = Http::timeout(60)->get(self::DATA_URL);

        if (!$response->successful()) {
            $this->command->error('No se pudo descargar el dataset: HTTP ' . $response->status());
            return;
        }

        $exercises = $response->json();
        $total     = count($exercises);
        $imported  = 0;
        $skipped   = 0;

        $this->command->info("Dataset descargado: {$total} ejercicios.");

        foreach ($exercises as $ex) {
            if (Exercise::where('name', $ex['name'])->exists()) {
                $skipped++;
                continue;
            }

            $muscle    = $this->mapMuscle($ex['primaryMuscles'] ?? [], $ex['category'] ?? '');
            $categorie = $this->mapMuscle($ex['primaryMuscles'] ?? [], $ex['category'] ?? '');
            $technique = implode(' ', $ex['instructions'] ?? []);

            $exercise = Exercise::create([
                'name'      => $ex['name'],
                'muscle'    => $muscle,
                'technique' => $technique ?: 'Sin descripción.',
                'categorie' => $categorie,
            ]);

            // Guardar primera imagen como file
            $images = $ex['images'] ?? [];
            if (!empty($images)) {
                ExerciseFile::create([
                    'exercise_id' => $exercise->id,
                    'file_path'   => self::IMAGE_BASE . $images[0],
                    'type'        => 'image',
                ]);
            }

            $imported++;

            if ($imported % 50 === 0) {
                $this->command->info("{$imported}/{$total} importados...");
            }
        }

        $this->command->info("✓ Completado: {$imported} importados, {$skipped} omitidos.");
    }

    private function mapMuscle(array $muscles, string $category): string
    {
        foreach ($muscles as $m) {
            $key = strtolower(trim($m));
            if (isset(self::MUSCLE_MAP[$key])) {
                return self::MUSCLE_MAP[$key];
            }
        }

        $catKey = strtolower(trim($category));
        return self::CATEGORY_MAP[$catKey] ?? 'Core';
    }
}
