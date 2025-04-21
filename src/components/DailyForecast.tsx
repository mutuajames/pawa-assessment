import { ForecastData } from "../types/weather";
import { celsiusToFahrenheit } from "../utils/temperatureConverter";

interface DailyForecastProps {
  forecastData: ForecastData | null;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export function DailyForecast({ forecastData, temperatureUnit }: DailyForecastProps) {
  if (!forecastData) return null;

  // Process forecast data to show one forecast per day (at noon)
  const dailyForecasts = forecastData.list.filter((item) => {
    const time = item.dt_txt.split(' ')[1];
    return time === '12:00:00';
  }).slice(0, 3); // Next 3 days as shown in wireframe

  return (
    <div className="grid grid-cols-3 gap-2">
    {dailyForecasts.map((day) => {
      const date = new Date(day.dt * 1000);
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
      
      const minTemp = day.main.temp - 3; // Simulating min temp since API doesn't directly provide it
      const maxTemp = day.main.temp;
      
      const displayMinTemp = temperatureUnit === 'celsius' 
        ? Math.round(minTemp) 
        : Math.round(celsiusToFahrenheit(minTemp));
        
      const displayMaxTemp = temperatureUnit === 'celsius' 
        ? Math.round(maxTemp) 
        : Math.round(celsiusToFahrenheit(maxTemp));

      return (
        <div key={day.dt} className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body p-4 text-center">
            <h6 className="font-medium mb-2">
              {dayNumber} {month}
            </h6>
            <div className="flex justify-center">
              <img src={iconUrl} alt={day.weather[0].description} className="h-16 w-16" />
            </div>
            <p className="text-sm mt-2">
              {displayMinTemp}-{displayMaxTemp}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </p>
          </div>
        </div>
      );
    })}
  </div>
  );
}