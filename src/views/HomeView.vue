<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="title">📖 Daftar Surah Al-Qur'an</h1>
      <h1 class="title">made With ❤️ By Aris</h1>
      <p class="subtitle">Pilih surah untuk melihat detail ayat</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">Memuat Daftar Surah...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-card">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <div>
          <h3 class="error-title">Gagal Memuat Data</h3>
          <p class="error-message">{{ error }}</p>
        </div>
      </div>
      <button @click="fetchSurahs" class="retry-btn">🔄 Muat Ulang</button>
    </div>

    <!-- Surah List -->
    <div v-else class="surah-grid">
      <router-link
        v-for="surah in surahs"
        :key="surah.number"
        :to="`/surah/${surah.number}`"
        class="surah-card"
      >
        <div class="surah-number">{{ surah.number }}</div>
        <div class="surah-content">
          <h2 class="surah-name">{{ surah.englishName }}</h2>
          <p class="surah-details">
            {{ surah.englishNameTranslation }}
            <span class="ayah-count">• {{ surah.numberOfAyahs }} Ayat</span>
          </p>
        </div>
        <div class="surah-icon">⌖</div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const surahs = ref([])
const loading = ref(true)
const error = ref(null)

const fetchSurahs = async () => {
  try {
    loading.value = true
    const response = await axios.get('https://api.alquran.cloud/v1/surah')
    surahs.value = response.data.data
    error.value = null
  } catch (err) {
    error.value = 'Gagal memuat data. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSurahs)
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-family: 'Poppins', sans-serif;
  color: #666;
  font-size: 1.1rem;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: 'Poppins', sans-serif;
  color: #666;
  font-size: 1.2rem;
}

/* Error State */
.error-card {
  background: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 1.8rem;
}

.error-title {
  font-family: 'Poppins', sans-serif;
  color: #d32f2f;
  margin: 0;
}

.error-message {
  font-family: 'Poppins', sans-serif;
  color: #666;
  margin: 0.5rem 0 0;
}

.retry-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* Surah Grid */
.surah-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.surah-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.surah-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.surah-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #4caf50;
}

.surah-number {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #4caf50;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f5e9;
  border-radius: 8px;
}

.surah-content {
  flex: 1;
}

.surah-name {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #2d3436;
  margin: 0;
}

.surah-details {
  font-family: 'Poppins', sans-serif;
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
}

.ayah-count {
  color: #4caf50;
  font-weight: 500;
}

.surah-icon {
  color: #4caf50;
  font-size: 1.2rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .surah-grid {
    grid-template-columns: 1fr;
  }

  .surah-card {
    padding: 1rem;
  }
}
</style>
