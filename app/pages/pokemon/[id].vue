<template>
  <div class="max-w-3xl mx-auto p-6" v-if="pokemon">
    <NuxtLink to="/" class="mb-4 text-blue-600 hover:underline font-semibold">
      &larr; Back to List
    </NuxtLink>
    
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- header info -->
      <div class="text-center border-b pb-6">
        <img :src="getImageUrl(pokemon.id)" class="w-48 h-48 mx-auto object-contain" />
        <h1 class="text-4xl font-bold capitalize mt-4">{{ pokemon.name }}</h1>
        <p class="text-gray-500 font-semibold text-xl">#{{ formatId(pokemon.id) }}</p>
      </div>

      <!-- description -->
      <div class="py-6 border-b">
        <h3 class="text-lg font-bold mb-2">Description</h3>
        <p class="text-gray-700 italic">"{{ description }}"</p>
      </div>

      <!-- types and weaknesses -->
      <div class="py-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-bold mb-2">Types</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="t in pokemonTypes" :key="t" class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize font-medium">
              {{ t }}
            </span>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-2 text-red-600">Weaknesses</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="w in pokemonWeaknesses" :key="w" class="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 capitalize font-medium">
              {{ w }}
            </span>
          </div>
        </div>
      </div>

      <!-- base stats -->
      <div class="py-6 border-b">
        <h3 class="text-lg font-bold mb-4">Base Stats</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- stat bar example -->
            <div class="space-y-3">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name">
                <div class="flex justify-between text-xs mb-1 uppercase font-bold text-gray-600">
                <span>{{ stat.stat.name.replace('-', ' ') }}</span>
                <span>{{ stat.base_stat }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                <div 
                    class="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                    :style="{ width: `${(stat.base_stat / 255) * 100}%` }"
                ></div>
                </div>
            </div>
            </div>
        </div>
      </div>

      <!-- moves -->
      <div class="py-6 border-b">
      <h3 class="text-lg font-bold mb-4">Top 10 Moves</h3>
      <div class="flex flex-wrap gap-2">
          <span 
          v-for="move in pokemonMoves" 
          :key="move" 
          class="px-3 py-1 bg-gray-100 rounded text-sm text-gray-700 capitalize font-medium"
          >
          {{ move.replace('-', ' ') }}
          </span>
      </div>
      </div>

      <!-- physical traits -->
      <div class="py-6 border-b grid grid-cols-2 gap-4 text-center">
        <div>
          <span class="block text-gray-500 text-sm">Height</span>
          <span class="font-bold">{{ pokemon.height / 10 }} m</span>
        </div>
        <div>
          <span class="block text-gray-500 text-sm">Weight</span>
          <span class="font-bold">{{ pokemon.weight / 10 }} kg</span>
        </div>
      </div>

      <!-- navigation -->
      <div class="flex justify-between mt-8">
        <NuxtLink 
          v-if="pokemon.id > 1" 
          :to="`/pokemon/${pokemon.id - 1}`" 
          class="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-700 transition"
        >
          Previous
        </NuxtLink>
        <div v-else></div> <!-- placeholder if id is 1 -->

        <NuxtLink 
          :to="`/pokemon/${pokemon.id + 1}`" 
          class="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemon } from '~/composables/getPokemon'
import { getWeaknesses } from '~/utils/weaknessMap' 

const route = useRoute()
const { formatId, getImageUrl } = usePokemon()

// fetch main stats and types
const { data: pokemon } = await useFetch(`https://pokeapi.co/api/v2/pokemon/${route.params.id}`)

// fetch species details for the description
const { data: species } = await useFetch(`https://pokeapi.co/api/v2/pokemon-species/${route.params.id}`)

const description = computed(() => {
  if (!species.value) return 'No description available.'
  
  // english descriptions
  const englishEntries = species.value.flavor_text_entries.filter(e => e.language.name === 'en')
  
  if (englishEntries.length === 0) return 'No description available.'

  // randomizing descriptions
  const randomIndex = Math.floor(Math.random() * englishEntries.length)
  const randomEntry = englishEntries[randomIndex]
  
  return randomEntry.flavor_text.replace(/[\n\f]/g, ' ')
})
// computed property for types array
const pokemonTypes = computed(() => {
  if (!pokemon.value) return []
  return pokemon.value.types.map(t => t.type.name)
})

const pokemonMoves = computed(() => {
  if (!pokemon.value) return []
  return pokemon.value.moves.slice(0, 10).map(m => m.move.name)
})

// computed property for weaknesses
const pokemonWeaknesses = computed(() => {
  return getWeaknesses(pokemonTypes.value)
})
</script>