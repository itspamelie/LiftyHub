<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Http;


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

    // VERIFICAR CONTRASEÑA ACTUAL (requiere JWT)
    public function checkPassword(Request $request) {
        $request->validate([
            'current_password' => 'required|string',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['valid' => false], 200);
        }

        return response()->json(['valid' => true], 200);
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
    public function googleLogin(Request $request)
{
    $request->validate(['id_token' => 'required|string']);

    $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
        'id_token' => $request->id_token,
    ]);

    if (!$response->successful() || $response->json('aud') !== env('GOOGLE_CLIENT_ID')) {
        return response()->json(['error' => 'Token inválido'], 401);
    }

    $payload = $response->json();

    $user = User::firstOrCreate(
        ['email' => $payload['email']],
        [
            'name'      => $payload['name'] ?? $payload['email'],
            'password'  => bcrypt(str()->random(24)),
            'google_id' => $payload['sub'],
        ]
    );

    $token = JWTAuth::fromUser($user);

    return response()->json(['token' => $token, 'user' => $user]);
}
}
