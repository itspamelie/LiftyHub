<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\MonthlyProgress;
use App\Models\ExerciseLog;
use App\Models\UserPropertie;
use App\Models\Somatotypes;
use App\Models\UserStreak;
use App\Models\UserRoutineExercise;
use App\Models\UserRoutine;
use App\Models\PaymentDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


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
        'email'=>'required|email|unique:users,email',
        'password'=>'required|min:6',
        'gender'=>'required|string',
        'img'=>'nullable|image',
        'birthdate'=>'required|date',
        'role'=>'required|string'
    ]);

    if($request->hasFile('img')){

        $file = $request->file('img');

        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $path = $file->storeAs('users',$filename,'public');

        $validated['img'] = $path;
    }

    $data = User::create($validated);

    return response()->json([
        "status"=>"ok",
        "message"=>"Usuario insertado correctamente.",
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
            'name'      => 'sometimes|string|min:2',
            'email'     => 'sometimes|email|unique:users,email,' . $id,
            'password'  => 'sometimes|min:6',
            'gender'    => 'sometimes|string',
            'img'       => 'nullable|image',
            'birthdate' => 'sometimes|date',
        ]);

        $data = User::findOrFail($id);

        if (isset($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $data->update($validated);

        return response()->json([
            "status" => "ok",
            "mesage" => "Datos del usuario actualizados correctamente.",
            "data"   => $data
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy(string $id)
{
    $user = User::find($id);

    if(!$user){
        return response()->json([
            "status"=>"error",
            "message"=>"Usuario no encontrado"
        ]);
    }

    // eliminar registros relacionados antes de borrar el usuario
    $routineIds = UserRoutine::where('user_id', $id)->pluck('id');
    UserRoutineExercise::whereIn('user_routine_id', $routineIds)->delete();
    UserRoutine::where('user_id', $id)->delete();
    UserPropertie::where('user_id', $id)->delete();
    UserStreak::where('user_id', $id)->delete();
    MonthlyProgress::where('user_id', $id)->delete();
    ExerciseLog::where('user_id', $id)->delete();
    Subscription::where('user_id', $id)->delete();
    PaymentDetail::where('user_id', $id)->delete();

    $user->delete();

    return response()->json([
        "status"=>"ok",
        "message"=>"Usuario eliminado correctamente."
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

public function searchUsers(Request $request)
{
    $search = $request->input('search');

    // Si no hay búsqueda, no consultar la BD
    if(!$search){
        return response()->json([
            "status"=>"ok",
            "data"=>[]
        ]);
    }

    $users = User::select('id','name','email','gender','birthdate','role','img','created_at')
        ->where(function($query) use ($search){
            $query->where('name','LIKE',"%{$search}%")
                  ->orWhere('email','LIKE',"%{$search}%")
                  ->orWhere('role','LIKE',"%{$search}%");
        })
        ->get();

    return response()->json([
        "status" => "ok",
        "data" => $users
    ]);
}
}
