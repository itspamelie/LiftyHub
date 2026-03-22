<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExerciseLog;


class ExerciseLogsController extends Controller
{
                  public function index()
    {
         $data = ExerciseLog::with('user','exercise','exerciseRoutine','session')->get();

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
            'user_id'=>'required',
            'exercise_id'=>'required',
            'weight_lifted'=>'required|numeric',
            'repetitions'=>'required|numeric',
            'sets'=>'required|numeric',
            'exercise_routine_id'=>'required',
            'user_routine_session_id'=>'required',
            'workout_date'=>'required|date'        
            ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = ExerciseLog::create($validated);
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
         $data = ExerciseLog::find($id);
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
            'user_id'=>'required',
            'exercise_id'=>'required',
            'weight_lifted'=>'required|numeric',
            'repetitions'=>'required|numeric',
            'sets'=>'required|numeric',
            'exercise_routine_id'=>'required',
            'user_routine_session_id'=>'required',
            'workout_date'=>'required|date'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = ExerciseLog::findOrFail($id);
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
         $data = ExerciseLog::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro eliminado correctamente."
        ]);
    }
}
