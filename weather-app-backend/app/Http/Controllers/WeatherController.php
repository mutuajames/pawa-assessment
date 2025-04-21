<?php
// app/Http/Controllers/WeatherController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5/';
    protected $geoUrl = 'https://api.openweathermap.org/geo/1.0/';

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY', '0067bf46004913e731223fd23800cabe');
    }

    public function getCurrentWeather($city)
    {
        $cacheKey = "weather_current_{$city}";
        
        return Cache::remember($cacheKey, 1800, function () use ($city) {
            $response = Http::get($this->baseUrl . 'weather', [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);
            
            return $response->json();
        });
    }

    public function getForecast($city)
    {
        $cacheKey = "weather_forecast_{$city}";
        
        return Cache::remember($cacheKey, 3600, function () use ($city) {
            $response = Http::get($this->baseUrl . 'forecast', [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);
            
            return $response->json();
        });
    }

    public function searchLocation($query)
    {
        $cacheKey = "geo_search_{$query}";
        
        return Cache::remember($cacheKey, 86400, function () use ($query) {
            $response = Http::get($this->geoUrl . 'direct', [
                'q' => $query,
                'limit' => 5,
                'appid' => $this->apiKey
            ]);
            
            return $response->json();
        });
    }
}