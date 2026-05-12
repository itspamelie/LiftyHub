<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NutritionProfile;

class NutritionProfilesController extends Controller
{
    public function index()
    {
        $data = NutritionProfile::with('user')->get();
        return response()->json(["status" => "ok", "data" => $data]);
    }

    public function byUser(string $userId)
    {
        $data = NutritionProfile::where('user_id', $userId)->first();
        return response()->json(["status" => "ok", "data" => $data]);
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
            'user_id'             => 'required',
            'weight'              => 'required|numeric',
            'age'                 => 'required|integer',
            'height'              => 'required|numeric',
            'meal_schedule'       => 'nullable|string',
            'favorite_foods'      => 'nullable|string',
            'disliked_foods'      => 'nullable|string',
            'allergies'           => 'nullable|string',
            'medical_restrictions'=> 'nullable|string',
            'favorite_meal'       => 'nullable|string',
            'can_cook_sunday'     => 'boolean',
        ]);

        // Upsert: si el usuario ya tiene perfil, actualiza
        $data = NutritionProfile::updateOrCreate(
            ['user_id' => $validated['user_id']],
            $validated
        );
        return response()->json(["status" => "ok", "mesage" => "Registro guardado correctamente.", "data" => $data]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = NutritionProfile::find($id);
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
            'user_id'             => 'sometimes|required',
            'weight'              => 'sometimes|numeric',
            'age'                 => 'sometimes|integer',
            'height'              => 'sometimes|numeric',
            'meal_schedule'       => 'nullable|string',
            'favorite_foods'      => 'nullable|string',
            'disliked_foods'      => 'nullable|string',
            'allergies'           => 'nullable|string',
            'medical_restrictions'=> 'nullable|string',
            'favorite_meal'       => 'nullable|string',
            'can_cook_sunday'     => 'boolean',
        ]);
        $data = NutritionProfile::findOrFail($id);
        $data->update($validated);
        return response()->json(["status" => "ok", "mesage" => "Registro actualizado correctamente.", "data" => $data]);
    }

    /**
     * Remove the specified resource from storage.
     */
    
    public function destroy(string $id)
    {
         $data = NutritionProfile::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Registro eliminado correctamente."
        ]);
    }
}
