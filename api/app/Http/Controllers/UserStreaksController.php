<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserStreak;

class UserStreaksController extends Controller
{
        public function index()
    {
         $data = UserStreak::with(['user'])->get();

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
            'current_streak'=>'required|numeric',
            'longest_streak'=>'required|numeric',
            'last_training_date'=>'required|date',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserStreak::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Racha actualizada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = UserStreak::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Racha del usuario encontrada.",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Racha no encontrada."
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
            'current_streak'=>'required|numeric',
            'longest_streak'=>'required|numeric',
            'last_training_date'=>'required|date',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = UserStreak::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Racha actualizada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = UserStreak::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Racha eliminada correctamente."
        ]);
    }
}
