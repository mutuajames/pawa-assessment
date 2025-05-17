import { WeatherData } from "../types/weather";
import { celsiusToFahrenheit } from "../utils/temperatureConverter";

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export function CurrentWeather({ weatherData, temperatureUnit }: CurrentWeatherProps) {
  if (!weatherData) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;
  const temperature = weatherData.main.temp;
  const displayTemp = temperatureUnit === 'celsius'
    ? Math.round(temperature)
    : Math.round(celsiusToFahrenheit(temperature));

  const date = new Date(weatherData.dt * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Get time of day to set appropriate background gradient
  const hours = date.getHours();
  const isDaytime = hours > 6 && hours < 18;
  
  // Get weather condition to adjust UI elements
  const condition = weatherData.weather[0].main.toLowerCase();

  // Define gradient based on time and weather condition
  let gradientClass = isDaytime 
    ? "bg-gradient-to-b from-blue-400 to-blue-600" 
    : "bg-gradient-to-b from-indigo-900 to-blue-900";
  
  // Adjust for specific weather conditions
  if (condition.includes('rain') || condition.includes('drizzle')) {
    gradientClass = isDaytime 
      ? "bg-gradient-to-b from-gray-400 to-blue-600" 
      : "bg-gradient-to-b from-gray-900 to-blue-900";
  } else if (condition.includes('cloud')) {
    gradientClass = isDaytime 
      ? "bg-gradient-to-b from-gray-300 to-blue-400" 
      : "bg-gradient-to-b from-gray-800 to-indigo-900";
  } else if (condition.includes('clear')) {
    gradientClass = isDaytime 
      ? "bg-gradient-to-b from-sky-300 to-blue-500" 
      : "bg-gradient-to-b from-indigo-800 to-blue-900";
  } else if (condition.includes('storm')) {
    gradientClass = isDaytime 
      ? "bg-gradient-to-b from-gray-500 to-gray-700" 
      : "bg-gradient-to-b from-gray-900 to-indigo-950";
  }

  return (
    <div className={`flex flex-col items-center h-full justify-between rounded-l-lg p-6 text-white ${gradientClass}`}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <img src={iconUrl} alt={weatherData.weather[0].description} className="w-40 h-40 drop-shadow-lg" />
        </div>
        <h2 className="text-6xl font-bold mt-2 tracking-tighter">
          {displayTemp}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
        </h2>
        <h5 className="text-2xl font-medium capitalize mt-1 text-white/90">
          {weatherData.weather[0].description}
        </h5>
        
        <div className="flex items-center gap-2 mt-4 bg-white/10 py-2 px-4 rounded-full backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">{weatherData.name}, {weatherData.sys.country}</span>
        </div>
      </div>

      <div className="mt-4 text-center bg-white/10 w-full py-3 px-4 rounded-lg backdrop-blur-sm">
        <p className="text-sm font-medium">
          {formattedDate}
        </p>
        <div className="flex justify-center items-center gap-6 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-80">Feels Like</span>
            <span className="font-medium">
              {temperatureUnit === 'celsius' 
                ? Math.round(weatherData.main.feels_like) 
                : Math.round(celsiusToFahrenheit(weatherData.main.feels_like))}°
            </span>
          </div>
          <div className="h-8 w-px bg-white/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-80">Pressure</span>
            <span className="font-medium">{weatherData.main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
