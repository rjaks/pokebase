export const typeIcons: Record<string, string> = {
  normal: 'ph:circle-fill',
  fire: 'ph:fire-fill',
  water: 'ph:drop-fill',
  electric: 'ph:lightning-fill',
  grass: 'ph:leaf-fill',
  ice: 'ph:snowflake-fill',
  fighting: 'mdi:boxing-glove',
  poison: 'ph:skull-fill',
  ground: 'ph:mountains-fill',
  flying: 'ph:wind-fill',
  psychic: 'ph:eye-fill',
  bug: 'ph:bug-fill',
  rock: 'ph:diamond-fill',
  ghost: 'ph:ghost-fill',
  dragon: 'ph:sword-fill',
  dark: 'ph:moon-fill',
  steel: 'ph:shield-fill',
  fairy: 'ph:star-fill',
}

export const getTypeIcon = (type: string) => {
  return typeIcons[type.toLowerCase()] || 'ph:question-fill'
}