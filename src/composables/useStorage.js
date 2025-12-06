// composables/useStorage.js
import { ref, watch } from 'vue'
const DEFAULT_SETTINGS = {
  work: 5,
  shortBreak: 4,
  longBreak: 3,
  soundVolume: 0.5,
  theme: 'light',
}

const DEFAULT_STATE = {
  sessionsCompleted: 0,
  timerType: 'work',
  timeLeft: 5,
  status: 'idle',
  lastSaved: '',
}
// 1. Define reactive state
const state = ref({ ...DEFAULT_STATE })

const settings = ref({ ...DEFAULT_SETTINGS })

// 2. Helper: get today's date
const getTodayDate = () => {
  // funzione per far tornare l'ora nel formato 2025-11-28
  let data = new Date().toISOString().split('T')[0]
  return data
}

// 3. Load from localStorage
const loadFromLocalStorage = () => {
  let pomodoro = JSON.parse(localStorage.getItem('pomodoro'))
  if (!pomodoro) return
  let today = getTodayDate()
  for (const key in DEFAULT_SETTINGS) {
    settings.value[key] = pomodoro[key] ?? DEFAULT_SETTINGS[key]
  }
  if (pomodoro.lastSaved !== today) {
    state.value = {
      sessionsCompleted: 0,
      timerType: 'work',
      timeLeft: settings.value.work, // Usa settings caricato!
      lastSaved: today,
      status: 'idle',
    }
  } else {
    state.value = {
      sessionsCompleted: pomodoro.sessionsCompleted ?? 0,
      timerType: pomodoro.timerType ?? 'work',
      timeLeft: pomodoro.timeLeft ?? settings.value.work,
      lastSaved: today,
      status: pomodoro.status ?? 'idle',
    }
  }
}

// 4. Save to localStorage
const saveToLocalStorage = () => {
  const dataToSave = { ...state.value, lastSaved: getTodayDate(), ...settings.value }
  localStorage.setItem('pomodoro', JSON.stringify(dataToSave))
}

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

applyTheme(settings.value.theme)

watch(() => settings.value.theme, applyTheme)

// 5. Init on composable creation
loadFromLocalStorage()

// 6. Return
export function useStorage() {
  return {
    state,
    settings,
    saveToLocalStorage,
    applyTheme,
  }
}
