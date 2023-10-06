<template>
  <div class="h-full py-8 w-16 flex justify-stretch">
    <div ref="containerEl" class="h-full py-4 grow flex justify-center">
      <div class="relative h-full flex justify-center rounded-lg w-2 bg-gray-800 shadow-inner">

        <div 
          class="absolute bottom-0 bg-blue-400 h-32 w-full rounded-lg shadow-md shadow-blue-400/70"
          :style="volumeStyle"
        />

        <div ref="sliderEl"
          class="absolute w-8 h-16 flex justify-center items-center bg-gradient-to-b from-gray-100 via-gray-400 via-40% to-gray-100 rounded border-2 border-gray-400 shadow-lg cursor-pointer"
          :style="sliderStyle">

          <span class="text-slate-700">
            {{ internalVolume }}
          </span>
        </div>


      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, unref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { lerp } from '../composables/useHelpers'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits([
  'update:modelValue'
])

const internalVolume = ref(props.modelValue)

const sliderEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

const sliderStyle = computed(() => {
  return {
    transform: 'translate(0, 50%)',
    bottom: `${internalVolume.value}%`
  }
})

const volumeStyle = computed(() => {
  return {
    height: `${props.modelValue}%`
  }
})

const containerSize = ref<{ start: number, end: number } | undefined>(undefined)

const start = (e: PointerEvent) => {
  const container = unref(containerEl)
  const rect = container!.getBoundingClientRect()

  containerSize.value = {
    start: rect.top,
    end: rect.height,
  }

  move(e)
}
const move = (e: PointerEvent) => {
  if (!containerSize.value) {
    return
  }

  const percentage = Math.max(0, Math.min(100, (100 / containerSize.value.end * (e.clientY - containerSize.value.start))))

  internalVolume.value = Math.round(100 - percentage)
}
const end = (e: PointerEvent) => {
  containerSize.value = undefined
}

setInterval (() => {
  const diff = Math.abs(props.modelValue - internalVolume.value)

  if (diff > 1) {
    emit('update:modelValue', lerp(props.modelValue, internalVolume.value, 0.01))
  } else {
    emit('update:modelValue', internalVolume.value)
  }
}, 10)

useEventListener(containerEl, 'pointerdown', start)
useEventListener(window, 'pointermove', move)
useEventListener(window, 'pointerleave', end)
useEventListener(window, 'pointerup', end)
</script>