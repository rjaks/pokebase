<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative transition-colors duration-500">
    <div class="fixed inset-0 z-0 pointer-events-none page-bg-dots"></div>
    
     <header 
      class="bg-white dark:bg-gray-900 border-red-600 dark:border-red-500 sticky top-0 z-50 shadow-sm sm:shadow-md flex items-center overflow-hidden transition-all duration-500 ease-in-out px-4 sm:px-6"
      :class="isScrolled ? 'h-14 border-b-2' : 'h-16 sm:h-20 border-b-4'"
    >
      <div class="max-w-7xl mx-auto w-full flex items-center relative h-full z-10">
        
        <div 
          class="absolute transition-all duration-500 ease-in-out whitespace-nowrap flex items-center z-10"
          :class="isScrolled ? 'left-0 translate-x-0 gap-2' : 'left-1/2 -translate-x-1/2 gap-0'"
        >
          <!-- shrinking pokeball icon -->
          <div 
            class="relative rounded-full border-2 border-gray-900 overflow-hidden bg-white transition-all duration-500 shrink-0"
            :class="isScrolled ? 'w-5 h-5 sm:w-7 sm:h-7 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-50 border-0'"
          >
            <div class="absolute top-0 left-0 right-0 h-1/2 bg-red-500 border-b-2 border-gray-900"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white border-2 border-gray-900 rounded-full z-10"></div>
          </div>

          <h1 
            class="font-black tracking-tight drop-shadow-sm transition-all duration-500 ease-in-out flex items-center"
            :class="isScrolled ? 'text-base sm:text-xl' : 'text-xl sm:text-3xl'"
          >
            <span class="text-red-500 dark:text-red-500">Poké</span><span class="text-gray-900 dark:text-white transition-colors duration-500">Base</span>
          </h1>
        </div>

        <div class="ml-auto flex items-center gap-1.5 sm:gap-3">
          
          <div 
            class="flex items-center gap-1.5 sm:gap-3 transition-all duration-500 ease-in-out"
            :class="isScrolled ? 'opacity-100 translate-x-0 pointer-events-auto relative' : 'opacity-0 translate-x-10 pointer-events-none absolute right-12 sm:right-16'"
          >
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search..." 
              class="w-20 sm:w-28 md:w-44 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium border border-gray-200 dark:border-gray-700 p-1.5 sm:p-2 pl-2 sm:pl-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/40 text-[10px] sm:text-xs md:text-sm transition-colors"
            />
            <select 
              v-model="sortBy" 
              class="w-16 sm:w-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-700 p-1.5 sm:p-2 px-1 sm:px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/40 cursor-pointer text-[10px] sm:text-xs md:text-sm transition-colors truncate"
            >
              <option value="id-asc">Lowest ID</option>
              <option value="id-desc">Highest ID</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
            </select>
          </div>

          <button 
            @click.prevent="toggleDark" 
            type="button"
            class="relative z-50 p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300 flex-shrink-0 cursor-pointer pointer-events-auto"
          >
            <Icon v-if="isDark" name="mdi:weather-night" class="text-lg sm:text-xl" />
            <Icon v-else name="mdi:weather-sunny" class="text-lg sm:text-xl" />
          </button>

          <div 
            class="bg-white dark:bg-gray-800 rounded-full shadow-inner transition-all duration-500 ease-in-out flex-shrink-0 overflow-hidden"
            :class="isScrolled ? 'opacity-0 scale-50 w-0 h-0 border-0 ml-0' : 'opacity-100 scale-100 w-5 h-5 sm:w-8 sm:h-8 border-[2px] sm:border-[4px] border-gray-200 dark:border-gray-700 ml-1'"
          ></div>

        </div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:py-10 relative z-10">
      
      <div class="bg-white dark:bg-gray-800 rounded-[2rem] sm:rounded-3xl p-6 sm:p-12 mb-8 sm:mb-12 border-2 border-gray-100 dark:border-gray-700 shadow-sm flex flex-col-reverse md:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden transition-colors duration-500">
        
        <div class="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div class="absolute top-[-10%] left-[-10%] w-40 h-40 sm:w-72 sm:h-72 bg-red-100 dark:bg-red-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-60 animate-blob"></div>
          <div class="absolute top-[20%] right-[-10%] w-40 h-40 sm:w-72 sm:h-72 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
          <div class="absolute bottom-[-20%] left-[20%] w-40 h-40 sm:w-72 sm:h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>

          <div class="absolute top-4 left-[15%] w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-400 opacity-20 dark:opacity-40 animate-float-slow"></div>
          <div class="absolute top-10 right-[20%] w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-400 opacity-20 dark:opacity-40 animate-float-medium"></div>
          <div class="absolute bottom-6 left-[40%] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-400 opacity-20 dark:opacity-40 animate-float-fast"></div>
          <div class="absolute bottom-4 right-[35%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-400 opacity-20 dark:opacity-40 animate-float-slow animation-delay-2000"></div>
          <div class="absolute top-1/2 left-[5%] w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-400 opacity-20 dark:opacity-40 animate-float-medium animation-delay-4000"></div>

          <svg class="absolute bottom-0 right-[10%] w-16 h-16 sm:w-24 sm:h-24 opacity-5 dark:opacity-10 dark:text-white animate-drift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M2 12h7m6 0h7"/>
          </svg>
          <svg class="absolute top-0 left-[30%] w-12 h-12 sm:w-16 sm:h-16 opacity-5 dark:opacity-10 dark:text-white animate-drift animation-delay-2000" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M2 12h7m6 0h7"/>
          </svg>
          <svg class="absolute top-[30%] right-[5%] w-8 h-8 sm:w-10 sm:h-10 opacity-5 dark:opacity-10 dark:text-white animate-drift animation-delay-4000" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M2 12h7m6 0h7"/>
          </svg>
        </div>

        <div class="relative z-10 text-center md:text-left">
          <p class="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-red-400 dark:text-red-500 mb-2 sm:mb-3">
            Your Pokédex. Refined.
          </p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-3 sm:mb-4 tracking-tight leading-tight transition-colors duration-500">
            Every Pokémon.<br/>
            <span class="text-red-600 dark:text-red-500">One base.</span>
          </h2>
          <p class="text-sm sm:text-base text-gray-400 dark:text-gray-300 font-medium max-w-sm sm:max-w-md mx-auto md:mx-0 leading-relaxed transition-colors duration-500">
            Browse over 1,000 Pokémon, explore their stats, types, weaknesses, and evolution chains — all in a clean, minimal experience built for trainers.
          </p>
        </div>
        
        <div class="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex-shrink-0 scale-110 lg:scale-125 z-10 flex items-center justify-center">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 bg-red-400 dark:bg-red-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
            <div class="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-pulse animation-delay-2000 translate-x-5 sm:translate-x-10"></div>
          </div>

          <transition-group name="slide-fade" tag="div" class="w-full h-full relative z-10">
            <img 
              v-for="(id, index) in randomIds"
              :key="id"
              v-show="currentSlide === index"
              :src="getImageUrl(id)" 
              alt="Featured Pokemon" 
              class="absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] sm:drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] floating-pokemon"
            />
          </transition-group>
        </div>

      </div>

      <div 
        class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center transition-all duration-500 ease-in-out"
      >
        <div class="relative w-full sm:w-1/2">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by Name or ID..." 
            class="w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-medium border-none p-2.5 sm:p-3 pl-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 transition-colors text-sm sm:text-base"
          />
        </div>

        <select 
          v-model="sortBy" 
          class="w-full sm:w-auto bg-gray-50 dark:bg-gray-900 font-medium text-gray-700 dark:text-gray-300 border-none p-2.5 sm:p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 cursor-pointer transition-colors text-sm sm:text-base"
        >
          <option value="id-asc">ID (Lowest First)</option>
          <option value="id-desc">ID (Highest First)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 -mt-2 sm:-mt-4">
        <PokemonCard
          v-for="(poke, index) in displayList"
          :key="poke.id"
          :rawId="poke.id"
          :id="formatId(poke.id)"
          :name="poke.name"
          :image="getImageUrl(poke.id)"
          :types="poke.types"
          :index="index"
        />
      </div>

      <div class="mt-8 sm:mt-12 flex justify-center pb-6 sm:pb-8">
        <button 
          @click="handleLoadMore" 
          :disabled="store.isLoading || !store.hasMore"
          class="flex items-center justify-center gap-2 sm:gap-3 w-48 sm:w-56 h-10 sm:h-12 bg-gray-800 dark:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 dark:hover:bg-red-600 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300 text-sm sm:text-base"
        >
          <div v-if="store.isLoading" class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[2px] border-white relative overflow-hidden animate-spin">
             <div class="absolute top-0 w-full h-1/2 bg-red-500 border-b-[2px] border-white"></div>
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white border-[1.5px] border-white rounded-full z-10"></div>
          </div>
          <span v-else>Load More Pokemon</span>
        </button>
      </div>

    </main>

    <button 
      v-show="showToTop" 
      @click="scrollToTop"
      class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-500 dark:bg-red-700 text-white rounded-full shadow-lg hover:bg-red-600 dark:hover:bg-red-800 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300"
    >
      <span class="font-bold text-lg sm:text-xl">&uarr;</span>
    </button>

    <footer class="bg-white dark:bg-gray-900 border-red-500 dark:border-red-600 border-t-4 py-8 sm:py-12 text-center mt-auto relative overflow-hidden transition-colors duration-500">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div v-for="i in 6" :key="i"
          class="absolute bottom-0 opacity-5 dark:opacity-10 animate-rise"
          :style="{
            left: `${10 + (i - 1) * 16}%`,
            animationDelay: `${(i - 1) * 0.8}s`,
            animationDuration: `${4 + (i % 3)}s`
          }"
        >
          <svg :width="20 + (i * 8)" :height="20 + (i * 8)" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="isDark ? 'text-white' : 'text-gray-900'" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M2 12h7m6 0h7"/>
          </svg>
        </div>
      </div>

      <div class="max-w-7xl mx-auto flex flex-col items-center relative z-10 gap-2 sm:gap-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-gray-800 overflow-hidden bg-white relative animate-spin mb-1">
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-red-500 border-b-[3px] border-gray-800"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border-[2.5px] sm:border-[3px] border-gray-800 rounded-full z-10"></div>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 font-black tracking-widest text-[11px] sm:text-xs uppercase">
          PokéBase &copy; {{ new Date().getFullYear() }}
        </p>

        <p class="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs font-medium">
          Made by <a href="https://github.com/rjaks" target="_blank" class="text-red-500 dark:text-red-400 hover:underline">Rjaks</a>
        </p>

        <div class="flex gap-3 text-gray-500 dark:text-gray-500 text-[10px] sm:text-xs mb-1">
          <a href="https://github.com/rjaks/pokebase" target="_blank" class="hover:text-red-500 dark:hover:text-red-400 transition-colors">View the Repository</a>
        </div>

        <p class="text-gray-400 dark:text-gray-600 text-[9px] sm:text-[10px]">Data from PokéAPI · Images from Pokémon</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { usePokemon } from '~/composables/getPokemon'
