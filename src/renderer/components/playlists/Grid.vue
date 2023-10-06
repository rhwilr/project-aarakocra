<template>
    <div class="grid grid-cols-3 gap-4 justify-items-center content-center">

        <Card 
            v-for="playlist in playlists.playlists"
            :playlist="playlist"
        />

    </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'

const playlists = await window.electronAPI.getPlaylists()
</script>