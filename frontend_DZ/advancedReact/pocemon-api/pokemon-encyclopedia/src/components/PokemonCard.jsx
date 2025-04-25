function PokemonCard({ pokemon, onClick }) {
    return (
      <div
        className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition cursor-pointer"
        onClick={onClick}
      >
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto"
        />
        <h2 className="text-xl font-semibold capitalize text-center text-gray-900">{pokemon.name}</h2>
        <p className="text-center text-gray-900">
          <strong>Type:</strong> {pokemon.types.map((type) => type.type.name).join(', ')}
        </p>
        <p className="text-center text-gray-900">
          <strong>Abilities:</strong> {pokemon.abilities.map((ability) => ability.ability.name).join(', ')}
        </p>
      </div>
    );
  }
  
  export default PokemonCard;