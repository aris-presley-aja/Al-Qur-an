<template>
  <div class="row">
    <div class="col-md-4 mb-4" v-for="surah in surahs" :key="surah.nomor">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ surah.nomor }}. {{ surah.nama_latin }}</h5>
          <p class="card-text">
            {{ surah.arti }} ({{ surah.jumlah_ayat }} ayat)
          </p>
          <router-link :to="`/surah/${surah.nomor}`" class="btn btn-primary">
            Baca Surah
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const surahs = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('https://quran-api.santrikoding.com/api/surah')
    surahs.value = response.data
  } catch (error) {
    console.error('Error fetching surahs:', error)
  }
})
</script>
