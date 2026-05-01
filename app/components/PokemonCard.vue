<template>
  <NuxtLink :to="`/pokemon/${rawId}`" class="group block h-full">
    <div 
      class="relative bg-white rounded-2xl p-5 h-full flex flex-col items-center transition-all duration-300 transform group-hover:-translate-y-2 border-2 overflow-hidden"
      :style="{ 
        borderColor: mainColor,
        '--type-color': mainColor 
      }"
      :class="'hover:shadow-[0_0_15px_var(--type-color)]'"
    >
      
      <!-- pokeball background -->
      <div class="pokeball-pattern absolute inset-0 z-0"></div>

      <!-- types -->
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

      <img 
        :src="image" 
        :alt="name" 
        class="relative z-10 w-full h-40 object-contain mb-3 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_var(--type-color)]" 
      />
      
      <!-- info container -->
      <div class="relative z-10 flex flex-col items-center w-full mt-auto">
        <span class="text-xs font-bold tracking-widest text-gray-400 mb-1">
          #{{ String(id).padStart(3, '0') }}
        </span>
        
        <h2 class="relative inline-block text-xl font-bold capitalize text-gray-800">
          {{ name }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
        </h2>

        <!-- click to view details for card hover -->
        <span class="text-[10px] text-gray-400 mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click to view details &rarr;
        </span>
      </div>
      
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'
import { getTypeHex } from '~/utils/typeColors'
import { getTypeIcon } from '~/utils/typeIcons'

const props = defineProps({
  id: String, 
  rawId: Number,
  name: String,
  image: String,
  types: Array
})

const mainColor = computed(() => {
  return props.types && props.types.length ? getTypeHex(props.types[0]) : '#e5e7eb'
})
</script>

<style scoped>
.pokeball-pattern {
  background-color: var(--type-color);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");
  -webkit-mask-size: 40px 40px;
  mask-size: 40px 40px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.group:hover .pokeball-pattern {
  opacity: 0.04; 
  animation: slide-bg 3s linear infinite;
}

@keyframes slide-bg {
  0% {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
  100% {
    -webkit-mask-position: 40px 40px;
    mask-position: 40px 40px;
  }
}
</style>