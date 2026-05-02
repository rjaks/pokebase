 <template>

  <div class="relative min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50 flex items-center" :style="{ '--type-color': mainColor }">

   

    <div class="pokeball-pattern absolute inset-0 z-0"></div>


    <!-- Top Navigation Bar -->

    <div class="absolute top-6 w-full px-6 flex justify-between items-center z-50 pointer-events-none">

      <NuxtLink to="/" class="pointer-events-auto px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700 hover:-translate-y-1 transition-all">

        &larr; Back

      </NuxtLink>


      <!-- Centered Next/Prev with Animated Name -->

      <div class="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2">

        <NuxtLink

          v-if="currentId > 1"

          :to="`/pokemon/${currentId - 1}`"

          class="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700 hover:-translate-y-1 transition-all"

        >

          &larr; Prev

        </NuxtLink>


        <!-- Animated Sticky Name -->

        <div

          class="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300"

          :class="isScrolled && pokemon ? 'max-w-[200px] opacity-100 px-5 py-2.5 mx-1' : 'max-w-0 opacity-0 border-transparent m-0'"

        >

          <span class="font-black capitalize whitespace-nowrap" :style="{ color: darkColor }">

            {{ pokemon?.name }}

          </span>

        </div>


        <NuxtLink

          :to="`/pokemon/${currentId + 1}`"

          class="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700 hover:-translate-y-1 transition-all"

        >

          Next &rarr;

        </NuxtLink>

      </div>

    </div>


    <!-- SKELETON LOADER -->

    <div v-if="isLoading" class="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 h-full mt-16 lg:mt-0 animate-pulse">

      <div class="lg:col-span-7 flex flex-col justify-center space-y-6 pt-12">

        <div class="h-16 bg-gray-200 rounded-xl w-2/3"></div>

        <div class="h-24 bg-gray-200 rounded-2xl w-full"></div>

        <div class="h-40 bg-gray-200 rounded-2xl w-full"></div>

        <div class="h-32 bg-gray-200 rounded-2xl w-full"></div>

      </div>

      <div class="lg:col-span-5 flex items-center justify-center">

        <div class="w-64 h-64 bg-gray-200 rounded-full"></div>

      </div>

    </div>


    <!-- MAIN CONTENT -->

    <div v-else-if="pokemon" class="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 h-full mt-16 lg:mt-0">


      <!-- Added scroll listener here -->

      <div @scroll="handleScroll" class="lg:col-span-7 flex flex-col justify-start space-y-6 h-full pt-6 pb-12 overflow-y-auto no-scrollbar">

       

        <!-- Headers -->

        <div class="flex flex-col gap-1">

          <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">

            {{ category }}

          </span>


          <div class="flex items-baseline gap-3">

            <h1 class="text-5xl lg:text-6xl font-black capitalize leading-tight"

                :style="{ color: darkColor }">

              {{ pokemon.name }}

            </h1>

            <span class="text-2xl font-bold text-gray-300">#{{ formatId(pokemon.id) }}</span>

          </div>


          <div class="flex items-center gap-3 mt-1">

            <div class="flex items-center gap-1 text-xl">

              <span v-if="genderRate === -1" class="text-xs font-bold text-gray-400">Genderless</span>

              <template v-else>

                <Icon v-if="genderRate < 8" name="mdi:gender-male" class="text-blue-400" />

                <Icon v-if="genderRate > 0" name="mdi:gender-female" class="text-pink-400" />

              </template>

            </div>


            <div class="flex gap-3 text-xs font-bold text-gray-500 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">

              <span>{{ pokemon.height / 10 }}m</span>

              <span class="text-gray-200">|</span>

              <span>{{ pokemon.weight / 10 }}kg</span>

              <span class="text-gray-200">|</span>

              <span class="text-green-500">{{ pokemon.base_experience }} EXP</span>

            </div>

          </div>

        </div>


        <p class="text-lg text-gray-600 font-medium italic bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">

          "{{ description }}"

        </p>


        <!-- Stats -->

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">

            <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center gap-3">

              <span class="text-[10px] font-bold uppercase w-20 text-gray-400 tracking-wider truncate">

                {{ stat.stat.name.replace('-', ' ') }}

              </span>

              <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">

                <div

                  class="h-full rounded-full transition-all duration-1000"

                  :style="{ width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: mainColor }"

                ></div>

              </div>

              <span class="text-xs font-bold w-6 text-right text-gray-700">{{ stat.base_stat }}</span>

            </div>

          </div>

        </div>


        <!-- Types & Weaknesses -->

        <div class="flex flex-wrap gap-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          <div>

            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Types</h3>

            <div class="flex gap-2">

              <div

                v-for="t in pokemonTypes"

                :key="t"

                class="group relative cursor-help w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1"

                :style="{ backgroundColor: getTypeHex(t) }"

              >

                <Icon :name="getTypeIcon(t)" class="text-xl" />

                <span class="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize whitespace-nowrap z-50">

                  {{ t }}

                </span>

              </div>

            </div>

          </div>


          <div>

            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Weaknesses</h3>

            <div class="flex flex-wrap gap-2">

              <div

                v-for="w in pokemonWeaknesses"

                :key="w"

                class="group relative cursor-help w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white transition-transform hover:-translate-y-1"

                :style="{ backgroundColor: getTypeHex(w) }"

              >

                <Icon :name="getTypeIcon(w)" class="text-xl" />

                <span class="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize whitespace-nowrap z-50">

                  {{ w }}

                </span>

              </div>

            </div>

          </div>

        </div>


        <!-- Abilities & Moves Grouping -->

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 pl-2">Abilities</h3>

            <div class="flex flex-col gap-3">

              <div

                v-for="ab in pokemonAbilities"

                :key="ab.name"

                class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"

              >

                <div class="flex items-center gap-1 mb-2">

                  <span class="text-sm font-bold text-gray-700 capitalize">

                    {{ ab.name.replace('-', ' ') }}

                  </span>

                  <Icon v-if="ab.hidden" name="mdi:eye-off-outline" class="text-xs text-gray-400" />

                </div>

                <p class="text-xs text-gray-500 leading-relaxed">

                  {{ ab.effect }}

                </p>

              </div>

            </div>

          </div>


          <div>

            <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3 pl-2">Top Moves</h3>

            <div class="flex flex-wrap gap-2">

              <span

                v-for="move in pokemonMoves"

                :key="move"

                class="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 capitalize shadow-sm cursor-default"

              >

                {{ move.replace('-', ' ') }}

              </span>

            </div>

          </div>

        </div>


        <!-- Evolutions -->

        <div class="mt-4 flex-1 pb-10" v-if="evolutions.length > 1">

          <h3 class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4 pl-2">Evolution Chain</h3>

          <div class="flex flex-wrap items-start gap-2">

            <template v-for="(evo, index) in evolutions" :key="evo.id">

             

              <NuxtLink

                :to="`/pokemon/${evo.id}`"

                class="flex flex-col items-center gap-3 group w-20"

              >

                <div

                  class="w-20 h-20 bg-white rounded-3xl p-3 shadow-sm border-[2px] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md"

                  :style="{ borderColor: pokemon.id === evo.id ? mainColor : '#f3f4f6' }"

                >

                  <img :src="getImageUrl(evo.id)" :alt="evo.name" class="w-full h-full object-contain drop-shadow-sm" />

                </div>

                <span

                  class="text-xs font-bold capitalize transition-colors text-center"

                  :style="{ color: pokemon.id === evo.id ? mainColor : '#9ca3af' }"

                >

                  {{ evo.name }}

                </span>

              </NuxtLink>


              <div v-if="index < evolutions.length - 1" class="flex flex-col items-center justify-center mt-6 px-1 min-w-[3rem] max-w-[5rem]">

                <span class="text-gray-300 font-bold text-lg">&rarr;</span>

                <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-center mt-1 bg-white border border-gray-100 shadow-sm px-2 py-1 rounded-md w-full break-words leading-tight">

                  {{ evolutions[index + 1].condition }}

                </span>

              </div>


            </template>

          </div>

        </div>


      </div>


      <!-- Right Column -->

      <div class="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[50vh] lg:min-h-0">

        <div class="floating-pokemon w-full max-w-lg z-10">

          <img

            :src="getImageUrl(pokemon.id)"

            class="w-full object-contain transition-all duration-500 hover:scale-110 drop-shadow-[0_0_40px_var(--type-color)]"

          />

        </div>

      </div>


    </div>

  </div>

