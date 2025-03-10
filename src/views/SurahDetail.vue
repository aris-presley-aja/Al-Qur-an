<template>
  <div class="surah-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Memuat Surah...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <h3>⚠️ Gagal Memuat</h3>
      <p>{{ error }}</p>
      <button @click="fetchSurah" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Data Success -->
    <div v-else-if="surah" class="surah-content">
      <!-- Header -->
      <button class="home-button" @click="$router.push('/')">
  Kembali
</button>
      <div class="surah-header">
        <h1 class="arabic">{{ surah.nama }}</h1>
        <h2>{{ surah.nama_latin }} ({{ surah.arti }})</h2>
        <div class="surah-meta">
          <span>{{ surah.tempat_turun }}</span>
          <span>{{ surah.jumlah_ayat }} Ayat</span>
        </div>
      </div>

      <!-- Full Surah Player Controls -->
      <div class="full-player">
        <div class="player-controls">
          <button @click="togglePlayAll" :class="{ playing: isPlayingAll }" class="play-all-btn">
            <i :class="isPlayingAll ? 'fas fa-pause' : 'fas fa-play'"></i>
            {{ isPlayingAll ? '⏸ Jeda' : '▶ Putar Semua' }}
          </button>
          <button @click="stopAll" class="stop-btn"><i class="fas fa-stop"></i> ⏹ Berhenti</button>
          <!-- <span v-if="isPlayingAll" class="current-ayah">
            Sedang Memutar Ayat {{ currentAyahIndex + 1 }} dari {{ surah.jumlah_ayat }}
          </span> -->
        </div>
      </div>

      <!-- Ayat List -->
      <div class="ayat-list">
        <div
          v-for="(ayah, index) in surah.ayat"
          :key="ayah.nomor"
          class="ayat-item"
          :class="{ 'current-playing': currentAyahIndex === index }"
        >
          <div class="ayat-header">
            <span class="number">۞ {{ ayah.nomor }}</span>
          </div>

          <div class="ayat-body">
            <p class="arabic-text" v-html="ayah.ar"></p>
            <p class="latin-text" v-html="ayah.tr || 'Transliterasi tidak tersedia'"></p>
            <p class="translation-text">{{ ayah.idn || 'Terjemahan tidak tersedia' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const surah = ref(null)
const loading = ref(true)
const error = ref(null)
const currentAyahIndex = ref(-1) // Indeks ayat yang sedang diputar
const isPlayingAll = ref(false) // Status pemutaran keseluruhan surah
let audioElement = null // Objek audio

// Base URL untuk audio
const baseAudioUrl = 'https://santrikoding.com/storage/audio/'

// Fetch surah data
const fetchSurah = async () => {
  try {
    loading.value = true
    error.value = null

    if (!route.params.nomor || isNaN(route.params.nomor)) {
      throw new Error('Nomor surah tidak valid')
    }

    const response = await axios.get(
      `https://quran-api.santrikoding.com/api/surah/${route.params.nomor}`,
    )

    if (!response.data) {
      throw new Error('Data tidak ditemukan')
    }

    surah.value = response.data
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

// Handle errors
const handleError = (err) => {
  error.value =
    err.response?.data?.message ||
    err.message ||
    'Terjadi kesalahan. Silakan coba beberapa saat lagi.'
  console.error('Error details:', err)
}

// Generate audio URL berdasarkan nomor surah
const generateAudioUrl = (nomorSurah) => {
  const surahNumber = String(nomorSurah).padStart(3, '0') // Format 3 digit (001, 002, ...)
  return `${baseAudioUrl}${surahNumber}.mp3` // Format URL: https://santrikoding.com/storage/audio/001.mp3
}

// Toggle play all
const togglePlayAll = () => {
  if (isPlayingAll.value) {
    pauseAll()
  } else {
    playAll()
  }
}

// Play all ayahs
const playAll = () => {
  if (currentAyahIndex.value >= surah.value.ayat.length - 1) {
    currentAyahIndex.value = -1
  }

  isPlayingAll.value = true
  currentAyahIndex.value = currentAyahIndex.value === -1 ? 0 : currentAyahIndex.value

  // Generate URL audio
  const nomorSurah = route.params.nomor
  const audioUrl = generateAudioUrl(nomorSurah)

  // Buat objek Audio baru
  audioElement = new Audio(audioUrl)

  // Mulai memutar audio
  audioElement
    .play()
    .then(() => {
      console.log('Audio berhasil diputar')
    })
    .catch((err) => {
      console.error('Gagal memutar audio:', err)
      isPlayingAll.value = false
      currentAyahIndex.value = -1
      alert('Gagal memutar audio. Pastikan URL audio valid dan dapat diakses.')
    })

  // Hitung durasi per ayat
  const totalDuration = audioElement.duration
  const ayatCount = surah.value.ayat.length
  const ayatDuration = totalDuration / ayatCount

  // Update currentAyahIndex berdasarkan progres pemutaran
  audioElement.addEventListener('timeupdate', () => {
    const currentTime = audioElement.currentTime
    const newIndex = Math.floor(currentTime / ayatDuration)
    if (newIndex !== currentAyahIndex.value) {
      currentAyahIndex.value = newIndex
    }
  })

  // Saat audio selesai, hentikan pemutaran
  audioElement.addEventListener('ended', () => {
    stopAll()
  })
}

// Pause all
const pauseAll = () => {
  isPlayingAll.value = false
  if (audioElement) {
    audioElement.pause()
  }
}

// Stop all
const stopAll = () => {
  isPlayingAll.value = false
  currentAyahIndex.value = -1
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchSurah()
})

onUnmounted(() => {
  stopAll()
})
</script>
<style scoped>
/* Global Styles */
.surah-container {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.retry-btn {
  background: #c62828;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Surah Content */
.surah-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
}

.surah-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.surah-header h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 1rem;
  text-align: center;
}

.surah-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

/* Ayat List */
.ayat-list {
  margin-top: 2rem;
}

.ayat-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.ayat-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.ayat-item.current-playing {
  background: #e8f5e9 !important;
  border-left: 4px solid #4caf50;
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.ayat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.number {
  font-size: 1.2rem;
  color: #4caf50;
}

.ayah-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.play-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-btn:hover {
  opacity: 0.9;
  transform: scale(1.1);
}

.arabic-text {
  font-size: 1.8rem;
  text-align: right;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 2.5rem;
}

.latin-text {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  line-height: 1.5rem;
}

.translation-text {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .surah-header h1 {
    font-size: 2rem;
  }

  .surah-header h2 {
    font-size: 1.2rem;
  }

  .arabic-text {
    font-size: 1.5rem;
  }

  .play-btn {
    width: 35px;
    height: 35px;
  }
/*  */
.home-button {
      background-color: #4CAF50; /* Warna hijau */
      color: white; /* Warna teks putih */
      padding: 10px 20px; /* Padding atas-bawah 10px, kiri-kanan 20px */
      border: none; /* Hilangkan border */
      border-radius: 5px; /* Sudut tombol melengkung */
      font-size: 16px; /* Ukuran font */
      cursor: pointer; /* Ubah kursor saat diarahkan ke tombol */
      transition: background-color 0.3s ease; /* Animasi perubahan warna */
    }

    .home-button:hover {
      background-color: #45a049; /* Warna hijau lebih gelap saat hover */
    }
/*  */
}
</style>
