<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Pokedex</h1>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
    <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search by Name or ID..." 
        class="border p-2 rounded-md w-full sm:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <select 
        v-model="sortBy" 
        class="border p-2 rounded-md w-full sm:w-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="id-asc">ID (Ascending)</option>
        <option value="id-desc">ID (Descending)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
    </select>
    </div>

    <!-- Pokemon Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <PokemonCard
        v-for="poke in displayList"
        :key="poke.id"
        :rawId="poke.id"
        :id="formatId(poke.id)"
        :name="poke.name"
        :image="getImageUrl(poke.id)"
        :types="poke.types"
      />
    </div>

    <!-- Load More Pagination -->
    <div class="mt-10 flex justify-center pb-10">
      <button 
        @click="store.fetchPokemons" 
        :disabled="store.isLoading || !store.hasMore"
        class="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {{ store.isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePokemon } from '~/composables/getPokemon'
import { usePokemonStore } from '~/stores/pokemon'

const { formatId, getImageUrl } = usePokemon()

const searchQuery = ref('')
const sortBy = ref('id-asc')
const store = usePokemonStore()

onMounted(() => {
  if (store.pokemonList.length === 0) {
    store.fetchPokemons()
  }
})

const displayList = computed(() => {
  let list = store.pokemonList

  // filtering
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(poke => 
      poke.name.toLowerCase().includes(query) || 
      poke.id.toString().includes(query) ||
      formatId(poke.id).includes(query)
    )
  }

  // sorting
  return [...list].sort((a, b) => {
    if (sortBy.value === 'name-asc') return a.name.localeCompare(b.name) 
    if (sortBy.value === 'name-desc') return b.name.localeCompare(a.name) 
    if (sortBy.value === 'id-desc') return b.id - a.id 
    return a.id - b.id 
  })
})
</script>