</template>


<script setup>

import { ref, computed, watch } from 'vue'

import { useRoute } from 'vue-router'

import { usePokemon } from '~/composables/getPokemon'

import { getWeaknesses } from '~/utils/weaknessMap'

import { getTypeHex } from '~/utils/typeColors'

import { getTypeIcon } from '~/utils/typeIcons'


const route = useRoute()

const { formatId, getImageUrl } = usePokemon()


const currentId = computed(() => parseInt(route.params.id) || 1)


const isScrolled = ref(false)


const handleScroll = (e) => {

  isScrolled.value = e.target.scrollTop > 120

}


const { data: pokemon, pending: pendingPoke } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon/${currentId.value}`, { lazy: true })

const { data: species, pending: pendingSpecies } = await useFetch(() => `https://pokeapi.co/api/v2/pokemon-species/${currentId.value}`, { lazy: true })


const isLoading = computed(() => pendingPoke.value || pendingSpecies.value)


const evoUrl = computed(() => species.value?.evolution_chain?.url)

const { data: evolutionData } = await useFetch(evoUrl, { lazy: true })


const pokemonAbilities = ref([])


// fetch ability details pag loaded na yung pokemon data

watch(pokemon, async (newVal) => {

  pokemonAbilities.value = []

  if (!newVal) return


  const abilitiesData = await Promise.all(

    newVal.abilities.map(async (a) => {

      try {

        const res = await $fetch(a.ability.url)

        const englishEntry = res.effect_entries.find(e => e.language.name === 'en')

        return {

          name: a.ability.name,

          hidden: a.is_hidden,

          effect: englishEntry ? englishEntry.short_effect : 'No description available.'

        }

      } catch (e) {

        return { name: a.ability.name, hidden: a.is_hidden, effect: 'Description unavailable.' }

      }

    })

  )

  pokemonAbilities.value = abilitiesData

}, { immediate: true })


