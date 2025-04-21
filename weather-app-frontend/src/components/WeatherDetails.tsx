import { WeatherData } from "../types/weather";

interface WeatherDetailsProps {
  weatherData: WeatherData | null;
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  if (!weatherData) return null;

  return (
<div className="grid grid-cols-2 gap-4 mt-4">
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <h6 className="text-center mb-4 font-semibold">
            Wind Status
          </h6>
          <h3 className="text-center text-3xl font-bold">
            {Math.round(weatherData.wind.speed * 3.6)} km/h
          </h3>
          <div className="flex justify-center mt-4">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-base-300 rounded-full">
              <div 
                className="w-6 h-1 bg-blue-600"
                style={{ 
                  transform: `rotate(${weatherData.wind.deg}deg)`,
                  transformOrigin: 'center'
                }}
              ></div>
            </div>
          </div>
          <p className="text-center mt-2 text-base-content/70 text-xs">
            {getWindDirection(weatherData.wind.deg)}
          </p>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          <h6 className="text-center mb-4 font-semibold">
            Humidity
          </h6>
          <h3 className="text-center text-3xl font-bold">
            {weatherData.main.humidity}%
          </h3>
          <div className="mt-4 px-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-base-content/70">0</span>
              <span className="text-xs text-base-content/70">50</span>
              <span className="text-xs text-base-content/70">100</span>
            </div>
            <progress 
              className="progress progress-primary w-full h-2" 
              value={weatherData.main.humidity} 
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}