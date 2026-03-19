<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'gender'   => 'required|string',
            'birthdate'=> 'required|date',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'gender'   => $request->gender,
            'birthdate'=> $request->birthdate,
            'role'     => 'user',
            'img'      => 'default.jpg',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 'ok',
            'token'  => $token,
            'user'   => $user
        ]);
    }

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
