export const usePokemon = () => {
  const formatId = (id: number | string): string => {
    return String(id).padStart(3, '0')
  }

  const getImageUrl = (id: number | string): string => {
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatId(id)}.png`
  }

  return {
    formatId,
    getImageUrl
  }
}