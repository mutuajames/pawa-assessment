import { ForecastData, LocationData, WeatherData } from "@/types/weather";

export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
    const response = await fetch(`/api/weather/current/${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch current weather');
    }
    return await response.json();
  };
  
  export const fetchForecast = async (city: string): Promise<ForecastData> => {
    const response = await fetch(`/api/weather/forecast/${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }
    return await response.json();
  };
  
  export const searchLocation = async (query: string): Promise<LocationData[]> => {
    const response = await fetch(`/api/weather/search/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search location');
    }
    return await response.json();
  };
  
  // src/utils/temperatureConverter.ts
  export const celsiusToFahrenheit = (temp: number): number => {
    return (temp * 9) / 5 + 32;
  };
  
  export const fahrenheitToCelsius = (temp: number): number => {
    return ((temp - 32) * 5) / 9;
  };
  