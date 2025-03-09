<template>
  <div class="row">
    <!-- Tambahkan loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Memuat daftar surah...</p>
    </div>

    <!-- Tambahkan error state -->
    <div v-if="error" class="alert alert-danger my-4">Gagal memuat data: {{ error }}</div>

    <div v-else class="col-md-4 mb-4" v-for="surah in surahs" :key="surah.nomor">
      <!-- Isi card surah -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const surahs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get('https://quran-api.santrikoding.com/api/surah', {
      timeout: 10000, // Timeout 10 detik
    })

    // Validasi response
    if (!Array.isArray(response.data)) {
      throw new Error('Format data tidak valid')
    }

    surahs.value = response.data
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})
</script>
