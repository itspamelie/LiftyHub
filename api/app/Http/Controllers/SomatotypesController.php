<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Somatotype;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SomatotypesController extends Controller
{
            public function index()
    {
         $data = Somatotype::all();

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
            'type'=>'required|string',
            'description'=>'required|string',
            'file'=>'nullable|image'
        ]);

        if($request->hasFile('file')){
             $file = $request->file('file');
              $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension(); 
              // ruta a public/users 
              $destinationPath = public_path('somatotypes'); 
              // mover archivo 
              $file->move($destinationPath, $filename); 
              // guardar solo la ruta pública 
              $validated['file'] = $filename; 
              }else{ 
                $validated['file'] = 'default.jpg';
                 } 
                 $data = Somatotype::create($validated);
                  return response()->json([ "status"=>"ok", "message"=>"Somatotipo insertado correctamente.", "data"=>$data ]); 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = Somatotype::find($id);
        if($data){
            return response()->json([
            "status"=>"ok",
            "mesage"=>"Somatotipos encontrados.",
            "data"=>$data
        ]);
        }
        return response()->json([
            "status"=>"error",
            "mesage"=>"Somatotipos no encontrados."
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
          'type'=>'required|string',
            'description'=>'required|string',
            'file'=>'nullable|image'  
         ]);

        //metodo si los campos se llaman igual que en la base de datos
        $data = Somatotype::findOrFail($id);
        
    if($request->hasFile('file')){

        // eliminar imagen anterior si no es default
        if($data->fie && $data->file !== 'default.jpg'){

            $oldImagePath = public_path('somatotypes/'.$data->file);

            if(file_exists($oldImagePath)){
                unlink($oldImagePath);
            }
        }

        $file = $request->file('file');

        $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

        $destinationPath = public_path('somatotypes');

        $file->move($destinationPath, $filename);

        $validated['file'] = $filename;
    }

    $data->update($validated);

    return response()->json([
        "status" => "ok",
        "message" => "Somatotipo actualizado correctamente",
        "data" => $data
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
     $somatotypes = Somatotype::find($id);

    if(!$somatotypes){
        return response()->json([
            "status"=>"error",
            "message"=>"Somatotipo no encontrado"
        ]);
    }

    // eliminar imagen del somatotipo si no es default
    if($somatotypes->file && $somatotypes->file !== 'default.jpg'){

        $path = public_path('somatotypes/'.$somatotypes->file);

        if(file_exists($path)){
            unlink($path);
        }
    }

     $somatotypes->delete();

    return response()->json([
        "status"=>"ok",
        "message"=>"Somatotipo eliminado correctamente."
    ]);
    }

    public function searchSomatotypes(Request $request)
{
    $search = $request->input('search');

    // Si no hay búsqueda, no consultar la BD
    if(!$search){
        return response()->json([
            "status"=>"No se encontraron coincidencias.",
            "data"=>[]
        ]);
    }

    $somatotypes = Somatotype::select('id','type','description','file')
        ->where(function($query) use ($search){
            $query->where('type','LIKE',"%{$search}%")
                  ->orWhere('description','LIKE',"%{$search}%");
        })
        ->get();

    return response()->json([
        "status" => "ok",
        "data" => $somatotypes
    ]);
}
}
