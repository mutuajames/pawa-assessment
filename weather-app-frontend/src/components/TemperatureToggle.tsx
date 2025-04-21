interface TemperatureToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
}

export function TemperatureToggle({ unit, onUnitChange }: TemperatureToggleProps) {
  return (
    <div className="inline-flex rounded-lg shadow-xs cursor-pointer" role="group">
      <button
        type="button"
        onClick={() => onUnitChange('celsius')}
        className={`px-4 py-2 text-sm font-medium border rounded-l-lg
          ${unit === 'celsius' 
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
            : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}    >
        °C
      </button>
      <button
      type="button"
        onClick={() => onUnitChange('fahrenheit')}
        className={`px-4 py-2 text-sm font-medium border rounded-r-lg
          ${unit === 'fahrenheit' 
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
            : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}   >
        °F
      </button>
    </div>
  );
} 