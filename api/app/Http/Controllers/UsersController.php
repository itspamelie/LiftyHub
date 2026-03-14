<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\MonthlyProgress;
use App\Models\ExerciseLog;
use App\Models\UserPropertie;
use App\Models\Somatotypes;
use Illuminate\Support\Facades\DB;


class UsersController extends Controller
{
      public function index()
    {
        $data = User:: all();
        //Siempre que hagamos una api enviamos un JSON
        return response()->json([
            "status"=>"Usuarios de LiftyHub",
            "data"=>$data

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //name,type,user_id
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
            'name'=>'required|string|min:2',
            'email'=>'required|string|min:6',
            'password'=>'required',
            'gender'=>'required|string',
            'img'=>'required|string',
            'birthdate'=>'required|date',
            'role'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = User::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Usuario insertado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
          $data = User::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Usuario encontrado.",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Usuario no encontrado."
        ],400);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'=>'required|string|min:2',
            'email'=>'required|string|min:6',
            'password'=>'required',
            'gender'=>'required|string',
            'img'=>'required|string',
            'birthdate'=>'required|date',
            'role'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = User::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Datos del usuario actualizados correctamente.",
            "data"=>$data

        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = User::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Usuario eliminado correctamente."
        ]);

    }

public function statsuser()
{
    return response()->json([

        // estadísticas generales
        'total_users' => User::where('role','user')->count(),

'new_users_this_month' => User::whereMonth('created_at', now()->month)
    ->whereYear('created_at', now()->year)
    ->count(),

        'active_subscriptions' => Subscription::where('status','active')->count(),

        'users_with_progress' => MonthlyProgress::distinct()->count('user_id'),

        'average_weight' => round(UserPropertie::avg('weight'),2),

        'trained_today' => ExerciseLog::whereDate('created_at', today())
            ->distinct()
            ->count('user_id'),

        'expiring_subscriptions' => Subscription::whereDate('end_date','<=',now()->addDays(7))->count(),

        // progreso promedio por mes
        'monthly_progress' => MonthlyProgress::select(
                'month_number',
                DB::raw('AVG(current_weight) as average_weight')
            )
            ->groupBy('month_number')
            ->orderBy('month_number')
            ->get(),

        // distribución de somatotipos
        'somatotypes' => DB::table('user_properties as up')
            ->join('somatotypes as s', 'up.somatotype_id', '=', 's.id')
            ->select('s.type', DB::raw('COUNT(*) as total'))
            ->groupBy('s.type')
            ->get(),

             // distribución de genero
        'genre' => DB::table('users')
    ->select('gender', DB::raw('COUNT(*) as total'))
    ->where('role', 'user')
    ->groupBy('gender')
    ->get(),


        // usuarios con mejor racha
        'top_streaks' => DB::table('exercise_logs as el')
            ->join('users as u','el.user_id','=','u.id')
            ->select(
                'u.name',
                DB::raw('COUNT(DISTINCT DATE(el.created_at)) as streak')
            )
            ->groupBy('u.name')
            ->orderByDesc('streak')
            ->limit(5)
            ->get()
    ]);
}
}
