<template>
  <NuxtLink :to="`/pokemon/${rawId}`" class="block">
  <div class="border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer bg-white transition-all">
    <img :src="image" :alt="name" class="w-full h-32 object-contain mb-4" />
    
    <div class="text-sm text-gray-500 font-semibold">#{{ id }}</div>
    <h2 class="text-xl font-bold capitalize mb-2">{{ name }}</h2>
    
    <div class="flex gap-2">
      <span 
        v-for="type in types" 
        :key="type" 
        class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 capitalize"
      >
        {{ type }}
      </span>
    </div>
  </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  id: String, 
  rawId: Number,
  name: String,
  image: String,
  types: Array
})
</script>