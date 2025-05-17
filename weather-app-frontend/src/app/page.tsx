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
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

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
            loadWeatherData('Nairobi, KE');
            setCity('Nairobi, KE');
          }
        },
        () => {
          // Default city if user denies location
          loadWeatherData('Nairobi, KE');
          setCity('Nairobi, KE');
        }
      );
    } else {
      // Default city if geolocation not available
      loadWeatherData('Nairobi, KE');
      setCity('Nairobi, KE');
    }
  }, []);

  // Determine if user preferred dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDarkMode);
    }
  }, []);

  const loadWeatherData = async (cityName: string) => {
    setError('');
    setIsLoading(true);
    setIsInitialLoad(false);

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

  // Get weather condition from data to set page background
  const getWeatherBackground = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-50 to-blue-100';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const hours = new Date(weatherData.dt * 1000).getHours();
    const isDaytime = hours > 6 && hours < 18;
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return isDaytime 
        ? 'bg-gradient-to-br from-gray-100 to-blue-100' 
        : 'bg-gradient-to-br from-gray-900 to-blue-900';
    } else if (condition.includes('cloud')) {
      return isDaytime 
        ? 'bg-gradient-to-br from-gray-100 to-blue-50' 
        : 'bg-gradient-to-br from-gray-800 to-indigo-900';
    } else if (condition.includes('clear')) {
      return isDaytime 
        ? 'bg-gradient-to-br from-sky-100 to-blue-50' 
        : 'bg-gradient-to-br from-indigo-900 to-blue-950';
    } else if (condition.includes('snow')) {
      return 'bg-gradient-to-br from-indigo-50 to-blue-100';
    } else if (condition.includes('storm')) {
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
    
    return 'bg-gradient-to-br from-blue-50 to-blue-100';
  };

  return (
    <>
      <Head>
        <title>{city ? `${city} Weather Forecast` : 'Weather App'}</title>
        <meta name="description" content="Real-time weather forecast application with beautiful UI" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${getWeatherBackground()}`}>
        <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
             <span className="text-blue-600">Weather Forecast</span>
          </h1>
        </div>
        
        <div className="card mx-auto max-w-4xl shadow-xl bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Column - Current Weather */}
            <div className="md:col-span-1">
              {isLoading && isInitialLoad ? (
                <div className="flex justify-center items-center h-64 md:h-full bg-gray-100 dark:bg-gray-700">
                  <div className="flex flex-col items-center">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Getting your weather data...</p>
                  </div>
                </div>
              ) : (
                <CurrentWeather 
                  weatherData={weatherData} 
                  temperatureUnit={temperatureUnit} 
                />
              )}
            </div>
            
            {/* Right Column - Search, Forecast, Details */}
            <div className="col-span-1 md:col-span-2 p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-3/4">
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
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && !isInitialLoad ? (
                <div className="flex justify-center my-8">
                  <span className="loading loading-spinner loading-lg text-blue-600"></span>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">3-Day Forecast</h2>
                    <DailyForecast 
                      forecastData={forecastData}
                      temperatureUnit={temperatureUnit}
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weather Details</h2>
                    <WeatherDetails weatherData={weatherData} />
                    
                    {weatherData && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right">
                        Last updated: {new Date(weatherData.dt * 1000).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <footer className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Weather Forecast App • Powered by OpenWeather API</p>
        </footer>
      </main>
    </>
  );
}