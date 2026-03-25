<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Routine;

class RoutinesController extends Controller
{
              public function index()
    {
         $data = Routine::with(['plan', 'somatotype'])->get();

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
            'objective'=>'required|string',
            'duration'=>'required|numeric',
            'level'=>'required|string',
            'img'=>'required|string',
            'plan_id'=>'required',
            'somatotype_id'=>'required',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Routine::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Rutina guardada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = Routine::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Rutinas encontradas",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Rutinas no encontradas."
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
            'objective'=>'required|string',
            'duration'=>'required|numeric',
            'level'=>'required|string',
            'img'=>'required|string',
            'plan_id'=>'required',
            'somatotype_id'=>'required',
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Routine::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Rutinas actualizadas correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Routines::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Rutinas eliminadas correctamente."
        ]);
    }

public function searchRoutines(Request $request){
    $search = $request->input('search');

    // Si no hay búsqueda, no consultar la BD
    if(!$search){
        return response()->json([
            "status"=>"No se encontraron coincidencias.",
            "data"=>[]
        ]);
    }

    $routine = Routine::select('id','name','objective','duration','level','img','plan_id','somatotype_id')
        ->where(function($query) use ($search){
            $query->where('name','LIKE',"%{$search}%")
                  ->orWhere('objective','LIKE',"%{$search}%")
                  ->orWhere('level','LIKE',"%{$search}%");
        })
        ->get();

    return response()->json([
        "status" => "ok",
        "data" => $routine
    ]);
}
}
