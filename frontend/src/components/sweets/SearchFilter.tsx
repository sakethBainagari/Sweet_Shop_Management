import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '../../types/sweet';
import { debounce } from '../../utils/helpers';
import { UI_CONSTANTS } from '../../utils/constants';

interface SearchFilterProps {
  categories: string[];
  onFiltersChange: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  categories, 
  onFiltersChange, 
  isLoading 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    category: '',
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((newFilters: SearchFilters) => {
      onFiltersChange(newFilters);
    }, UI_CONSTANTS.DEBOUNCE_DELAY),
    [onFiltersChange]
  );

  // Effect to trigger search when filters change
  useEffect(() => {
    debouncedSearch(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minPrice' || name === 'maxPrice' 
        ? (value === '' ? undefined : parseFloat(value))
        : value
    }));
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      name: '',
      category: '',
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Search & Filter Sweets
        </h3>
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
            Searching...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name Search */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Sweet Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($)
          </label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min="0"
            step="0.01"
            value={filters.minPrice || ''}
            onChange={handleInputChange}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($)
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min="0"
            step="0.01"
            value={filters.maxPrice || ''}
            onChange={handleInputChange}
            placeholder="999.99"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4">
        {(filters.name || filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.name && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Name: "{filters.name}"
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.minPrice !== undefined && (
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Min: ${filters.minPrice}
              </span>
            )}
            {filters.maxPrice !== undefined && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Max: ${filters.maxPrice}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;