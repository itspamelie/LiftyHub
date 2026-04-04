<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exercise;

class ExerciseController extends Controller
{
                          public function index()
    {
         $data = Exercise::with('exercise_files')->get();

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
            'name'=>'required|string',
            'muscle'=>'required|string',
            'technique'=>'required|string',
            'categorie'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Exercise::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Ejercicio agregado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = Exercise::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Ejercicio encontrado",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Ejercicio no encontrado"
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
            'name'=>'required|string',
            'muscle'=>'required|string',
            'technique'=>'required|string',
            'categorie'=>'required|string'

         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Exercise::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Ejercicio actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Exercise::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Ejercicio eliminado correctamente."
        ]);
    }


        public function searchExercises(Request $request)
{
    $search = $request->input('search');

    // Si no hay búsqueda, no consultar la BD
    if(!$search){
        return response()->json([
            "status"=>"No se encontraron coincidencias.",
            "data"=>[]
        ]);
    }

    $exercise = Exercise::select('id','name','muscle','categorie','technique')
        ->where(function($query) use ($search){
            $query->where('name','LIKE',"%{$search}%")
                  ->orWhere('muscle','LIKE',"%{$search}%")
                  ->orWhere('categorie','LIKE',"%{$search}%");
        })
        ->get();

    return response()->json([
        "status" => "ok",
        "data" => $exercise
    ]);
}
}
