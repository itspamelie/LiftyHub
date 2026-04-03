<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRoutineExercise;

class UserRoutineExercisesController extends Controller
{
                public function index()
    {
         $data = UserRoutineExercise::with('userRoutine','exercise')->get();

        //Siempre que hagamos una api enviamos un JSON
        return response()->json([
            "status"=>"ok",
            "data"=>$data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //ammount,type,description,user_id,category_id,account_id
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          $validated = $request->validate([
            'user_routine_id'=>'required',
            'exercise_id'=>'required',
            'sets'=>'required|numeric',
            'repetitions'=>'required|numeric',
            'seconds_rest'=>'required|numeric',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserRoutineExercise::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro agregado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = UserRoutineExercise::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro encontrado",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Registro no encontrado"
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
            'user_routine_id'=>'required',
            'exercise_id'=>'required',
            'sets'=>'required|numeric',
            'repetitions'=>'required|numeric',
            'seconds_rest'=>'required|numeric',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserRoutineExercise::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    
    public function destroy(string $id)
    {
         $data = UserRoutineExercise::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro eliminado correctamente."
        ]);
    }

public function getByRoutine($id)
{
    $data = UserRoutineExercise::with(['exercise'])
        ->where('user_routine_id', $id)
        ->get();

    if ($data->isEmpty()) {
        return response()->json([
            "status" => "ok",
            "data" => [],
            "message" => "No hay ejercicios en esta rutina"
        ]);
    }

    return response()->json([
        "status" => "ok",
        "data" => $data
    ]);
}
}
