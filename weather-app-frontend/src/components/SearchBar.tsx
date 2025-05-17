
import { useState, useEffect, useRef } from 'react';
import { searchLocation } from '../services/weatherApi';
import { LocationData } from '../types/weather';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
}

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        setIsLoading(true);
        try {
          const data = await searchLocation(query);
          setResults(data);
          setIsResultsVisible(true);
        } catch (error) {
          console.error('Error searching locations:', error);
        } finally {
          setIsLoading(false);
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
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        
        <input
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          placeholder="Search for cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <button
          className="absolute right-0 p-3 text-sm font-medium h-full text-white bg-blue-600 rounded-r-lg border border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300"
          onClick={handleSearch}
        >
          <span className="sr-only">Search</span>
          GO
        </button>
      </div>

      {isLoading && (
        <div className="absolute right-14 top-3">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {isResultsVisible && results.length > 0 && (
        <div className="card w-full mt-1 z-10 bg-white absolute border border-gray-200 rounded-lg shadow-lg">
          <div className="card-body max-h-64 overflow-y-auto p-0">
            {results.map((location, index) => (
              <div
                key={`${location.name}-${location.lat}-${location.lon}-${index}`}
                className="p-3 cursor-pointer transition-colors duration-200 hover:bg-blue-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                onClick={() => handleCitySelect(location.name, location.country)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {location.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {location.country}
                    {location.state && `, ${location.state}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}