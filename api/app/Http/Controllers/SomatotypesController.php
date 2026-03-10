<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Somatotype;

class SomatotypesController extends Controller
{
            public function index()
    {
         $data = Somatotype::all();

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
            'type'=>'required|string',
            'description'=>'required|string',
            'file'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Somatotype::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Somatotipo guardado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = Somatotype::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Somatotipos encontrados.",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Somatotipos no encontrados."
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
          'type'=>'required|string',
            'description'=>'required|string',
            'file'=>'required|string'  
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Somatotype::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Somatotipo actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Somatotype::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Somatotipo eliminado correctamente."
        ]);
    }
}
