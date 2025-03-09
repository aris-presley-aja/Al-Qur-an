<template>
  <div v-if="surah">
    <div class="text-center mb-5">
      <h2>{{ surah.nama_latin }}</h2>
      <p class="text-muted">{{ surah.arti }} ({{ surah.jumlah_ayat }} ayat)</p>
    </div>

    <div v-for="ayat in surah.ayat" :key="ayat.nomor" class="ayat-card mb-4 p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-primary">Ayat {{ ayat.nomor }}</span>
        <button
          @click="playAudio(ayat.audio)"
          class="btn btn-sm btn-success"
        >
          ▶ Play
        </button>
      </div>
      <p class="arabic">{{ ayat.ar }}</p>
      <p class="text-muted">{{ ayat.idn }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAudioStore } from '../stores/audio'

const route = useRoute()
const surah = ref(null)
const audioStore = useAudioStore()

onMounted(async () => {
  try {
    const response = await axios.get(
      `https://quran-api.santrikoding.com/api/surah/${route.params.id}`
    )
    surah.value = response.data
  } catch (error) {
    console.error('Error fetching surah detail:', error)
  }
})

const playAudio = (audioUrl) => {
  audioStore.setCurrentAudio(audioUrl)
}
</script>