const category = computed(() => {

  if (!species.value) return ''

  const en = species.value.genera.find(g => g.language.name === 'en')

  return en ? en.genus : ''

})


const genderRate = computed(() => species.value?.gender_rate ?? -1)


const description = computed(() => {

  if (!species.value) return ''

  const englishEntries = species.value.flavor_text_entries.filter(e => e.language.name === 'en')

  if (englishEntries.length === 0) return ''

  const randomIndex = Math.floor(Math.random() * englishEntries.length)

  return englishEntries[randomIndex].flavor_text.replace(/[\n\f]/g, ' ')

})


const pokemonTypes = computed(() => pokemon.value?.types.map(t => t.type.name) || [])

const pokemonMoves = computed(() => pokemon.value?.moves.slice(0, 10).map(m => m.move.name) || [])

const pokemonWeaknesses = computed(() => getWeaknesses(pokemonTypes.value))


const mainColor = computed(() => pokemonTypes.value.length ? getTypeHex(pokemonTypes.value[0]) : '#e5e7eb')


const darkColor = computed(() => {

  if (mainColor.value === '#e5e7eb') return '#4b5563'

  let hex = mainColor.value.replace('#', '')

  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')

 

  let r = Math.floor(parseInt(hex.substring(0, 2), 16) * 0.65)

  let g = Math.floor(parseInt(hex.substring(2, 4), 16) * 0.65)

  let b = Math.floor(parseInt(hex.substring(4, 6), 16) * 0.65)

 

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

})


const getEvoCondition = (details) => {

  if (!details || details.length === 0) return ''

  const d = details[0]

  if (d.min_level) return `Lvl ${d.min_level}`

  if (d.item) return d.item.name.replace('-', ' ')

  if (d.min_happiness) return 'Happy'

  if (d.trigger?.name === 'trade') return 'Trade'

  return 'Evolve'

}


const extractEvolutions = (node, acc = []) => {

  if (!node) return acc

  const urlParts = node.species.url.split('/').filter(Boolean)

  const id = urlParts[urlParts.length - 1]

 

  acc.push({

    id: parseInt(id),

    name: node.species.name,

    condition: getEvoCondition(node.evolution_details)

  })

 

  node.evolves_to.forEach(child => extractEvolutions(child, acc))

  return acc

}


const evolutions = computed(() => {

  if (!evolutionData.value) return []

  const rawEvo = extractEvolutions(evolutionData.value.chain)

  const unique = []

  rawEvo.forEach(evo => {

    if (!unique.find(u => u.id === evo.id)) unique.push(evo)

  })

  return unique

})

</script>


<style scoped>

.pokeball-pattern {

  background-color: var(--type-color);

  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");

  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M2 12h7m6 0h7'/%3E%3C/svg%3E");

  -webkit-mask-size: 60px 60px;

  mask-size: 60px 60px;

  opacity: 0.07;

  animation: slide-bg 4s linear infinite;

  pointer-events: none;

}


@keyframes slide-bg {

  0% { -webkit-mask-position: 0 0; mask-position: 0 0; }

  100% { -webkit-mask-position: 60px 60px; mask-position: 60px 60px; }

}


@keyframes float {

  0%, 100% { transform: translateY(0); }

  50% { transform: translateY(-15px); }

}


.floating-pokemon {

  animation: float 4s ease-in-out infinite;

}


.no-scrollbar::-webkit-scrollbar {

  display: none;

}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 