<template>
  <div>
    <!-- Timer Display -->

    <!-- Bottoni -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 1. ref
const timeLeft = ref(25 * 60)
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
  // Scrivi tu! Usa formatTime
  return formatTime(timeLeft.value)
})

// 5. computed per button text
const buttonText = computed(() => {
  // Scrivi tu! Se running → 'Pause', altrimenti → 'Start'
  return status.value === 'running' ? 'Pause' : 'Start'
})
</script>

<style scoped>
/* CSS dopo */
</style>
