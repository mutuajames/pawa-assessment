interface TemperatureToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
}

export function TemperatureToggle({ unit, onUnitChange }: TemperatureToggleProps) {
  return (
    <div className="flex p-1 bg-gray-100 rounded-full shadow-sm">
      <button
        type="button"
        onClick={() => onUnitChange('celsius')}
        className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
          ${unit === 'celsius' 
            ? 'text-white' 
            : 'text-gray-500 hover:text-gray-800'}`}  
        aria-pressed="true"
        aria-label="Celsius temperature unit"  
      >
        {unit === 'celsius' && (
          <span className="absolute inset-0 rounded-full bg-blue-600 shadow-md transition-all duration-300"></span>
        )}
        <span className="relative">°C</span>
      </button>
      
      <button
        type="button"
        onClick={() => onUnitChange('fahrenheit')}
        className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
          ${unit === 'fahrenheit' 
            ? 'text-white' 
            : 'text-gray-500 hover:text-gray-800'}`}  
        aria-pressed="false"
        aria-label="Fahrenheit temperature unit"
      >
        {unit === 'fahrenheit' && (
          <span className="absolute inset-0 rounded-full bg-blue-600 shadow-md transition-all duration-300"></span>
        )}
        <span className="relative">°F</span>
      </button>
    </div>
  );
}