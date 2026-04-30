// utils/weaknessMap.ts

// simplified mapping based on type
const typeWeaknesses: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['grass', 'electric'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel']
}

export const getWeaknesses = (types: string[]) => {
  const weaknesses = new Set<string>() // gamit tayo ng Set para walang duplicate
  types.forEach(t => {
    const typeName = t.toLowerCase()
    if (typeWeaknesses[typeName]) {
      typeWeaknesses[typeName].forEach(w => weaknesses.add(w))
    }
  })
  return Array.from(weaknesses)
}