import { defineStore } from 'pinia'

interface PokemonListResponse {
  results: { name: string; url: string }[]
  next: string | null
}

interface PokemonStat {
  base_stat: number
  stat: { name: string }
}

interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  types: string[]
  stats: PokemonStat[]
}

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [] as Pokemon[],
    limit: 10,
    offset: 0,
    isLoading: false,
    hasMore: true
  }),
  actions: {
    async fetchPokemons() {
      if (this.isLoading || !this.hasMore) return
      this.isLoading = true

      try {
        const response = await $fetch<PokemonListResponse>(
          `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`
        )

        const details = await Promise.all(
          response.results.map(async (p) => {
            const rawData = await $fetch<any>(p.url)
            return {
              id: rawData.id,
              name: rawData.name,
              height: rawData.height,
              weight: rawData.weight,
              types: rawData.types.map((t: any) => t.type.name),
              stats: rawData.stats
            } as Pokemon
          })
        )

        this.pokemonList.push(...details)
        this.offset += this.limit
        this.hasMore = response.next !== null  // ← tamang check
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})