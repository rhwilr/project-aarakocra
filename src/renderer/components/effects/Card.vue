<template>
    <div class="relative bg-gray-200  h-12 sm:h-20 lg:h-32 w-12 sm:w-20 lg:w-32 rounded flex flex-col justify-between items-stretch border-2 shadow-lg cursor-pointer bg-cover transition-all"
        :class="{
            'border-blue-600 shadow-blue-500/70': isPlaying && !isFadingOut,
            'border-blue-800 shadow-blue-700/50': isFadingOut,
            'border-gray-500': !isPlaying && !isFadingOut,
            'opacity-50': isLoading
        }" :style="{
    'background-image': `url(${effect.cover})`
}" @click="togglePlayback">
        <!-- Title -->
        <div class="w-full text-center pb-4 text-white bg-gradient-to-b from-black/60 from-40% ">
            {{ effect.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, watch, computed, ref, onMounted } from 'vue'
import { EffectVolume } from '../../symbols';
import useGapless from "../../composables/useGapless"
import { sleep } from '../../composables/useHelpers'

const FADE_SPEED = 3 / 100
const volume = inject(EffectVolume, computed(() => 1))

const props = defineProps<{
    effect: Effect
}>()

const { player, isPlaying, isLoading } = useGapless({
    volume: volume.value,
    shuffle: false
})

const isFadingIn = ref(false)
const isFadingOut = ref(false)

watch(volume, () => {
    if (isFadingIn.value || isFadingOut.value) {
        return 
    }
    
    player.setVolume(volume.value)
})
onMounted(() => loadEffect())

const togglePlayback = () => {
    if (isLoading.value) {
        return
    }

    if (isPlaying.value) {
        return props.effect.fade_out ? fadeOut() : player.pause()
    }

    props.effect.fade_in ? fadeIn() : player.play()
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

const loadEffect = async () => {
    const files = await window.electronAPI.getEffectDetails(props.effect.id)

    for (const file of files) {
        player.addTrack(file)
    }
}
</script>