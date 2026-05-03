<template>
  <div 
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out bg-gray-50"
    :class="isOverlayVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    <!-- INITIAL LOAD -->
    <div v-if="isInitial" class="flex flex-col items-center gap-6">
      
      <!-- Orbit Container -->
      <div class="relative w-44 h-44 flex items-center justify-center">
        
        <!-- Orbiting type badges -->
        <div class="absolute inset-0 animate-spin-slow">
          <div
            v-for="(type, index) in orbitTypes"
            :key="type.name"
            class="absolute w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white"
            :style="{
              backgroundColor: type.color,
              top: `${50 - 47 * Math.cos((2 * Math.PI * index) / orbitTypes.length)}%`,
              left: `${50 + 47 * Math.sin((2 * Math.PI * index) / orbitTypes.length)}%`,
              transform: 'translate(-50%, -50%)'
            }"
          >
            <!-- counter-rotate so icons stay upright -->
            <div class="animate-spin-reverse">
              <Icon :name="type.icon" class="text-base" />
            </div>
          </div>
        </div>

        <!-- Pokeball Center -->
        <div class="relative w-14 h-14 rounded-full border-4 border-gray-800 overflow-hidden bg-white z-10 animate-pb-pulse">
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-gray-800 rounded-full z-10"></div>
        </div>

      </div>

      <!-- Witty rotating text -->
      <div class="flex flex-col items-center gap-2">
        <p 
          class="text-xs font-bold tracking-widest uppercase text-gray-400 transition-opacity duration-300"
          :class="textVisible ? 'opacity-100' : 'opacity-0'"
        >
          {{ currentLine }}
        </p>
        <div class="flex gap-1.5">
          <div v-for="i in 3" :key="i" 
            class="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce-dot"
            :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
          ></div>
        </div>
      </div>

    </div>

    <!-- NAVIGATION LOAD -->
    <div v-else class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 rounded-full border-4 border-gray-800 overflow-hidden bg-white relative animate-spin">
        <div class="absolute top-0 left-0 right-0 h-1/2 bg-red-500 border-b-4 border-gray-800"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-[3px] border-gray-800 rounded-full z-10"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTypeIcon } from '~/utils/typeIcons'
import { getTypeHex } from '~/utils/typeColors'

const nuxtApp = useNuxtApp()
const isOverlayVisible = ref(true)
const isInitial = ref(true)
const textVisible = ref(true)

const wittyLines = [
  'Catching them all...',
  'Consulting Professor Oak...',
  'Avoiding wild encounters...',
  'Healing at the Pokécenter...',
  'Waking up Snorlax...',
  'Checking the Pokédex...',
  'Almost there, trainer...',
]

const currentLine = ref(wittyLines[0])
let lineIndex = 0
let textInterval

const orbitTypes = [
  'fire', 'water', 'grass', 'electric',
  'psychic', 'ghost', 'fairy', 'dragon'
].map(name => ({
  name,
  icon: getTypeIcon(name),
  color: getTypeHex(name)
}))

const cycleText = () => {
  textInterval = setInterval(() => {
    textVisible.value = false
    setTimeout(() => {
      lineIndex = (lineIndex + 1) % wittyLines.length
      currentLine.value = wittyLines[lineIndex]
      textVisible.value = true
    }, 300)
  }, 2200)
}

onMounted(() => {
  cycleText()

  setTimeout(() => {
    isOverlayVisible.value = false
    clearInterval(textInterval)
    setTimeout(() => {
      isInitial.value = false
    }, 500)
  }, 3000)
})

nuxtApp.hook('page:start', () => {
  if (isInitial.value) return
  isOverlayVisible.value = true
})

nuxtApp.hook('page:finish', () => {
  window.scrollTo(0, 0)
  if (isInitial.value) return
  setTimeout(() => {
    isOverlayVisible.value = false
  }, 300)
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
@keyframes pb-pulse {
  0%, 100% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}
@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}

.animate-spin-slow { animation: spin-slow 5s linear infinite; }
.animate-spin-reverse { animation: spin-reverse 5s linear infinite; }
.animate-pb-pulse { animation: pb-pulse 1.5s ease-in-out infinite; }
.animate-bounce-dot { animation: bounce-dot 1.2s ease-in-out infinite; }
</style>