<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\WeatherController;

Route::get('/weather/current/{city}', [WeatherController::class, 'getCurrentWeather']);
Route::get('/weather/forecast/{city}', [WeatherController::class, 'getForecast']);
Route::get('/weather/search/{query}', [WeatherController::class, 'searchLocation']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
