'use client';

import { useState } from 'react';
import axios from 'axios';
import { OPENWEATHER_API_KEY } from '@/config/api';
import StarBorder from './StarBorder';

interface SearchBarProps {
  onSearch: (coordinates: { lat: number; lon: number }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(search)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        onSearch({ lat, lon });
        setSearch('');
      } else {
        setError('City not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setError('Failed to search location');
    }
  };

  return (
    <div>
      <StarBorder 
        as="div"
        color="#ef4444"
        speed="4s"
        className="w-full"
      >
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city..."
            className="px-4 py-2 rounded-lg bg-transparent text-red-400 placeholder-red-600 focus:outline-none w-full text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap text-sm sm:text-base"
          >
            Search
          </button>
        </form>
      </StarBorder>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}