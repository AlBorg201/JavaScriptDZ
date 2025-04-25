import { usePokemonContext } from '../context/PokemonContext.jsx';

function SearchBar() {
  const { setSearchTerm } = usePokemonContext();

  return (
    <input
      type="text"
      placeholder="Поиск в этой вкладке"
      className="w-full p-2 mb-4 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default SearchBar;