import { usePokemonStore } from '~/stores/pokemon'
import { useTheme } from '~/composables/useTheme'

const { isDark, toggleDark, initTheme } = useTheme()
const { formatId, getImageUrl } = usePokemon()

const searchQuery = ref('')
const sortBy = ref('id-asc')
const store = usePokemonStore()

const randomIds = ref([])
const currentSlide = ref(0)
let slideInterval

const isScrolled = ref(false)
const showToTop = ref(false)

const globalSearchHit = ref(null)
let searchTimeout = null

watch(searchQuery, async (newVal) => {
  clearTimeout(searchTimeout)
  const query = newVal.toLowerCase().trim()
  if (!query) {
    globalSearchHit.value = null
    return
  }

  // wait for 500ms before fetching again
  searchTimeout = setTimeout(async () => {
    // Only trigger API if it's somewhat specific to avoid spamming
    if (query.length > 2 || !isNaN(query)) {
      try {
        const rawData = await $fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        if (searchQuery.value.toLowerCase().trim() === query) {
          globalSearchHit.value = {
            id: rawData.id,
            name: rawData.name,
            types: rawData.types.map(t => t.type.name)
          }
        }
      } catch (e) {
        if (searchQuery.value.toLowerCase().trim() === query) {
          globalSearchHit.value = null // not found in API yet (or partial word)
        }
      }
    }
  }, 500)
})

