<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DietReview;


class DietReviewsController extends Controller
{
    public function index()
    {
         $data = DietReview::with('dietplan')->get();

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
            'diet_plan_id'=>'required',
            'rating'=>'required|numeric',
            'comment'=>'required|string'
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = DietReview::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Review agregada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = DietReview::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Review encontrada",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Review no encontrada"
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
            'diet_plan_id'=>'required',
            'rating'=>'required|numeric',
            'comment'=>'required|string'
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = DietReview::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Review actualizada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = DietReview::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Review eliminada correctamente."
        ]);
    }
}
