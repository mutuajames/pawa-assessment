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

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <div className="flex flex-col items-center">
        <img src={iconUrl} alt={weatherData.weather[0].description} className="w-32 h-32" />
        <h2 className="text-4xl font-bold mt-2">
          {displayTemp}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
        </h2>
        <h5 className="text-xl font-medium capitalize">
          {weatherData.weather[0].main}
        </h5>
      </div>

      <div className="mt-4 text-center">
        <p>
          {formattedDate}<br />
          {weatherData.name}, {weatherData.sys.country}
        </p>
      </div>
    </div>
  );
}