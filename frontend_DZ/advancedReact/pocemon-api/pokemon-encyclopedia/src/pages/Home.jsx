import SearchBar from '../components/SearchBar.jsx';
import PokemonList from '../components/PokemonList.jsx';

function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Энциклопедия покемонов</h1>
      <div className="w-full max-w-7xl px-4">
        <SearchBar />
        <PokemonList />
      </div>
    </div>
  );
}

export default Home;