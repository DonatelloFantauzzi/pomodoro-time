<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
      <!-- Header -->
      <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        🍅 Pomodoro Timer
      </h1>

      <!-- Timer Type Indicator -->
      <div class="mb-4 text-center">
        <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100">
          <span class="text-3xl">{{ timerEmoji }}</span>
          <span :class="['text-xl font-bold', timerColor]">
            {{ timerLabel }}
          </span>
        </div>
      </div>

      <!-- Timer Display -->
      <div class="mb-8">
        <div :class="['text-7xl md:text-8xl font-mono font-bold text-center', timerColor]">
          {{ displayTime }}
        </div>
      </div>

      <!-- Completion Message (NUOVO) -->
      <div v-if="state.status === 'completed'" class="mb-6 text-center animate-fade-in">
        <div
          class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200"
        >
          <p v-if="timerLabel === 'Work Session'" class="text-xl font-bold text-green-600 mb-2">
            ☕ Break's Over!
          </p>
          <p v-else class="text-xl font-bold text-blue-600 mb-2">🎉 Work Session Complete!</p>

          <p class="text-gray-700 mb-3">
            <span v-if="timerLabel === 'Work Session'">Ready for another work session?</span>
            <span v-else>Time for a {{ state.timeLeft }} minute break</span>
          </p>

          <p class="text-sm text-gray-500">Click Start when you're ready to continue</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex gap-4 justify-center mb-8">
        <!-- Start/Pause Button -->
        <button
          @click="toggleTimer"
          class="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {{ buttonText }}
        </button>

        <!-- Reset Button -->
        <button
          v-if="state.status !== 'idle'"
          @click="reset"
          class="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reset
        </button>
      </div>

      <!-- Session Counter -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center justify-center gap-2">
          <span class="text-2xl">🍅</span>
          <span class="text-lg font-semibold text-gray-700"> Sessions Today: </span>
          <span class="text-2xl font-bold text-red-500 bg-red-50 px-4 py-1 rounded-full">
            {{ state.sessionsCompleted }}
          </span>
        </div>
      </div>
      <settings-panel />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
//importo il composable
import { useSound } from '../composables/useSound'
import { useStorage } from '@/composables/useStorage'

//importo componente
import SettingsPanel from './SettingsPanel.vue'

//destrutturo il composable
const { playAlarm } = useSound()
const { state, settings, saveToLocalStorage } = useStorage()

//  variabile normale
let intervalId = null

//  funzione formatTime
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

//  computed per display
const displayTime = computed(() => {
  return formatTime(state.value.timeLeft)
})

//  computed per button text
const buttonText = computed(() => {
  return state.value.status === 'running' ? 'Pause' : 'Start'
})

// computed per timer & emoji
const timerColor = computed(() => {
  if (state.value.timerType === 'work') return 'text-red-500'
  if (state.value.timerType === 'shortBreak') return 'text-green-500'
  if (state.value.timerType === 'longBreak') return 'text-blue-500'
})

const timerEmoji = computed(() => {
  if (state.value.timerType === 'work') return '🍅'
  if (state.value.timerType === 'shortBreak') return '☕'
  if (state.value.timerType === 'longBreak') return '🌴'
})

const timerLabel = computed(() => {
  if (state.value.timerType === 'work') return 'Work Session'
  if (state.value.timerType === 'shortBreak') return 'Short Break'
  if (state.value.timerType === 'longBreak') return 'Long Break'
})

// funzione pr cambiare il tempo
const getDurationForType = (type) => {
  return settings.value[type]
}
// funzione per cambiare il timer
const getNextTimerType = () => {
  if (state.value.timerType === 'work') {
    return state.value.sessionsCompleted > 0 && state.value.sessionsCompleted % 4 === 0
      ? 'longBreak'
      : 'shortBreak'
  }
  return 'work'
}

// Funzione per far partire il timer
const startTimer = () => {
  if (intervalId) return
  state.value.status = 'running'
  intervalId = setInterval(() => {
    state.value.timeLeft--
    if (state.value.timeLeft <= 0) {
      handleTimerComplete()
    }
  }, 1000)
}

const handleTimerComplete = () => {
  // 1. Ferma il timer
  clearInterval(intervalId)
  intervalId = null

  // 2. Cambia stato a 'completed'
  state.value.status = 'completed'

  // 3. Suona l'allarme SUBITO
  playAlarm(state.value.timerType)

  // 4. Aggiorna contatori
  if (state.value.timerType === 'work') {
    state.value.sessionsCompleted++
  }

  // 5. Prepara il prossimo timer (MA NON lo avvia!)
  state.value.timerType = getNextTimerType()
  state.value.timeLeft = getDurationForType(state.value.timerType)

  // 6. Salva stato
  saveToLocalStorage()
}

// funzione gestisce il timer
const toggleTimer = () => {
  if (state.value.status === 'running') {
    clearInterval(intervalId)
    intervalId = null
    state.value.status = 'paused'
    saveToLocalStorage()
    return
  }

  startTimer()
  saveToLocalStorage()
}
// funzione reset
const reset = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  state.value.timeLeft = settings.value.work
  state.value.timerType = 'work'
  state.value.status = 'idle'
  saveToLocalStorage()
}
</script>

<style scoped>
/* CSS dopo */
</style>
