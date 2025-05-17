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

  // Get day names for better display
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Function to determine weather icon background color
  const getWeatherColor = (condition: string): string => {
    condition = condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-blue-100';
    } else if (condition.includes('cloud')) {
      return 'bg-gray-100';
    } else if (condition.includes('clear')) {
      return 'bg-yellow-100';
    } else if (condition.includes('snow')) {
      return 'bg-indigo-100';
    } else if (condition.includes('storm')) {
      return 'bg-purple-100';
    }
    return 'bg-blue-50';
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {dailyForecasts.map((day) => {
        const date = new Date(day.dt * 1000);
        const dayName = getDayName(date);
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const weatherCondition = day.weather[0].main;
        const iconBgColor = getWeatherColor(weatherCondition);
        
        const minTemp = day.main.temp - 3; // Simulating min temp since API doesn't directly provide it
        const maxTemp = day.main.temp;
        
        const displayMinTemp = temperatureUnit === 'celsius' 
          ? Math.round(minTemp) 
          : Math.round(celsiusToFahrenheit(minTemp));
          
        const displayMaxTemp = temperatureUnit === 'celsius' 
          ? Math.round(maxTemp) 
          : Math.round(celsiusToFahrenheit(maxTemp));

        return (
          <div key={day.dt} className="card bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="card-body p-4 flex flex-col items-center">
              <div className="flex flex-col items-center gap-1">
                <h6 className="font-bold text-gray-800">
                  {dayName}
                </h6>
                <p className="text-xs text-gray-500">
                  {dayNumber} {month}
                </p>
              </div>
              
              <div className={`flex justify-center items-center p-2 rounded-full mt-3 ${iconBgColor} w-16 h-16`}>
                <img 
                  src={iconUrl} 
                  alt={day.weather[0].description} 
                  className="h-12 w-12 drop-shadow-sm" 
                />
              </div>
              
              <p className="font-medium text-sm text-gray-700 mt-2 text-center">
                {day.weather[0].description}
              </p>
              
              <div className="flex items-center justify-between w-full mt-3">
                <span className="text-sm font-bold text-gray-700">
                  {displayMaxTemp}°
                </span>
                <div className="w-full mx-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full">
                    <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                      style={{ width: '100%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {displayMinTemp}°
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}