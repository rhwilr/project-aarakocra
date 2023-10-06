import { Gapless5 } from '@regosen/gapless-5'
import { ref } from 'vue'

export default function (options: { volume: number, shuffle: boolean }) {
    const isPlaying = ref(false)
    const isLoading = ref(false)
    
    const player = new Gapless5({ 
        guiId: 'gapless5-player-id',
        loadLimit: 1,
        crossfade: 3000,
        volume: options.volume,
        shuffle: options.shuffle,
        useHTML5Audio: false,
    })

    player.onplay = () => isPlaying.value = true
    player.onpause = () => isPlaying.value = false
    player.onstop = () => isPlaying.value = false

    player.onloadstart = () => isLoading.value = true
    player.onload = () => isLoading.value = false
    
    return {
        player,
        isPlaying,
        isLoading
    }
}
