import { useState } from 'react';
import PokemonList from '../components/PokemonList.jsx';
import SearchBar from '../components/SearchBar.jsx';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Энциклопедия покемонов</h1>
      <div className="w-full max-w-7xl px-4">
        <SearchBar setSearchTerm={setSearchTerm} />
        <PokemonList searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default Home;