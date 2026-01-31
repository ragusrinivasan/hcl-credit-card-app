import { useState } from "react";

const SearchBar = ({ onSearch, onCardTypeChange, cardType }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Applications
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Application #, Name, Email, Phone, or PAN..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Card Type Filter */}
        <div className="w-full md:w-48">
          <label
            htmlFor="cardType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Card Type
          </label>
          <select
            id="cardType"
            value={cardType}
            onChange={(e) => onCardTypeChange(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Cards</option>
            <option value="VISA">VISA</option>
            <option value="MASTER">MASTER</option>
            <option value="RUPAY">RUPAY</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
