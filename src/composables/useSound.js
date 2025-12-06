import { ref } from 'vue'
export function useSound() {
  let audioContext = null
  const volume = ref(0.5)
  const playAlarm = (type = 'work') => {
    if (!audioContext) {
      audioContext = new AudioContext()
    }

    const now = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    gainNode.gain.value = volume.value
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.type = 'sine'

    // Melodie diverse in base al tipo
    if (type === 'work') {
      // Work finito: DO-MI-SOL (ascendente, celebrativo)
      oscillator.frequency.setValueAtTime(523.25, now) // DO
      oscillator.frequency.setValueAtTime(659.25, now + 0.25) // MI
      oscillator.frequency.setValueAtTime(783.99, now + 0.5) // SOL
      oscillator.start(now)
      oscillator.stop(now + 0.75)
    } else if (type === 'shortBreak') {
      // Short break finito: SOL-MI-DO (discendente, gentle)
      oscillator.frequency.setValueAtTime(783.99, now) // SOL
      oscillator.frequency.setValueAtTime(659.25, now + 0.25) // MI
      oscillator.frequency.setValueAtTime(523.25, now + 0.5) // DO
      gainNode.gain.value = volume.value * 0.8 // Un po' più basso
      oscillator.start(now)
      oscillator.stop(now + 0.75)
    } else if (type === 'longBreak') {
      // Long break finito: DO-MI-SOL-DO (ottava, trionfante!)
      oscillator.frequency.setValueAtTime(523.25, now) // DO
      oscillator.frequency.setValueAtTime(659.25, now + 0.2) // MI
      oscillator.frequency.setValueAtTime(783.99, now + 0.4) // SOL
      oscillator.frequency.setValueAtTime(1046.5, now + 0.6) // DO (ottava sopra)
      oscillator.start(now)
      oscillator.stop(now + 0.9)
    }
  }

  return { playAlarm }
}
