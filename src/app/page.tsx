"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SearchBar } from '../components/SearchBar';
import { TemperatureToggle } from '../components/TemperatureToggle';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { WeatherDetails } from '../components/WeatherDetails';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherApi';
import { WeatherData, ForecastData } from '../types/weather';

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  useEffect(() => {
    // Try to load weather for user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              setCity(`${data[0].name}, ${data[0].country}`);
              loadWeatherData(`${data[0].name}, ${data[0].country}`);
            }
          } catch (error) {
            console.error('Error getting location weather:', error);
            // Default to a popular city
            setCity('Nairobi, KE');
            console.log(city)
            loadWeatherData('Nairobi, KE');
          }
        },
        () => {
          // Default city if user denies location
          setCity('Nairobi, KE');
          loadWeatherData('Nairobi, KE');
        }
      );
    } else {
      // Default city if geolocation not available
      setCity('Nairobi, KE');
      loadWeatherData('Nairobi, KE');
    }
  }, []);

  const loadWeatherData = async (cityName: string) => {
    setError('');
    setIsLoading(true);

    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName)
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data. Please check the city name and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    loadWeatherData(selectedCity);
  };

  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setTemperatureUnit(unit);
  };

  return (
    <>
    <Head>
      <title>Weather App</title>
      <meta name="description" content="Weather forecast application" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="min-h-screen bg-base-300 p-4 md:p-8">
      <div className="card mx-auto max-w-4xl shadow-xl bg-base-100 border border-base-200">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Column - Current Weather */}
          <div className="p-6 bg-base-200 border-r border-base-300">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <CurrentWeather 
                weatherData={weatherData} 
                temperatureUnit={temperatureUnit} 
              />
            )}
          </div>
          
          {/* Right Column - Search, Forecast, Details */}
          <div className="col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="w-3/4">
                <SearchBar onCitySelect={handleCitySelect} />
              </div>
              <div>
                <TemperatureToggle 
                  unit={temperatureUnit} 
                  onUnitChange={handleUnitChange} 
                />
              </div>
            </div>
            
            {error && (
              <div className="alert alert-error mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center my-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <DailyForecast 
                    forecastData={forecastData}
                    temperatureUnit={temperatureUnit}
                  />
                </div>
                
                <WeatherDetails weatherData={weatherData} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  </>
  );
}