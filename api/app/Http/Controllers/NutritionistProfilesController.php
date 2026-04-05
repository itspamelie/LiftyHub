<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NutritionistProfile;

class NutritionistProfilesController extends Controller
{
                      public function index()
    {
         $data = NutritionistProfile::with('user')->get();

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
            'license_number'=>'required|string',
            'profile_pic'=>'required|string',
            'specialty'=>'required|string',
            'location'=>'required|string',
            'bio'=>'required|string',
            'rating'=>'required|numeric',
            'is_active'=>'required'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = NutritionistProfile::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Informacion agregada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
public function show(string $id) 
{
    $data = NutritionistProfile::with([
        'user',
        'education',
        'experience',
        'specialties',
        'reviews.user'
    ])->find($id);

    if($data){
        return response()->json([
            "status" => "ok",
            "message" => "Perfil encontrado",
            "data" => $data
        ]);
    }

    return response()->json([
        "status" => "error",
        "message" => "Perfil no encontrado"
    ], 400);
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
            'license_number'=>'required|string',
            'profile_pic'=>'required|string',
            'specialty'=>'required|string',
            'location'=>'required|string',
            'bio'=>'required|string',
            'rating'=>'required|numeric',
            'is_active'=>'required'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = NutritionistProfile::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Perfil actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = NutritionistProfile::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Informacion eliminada correctamente."
        ]);
    }
}
