function PokemonModal({ pokemon, onClose }) {
    if (!pokemon) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold capitalize text-gray-900 mb-4">{pokemon.name}</h2>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto mb-4"
          />
          <p className="text-gray-900">
            <strong>Type:</strong> {pokemon.types.map((type) => type.type.name).join(', ')}
          </p>
          <p className="text-gray-900">
            <strong>Abilities:</strong> {pokemon.abilities.map((ability) => ability.ability.name).join(', ')}
          </p>
          <p className="text-gray-900">
            <strong>Height:</strong> {pokemon.height / 10} m
          </p>
          <p className="text-gray-900">
            <strong>Weight:</strong> {pokemon.weight / 10} kg
          </p>
          <p className="text-gray-900">
            <strong>Stats:</strong>
            <ul>
              {pokemon.stats.map((stat) => (
                <li key={stat.stat.name}>
                  {stat.stat.name}: {stat.base_stat}
                </li>
              ))}
            </ul>
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }
  
  export default PokemonModal;