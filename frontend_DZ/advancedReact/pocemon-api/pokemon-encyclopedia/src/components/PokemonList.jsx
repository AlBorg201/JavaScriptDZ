import PokemonCard from './PokemonCard.jsx';
import PokemonModal from './PokemonModal.jsx';
import { usePokemonContext } from '../context/PokemonContext.jsx';
import { ITEMS_PER_PAGE } from '../constants';

function PokemonList() {
  const {
    filteredPokemons,
    loading,
    error,
    selectedPokemon,
    setSelectedPokemon,
    offset,
    setOffset,
  } = usePokemonContext();

  return (
    <div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setOffset((prev) => Math.max(prev - ITEMS_PER_PAGE, 0))}
          disabled={offset === 0}
          className="px-4 py-3 bg-blue-500 text-white rounded disabled:bg-gray-300 my-4"
        >
          Загрузить предыдущие 100 покемонов
        </button>
        <button
          onClick={() => setOffset((prev) => prev + ITEMS_PER_PAGE)}
          className="px-4 py-3 bg-blue-500 text-white rounded my-4"
        >
          Загрузить следующие 100 покемонов
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-900">Загрузка...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredPokemons.length === 0 ? (
        <p className="text-center text-gray-900">Не найдено</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => setSelectedPokemon(pokemon)}
            />
          ))}
        </div>
      )}
      <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  );
}

export default PokemonList;