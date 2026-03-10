<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DietPlan;


class DietPlansController extends Controller
{
                                  public function index()
    {
         $data = DietPlan::with('nutritionist','user')->get();

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
            'nutritionist_id'=>'required',
            'user_id'=>'required',
            'plan_content'=>'required|string',
            'status'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = DietPlan::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Dieta agregada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = DietPlan::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Dieta encontrada",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Dieta no encontrada"
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
            'nutritionist_id'=>'required',
            'user_id'=>'required',
            'plan_content'=>'required|string',
            'status'=>'required|string'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = DietPlan::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Dieta actualizada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = DietPlan::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Dieta eliminada correctamente."
        ]);
    }
}
