<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NutritionistEducation;


class NutritionistEducationsController extends Controller
{
    public function index()
    {
         $data = NutritionistEducation::with('nutritionist')->get();

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
            'nutritionist_profile_id'=>'required',
            'degree'=>'required|string',
            'institution'=>'required|string',
            'year'=>'required'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = NutritionistEducation::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Estudios agregados correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = NutritionistEducation::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Estudios encontrados",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Estudios no encontrados"
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
             'nutritionist_profile_id'=>'required',
            'degree'=>'required|string',
            'institution'=>'required|string',
            'year'=>'required'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = NutritionistEducation::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Estudios actualizados correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = NutritionistEducation::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Estudios eliminados correctamente."
        ]);
    }
}
