<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <div class="bg-red-300">
    <h1>{{ msg }}</h1>
    <div>{{ count }}</div>
  </div>
</template>

<style scoped></style>
