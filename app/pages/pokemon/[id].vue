<template>
  <div class="relative min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row items-center transition-colors duration-500" :style="{ '--type-color': mainColor }">
    
    <div class="pokeball-pattern absolute inset-0 z-0"></div>

    <div ref="scrollTrigger" class="absolute top-20 w-full h-1 z-0"></div>

    <!-- top navbar -->
    <div class="absolute top-4 sm:top-6 w-full px-4 sm:px-6 flex justify-between items-center z-40 pointer-events-none">
      <NuxtLink to="/" class="pointer-events-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200 hover:-translate-y-1 transition-all text-xs sm:text-base focus:outline-none">
        &larr; <span class="hidden sm:inline">Back</span>
      </NuxtLink>

      <div class="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2">
        <NuxtLink 
          v-if="currentId > 1" 
          :to="`/pokemon/${currentId - 1}`" 
          class="px-3 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200 hover:-translate-y-1 transition-all text-xs sm:text-base focus:outline-none"
        >
          &larr; <span class="hidden sm:inline">Prev</span>
        </NuxtLink>

        <!-- sticky name popup inbetween next and prev for desktop -->
        <div 
          class="hidden lg:flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 items-center justify-center overflow-hidden transition-all duration-300"
          :class="isScrolledDesktop && pokemon && !showSkeleton ? 'max-w-[200px] opacity-100 px-5 py-2.5 mx-1' : 'max-w-0 opacity-0 border-transparent m-0'"
        >
          <span class="font-black capitalize whitespace-nowrap transition-colors duration-500 text-base" :style="{ color: displayNameColor }">
            {{ pokemon?.name }}
          </span>
        </div>

        <NuxtLink 
          :to="`/pokemon/${currentId + 1}`" 
          class="px-3 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200 hover:-translate-y-1 transition-all text-xs sm:text-base focus:outline-none"
        >
          <span class="hidden sm:inline">Next</span> &rarr;
        </NuxtLink>
      </div>

      <div class="pointer-events-auto">
        <ClientOnly>
          <button @click.prevent="toggleDark" type="button" class="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:-translate-y-1 transition-all flex items-center justify-center focus:outline-none">
            <Icon v-if="isDark" name="mdi:weather-night" class="text-lg sm:text-xl" />
            <Icon v-else name="mdi:weather-sunny" class="text-lg sm:text-xl" />
          </button>
        </ClientOnly>
      </div>
    </div>

    <!-- floating navbar for mobile -->
    <div 
      class="fixed top-0 left-0 w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 flex justify-between items-center lg:hidden"
      :class="isScrolledMobile ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
      <NuxtLink to="/" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none">
        <Icon name="mdi:arrow-left" class="text-xl" />
      </NuxtLink>

      <div class="flex items-center gap-2 font-black capitalize text-sm" :style="{ color: displayNameColor }">
        {{ pokemon?.name }} <span class="text-gray-400 dark:text-gray-500 font-normal">#{{ formatId(pokemon?.id || 1) }}</span>
      </div>

      <div class="flex gap-2">
        <NuxtLink v-if="currentId > 1" :to="`/pokemon/${currentId - 1}`" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none">
          <Icon name="mdi:chevron-left" class="text-xl" />
        </NuxtLink>
        <NuxtLink :to="`/pokemon/${currentId + 1}`" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none">
          <Icon name="mdi:chevron-right" class="text-xl" />
        </NuxtLink>
      </div>
    </div>

    <Transition name="poke-fade" mode="out-in">
      
      <!-- skeleton loader / placeholder -->
      <div v-if="showSkeleton" :key="'skeleton-' + currentId" class="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 p-4 sm:p-6 lg:p-12 h-full mt-20 lg:mt-0 animate-pulse">
        <div class="lg:col-span-5 lg:col-start-8 flex items-center justify-center pt-8 lg:pt-0">
          <div class="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div class="lg:col-span-7 lg:col-start-1 lg:row-start-1 flex flex-col justify-center items-center lg:items-start space-y-4 sm:space-y-6">
          <div class="h-10 sm:h-16 bg-gray-200 dark:bg-gray-800 rounded-xl w-2/3"></div>
          <div class="h-20 sm:h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
          <div class="h-32 sm:h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
        </div>
      </div>

      <!-- main content -->
      <div v-else-if="pokemon" :key="'content-' + currentId" class="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-12 h-full mt-16 sm:mt-20 lg:mt-0">

        <!-- image -->
        <div class="lg:col-span-5 lg:col-start-8 flex flex-col items-center justify-center relative min-h-[30vh] sm:min-h-[40vh] lg:min-h-0 animate-slide-in-right pt-6 lg:pt-0" style="animation-delay: 150ms;">
          <div class="floating-pokemon w-full max-w-[200px] sm:max-w-xs lg:max-w-lg z-10">
            <img 
              :src="getImageUrl(pokemon.id)" 
              class="w-full object-contain transition-all duration-500 hover:scale-110 drop-shadow-[0_0_20px_var(--type-color)] lg:drop-shadow-[0_0_40px_var(--type-color)]" 
            />
          </div>
        </div>

        <!-- details -->
        <div @scroll="handleScroll" class="lg:col-span-7 lg:col-start-1 lg:row-start-1 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 h-full pb-12 lg:overflow-y-auto no-scrollbar text-center lg:text-left">
          
          <!-- header -->
          <div class="flex flex-col items-center lg:items-start gap-1 animate-slide-in-left w-full" style="animation-delay: 50ms;">
            <span class="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">
              {{ category }}
            </span>

            <div class="flex items-baseline justify-center lg:justify-start gap-2 sm:gap-3 w-full">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black capitalize leading-tight transition-colors duration-500"
                  :style="{ color: displayNameColor }">
                {{ pokemon.name }}
              </h1>
              <span class="text-xl sm:text-2xl font-bold text-gray-300 dark:text-gray-600">#{{ formatId(pokemon.id) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
              <div class="flex items-center justify-center gap-1 text-lg sm:text-xl">
                <span v-if="genderRate === -1" class="text-[10px] sm:text-xs font-bold text-gray-400">Genderless</span>
                <template v-else>
                  <Icon v-if="genderRate < 8" name="mdi:gender-male" class="text-blue-400" />
                  <Icon v-if="genderRate > 0" name="mdi:gender-female" class="text-pink-400" />
                </template>
              </div>

              <div class="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors w-fit">
                <span>{{ pokemon.height / 10 }}m</span>
                <span class="text-gray-200 dark:text-gray-600">|</span>
                <span>{{ pokemon.weight / 10 }}kg</span>
                <span class="text-gray-200 dark:text-gray-600">|</span>
                <span class="text-green-500 dark:text-green-400">{{ pokemon.base_experience }} EXP</span>
              </div>
            </div>
          </div>

          <!-- randomized desc -->
          <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-300 font-medium italic bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-white dark:border-gray-700 animate-slide-in-left transition-colors text-center lg:text-left" style="animation-delay: 100ms;">
            "{{ description }}"
          </p>

          <!-- stats -->
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-in-left transition-colors w-full" style="animation-delay: 150ms;">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-2 sm:gap-3">
                <span class="text-[9px] sm:text-[10px] font-bold uppercase w-16 sm:w-20 text-gray-400 tracking-wider text-right lg:text-left truncate">
                  {{ stat.stat.name.replace('-', ' ') }}
                </span>
                <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden transition-colors">
                  <div 
                    class="h-full rounded-full transition-all duration-1000" 
                    :style="{ width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: mainColor }"
                  ></div>
                </div>
                <span class="text-[10px] sm:text-xs font-bold w-6 text-left lg:text-right text-gray-700 dark:text-gray-200">{{ stat.base_stat }}</span>
              </div>
            </div>
          </div>

          <!-- types & weaknesses -->
          <div class="flex flex-col sm:flex-row flex-wrap items-center lg:items-start justify-center lg:justify-start gap-4 sm:gap-10 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-in-left transition-colors w-full" style="animation-delay: 200ms;">
            <div class="flex flex-col items-center lg:items-start">
              <h3 class="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 sm:mb-3">Types</h3>
              <div class="flex justify-center lg:justify-start gap-2">
                <div 
                  v-for="t in pokemonTypes" 
                  :key="t" 
                  class="group relative cursor-help w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1 active:-translate-y-1" 
                  :style="{ backgroundColor: getTypeHex(t) }"
                >
                  <Icon :name="getTypeIcon(t)" class="text-base sm:text-xl" />
                  <span class="absolute -bottom-8 bg-gray-800 dark:bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity whitespace-nowrap capitalize z-50 pointer-events-none shadow-sm border border-gray-600">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center lg:items-start">
              <h3 class="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 sm:mb-3">Weaknesses</h3>
              <div class="flex flex-wrap justify-center lg:justify-start gap-2">
                <div 
                  v-for="w in pokemonWeaknesses" 
                  :key="w" 
                  class="group relative cursor-help w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1 active:-translate-y-1" 
                  :style="{ backgroundColor: getTypeHex(w) }"
                >
                  <Icon :name="getTypeIcon(w)" class="text-base sm:text-xl" />
                  <span class="absolute -bottom-8 bg-gray-800 dark:bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity whitespace-nowrap capitalize z-50 pointer-events-none shadow-sm border border-gray-600">
                    {{ w }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- abilities & moves -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-slide-in-left w-full" style="animation-delay: 250ms;">
            <div class="flex flex-col items-center lg:items-start">
              <h3 class="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 sm:mb-3">Abilities</h3>
              <div class="flex flex-col gap-2 sm:gap-3 w-full">
                <div 
                  v-for="ab in pokemonAbilities" 
                  :key="ab.name" 
                  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm transition-colors text-center lg:text-left"
                >
                  <div class="flex items-center justify-center lg:justify-start gap-1 mb-1 sm:mb-2">
                    <span class="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
                      {{ ab.name.replace('-', ' ') }}
                    </span>
                    <Icon v-if="ab.hidden" name="mdi:eye-off-outline" class="text-[10px] sm:text-xs text-gray-400" />
                  </div>
                  <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {{ ab.effect }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center lg:items-start">
              <h3 class="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 sm:mb-3">Top Moves</h3>
              <div class="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2">
                <span 
                  v-for="move in pokemonMoves" 
                  :key="move" 
                  class="px-2 py-1 sm:px-3 sm:py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 capitalize shadow-sm cursor-default transition-colors"
                >
                  {{ move.replace('-', ' ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- evols -->
          <div class="mt-2 sm:mt-4 flex flex-col items-center lg:items-start w-full pb-6 sm:pb-10 animate-slide-in-left" style="animation-delay: 300ms;" v-if="evolutions.length > 1">
            <h3 class="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 sm:mb-4">Evolution Chain</h3>
            <div class="flex flex-wrap items-start justify-center lg:justify-start gap-1 sm:gap-2">
              <template v-for="(evo, index) in evolutions" :key="evo.id">
                
                <NuxtLink 
                  :to="`/pokemon/${evo.id}`" 
                  class="flex flex-col items-center gap-2 sm:gap-3 group w-14 sm:w-20 focus:outline-none"
                >
                  <div 
                    class="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-sm border-[2px] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md"
                    :style="{ borderColor: pokemon.id === evo.id ? mainColor : (isDark ? '#374151' : '#f3f4f6') }"
                  >
                    <img :src="getImageUrl(evo.id)" :alt="evo.name" class="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                  <span 
                    class="text-[9px] sm:text-xs font-bold capitalize transition-colors text-center"
                    :style="{ color: pokemon.id === evo.id ? displayNameColor : '#9ca3af' }"
                  >
                    {{ evo.name }}
                  </span>
                </NuxtLink>

                <div v-if="index < evolutions.length - 1" class="flex flex-col items-center justify-center mt-4 sm:mt-6 px-0.5 sm:px-1 min-w-[2rem] sm:min-w-[3rem] max-w-[4rem] sm:max-w-[5rem]">
                  <span class="text-gray-300 dark:text-gray-600 font-bold text-sm sm:text-lg">&rarr;</span>
                  <span class="text-[7px] sm:text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm px-1 py-0.5 sm:px-2 sm:py-1 rounded-md w-full break-words leading-tight transition-colors">
                    {{ evolutions[index + 1].condition }}
                  </span>
                </div>

              </template>
            </div>
          </div>

        </div>

      </div>

    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemon } from '~/composables/getPokemon'
import { getWeaknesses } from '~/utils/weaknessMap'
import { getTypeHex } from '~/utils/typeColors'
import { getTypeIcon } from '~/utils/typeIcons'
import { useTheme } from '~/composables/useTheme'
import { getDarkColor, getLightColor } from '~/utils/colorUtils'

const route = useRoute()
const { formatId, getImageUrl } = usePokemon()
const { isDark, toggleDark, initTheme } = useTheme()

const currentId = computed(() => parseInt(route.params.id) || 1)
const isScrolledMobile = ref(false)
const isScrolledDesktop = ref(false)
const isNavigating = ref(false)
const scrollTrigger = ref(null)

let observer = null
onMounted(() => {
  initTheme()
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  observer = new IntersectionObserver(
    ([entry]) => { isScrolledMobile.value = !entry.isIntersecting },
    { threshold: 0 }
  )
  if (scrollTrigger.value) observer.observe(scrollTrigger.value)
})

onUnmounted(() => observer?.disconnect())

const handleScroll = (e) => {
  if (e.target !== document) {
    isScrolledDesktop.value = e.target.scrollTop > 120
  }
}

watch(() => currentId.value, () => {
  isNavigating.value = true
  isScrolledMobile.value = false 
  isScrolledDesktop.value = false
})

const { data: pokemon, pending: pendingPoke } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon/${currentId.value}`, { lazy: true })
const { data: species, pending: pendingSpecies } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon-species/${currentId.value}`, { lazy: true })

watch([pendingPoke, pendingSpecies], ([p1, p2]) => {
  if (!p1 && !p2) {
    setTimeout(() => {
      isNavigating.value = false
    }, 300)
  }
}, { immediate: true })

const showSkeleton = computed(() => pendingPoke.value || pendingSpecies.value || isNavigating.value)

const evoUrl = computed(() => species.value?.evolution_chain?.url)
const { data: evolutionData } = await useFetch(evoUrl, { lazy: true })

const pokemonAbilities = ref([])

let abilitiesController = null

watch(pokemon, async (newVal) => {
  pokemonAbilities.value = []
  if (!newVal) return

  abilitiesController = new AbortController()

  const abilitiesData = await Promise.all(
    newVal.abilities.map(async (a) => {
      try {
        const res = await $fetch(a.ability.url)
        const englishEntry = res.effect_entries.find(e => e.language.name === 'en')
        return {
          name: a.ability.name,
          hidden: a.is_hidden,
          effect: englishEntry ? englishEntry.short_effect : 'No description available.'
        }
      } catch (e) {
        return { name: a.ability.name, hidden: a.is_hidden, effect: 'Description unavailable.' }
      }
    })
  )
  pokemonAbilities.value = abilitiesData
}, { immediate: true })

const category = computed(() => {
  if (!species.value) return ''
  const en = species.value.genera.find(g => g.language.name === 'en')
  return en ? en.genus : ''
})

const genderRate = computed(() => species.value?.gender_rate ?? -1)

const description = computed(() => {
  if (!species.value) return ''
  const englishEntries = species.value.flavor_text_entries.filter(e => e.language.name === 'en')
  if (englishEntries.length === 0) return ''
  const randomIndex = Math.floor(Math.random() * englishEntries.length)
  return englishEntries[randomIndex].flavor_text.replace(/[\n\f]/g, ' ')
})

const pokemonTypes = computed(() => pokemon.value?.types.map(t => t.type.name) || [])
const pokemonMoves = computed(() => pokemon.value?.moves.slice(0, 10).map(m => m.move.name) || [])
const pokemonWeaknesses = computed(() => getWeaknesses(pokemonTypes.value))

const mainColor = computed(() => pokemonTypes.value.length ? getTypeHex(pokemonTypes.value[0]) : '#e5e7eb')
const darkColor = computed(() => getDarkColor(mainColor.value))
const lightColor = computed(() => getLightColor(mainColor.value))

const displayNameColor = computed(() => isDark.value ? lightColor.value : darkColor.value)

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

const pageTitle = computed(() => {
  if (!pokemon.value) return 'PokéBase'
  const capitalized = pokemon.value.name.charAt(0).toUpperCase() + pokemon.value.name.slice(1)
  return `${capitalized} - PokéBase`
})

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: () => description.value || 'View Pokémon stats, types, weaknesses, and evolutions on PokéBase.',
  ogDescription: () => description.value || 'View Pokémon stats, types, weaknesses, and evolutions on PokéBase.',
  ogImage: () => getImageUrl(currentId.value)
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
  0% { -webkit-mask-position: 0 0; mask-position: 0 0; }
  100% { -webkit-mask-position: 60px 60px; mask-position: 60px 60px; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.floating-pokemon {
  animation: float 4s ease-in-out infinite;
}

/* Base custom transition wrapper */
.poke-fade-enter-active,
.poke-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.poke-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.poke-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Inner element slide animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  opacity: 0;
  animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.animate-slide-in-right {
  opacity: 0;
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>