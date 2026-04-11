<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserWeekPlanConroller extends Controller
{
      public function index(Request $request)
    {
        $plans = UserWeekPlan::where('user_id', auth()->id())->get();
        return response()->json(['data' => $plans]);
    }

    public function update(Request $request)
    {
        $userId = auth()->id();
        $days = $request->input('days'); // array de días

        foreach ($days as $day) {
            if ($day['type'] === null) {
                UserWeekPlan::where('user_id', $userId)
                    ->where('day_index', $day['day_index'])
                    ->delete();
            } else {
                UserWeekPlan::updateOrCreate(
                    ['user_id' => $userId, 'day_index' => $day['day_index']],
                    [
                        'type'            => $day['type'],
                        'routine_id'      => $day['routine_id'] ?? null,
                        'user_routine_id' => $day['user_routine_id'] ?? null,
                        'routine_name'    => $day['routine_name'] ?? null,
                    ]
                );
            }
        }

        return response()->json(['message' => 'Plan guardado']);
    }  
}
