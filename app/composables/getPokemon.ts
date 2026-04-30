export const usePokemon = () => {
  // ID format is 3 digit minimum (1 becomes 001)
  const formatId = (id: number | string) => {
    return String(id).padStart(3, '0')
  }

  // required url format for fetching photos
  const getImageUrl = (id: number | string) => {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatId(id)}.png`
  }

  // fetches list with limit and offset for the initial 10 and "load more" functionality
  const fetchPokemonList = async (limit = 10, offset = 0) => {
    const { data, error } = await useFetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    return { data, error }
  }

  return {
    formatId,
    getImageUrl,
    fetchPokemonList
  }
}