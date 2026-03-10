<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentDetail;


class PaymentDetailsController extends Controller
{
                  public function index()
    {
         $data = PaymentDetail::with('user')->get();

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
            'name'=>'required|string',
            'bank'=>'required|string',
            'card_number'=>'required|string',
            'expiration_date'=>'required|date',
        ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = PaymentDetail::create($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Informacion de pago agregada correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = PaymentDetail::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Detalles de pago encontrados",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Detalles de pago no encontrados"
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
            'name'=>'required|string',
            'bank'=>'required|string',
            'card_number'=>'required|string',
            'expiration_date'=>'required|date',   
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = PaymentDetail::findOrFail($id);
        $data->update($validated);
          return response()->json([
            "status"=>"ok",
            "mesage"=>"Datos actualizados correctamente.",
            "data"=>$data

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $data = PaymentDetail::find($id);
        if($data){
            $data->delete();
        }
        return response()->json([
            "status"=>"ok",
            "mesage"=>"Informacion eliminada correctamente."
        ]);
    }
}
