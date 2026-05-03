<template>
  <NuxtLink 
    :to="`/pokemon/${rawId}`" 
    class="group block transition-all duration-700 ease-out h-full"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'"
    ref="cardRef"
  >
    <!-- added mobile respnsiveness, square aspect res for mobile, rectangle aspect res for landscape res -->
    <div 
      class="relative bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-5 aspect-square sm:aspect-auto h-full flex flex-col items-center justify-between transition-all duration-300 transform group-hover:-translate-y-2 border-2 dark:border-gray-700 shadow-md overflow-hidden"
      :style="{ 
        borderColor: mainColor,
        '--type-color': mainColor,
        '--shade-dark': darkColor,
        '--shade-light': lightColor
      }"
      :class="'hover:shadow-[0_0_15px_var(--type-color)]'"
    >
      
      <div class="pokeball-pattern absolute inset-0 z-0"></div>

      <!-- types -->
      <div class="relative z-10 flex flex-wrap justify-center gap-1 sm:gap-2 w-full mt-1 sm:mb-4">
        <span 
          v-for="type in types" 
          :key="type" 
          :style="{ backgroundColor: getTypeHex(type) }"
          class="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs capitalize font-semibold rounded-lg sm:rounded-xl text-white shadow-sm"
        >
          <Icon :name="getTypeIcon(type)" class="text-[10px] sm:text-sm" />
          <span class="hidden sm:inline">{{ type }}</span>
        </span>
      </div>

      <!-- image -->
      <div class="relative z-10 w-full flex-1 sm:flex-none sm:h-40 flex items-center justify-center min-h-0 my-1 sm:mb-3">
        <Icon v-if="!isLoaded" name="mdi:loading" class="absolute text-2xl sm:text-3xl text-gray-300 animate-spin" />
        
        <img 
          :src="image" 
          :alt="name" 
          @load="isLoaded = true"
          class="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_var(--type-color)]" 
          :class="isLoaded ? 'opacity-100' : 'opacity-0 scale-90'"
        />
      </div>
      
      <!-- info -->
      <div class="relative z-10 flex flex-col items-center w-full mt-auto">
        <span class="text-[9px] sm:text-xs font-bold tracking-widest text-gray-400 mb-0.5 sm:mb-1">
          #{{ String(id).padStart(3, '0') }}
        </span>
        
        <h2 
          class="relative inline-block text-sm sm:text-xl font-bold capitalize transition-colors duration-300 text-[var(--shade-dark)] dark:text-[var(--shade-light)] leading-tight"
        >
          {{ name }}
          <span 
            class="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[var(--shade-dark)] dark:bg-[var(--shade-light)]"
          ></span>
        </h2>

        <!-- click to view details: hidden in mobile view -->
        <span 
          class="hidden sm:block text-[10px] font-bold mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-[var(--shade-dark)] dark:text-[var(--shade-light)]"
        >
          Click to view details &rarr;
        </span>
      </div>
      
    </div>
  </NuxtLink>
</template>

<script setup lang>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getTypeHex } from '~/utils/typeColors'
import { getTypeIcon } from '~/utils/typeIcons'
import { getDarkColor, getLightColor } from '~/utils/colorUtils'

const props = defineProps({
  id: String, 
  rawId: Number,
  name: String,
  image: String,
  types: Array,
  index: Number 
})

const isLoaded = ref(false)
const cardRef = ref(null)
const isVisible = ref(false)
let observer

onMounted(() => {
  if (props.index !== undefined && props.index < 10) {
    setTimeout(() => {
      isVisible.value = true
    }, (props.index % 10) * 50)
  } else {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
        } else if (entry.boundingClientRect.top > 0) {
          isVisible.value = false
        }
      })
    }, { threshold: 0.1 })

    if (cardRef.value) {
      observer.observe(cardRef.value.$el || cardRef.value)
    }
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const mainColor = computed(() => {
  return props.types && props.types.length ? getTypeHex(props.types[0]) : '#e5e7eb'
})

const darkColor = computed(() => getDarkColor(mainColor.value))
const lightColor = computed(() => getLightColor(mainColor.value))
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