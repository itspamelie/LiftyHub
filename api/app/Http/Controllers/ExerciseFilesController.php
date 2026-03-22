<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExerciseFile;


class ExerciseFilesController extends Controller
{
    public function index()
    {
         $data = ExerciseFile::with('exercise')->get();

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
            'exercise_id'=>'required',
            'file_path'=>'required',
            'type'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = ExerciseFile::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Archivo agregado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = ExerciseFile::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Archivo encontrado",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Archivo no encontrado"
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
            'exercise_id'=>'required',
            'file_path'=>'required',
            'type'=>'required|string'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = ExerciseFile::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Archivo actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = ExerciseFile::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Archivo eliminado correctamente."
        ]);
    }
}
