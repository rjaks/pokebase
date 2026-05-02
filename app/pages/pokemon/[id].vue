<template>
  <div class="relative min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50 flex items-center" v-if="pokemon" :style="{ '--type-color': mainColor }">
    
    <div class="pokeball-pattern absolute inset-0 z-0"></div>

    <NuxtLink to="/" class="absolute top-6 left-6 z-50 px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700 hover:bg-gray-50 transition">
      &larr; Back to List
    </NuxtLink>

    <div class="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 h-full">

      <!-- left column for details -->
      <div class="lg:col-span-7 flex flex-col justify-start space-y-6 h-full pt-12 pb-12 overflow-y-auto no-scrollbar">
        
        <div class="flex flex-wrap items-center gap-4">
          <h1 class="text-5xl lg:text-6xl font-black capitalize transition-colors duration-500 drop-shadow-sm leading-normal py-2" :style="{ color: mainColor }">
            {{ pokemon.name }}
          </h1>
          <span class="text-3xl font-bold text-gray-300">#{{ formatId(pokemon.id) }}</span>
          
          <div class="flex gap-4 sm:ml-auto text-sm font-bold text-gray-500 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
            <span>{{ pokemon.height / 10 }}m</span>
            <span class="text-gray-200">|</span>
            <span>{{ pokemon.weight / 10 }}kg</span>
          </div>
        </div>

        <p class="text-lg text-gray-600 font-medium italic bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
          "{{ description }}"
        </p>

        <!-- stats -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-3">
              <span class="text-[10px] font-bold uppercase w-20 text-gray-400 tracking-wider truncate">
                {{ stat.stat.name.replace('-', ' ') }}
              </span>
              <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000" 
                  :style="{ width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: mainColor }"
                ></div>
              </div>
              <span class="text-xs font-bold w-6 text-right text-gray-700">{{ stat.base_stat }}</span>
            </div>
          </div>
        </div>

        <!-- types, weaknesses -->
        <div class="flex flex-wrap gap-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Types</h3>
            <div class="flex gap-2">
              <div 
                v-for="t in pokemonTypes" 
                :key="t" 
                class="group relative cursor-help w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1" 
                :style="{ backgroundColor: getTypeHex(t) }"
              >
                <Icon :name="getTypeIcon(t)" class="text-xl" />
                <span class="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize whitespace-nowrap z-50">
                  {{ t }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Weaknesses</h3>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="w in pokemonWeaknesses" 
                :key="w" 
                class="group relative cursor-help w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1" 
                :style="{ backgroundColor: getTypeHex(w) }"
              >
                <Icon :name="getTypeIcon(w)" class="text-xl" />
                <span class="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize whitespace-nowrap z-50">
                  {{ w }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- top moves -->
        <div>
          <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 pl-2">Top Moves</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="move in pokemonMoves" 
              :key="move" 
              class="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 capitalize shadow-sm transition-colors cursor-default"
            >
              {{ move.replace('-', ' ') }}
            </span>
          </div>
        </div>

        <!-- evolutions -->
        <div class="mt-4 flex-1 pb-10" v-if="evolutions.length > 1">
          <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4 pl-2">Evolution Chain</h3>
          <div class="flex flex-wrap items-start gap-2">
            <template v-for="(evo, index) in evolutions" :key="evo.id">
              
              <NuxtLink 
                :to="`/pokemon/${evo.id}`" 
                class="flex flex-col items-center gap-3 group w-20"
              >
                <div 
                  class="w-20 h-20 bg-white rounded-3xl p-3 shadow-sm border-[2px] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md"
                  :style="{ borderColor: pokemon.id === evo.id ? mainColor : '#f3f4f6' }"
                >
                  <img :src="getImageUrl(evo.id)" :alt="evo.name" class="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <span 
                  class="text-xs font-bold capitalize transition-colors text-center"
                  :style="{ color: pokemon.id === evo.id ? mainColor : '#9ca3af' }"
                >
                  {{ evo.name }}
                </span>
              </NuxtLink>

              <div v-if="index < evolutions.length - 1" class="flex flex-col items-center justify-center mt-6 px-1 min-w-[3rem] max-w-[5rem]">
                <span class="text-gray-300 font-bold text-lg">&rarr;</span>
                <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center mt-1 bg-white border border-gray-100 shadow-sm px-2 py-1 rounded-md w-full break-words leading-tight">
                  {{ evolutions[index + 1].condition }}
                </span>
              </div>

            </template>
          </div>
        </div>

      </div>

      <!-- right column for image and navigation (?) -->
      <div class="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[50vh] lg:min-h-0">
        
        <div class="floating-pokemon w-full max-w-lg z-10">
          <img 
            :src="getImageUrl(pokemon.id)" 
            class="w-full object-contain transition-all duration-500 hover:scale-110 drop-shadow-[0_0_40px_var(--type-color)]" 
          />
        </div>
        
        <div class="absolute bottom-0 lg:-bottom-6 flex gap-4 z-20">
          <NuxtLink 
            v-if="pokemon.id > 1" 
            :to="`/pokemon/${pokemon.id - 1}`" 
            class="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform text-gray-800"
          >
            <span class="font-bold text-xl">&larr;</span>
          </NuxtLink>
          <NuxtLink 
            :to="`/pokemon/${pokemon.id + 1}`" 
            class="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform text-gray-800"
          >
            <span class="font-bold text-xl">&rarr;</span>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemon } from '~/composables/getPokemon'
import { getWeaknesses } from '~/utils/weaknessMap'
import { getTypeHex } from '~/utils/typeColors'
import { getTypeIcon } from '~/utils/typeIcons'

const route = useRoute()
const { formatId, getImageUrl } = usePokemon()

const { data: pokemon } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon/${route.params.id}`)
const { data: species } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon-species/${route.params.id}`)

