<template>
  <App>
    <Suspense>
      <div class="grow flex flex-row select-none">
        <div class="basis-5/12 flex flex-col justify-between items-center">
          <div></div>
          <PlaylistsGrid />
          <div class="mb-4 text-white">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-8 h-8 cursor-pointer transition-all"
              :class="{
                'text-blue-600': enableExclusivePlaylist
              }"
              @click="toggleExclusive">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>

          </div>
        </div>
        <div class="basis-1/12 flex justify-between">
          <VolumeSlider v-model="volume1" />
          <VolumeSlider v-model="volume2" />
        </div>
        <div class="basis-5/12">
          <EffectsGrid />
        </div>
      </div>
    </Suspense>
  </App>
</template>

<script setup lang="ts">
import App from './layouts/App.vue'
import VolumeSlider from './components/VolumeSlider.vue'
import PlaylistsGrid from './components/playlists/Grid.vue'
import EffectsGrid from './components/effects/Grid.vue'
import { ref, provide, computed } from 'vue';
import { EffectVolume, PlaylistVolume, PlaylistExclusive } from './symbols';

const enableExclusivePlaylist = ref(true)
const exclusivePlaylist = ref<string|null>(null)

const volume1 = ref(50)
const volume2 = ref(50)

const toggleExclusive = () => {
  enableExclusivePlaylist.value = !enableExclusivePlaylist.value

  if (enableExclusivePlaylist.value) {
    exclusivePlaylist.value = null
  }
}

const updateExclusivePlaylist = (value: string) => {
  if (enableExclusivePlaylist.value) {
    return
  }

  exclusivePlaylist.value = value
}

provide(EffectVolume, computed(() => volume2.value / 100))

provide(PlaylistVolume, computed(() => volume1.value / 100))
provide(PlaylistExclusive, {
  exclusivePlaylist: exclusivePlaylist,
  updateExclusivePlaylist: updateExclusivePlaylist
})
</script>
