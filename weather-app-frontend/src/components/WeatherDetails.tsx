import { WeatherData } from "../types/weather";

interface WeatherDetailsProps {
  weatherData: WeatherData | null;
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  if (!weatherData) return null;

  // Calculate visibility in km with one decimal point
  const visibilityKm = (weatherData.visibility / 1000).toFixed(1);
  
  // Convert pressure from hPa to inHg for additional info
  const pressureInHg = (weatherData.main.pressure * 0.02953).toFixed(2);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* Wind Status Card */}
      <div className="card bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-center mb-4 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <h6 className="font-semibold text-gray-700">Wind Status</h6>
          </div>
          
          <h3 className="text-center text-4xl font-bold text-gray-800">
            {Math.round(weatherData.wind.speed * 3.6)} <span className="text-base font-normal text-gray-600">km/h</span>
          </h3>
          
          <div className="flex justify-center mt-6">
            <div className="flex items-center justify-center w-12 h-12 border-2 border-blue-100 rounded-full bg-blue-50">
              <div 
                className="w-7 h-1.5 bg-blue-600 rounded-full"
                style={{ 
                  transform: `rotate(${weatherData.wind.deg}deg)`,
                  transformOrigin: 'center'
                }}
              ></div>
            </div>
          </div>
          
          <p className="text-center mt-3 text-gray-500 font-medium">
            {getWindDirection(weatherData.wind.deg)}
          </p>
        </div>
      </div>
      
      {/* Humidity Card */}
      <div className="card bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-center mb-4 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <h6 className="font-semibold text-gray-700">Humidity</h6>
          </div>
          
          <h3 className="text-center text-4xl font-bold text-gray-800">
            {weatherData.main.humidity}<span className="text-base font-normal text-gray-600">%</span>
          </h3>
          
          <div className="mt-6 px-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">50</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${weatherData.main.humidity}%` }}
              ></div>
            </div>
            <p className="text-center mt-3 text-gray-500 text-sm">
              {getHumidityStatus(weatherData.main.humidity)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details Cards */}
      <div className="card bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-center mb-4 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h6 className="font-semibold text-gray-700">Visibility</h6>
          </div>
          
          <h3 className="text-center text-4xl font-bold text-gray-800">
            {visibilityKm} <span className="text-base font-normal text-gray-600">km</span>
          </h3>
          
          <p className="text-center mt-3 text-gray-500 text-sm">
            {getVisibilityStatus(Number(visibilityKm))}
          </p>
        </div>
      </div>
      
      <div className="card bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-center mb-4 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h6 className="font-semibold text-gray-700">Pressure</h6>
          </div>
          
          <h3 className="text-center text-4xl font-bold text-gray-800">
            {weatherData.main.pressure} <span className="text-base font-normal text-gray-600">hPa</span>
          </h3>
          
          <p className="text-center mt-3 text-gray-500 text-sm">
            {pressureInHg} inHg • {getPressureStatus(weatherData.main.pressure)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getHumidityStatus(humidity: number): string {
  if (humidity < 30) return "Low humidity";
  if (humidity < 60) return "Comfortable";
  return "High humidity";
}

function getVisibilityStatus(visibility: number): string {
  if (visibility < 1) return "Poor visibility";
  if (visibility < 5) return "Moderate visibility";
  return "Good visibility";
}

function getPressureStatus(pressure: number): string {
  if (pressure < 1000) return "Low pressure";
  if (pressure > 1020) return "High pressure";
  return "Normal pressure";
}
