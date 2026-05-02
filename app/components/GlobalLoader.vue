<template>
  <div 
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out"
    :class="isOverlayVisible ? 'opacity-100 bg-gray-50' : 'opacity-0 pointer-events-none'"
  >
    <!-- INITIAL LOAD -->
    <div v-if="isInitial" class="relative flex items-center justify-center w-full h-full">
      
      <!-- Pokedex Title na lalabas pag nahati yung Pokeball -->
      <h1 
        class="absolute text-5xl md:text-7xl font-black text-gray-800 tracking-widest uppercase transition-all duration-700 z-0"
        :class="startSplit ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
      >
        Pokédex
      </h1>

      <!-- The Splitting Pokeball Container -->
      <div 
        class="relative w-40 h-40 transition-all duration-500 z-10"
        :class="isSpinning ? 'animate-spin' : '-rotate-45'"
      >
        <!-- Top Half (Red) -->
        <div 
          class="absolute top-0 w-full h-1/2 bg-red-500 rounded-t-full border-[8px] border-b-[4px] border-gray-800 transition-all duration-700 ease-in-out"
          :class="startSplit ? '-translate-y-32 opacity-0' : 'translate-y-0 opacity-100'"
        ></div>
        
        <!-- Bottom Half (White) -->
        <div 
          class="absolute bottom-0 w-full h-1/2 bg-white rounded-b-full border-[8px] border-t-[4px] border-gray-800 transition-all duration-700 ease-in-out"
          :class="startSplit ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'"
        ></div>

        <!-- Center Button -->
        <div 
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-[8px] border-gray-800 rounded-full transition-opacity duration-300"
          :class="startSplit ? 'opacity-0' : 'opacity-100'"
        ></div>
      </div>
    </div>

    <!-- NAVIGATION LOAD (Normal) -->
    <div v-else class="flex flex-col items-center">
      <div class="w-24 h-24 rounded-full border-[8px] border-gray-800 bg-white relative overflow-hidden flex items-center justify-center shadow-lg animate-spin">
         <div class="absolute top-0 w-full h-1/2 bg-red-500 border-b-[8px] border-gray-800"></div>
         <div class="w-6 h-6 bg-white border-[4px] border-gray-800 rounded-full z-10"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const nuxtApp = useNuxtApp()

const isOverlayVisible = ref(true)
const isInitial = ref(true)

const isSpinning = ref(true)
const startSplit = ref(false)

onMounted(() => {
  setTimeout(() => {
    isSpinning.value = false 
    
    setTimeout(() => {
      startSplit.value = true 
      
      setTimeout(() => {
        isOverlayVisible.value = false 
        
        setTimeout(() => {
          isInitial.value = false 
        }, 500)
        
      }, 1000) 
      
    }, 400) 
    
  }, 1000) 
})

nuxtApp.hook('page:start', () => {
  // wag i-trigger kung initial load
  if (isInitial.value) return
  isOverlayVisible.value = true
})

nuxtApp.hook('page:finish', () => {
  window.scrollTo(0, 0)
  
  // eto yung fix: wag i-hide agad kung nagp-play pa yung initial animation
  if (isInitial.value) return 

  setTimeout(() => {
    isOverlayVisible.value = false
  }, 300)
})
</script>