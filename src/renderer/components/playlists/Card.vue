<template>
    <div class="relative bg-gray-200  h-12 sm:h-20 lg:h-32 w-12 sm:w-20 lg:w-32 rounded flex flex-col justify-between items-stretch border-2 shadow-lg cursor-pointer bg-cover transition-all"
        :class="{
            'border-blue-600 shadow-blue-500/70': isPlaying && !isFadingOut,
            'border-blue-800 shadow-blue-700/50': isFadingOut,
            'border-gray-500': !isPlaying && !isFadingOut,
            'opacity-50': isLoading
        }" :style="{
    'background-image': `url(${playlist.cover})`
}" @click="togglePlayback">
        <!-- Title -->
        <div class="w-full text-center pb-4 text-white bg-gradient-to-b from-black/60 from-40% ">
            {{ playlist.name }}
        </div>

        <!-- Controls -->
        <div class="flex justify-between items-baseline text-gray-400">
            <!--
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                </svg>
            </div>


            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                </svg>
            </div>
            -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, watch, computed, ref, onMounted } from 'vue'
import { PlaylistVolume, PlaylistExclusive } from '../../symbols';
import useGapless from "../../composables/useGapless"
import { sleep } from '../../composables/useHelpers'

const FADE_SPEED = 3 / 100
const volume = inject(PlaylistVolume, computed(() => 1))
const { exclusivePlaylist, updateExclusivePlaylist } = inject(PlaylistExclusive, {
    exclusivePlaylist: ref(null), updateExclusivePlaylist: () => {}
})

const props = defineProps<{
    playlist: Playlist
}>()

const { player, isPlaying, isLoading } = useGapless({
    volume: volume.value,
    shuffle: props.playlist.shuffle
})

const isFadingIn = ref(false)
const isFadingOut = ref(false)

watch(volume, () => {
    if (isFadingIn.value || isFadingOut.value) {
        return 
    }
    
    player.setVolume(volume.value)
})
watch(exclusivePlaylist, () => {
    if (!isPlaying.value || isLoading.value) {
        return
    }

    if (exclusivePlaylist.value && exclusivePlaylist.value !== props.playlist.id) {
        props.playlist.fade_out ? fadeOut() : player.pause()
    }
})

onMounted(() => loadPlaylist())

const togglePlayback = () => {
    if (isLoading.value) {
        return
    }

    if (isPlaying.value) {
        return props.playlist.fade_out ? fadeOut() : player.pause()
    }

    updateExclusivePlaylist(props.playlist.id)

    props.playlist.fade_in ? fadeIn() : player.play()
}

const fadeIn = async () => {
    isFadingIn.value = true

    player.setVolume(0)
    player.play()

    for (let i = 0; i <= 100; i++) {
        player.setVolume(volume.value * (i / 100))
        await sleep(FADE_SPEED)

        if (isFadingOut.value) {
            isFadingIn.value = false
            return
        }
    }

    isFadingIn.value = false
}

const fadeOut = async () => {
    isFadingOut.value = true

    for (let i = 100; i >= 0; i--) {
        player.setVolume(volume.value * (i / 100))
        await sleep(FADE_SPEED)

        if (isFadingIn.value) {
            isFadingOut.value = false
            return
        }
    }

    player.pause()
    player.setVolume(0)

    isFadingOut.value = false
}

const loadPlaylist = async () => {
    const files = await window.electronAPI.getPlaylistDetails(props.playlist.id)

    for (const file of files) {
        player.addTrack(file)
    }
}
</script>