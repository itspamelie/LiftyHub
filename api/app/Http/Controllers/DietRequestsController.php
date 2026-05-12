<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DietRequest;
use App\Models\NutritionistProfile;


class DietRequestsController extends Controller
{
    public function index()
    {
        $data = DietRequest::with('user', 'nutritionist', 'dietPlan')->get();
        return response()->json(["status" => "ok", "data" => $data]);
    }

    public function byUser(string $userId)
    {
        $data = DietRequest::with('user', 'nutritionist', 'dietPlan')
            ->where('user_id', $userId)
            ->whereNotIn('status', ['cancelled'])
            ->latest()
            ->first();
        return response()->json(["status" => "ok", "data" => $data]);
    }

    public function byNutritionist(string $nutritionistId)
    {
        // nutritionistId aquí es el id del nutritionist_profiles, no el user_id
        $profile = NutritionistProfile::find($nutritionistId);
        if (!$profile) {
            return response()->json(["status" => "ok", "data" => []]);
        }
        $data = DietRequest::with('user', 'dietPlan')
            ->where('nutritionist_id', $profile->user_id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(["status" => "ok", "data" => $data]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,in_progress,completed,cancelled',
        ]);
        $data = DietRequest::findOrFail($id);
        $data->update($validated);
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
            'user_id'=>'required',
            'nutritionist_id'=>'required',
            'year'=>'required',
            'month'=>'required',
            'status'=>'required|string',

        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = DietRequest::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Solicitud agregada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = DietRequest::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Solicitud encontrada",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Solicitud no encontrada"
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
            'user_id'         => 'sometimes|required',
            'nutritionist_id' => 'sometimes|required',
            'year'            => 'sometimes|required',
            'month'           => 'sometimes|required',
            'status'          => 'sometimes|required|string',
        ]);
        $data = DietRequest::findOrFail($id);
        $data->update($validated);
        return response()->json(["status" => "ok", "mesage" => "Solicitud actualizada correctamente.", "data" => $data]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = DietRequest::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Solicitud eliminada correctamente."
        ]);
    }
}
