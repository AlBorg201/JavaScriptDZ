import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, ITEMS_PER_PAGE } from '../constants';

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return details.data;
          })
        );
        setPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
      } catch (error) {
        setError('Ошибка загрузки данных');
        setPokemons([]);
        setFilteredPokemons([]);
      }
      setLoading(false);
    };

    fetchPokemons();
  }, [offset]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(pokemons);
    }
  }, [searchTerm, pokemons]);

  return (
    <PokemonContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filteredPokemons,
        loading,
        error,
        selectedPokemon,
        setSelectedPokemon,
        offset,
        setOffset,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemonContext() {
  return useContext(PokemonContext);
}