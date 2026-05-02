<template>
  <div class="min-h-screen bg-gray-50 flex flex-col relative">
    
    <header 
      class="bg-red-500 border-gray-800 sticky top-0 z-50 shadow-md flex items-center overflow-hidden transition-all duration-500 ease-in-out px-6"
      :class="isScrolled ? 'h-14 border-b-2' : 'h-20 border-b-4'"
    >
      <div class="max-w-7xl mx-auto w-full flex items-center relative h-full z-10">
        <h1 
          class="text-white font-black tracking-widest uppercase drop-shadow-sm absolute transition-all duration-500 ease-in-out whitespace-nowrap"
          :class="isScrolled ? 'left-0 translate-x-0 text-lg sm:text-xl' : 'left-1/2 -translate-x-1/2 text-xl sm:text-3xl'"
        >
          Pokédex
        </h1>

        <div 
          class="ml-auto flex justify-end items-center gap-2 sm:gap-4 transition-all duration-500 ease-in-out absolute right-0"
          :class="isScrolled ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-10 pointer-events-none'"
        >
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search..." 
            class="w-28 sm:w-48 lg:w-64 bg-white text-gray-800 font-medium border-none p-1.5 sm:p-2 pl-4 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-inner text-xs sm:text-sm"
          />
          <select 
            v-model="sortBy" 
            class="w-auto bg-white font-medium text-gray-700 border-none p-1.5 sm:p-2 sm:px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 cursor-pointer shadow-inner text-xs sm:text-sm"
          >
            <option value="id-asc">Lowest ID</option>
            <option value="id-desc">Highest ID</option>
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
          </select>
        </div>

        <div 
          class="w-6 h-6 sm:w-8 sm:h-8 bg-white border-[3px] sm:border-[4px] border-gray-800 rounded-full shadow-inner absolute right-0 transition-all duration-500 ease-in-out"
          :class="isScrolled ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'"
        ></div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl mx-auto w-full p-6 lg:py-10 relative z-10">
      
      <div class="bg-white rounded-3xl p-8 sm:p-12 mb-12 border-2 border-gray-100 shadow-sm flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div class="relative z-10 text-center md:text-left">
          <h2 class="text-4xl sm:text-5xl font-black text-gray-800 mb-4 tracking-tight">
            Discover them all.
          </h2>
          <p class="text-lg text-gray-500 font-medium max-w-lg mx-auto md:mx-0">
            Search, sort, and learn about your favorite companions in this sleek and minimal encyclopedia.
          </p>
        </div>
        
        <!-- Animated Intro Section with Glow -->
        <div class="relative w-56 h-56 sm:w-80 sm:h-80 flex-shrink-0 scale-110 lg:scale-125 z-10 flex items-center justify-center">
          
          <!-- Glowing Orbs Background -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="absolute w-40 h-40 sm:w-60 sm:h-60 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div class="absolute w-40 h-40 sm:w-60 sm:h-60 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000 translate-x-10"></div>
          </div>

          <transition-group name="slide-fade" tag="div" class="w-full h-full relative z-10">
            <img 
              v-for="(id, index) in randomIds"
              :key="id"
              v-show="currentSlide === index"
              :src="getImageUrl(id)" 
              alt="Featured Pokemon" 
              class="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] floating-pokemon"
            />
          </transition-group>
        </div>

        <div class="absolute -right-20 -top-20 w-96 h-96 bg-gray-50 rounded-full opacity-80 z-0"></div>
      </div>

      <div 
        class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center transition-all duration-500 ease-in-out"
        :class="isScrolled ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'"
      >
        <div class="relative w-full sm:w-1/2">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by Name or ID..." 
            class="w-full bg-gray-50 text-gray-800 font-medium border-none p-3 pl-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow"
          />
        </div>

        <select 
          v-model="sortBy" 
          class="w-full sm:w-auto bg-gray-50 font-medium text-gray-700 border-none p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition-shadow"
        >
          <option value="id-asc">ID (Lowest First)</option>
          <option value="id-desc">ID (Highest First)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      <!-- Top Load More Button (Shows when reversed) -->
      <div v-if="isReversedSort" class="mb-8 flex justify-center pt-4">
        <button 
          @click="handleLoadMore" 
          :disabled="store.isLoading || !store.hasMore"
          class="flex items-center justify-center gap-3 w-56 h-12 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300"
        >
          <div v-if="store.isLoading" class="w-5 h-5 rounded-full border-[2px] border-white relative overflow-hidden animate-spin">
             <div class="absolute top-0 w-full h-1/2 bg-red-500 border-b-[2px] border-white"></div>
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white border-[1.5px] border-white rounded-full z-10"></div>
          </div>
          <span v-else>Load More Pokemon</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 -mt-4">
        <PokemonCard
          v-for="(poke, index) in displayList"
          :key="poke.id"
          :rawId="poke.id"
          :id="formatId(poke.id)"
          :name="poke.name"
          :image="getImageUrl(poke.id)"
          :types="poke.types"
          class="animate-fade-in-up"
          :style="{ animationDelay: `${(index % 20) * 50}ms` }"
        />
      </div>

      <!-- Bottom Load More Button (Shows when normal sort) -->
      <div v-if="!isReversedSort" class="mt-12 flex justify-center pb-8">
        <button 
          @click="handleLoadMore" 
          :disabled="store.isLoading || !store.hasMore"
          class="flex items-center justify-center gap-3 w-56 h-12 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300"
        >
          <div v-if="store.isLoading" class="w-5 h-5 rounded-full border-[2px] border-white relative overflow-hidden animate-spin">
             <div class="absolute top-0 w-full h-1/2 bg-red-500 border-b-[2px] border-white"></div>
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white border-[1.5px] border-white rounded-full z-10"></div>
          </div>
          <span v-else>Load More Pokemon</span>
        </button>
      </div>

    </main>

    <button 
      v-show="showToTop" 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:-translate-y-2 transition-all duration-300"
    >
      <span class="font-bold text-xl">&uarr;</span>
    </button>

    <footer class="bg-gray-900 border-gray-800 border-t-4 py-8 text-center mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col items-center">
        <div class="w-8 h-8 bg-white border-[4px] border-gray-800 rounded-full mb-4 opacity-50"></div>
        <p class="text-gray-400 font-bold tracking-widest text-xs uppercase">
          Pokébase &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePokemon } from '~/composables/getPokemon'
import { usePokemonStore } from '~/stores/pokemon'

const { formatId, getImageUrl } = usePokemon()

const searchQuery = ref('')
const sortBy = ref('id-asc')
const store = usePokemonStore()

const randomIds = ref([])
const currentSlide = ref(0)
let slideInterval

const isScrolled = ref(false)
const showToTop = ref(false)

// Check kung descending ang sort
const isReversedSort = computed(() => {
  return ['id-desc', 'name-desc'].includes(sortBy.value)
})

const checkScroll = () => {
  isScrolled.value = window.scrollY > 300
  showToTop.value = window.scrollY > 600
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleLoadMore = async () => {
  await store.fetchPokemons()
  
  setTimeout(() => {
    // kung nakabaligtad yung list, wag mag-scroll pababa
    if (!isReversedSort.value) {
      window.scrollBy({ top: 400, behavior: 'smooth' })
    }
  }, 100)
}

onMounted(() => {
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
    list = list.filter(poke => 
      poke.name.toLowerCase().includes(query) || 
      poke.id.toString().includes(query) ||
      formatId(poke.id).includes(query)
    )
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

/* slide-fade animation para sa intro slideshow */
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

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>