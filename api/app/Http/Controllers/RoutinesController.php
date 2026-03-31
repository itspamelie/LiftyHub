<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Routine;
use App\Models\ExerciseRoutine;
use Illuminate\Support\Str;


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
        //ammount,type,description,routine_id,category_id,account_id
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
            'category'=>'required|string',
            'level'=>'required|string',
            'img'=>'nullable|image',
            'plan_id'=>'required',
            'somatotype_id'=>'required',
        ]);
                 if($request->hasFile('img')){
             $file = $request->file('img');
              $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension(); 
              // ruta a public/routines 
              $destinationPath = public_path('routines'); 
              // mover archivo 
              $file->move($destinationPath, $filename); 
              // guardar solo la ruta pública 
              $validated['img'] = $filename; 
              }else{ 
                $validated['img'] = 'default.jpg';
                 } 
                 $data = Routine::create($validated);
                  return response()->json([ "status"=>"ok", "message"=>"Rutina creada correctamente.", "data"=>$data ]); 
                
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
            $routine = Routine::findOrFail($id);

         $validated = $request->validate([
            'name'=>'required|string',
            'objective'=>'required|string',
            'duration'=>'required|numeric',
            'category'=>'required|string',
            'level'=>'required|string',
            'img'=>'nullable|image',
            'plan_id'=>'required',
            'somatotype_id'=>'required',
         ]);

    /*
    IMAGEN
    */
    if($request->hasFile('img')){

        // eliminar imagen anterior si no es default
        if($routine->img && $routine->img !== 'default.jpg'){

            $oldImagePath = public_path('routines/'.$routine->img);

            if(file_exists($oldImagePath)){
                unlink($oldImagePath);
            }
        }

        $file = $request->file('img');

        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $destinationPath = public_path('routines');

        $file->move($destinationPath, $filename);

        $validated['img'] = $filename;
    }

    $routine->update($validated);
    $routine = Routine::with(['plan','somatotype'])->find($id);

    return response()->json([
        "status" => "ok",
        "message" => "Rutina actualizada correctamente",
        "data" => $routine
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    $routine = Routine::find($id);

    if(!$routine){
        return response()->json([
            "status"=>"error",
            "message"=>"Rutina no encontrada"
        ], 404);
    }

    // eliminar imagen
    if($routine->img && $routine->img !== 'default.jpg'){
        $path = public_path('routines/'.$routine->img);

        if(file_exists($path)){
            unlink($path);
        }
    }

    // eliminar rutina
    $routine->delete();

    return response()->json([
        "status"=>"ok",
        "message"=>"Rutina eliminada correctamente."
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

    $routine = Routine::with(['plan', 'somatotype'])
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
