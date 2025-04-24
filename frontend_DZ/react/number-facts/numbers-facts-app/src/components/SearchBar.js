import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = e => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Поиск фактов..."
      value={query}
      onChange={handleChange}
      className="w-full p-2 mb-4 border rounded"
    />
  );
};

export default SearchBar;