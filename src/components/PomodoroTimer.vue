<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
      <!-- Header -->
      <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        🍅 Pomodoro Timer
      </h1>

      <!-- Timer Display -->
      <div class="mb-8">
        <div class="text-7xl md:text-8xl font-mono font-bold text-center text-red-500">
          {{ displayTime }}
        </div>
      </div>

      <!-- Controls -->
      <div class="flex gap-4 justify-center">
        <!-- Start/Pause Button -->
        <button
          @click="toggleTimer"
          class="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200 text-lg"
        >
          {{ buttonText }}
        </button>

        <!-- Reset Button -->
        <button
          v-if="status !== 'idle'"
          @click="reset"
          class="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors duration-200 text-lg"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const WORK_TIME = 5

// 1. ref
const timeLeft = ref(WORK_TIME)
const status = ref('idle')

// 2. variabile normale
let intervalId = null

// 3. funzione formatTime
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 4. computed per display
const displayTime = computed(() => {
  return formatTime(timeLeft.value)
})

// 5. computed per button text
const buttonText = computed(() => {
  // Scrivi tu! Se running → 'Pause', altrimenti → 'Start'
  return status.value === 'running' ? 'Pause' : 'Start'
})

const toggleTimer = () => {
  if (status.value === 'running') {
    clearInterval(intervalId)
    intervalId = null
    status.value = 'paused'
    return
  }

  if (intervalId) return

  if (timeLeft.value <= 0) timeLeft.value = WORK_TIME

  status.value = 'running'
  intervalId = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(intervalId)
      intervalId = null
      status.value = 'idle'
    }
  }, 1000)
}

const reset = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  timeLeft.value = WORK_TIME
  status.value = 'idle'
}
</script>

<style scoped>
/* CSS dopo */
</style>
