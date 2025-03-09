import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentAudio: null,
  }),
  actions: {
    setCurrentAudio(audioUrl) {
      this.currentAudio = audioUrl
    },
  },
})
