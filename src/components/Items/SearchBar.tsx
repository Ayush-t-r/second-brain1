import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  setSelectedTags,
  availableTags
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes and links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
        />
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-2 border-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(searchTerm || selectedTags.length > 0) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <XIcon className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;