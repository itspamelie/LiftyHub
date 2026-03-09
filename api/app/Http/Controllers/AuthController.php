<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    //PARA HACER EL LOGIN DE LA API
    public function login(Request $request){
        $credentials = $request->only("email","password");
        try{
            if(! $access_token = JWTAuth::attempt($credentials)){
                return response()
                ->json(["error"=>"Error: Email o contraseña incorrectas."]);
            }
            $user = Auth::User();
            return response()->json([
                "token"=>$access_token,
                "user"=>$user
            ]);
 
        }catch(JWTExeption $e){
                return response()->json([
                    "error"=>"Error: Email o contraseña incorrectas."
                ]);
        }
    }
}
