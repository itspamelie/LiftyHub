<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MonthlyProgress;


class MonthlyProgressController extends Controller
{
    public function index()
    {
         $data = MonthlyProgress::with('user')->get();

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
            'month_number'=>'required|numeric',
            'year'=>'required',
            'initial_weight'=>'required|numeric',
            'current_weight'=>'required|numeric',
            'observations'=>'required|string',
            'img'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = MonthlyProgress::create($validated);
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
         $data = MonthlyProgress::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Progreso encontrado",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Progreso no encontrado"
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
            'month_number'=>'required|numeric',
            'year'=>'required',
            'initial_weight'=>'required|numeric',
            'current_weight'=>'required|numeric',
            'observations'=>'required|string',
            'img'=>'required|string'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = MonthlyProgress::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Progreso actualizado correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = MonthlyProgress::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Progreso eliminado correctamente."
        ]);
    }
}
