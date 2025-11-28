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
          v-if="status !== 'idle'"
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
            {{ sessionsCompleted }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const TIMER_DURATIONS = {
  work: 5,
  shortBreak: 4,
  longBreak: 3,
}

//  ref
const status = ref('idle')
const sessionsCompleted = ref(0)
const timerType = ref('work')
const timeLeft = ref(TIMER_DURATIONS.work)

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
  return formatTime(timeLeft.value)
})

//  computed per button text
const buttonText = computed(() => {
  return status.value === 'running' ? 'Pause' : 'Start'
})

// computed per timer & emoji
const timerColor = computed(() => {
  if (timerType.value === 'work') return 'text-red-500'
  if (timerType.value === 'shortBreak') return 'text-green-500'
  if (timerType.value === 'longBreak') return 'text-blue-500'
})

const timerEmoji = computed(() => {
  if (timerType.value === 'work') return '🍅'
  if (timerType.value === 'shortBreak') return '☕'
  if (timerType.value === 'longBreak') return '🌴'
})

const timerLabel = computed(() => {
  if (timerType.value === 'work') return 'Work Session'
  if (timerType.value === 'shortBreak') return 'Short Break'
  if (timerType.value === 'longBreak') return 'Long Break'
})

const getDurationForType = (type) => {
  return TIMER_DURATIONS[type]
}

const getNextTimerType = () => {
  if (timerType.value === 'work') {
    return sessionsCompleted.value > 0 && sessionsCompleted.value % 4 === 0
      ? 'longBreak'
      : 'shortBreak'
  }
  return 'work'
}

// Funzione per far partire il timer
const startTimer = () => {
  if (intervalId) return
  status.value = 'running'
  intervalId = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleTimerComplete()
    }
  }, 1000)
}

const handleTimerComplete = () => {
  clearInterval(intervalId)
  intervalId = null
  if (timerType.value === 'work') sessionsCompleted.value++
  timerType.value = getNextTimerType()
  timeLeft.value = getDurationForType(timerType.value)
  startTimer()
}

const toggleTimer = () => {
  if (status.value === 'running') {
    clearInterval(intervalId)
    intervalId = null
    status.value = 'paused'
    return
  }

  startTimer()
}

const reset = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  timeLeft.value = TIMER_DURATIONS.work
  timerType.value = 'work'
  status.value = 'idle'
}
</script>

<style scoped>
/* CSS dopo */
</style>
