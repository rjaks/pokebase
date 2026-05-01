import { defineStore } from 'pinia'

// In-update ko yung interface para string[] na ulit ang types
interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  types: string[] 
  stats: { base_stat: number; stat: { name: string } }[]
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
        const response: any = await $fetch(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
        
        // I-map natin yung data para malinis yung papasok sa state
        const details = await Promise.all(
          response.results.map(async (p: any) => {
            const rawData: any = await $fetch(p.url)
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
        
        if (response.results.length < this.limit) {
          this.hasMore = false
        }
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})