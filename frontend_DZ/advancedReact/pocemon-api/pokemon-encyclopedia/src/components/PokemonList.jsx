import { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard.jsx';
import PokemonModal from './PokemonModal.jsx';
import { API_URL, ITEMS_PER_PAGE } from '../constants';

function PokemonList({ searchTerm }) {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchTerm.trim()) {
          try {
            const response = await axios.get(`${API_URL}/${searchTerm.toLowerCase()}`);
            setPokemons([response.data]);
          } catch (err) {
            setError('Покемон не найден');
            setPokemons([]);
          }
        } else {
          const response = await axios.get(`${API_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
          const pokemonDetails = await Promise.all(
            response.data.results.map(async (pokemon) => {
              const details = await axios.get(pokemon.url);
              return details.data;
            })
          );
          setPokemons(pokemonDetails);
        }
      } catch (error) {
        setError('Ошибка загрузки данных');
        setPokemons([]);
      }
      setLoading(false);
    };

    fetchPokemons();
  }, [offset, searchTerm]);

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-900">Загрузка...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : pokemons.length === 0 ? (
        <p className="text-center text-gray-900">Покемоны не найдены</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => setSelectedPokemon(pokemon)}
            />
          ))}
        </div>
      )}
      {!searchTerm && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - ITEMS_PER_PAGE, 0))}
            disabled={offset === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Назад
          </button>
          <button
            onClick={() => setOffset((prev) => prev + ITEMS_PER_PAGE)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Далее
          </button>
        </div>
      )}
      <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </div>
  );
}

export default PokemonList;