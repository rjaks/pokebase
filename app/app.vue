<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <GlobalLoader/>
    <NuxtPage/>
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'PokéBase',
  description: 'Your Pokédex. Refined. Browse over 1,000 Pokémon, explore their stats, types, weaknesses, and evolution chains.',
  ogTitle: 'PokéBase',
  ogDescription: 'Your Pokédex. Refined. Browse over 1,000 Pokémon, explore their stats, types, weaknesses, and evolution chains.',
  ogImage: '/pokeball.png', 
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/pokeball.png' }
  ],
  meta: [
    { name: 'theme-color', content: '#ef4444' }
  ]
})
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=VT323&display=swap');

  body {
    font-family: 'Inter', sans-serif;
  }
  .font-retro {
    font-family: 'VT323', monospace;
  }
</style>