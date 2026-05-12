<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Exercise;
use Illuminate\Support\Facades\Http;

class TranslateExercises extends Command
{
    protected $signature   = 'exercises:translate {--limit=50 : Ejercicios por ejecución}';
    protected $description = 'Traduce nombres e instrucciones de ejercicios al español';

    public function handle(): void
    {
        $limit = (int) $this->option('limit');

        // Solo traduce los que aún tienen nombre en inglés (solo letras/números ASCII)
        $exercises = Exercise::where('name', 'REGEXP', '^[A-Za-z0-9 ()/:,\'-]+$')
            ->limit($limit)
            ->get();

        if ($exercises->isEmpty()) {
            $this->info('Todos los ejercicios ya están traducidos.');
            return;
        }

        $this->info("Traduciendo {$exercises->count()} ejercicios...");
        $bar = $this->output->createProgressBar($exercises->count());
        $bar->start();

        $translated = 0;
        $failed     = 0;

        foreach ($exercises as $exercise) {
            try {
                $translatedName = $this->translate($exercise->name);
                usleep(400000);

                $translatedTechnique = null;
                if ($exercise->technique && $exercise->technique !== 'Sin descripción.') {
                    $translatedTechnique = $this->translate($exercise->technique);
                    usleep(400000);
                }

                $exercise->update([
                    'name'      => $translatedName      ?? $exercise->name,
                    'technique' => $translatedTechnique ?? $exercise->technique,
                ]);

                $translated++;
            } catch (\Exception) {
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();

        $pending = Exercise::where('name', 'REGEXP', '^[A-Za-z0-9 ()/:,\'-]+$')->count();
        $this->info("✓ Traducidos: {$translated} | Fallos: {$failed} | Pendientes aún: {$pending}");
    }

    private function translate(string $text): ?string
    {
        $response = Http::timeout(15)
            ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
            ->get('https://translate.googleapis.com/translate_a/single', [
                'client' => 'gtx',
                'sl'     => 'en',
                'tl'     => 'es',
                'dt'     => 't',
                'q'      => $text,
            ]);

        if (!$response->successful()) {
            return null;
        }

        // Resultado: [[["traducido","original",...], ...], ...]
        $parts = collect($response->json()[0] ?? [])->pluck(0)->filter()->implode(' ');

        return $parts ?: null;
    }
}
