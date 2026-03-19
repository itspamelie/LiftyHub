<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPropertie;

class UserPropertiesController extends Controller
{
            public function index()
    {
         $data = UserPropertie::with(['user', 'somatotype'])->get();

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
            'user_id'      => 'required',
            'stature'      => 'nullable|numeric',
            'weight'       => 'nullable|numeric',
            'waist'        => 'nullable|numeric',
            'chest'        => 'nullable|numeric',
            'hips'         => 'nullable|numeric',
            'arms'         => 'nullable|numeric',
            'shoulders'    => 'nullable|numeric',
            'thighs'       => 'nullable|numeric',
            'objective'    => 'required|string',
            'somatotype_id'=> 'required'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserPropertie::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Tus propiedades han sido guardadas correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = UserPropertie::with('somatotype')->where('user_id', $id)->first();
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Propiedades encontradas.",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Propiedades no encontradas."
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
            'stature'=>'required|numeric',
            'waist'=>'required|numeric',
            'chest'=>'required|numeric',
            'hips'=>'required|numeric',
            'arms'=>'required|numeric',
            'shoulders'=>'required|numeric',
            'thighs'=>'required|numeric',
            'objective'=>'required|string',
            'somatotype_id'=>'required',   
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserPropertie::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Propiedades actualizadas correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = UserPropertie::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Propiedades eliminadas correctamente."
        ]);
    }
}
