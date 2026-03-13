<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Routine;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
 public function stats()
    {
        $rutinas = Routine::count();
        $usuarios = User::where('role','user')->count();

        $nutriologos = User::where('role','nutritionist')->count();

        $suscripcionesActivas = Subscription::where('status','active')->count();

        $ingresos = DB::table('subscriptions')
        ->join('plans','subscriptions.plan_id','=','plans.id')
        ->sum('plans.price');

        $usuariosPorDia = User::selectRaw('DATE(created_at) as fecha, COUNT(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        $suscripcionesPorPlan = DB::table('subscriptions')
        ->join('plans','subscriptions.plan_id','=','plans.id')
        ->select('plans.name', DB::raw('COUNT(*) as total'))
        ->groupBy('plans.name')
        ->get();

        $usuariosConSuscripcion = Subscription::distinct('user_id')->count();

        $usuariosSinSuscripcion = $usuarios - $usuariosConSuscripcion;

    $planes = DB::table('plans')
    ->leftJoin('subscriptions','plans.id','=','subscriptions.plan_id')
    ->select(
        'plans.name',

        DB::raw('COUNT(subscriptions.id) as usuarios'),

        DB::raw('COUNT(subscriptions.id) * plans.price as ingresos'),

        DB::raw("
        COALESCE(
        (
            (
                SUM(CASE WHEN MONTH(subscriptions.created_at)=MONTH(CURRENT_DATE()) THEN 1 ELSE 0 END)
                -
                SUM(CASE WHEN MONTH(subscriptions.created_at)=MONTH(CURRENT_DATE()-INTERVAL 1 MONTH) THEN 1 ELSE 0 END)
            )
            /
            NULLIF(
                SUM(CASE WHEN MONTH(subscriptions.created_at)=MONTH(CURRENT_DATE()-INTERVAL 1 MONTH) THEN 1 ELSE 0 END),
            0)
        ) * 100
        ,0) as crecimiento
        ")
    )
    ->groupBy('plans.id','plans.name','plans.price')
    ->get();


    $actividad = DB::table('subscriptions')
    ->join('users','subscriptions.user_id','=','users.id')
    ->join('plans','subscriptions.plan_id','=','plans.id')
    ->select(
        'users.name as usuario',
        'plans.name as plan',
        'subscriptions.created_at'
    )
    ->orderBy('subscriptions.created_at','desc')
    ->limit(5)
    ->get();
        return response()->json([
            "stats" => [
                "usuarios" => $usuarios,
                "nutriologos" => $nutriologos,
                "suscripciones" => $suscripcionesActivas,
                "ingresos" => $ingresos,
                "rutinas" => $rutinas
            ],

            "usuariosPorDia" => $usuariosPorDia,

            "suscripcionesPorPlan" => $suscripcionesPorPlan,

            "usuariosSuscripcion" => [
                "con" => $usuariosConSuscripcion,
                "sin" => $usuariosSinSuscripcion
            ],
                    "planes"=>$planes,
                    "actividad" =>$actividad

        ]);
    }
}
