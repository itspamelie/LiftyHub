<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRoutine;

class UserRoutinesController extends Controller
{
    public function index()
    {
        $data = UserRoutine::with(['exercises.exercise'])->get();

        return response()->json([
            "status" => "ok",
            "data" => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'name'      => 'required|string',
            'category'  => 'nullable|string',
            'objective' => 'required|string',
            'level'     => 'required|string',
            'duration'  => 'required|integer',
            'img'       => 'nullable|string',
        ]);

        $data = UserRoutine::create($validated);

        return response()->json([
            "status"  => "ok",
            "mesage"  => "Rutina creada correctamente.",
            "data"    => $data
        ]);
    }

    public function count(string $id)
    {
        $count = UserRoutine::where('user_id', $id)->count();

        return response()->json([
            "status" => "ok",
            "count"  => $count
        ]);
    }

    public function show(string $id)
    {
        $data = UserRoutine::with(['exercises.exercise'])
            ->where('user_id', $id)
            ->get();

        return response()->json([
            "status" => "ok",
            "data"   => $data
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'      => 'required|string',
            'category'  => 'nullable|string',
            'objective' => 'required|string',
            'level'     => 'required|string',
            'duration'  => 'required|integer',
            'img'       => 'nullable|string',
        ]);

        $data = UserRoutine::findOrFail($id);
        $data->update($validated);

        return response()->json([
            "status" => "ok",
            "mesage" => "Rutina actualizada correctamente.",
            "data"   => $data
        ]);
    }

    public function destroy(string $id)
    {
        $data = UserRoutine::find($id);
        if ($data) {
            $data->delete();
        }

        return response()->json([
            "status" => "ok",
            "mesage" => "Rutina eliminada correctamente."
        ]);
    }
}
