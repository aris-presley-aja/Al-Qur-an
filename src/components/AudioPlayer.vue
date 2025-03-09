<template>
  <div class="audio-player fixed-bottom bg-light p-3">
    <audio :src="audioUrl" controls autoplay class="w-100"></audio>
  </div>
</template>

<script setup>
defineProps({
  audioUrl: String
})
</script>