const checkScroll = () => {
  isScrolled.value = window.scrollY > 300
  showToTop.value = window.scrollY > 600
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleLoadMore = async () => {
  const prevLength = store.pokemonList.length
  await store.fetchPokemons()
  await nextTick()
  if (store.pokemonList.length > prevLength) {
    setTimeout(() => window.scrollBy({ top: 400, behavior: 'smooth' }), 50)
  }
}

onMounted(() => {
  initTheme()
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  for(let i = 0; i < 5; i++) {
    randomIds.value.push(Math.floor(Math.random() * 1010) + 1)
  }

  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % randomIds.value.length
  }, 3000)

  if (store.pokemonList.length === 0) {
    store.fetchPokemons()
  }

  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  clearInterval(slideInterval)
})

const displayList = computed(() => {
  let list = store.pokemonList

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    let filtered = list.filter(poke => 
      poke.name.toLowerCase().includes(query) || 
      poke.id.toString().includes(query) ||
      formatId(poke.id).includes(query)
    )

    if (globalSearchHit.value) {
      const isAlreadyLocal = filtered.some(p => p.id === globalSearchHit.value.id)
      if (!isAlreadyLocal) {
        filtered.push(globalSearchHit.value)
      }
    }

    list = filtered
  }

  return [...list].sort((a, b) => {
    if (sortBy.value === 'name-asc') return a.name.localeCompare(b.name) 
    if (sortBy.value === 'name-desc') return b.name.localeCompare(a.name) 
    if (sortBy.value === 'id-desc') return b.id - a.id 
    return a.id - b.id 
  })
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.footer-pattern {
  background-image: radial-gradient(circle, #9ca3af 2px, transparent 2px);
  background-size: 32px 32px;
  animation: slide-bg 20s linear infinite;
}

@keyframes slide-bg {
  0% { background-position: 0 0; }
  100% { background-position: 64px 64px; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.floating-pokemon {
  animation: float 4s ease-in-out infinite;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  opacity: 0; 
  animation: fadeInUp 0.5s ease-out forwards;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}

.page-bg-dots {
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
}
:global(html.dark .page-bg-dots) {
  background-image: radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px);
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
}
@keyframes float-medium {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes float-fast {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes drift {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(15deg); }
}
@keyframes rise {
  0% { transform: translateY(0px); opacity: 0.05; }
  50% { opacity: 0.08; }
  100% { transform: translateY(-120px); opacity: 0; }
}

.animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
.animate-float-medium { animation: float-medium 3.5s ease-in-out infinite; }
.animate-float-fast { animation: float-fast 2.5s ease-in-out infinite; }
.animate-drift { animation: drift 6s ease-in-out infinite; }
.animate-rise { animation: rise 4s ease-in-out infinite; }
</style>