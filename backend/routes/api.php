<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
Route::group(['prefix' => 'auth'], function () {
// Routes publiques
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Routes protégées
Route::middleware('auth:api')->group(function () {
Route::post('logout', [AuthController::class, 'logout']);
Route::post('refresh', [AuthController::class, 'refresh']);
Route::get('user-profile', [AuthController::class, 'userProfile']);
});
});
