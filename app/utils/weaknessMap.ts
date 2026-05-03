export const typeWeaknesses: Record<string, string[]> = {
  normal: ['rock', 'steel', 'fighting'],
  fighting: ['flying', 'poison', 'psychic', 'bug', 'ghost', 'fairy'],
  flying: ['rock', 'steel', 'electric'],
  poison: ['poison', 'ground', 'rock', 'ghost', 'steel'],
  ground: ['flying', 'bug', 'grass'],
  rock: ['fighting', 'ground', 'steel'],
  bug: ['fighting', 'flying', 'poison', 'ghost', 'steel', 'fire', 'fairy'],
  ghost: ['normal', 'dark', 'ghost'],
  steel: ['steel', 'fire', 'water', 'electric'],
  fire: ['rock', 'fire', 'water', 'dragon'],
  water: ['water', 'grass', 'dragon'],
  grass: ['flying', 'poison', 'bug', 'steel', 'fire', 'grass', 'dragon'],
  electric: ['ground', 'grass', 'electric', 'dragon'],
  psychic: ['steel', 'psychic', 'dark'],
  ice: ['steel', 'fire', 'water', 'ice'],
  dragon: ['steel', 'fairy'],
  dark: ['fighting', 'dark', 'fairy'],
  fairy: ['poison', 'steel', 'fire']
}

export const getWeaknesses = (types: string[]): string[] => {
  const weaknesses = new Set<string>()
  types.forEach(type => {
    const weakList = typeWeaknesses[type.toLowerCase()]
    if (weakList) weakList.forEach(w => weaknesses.add(w))
  })
  return Array.from(weaknesses)
}