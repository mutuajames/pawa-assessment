interface TemperatureToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onUnitChange: (unit: 'celsius' | 'fahrenheit') => void;
}

export function TemperatureToggle({ unit, onUnitChange }: TemperatureToggleProps) {
  return (
    <div className="btn-group">
      <button
        onClick={() => onUnitChange('celsius')}
        className={unit === 'celsius' ? 'bg-blue-500 text-white' : ''}

      >
        °C
      </button>
      <button
        onClick={() => onUnitChange('fahrenheit')}
        className={`btn btn-sm ${unit === 'fahrenheit' ? 'bg-blue-500 text-white' : ''}`}
      >
        °F
      </button>
    </div>
  );
}