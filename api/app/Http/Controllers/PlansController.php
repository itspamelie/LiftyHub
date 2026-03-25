<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;



class PlansController extends Controller
{
   public function index()
    {
         $data = Plan::all();

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
            'description'=>'required|string',
            'price'=>'required|numeric',
            'level'=>'required|numeric',
            'max_routines'=>'required|numeric'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Plan::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Plan agregado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = Plan::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Plan encontrado",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Plan no encontrado"
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
            'description'=>'required|string',
            'price'=>'required|numeric',
            'level'=>'required|numeric',
            'max_routines'=>'required|numeric'  
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Plan::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Plan actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = Plan::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Plan eliminado correctamente."
        ]);
    }

    public function searchPlans(Request $request)
{
    $search = $request->input('search');

    // si no hay búsqueda devolver todos los planes
    if(!$search){
        return response()->json([
            "status" => "ok",
            "data" => Plan::all()
        ]);
    }

    $plans = Plan::where(function($query) use ($search){
        $query->where('name','LIKE',"%{$search}%")
              ->orWhere('description','LIKE',"%{$search}%")
              ->orWhere('price','LIKE',"%{$search}%");
    })->get();

    return response()->json([
        "status" => "ok",
        "data" => $plans
    ]);
}
}
