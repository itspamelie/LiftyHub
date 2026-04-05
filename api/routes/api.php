<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//IMPORTAR EL CONTROLADOR PARA EL LOGIN
use App\Http\Controllers\AuthController;
//IMPORTAR CONTROLADORES PARA LA RUTA
use App\Http\Controllers\DietPlansController;
use App\Http\Controllers\DietReviewsController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\ExerciseFilesController;
use App\Http\Controllers\ExerciseLogsController;
use App\Http\Controllers\ExerciseRoutinesController;
use App\Http\Controllers\MonthlyProgressController;
use App\Http\Controllers\NutritionistProfilesController;
use App\Http\Controllers\PaymentDetailsController;
use App\Http\Controllers\PlansController;
use App\Http\Controllers\RoutinesController;
use App\Http\Controllers\SomatotypesController;
use App\Http\Controllers\SubscriptionsController;
use App\Http\Controllers\UserPropertiesController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\UserRoutinesController;
use App\Http\Controllers\UserStreaksController;
use App\Http\Controllers\UserRoutineExercisesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserRoutineSessionsController;


//RUTA DEL LOGIN
Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);
Route::middleware("jwt")->post('/check-password',[AuthController::class,'checkPassword']);
//Proteger vistas. Si hay una ruta fuera del grupo, cualquier persona puede hacerle peticion
//para enviar token
Route::middleware("jwt")->group(function(){
Route::get('/users/stats', [UsersController::class,'statsuser']);
Route::resource('users',UsersController::class);
Route::resource('userStreak',UserStreaksController::class);
Route::get('/userRoutines/{id}/count', [UserRoutinesController::class, 'count']);
Route::resource('userRoutines',UserRoutinesController::class);
Route::resource('userRoutineExercises',UserRoutineExercisesController::class);
Route::resource('userProperties',UserPropertiesController::class);
Route::resource('subscriptions',SubscriptionsController::class);
Route::resource('somatotypes',SomatotypesController::class);
Route::resource('routines',RoutinesController::class);
Route::resource('plans',PlansController::class);
Route::resource('paymentDetails',PaymentDetailsController::class);
Route::resource('nutritionistProfiles',NutritionistProfilesController::class);
Route::resource('monthlyProgress',MonthlyProgressController::class);
Route::resource('exerciseRoutines',ExerciseRoutinesController::class);
Route::resource('exerciseLogs',ExerciseLogsController::class);
Route::resource('exerciseFiles',ExerciseFilesController::class);
Route::resource('exercises',ExerciseController::class);
Route::resource('dietReviews',DietReviewsController::class);
Route::resource('dietPlans',DietPlansController::class);
Route::resource('routines',RoutinesController::class);
Route::get('/dashboard', [DashboardController::class, 'stats']);
Route::get('/search-users', [UsersController::class, 'searchUsers']);
Route::get('/search-plans', [PlansController::class, 'searchPlans']);
Route::get('/search-somatotypes', [SomatotypesController::class, 'searchSomatotypes']);
Route::get('/search-exercises', [ExerciseController::class, 'searchExercises']);
Route::get('/search-routines', [RoutinesController::class, 'searchRoutines']);
Route::get('/exercise-files/{id}', [ExerciseFilesController::class, 'getByExercise']);
Route::get('/routines/{id}/exercises', [ExerciseRoutinesController::class, 'getByRoutine']);
Route::get('/userroutines/{id}/exercises', [UserRoutineExercisesController::class, 'getByRoutine']);
Route::resource('userRoutineSessions', UserRoutineSessionsController::class); 
});