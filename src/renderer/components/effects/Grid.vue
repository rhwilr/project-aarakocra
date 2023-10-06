<template>
    <div class="grid grid-cols-3 gap-4 justify-items-center content-center">

        <Card 
            v-for="effect in effects.effects"
            :effect="effect"
        />

    </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'

const effects = await window.electronAPI.getEffects()
</script>