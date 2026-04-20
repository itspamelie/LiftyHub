<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friendship;
use App\Models\UserStreak;
use App\Models\UserRoutineSession;
use Tymon\JWTAuth\Facades\JWTAuth;

class FriendshipsController extends Controller
{
    // GET /friends — lista de amigos aceptados con sus stats
    public function index()
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        $friendships = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)
                  ->orWhere('addressee_id', $userId);
            })
            ->with(['requester', 'addressee'])
            ->get();

        $friends = $friendships->map(function ($f) use ($userId) {
            $friend = $f->requester_id === $userId ? $f->addressee : $f->requester;
            $streak = UserStreak::where('user_id', $friend->id)->first();
            $workouts = UserRoutineSession::where('user_id', $friend->id)
                ->whereNotNull('finished_at')
                ->count();

            return [
                'id'       => $f->id,
                'user_id'  => $friend->id,
                'name'     => $friend->name,
                'avatar'   => $friend->img,
                'streak'   => $streak ? $streak->current_streak : 0,
                'workouts' => $workouts,
            ];
        });

        return response()->json([
            'status' => 'ok',
            'data'   => $friends,
        ]);
    }

    // GET /friends/requests — solicitudes pendientes recibidas
    public function requests()
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        $pending = Friendship::where('addressee_id', $userId)
            ->where('status', 'pending')
            ->with('requester')
            ->get()
            ->map(function ($f) {
                return [
                    'id'     => $f->id,
                    'name'   => $f->requester->name,
                    'avatar' => $f->requester->img,
                ];
            });

        return response()->json([
            'status' => 'ok',
            'data'   => $pending,
        ]);
    }

    // POST /friends/request/{userId} — enviar solicitud
    public function sendRequest(string $targetUserId)
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        if ($userId == $targetUserId) {
            return response()->json(['status' => 'error', 'message' => 'No puedes agregarte a ti mismo.'], 400);
        }

        $exists = Friendship::where(function ($q) use ($userId, $targetUserId) {
            $q->where('requester_id', $userId)->where('addressee_id', $targetUserId);
        })->orWhere(function ($q) use ($userId, $targetUserId) {
            $q->where('requester_id', $targetUserId)->where('addressee_id', $userId);
        })->first();

        if ($exists) {
            return response()->json(['status' => 'error', 'message' => 'Ya existe una solicitud o amistad.'], 400);
        }

        $friendship = Friendship::create([
            'requester_id' => $userId,
            'addressee_id' => $targetUserId,
            'status'       => 'pending',
        ]);

        return response()->json([
            'status'  => 'ok',
            'message' => 'Solicitud enviada.',
            'data'    => $friendship,
        ]);
    }

    // PUT /friends/accept/{id} — aceptar solicitud
    public function accept(string $id)
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        $friendship = Friendship::where('id', $id)
            ->where('addressee_id', $userId)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json(['status' => 'error', 'message' => 'Solicitud no encontrada.'], 404);
        }

        $friendship->update(['status' => 'accepted']);

        return response()->json([
            'status'  => 'ok',
            'message' => 'Solicitud aceptada.',
        ]);
    }

    // DELETE /friends/{id} — rechazar solicitud o eliminar amistad
    public function destroy(string $id)
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        $friendship = Friendship::where('id', $id)
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)
                  ->orWhere('addressee_id', $userId);
            })
            ->first();

        if (!$friendship) {
            return response()->json(['status' => 'error', 'message' => 'No encontrado.'], 404);
        }

        $friendship->delete();

        return response()->json([
            'status'  => 'ok',
            'message' => 'Eliminado correctamente.',
        ]);
    }
}