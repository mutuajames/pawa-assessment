import { useState, useEffect, useRef } from 'react';
import { searchLocation } from '../services/weatherApi';
import { LocationData } from '../types/weather';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<LocationData[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.trim().length > 2) {
        // setIsLoading(true);
        try {
          const data = await searchLocation(query);
          setResults(data);
          setIsResultsVisible(true);
        } catch (error) {
          console.error('Error searching locations:', error);
        } finally {
          // setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsResultsVisible(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleCitySelect = (city: string, country: string) => {
    onCitySelect(`${city}, ${country}`);
    setQuery(`${city}, ${country}`);
    setIsResultsVisible(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onCitySelect(query);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="w-full">
        <input
          className="input input-solid flex-1 border-2"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="btn btn-outline-primary border border-primary "
          onClick={handleSearch}
        >
          GO
        </button>
      </div>

      {isResultsVisible && results.length > 0 && (
        <div className="card w-full mt-1 z-10 shadow-lg bg-base-100 absolute border border-base-300">
          <div className="card-body p-2">
            {results.map((location, index) => (
              <div
                key={`${location.name}-${location.lat}-${location.lon}-${index}`}
                className="p-2 rounded cursor-pointer transition-colors duration-200 hover:bg-base-200 hover:text-primary"
                onClick={() => handleCitySelect(location.name, location.country)}
              >
                <p className="text-sm">
                  {location.name}, {location.country}
                  {location.state && `, ${location.state}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}