const evoUrl = computed(() => species.value?.evolution_chain?.url)
const { data: evolutionData } = await useFetch(evoUrl)

const description = computed(() => {
  if (!species.value) return 'No description available.'
  const englishEntries = species.value.flavor_text_entries.filter(e => e.language.name === 'en')
  if (englishEntries.length === 0) return 'No description available.'
  const randomIndex = Math.floor(Math.random() * englishEntries.length)
  return englishEntries[randomIndex].flavor_text.replace(/[\n\f]/g, ' ')
})

const pokemonTypes = computed(() => {
  if (!pokemon.value) return []
  return pokemon.value.types.map(t => t.type.name)
})

const pokemonMoves = computed(() => {
  if (!pokemon.value) return []
  return pokemon.value.moves.slice(0, 10).map(m => m.move.name)
})

const pokemonWeaknesses = computed(() => {
  return getWeaknesses(pokemonTypes.value)
})

const mainColor = computed(() => {
  if (pokemonTypes.value.length > 0) {
    return getTypeHex(pokemonTypes.value[0])
  }
  return '#e5e7eb'
})

const getEvoCondition = (details) => {
  if (!details || details.length === 0) return ''
  const d = details[0]
  if (d.min_level) return `Lvl ${d.min_level}`
  if (d.item) return d.item.name.replace('-', ' ')
  if (d.min_happiness) return 'Happy'
  if (d.trigger?.name === 'trade') return 'Trade'
  return 'Evolve'
}

const extractEvolutions = (node, acc = []) => {
  if (!node) return acc
  const urlParts = node.species.url.split('/').filter(Boolean)
  const id = urlParts[urlParts.length - 1]
  
  acc.push({ 
    id: parseInt(id), 
    name: node.species.name,
    condition: getEvoCondition(node.evolution_details)
  })
  
  node.evolves_to.forEach(child => extractEvolutions(child, acc))
  return acc
}

const evolutions = computed(() => {
  if (!evolutionData.value) return []
  const rawEvo = extractEvolutions(evolutionData.value.chain)
  
  const unique = []
  rawEvo.forEach(evo => {
    if (!unique.find(u => u.id === evo.id)) unique.push(evo)
  })
  return unique
})
</script>

<style scoped>
.pokeball-pattern {
  background-color: var(--type-color);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  -webkit-mask-size: 60px 60px;
  mask-size: 60px 60px;
  opacity: 0.07;
  animation: slide-bg 4s linear infinite;
  pointer-events: none;
}

@keyframes slide-bg {
  0% {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
  100% {
    -webkit-mask-position: 60px 60px;
    mask-position: 60px 60px;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.floating-pokemon {
  animation: float 4s ease-in-out infinite;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>