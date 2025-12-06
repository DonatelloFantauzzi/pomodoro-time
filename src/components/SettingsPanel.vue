<template>
  <div
    v-if="isDisabled"
    class="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center gap-3"
  >
    <span class="text-2xl">⏸️</span>
    <p class="text-sm font-medium text-yellow-800">
      Settings are disabled while timer is running. Pause or stop the timer to make changes.
    </p>
  </div>
  <div v-else class="mt-6 pt-6 border-t border-gray-200">
    <!-- Toggle Button -->
    <button
      @click="toggleOpen"
      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
    >
      <span class="text-xl">⚙️</span>
      <span class="font-semibold text-gray-700">Settings</span>
      <span class="text-gray-500 text-sm ml-auto">
        {{ isOpen ? '▲' : '▼' }}
      </span>
    </button>

    <!-- Settings Panel (Accordion) -->
    <div v-if="isOpen" class="mt-4 p-6 bg-gray-50 rounded-xl space-y-6">
      <!-- Work Duration -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          🍅 Work Duration (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          v-model.number="tempSettings.work"
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
        />
      </div>

      <!-- Short Break Duration -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          ☕ Short Break (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="30"
          v-model.number="tempSettings.shortBreak"
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
        />
      </div>

      <!-- Long Break Duration -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          🌴 Long Break (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          v-model.number="tempSettings.longBreak"
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <!-- Sound Volume -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2"> 🔊 Sound Volume </label>
        <div class="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model.number="tempSettings.soundVolume"
            class="flex-1"
          />
          <span class="text-sm font-mono text-gray-600 w-12">
            {{ Math.round(tempSettings.soundVolume * 100) }}%
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          @click="handleSave"
          class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          💾 Save Settings
        </button>
        <button
          @click="handleCancel"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Import useStorage composable
import { useStorage } from '@/composables/useStorage'
// destrutturo il composable
const { settings, state, saveToLocalStorage } = useStorage()

// ref
const tempSettings = ref({ ...settings.value })
const isOpen = ref(false)

//computed
const isDisabled = computed(() => {
  return state.value.status === 'running'
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    tempSettings.value = { ...settings.value }
  }
}

const handleSave = () => {
  settings.value = { ...tempSettings.value }
  if (state.value.status === 'idle' || state.value.status === 'paused') {
    // Aggiorna solo se è il timer corretto
    if (state.value.timerType === 'work') {
      state.value.timeLeft = settings.value.work * 60
    } else if (state.value.timerType === 'shortBreak') {
      state.value.timeLeft = settings.value.shortBreak * 60
    } else if (state.value.timerType === 'longBreak') {
      state.value.timeLeft = settings.value.longBreak * 60
    }
  }
  saveToLocalStorage()
  isOpen.value = false
}

const handleCancel = () => {
  tempSettings.value = { ...settings.value }
  isOpen.value = false
}
</script>
