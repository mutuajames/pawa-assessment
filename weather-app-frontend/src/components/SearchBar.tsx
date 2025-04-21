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
      <div className="w-full flex items-center gap-2">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 border border-blue-700 rounded-lg cursor-pointer"
          onClick={handleSearch}
        >
          GO
        </button>
      </div>


      {isResultsVisible && results.length > 0 && (
        <div className="card w-full mt-1 z-10 shadow-lg bg-white absolute border border-base-300">
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