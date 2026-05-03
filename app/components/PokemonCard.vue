<template>
  <NuxtLink 
    :to="`/pokemon/${rawId}`" 
    class="group block h-full transition-all duration-700 ease-out"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'"
    ref="cardRef"
  >
    <div 
      class="relative bg-white rounded-2xl p-5 h-full flex flex-col items-center transition-all duration-300 transform group-hover:-translate-y-2 border-2 shadow-md overflow-hidden"
      :style="{ 
        borderColor: mainColor,
        '--type-color': mainColor 
      }"
      :class="'hover:shadow-[0_0_15px_var(--type-color)]'"
    >
      
      <div class="pokeball-pattern absolute inset-0 z-0"></div>

      <div class="relative z-10 flex flex-wrap justify-center gap-2 w-full mb-4">
        <span 
          v-for="type in types" 
          :key="type" 
          :style="{ backgroundColor: getTypeHex(type) }"
          class="flex items-center gap-1 px-3 py-1 text-xs capitalize font-semibold rounded-xl text-white shadow-sm"
        >
          <Icon :name="getTypeIcon(type)" class="text-sm" />
          {{ type }}
        </span>
      </div>

      <div class="relative z-10 w-full h-40 mb-3 flex items-center justify-center">
        <Icon v-if="!isLoaded" name="mdi:loading" class="absolute text-3xl text-gray-300 animate-spin" />
        
        <img 
          :src="image" 
          :alt="name" 
          @load="isLoaded = true"
          class="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_var(--type-color)]" 
          :class="isLoaded ? 'opacity-100' : 'opacity-0 scale-90'"
        />
      </div>
      
      <div class="relative z-10 flex flex-col items-center w-full mt-auto">
        <span class="text-xs font-bold tracking-widest text-gray-400 mb-1">
          #{{ String(id).padStart(3, '0') }}
        </span>
        
        <h2 
          class="relative inline-block text-xl font-bold capitalize transition-colors duration-300"
          :style="{ color: darkColor }"
        >
          {{ name }}
          <span 
            class="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
            :style="{ backgroundColor: darkColor }"
          ></span>
        </h2>

        <span 
          class="text-[10px] font-bold mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          :style="{ color: darkColor }"
        >
          Click to view details &rarr;
        </span>
      </div>
      
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getTypeHex } from '~/utils/typeColors'
import { getTypeIcon } from '~/utils/typeIcons'

const props = defineProps({
  id: String, 
  rawId: Number,
  name: String,
  image: String,
  types: Array
})

const isLoaded = ref(false)
const cardRef = ref(null)
const isVisible = ref(false)
let observer

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible.value = entry.isIntersecting
    })
  }, { threshold: 0.1 }) // mag-t-trigger pag 10% na ng card ang visible

  if (cardRef.value) {
    // kailangan ng $el kasi component yung NuxtLink
    observer.observe(cardRef.value.$el || cardRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const mainColor = computed(() => {
  return props.types && props.types.length ? getTypeHex(props.types[0]) : '#e5e7eb'
})

const darkColor = computed(() => {
  let hex = mainColor.value.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  
  r = Math.floor(r * 0.65)
  g = Math.floor(g * 0.65)
  b = Math.floor(b * 0.65)
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
})
</script>

<style scoped>
.pokeball-pattern {
  background-color: var(--type-color);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  -webkit-mask-size: 40px 40px;
  mask-size: 40px 40px;
  opacity: 0.03;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.group:hover .pokeball-pattern {
  opacity: 0.1; 
  animation: slide-bg 3s linear infinite;
}

@keyframes slide-bg {
  0% { mask-position: 0 0; -webkit-mask-position: 0 0; }
  100% { mask-position: 40px 40px; -webkit-mask-position: 40px 40px; }
}
</style>