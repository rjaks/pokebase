<template>
  <NuxtLink :to="`/pokemon/${rawId}`" class="group block">
    <div class="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-blue-200 overflow-hidden">
      <!-- subtle background pattern/blob -->
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300"></div>

      <div class="relative">
        <img :src="image" :alt="name" class="w-full h-40 object-contain mb-4 z-10" />
        
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-xl font-extrabold capitalize text-gray-800">{{ name }}</h2>
          <span class="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">#{{ id }}</span>
        </div>
        
        <div class="flex gap-2">
          <span 
            v-for="type in types" 
            :key="type" 
            :style="{ backgroundColor: getTypeHex(type) }"
            :class="['px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-gray-800 text-white']"
          >
            {{ type }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { getTypeHex } from '~/utils/typeColors';
defineProps({
  id: String, 
  rawId: Number,
  name: String,
  image: String,
  types: Array
})
</script>