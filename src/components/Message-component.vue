<template>
  <div class="container">
    <div class="card shadow rounded">
      <div class="card-body">
        <h5 class="card-title">{{ props.login }}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">{{ props.date }}</h6>
        <p class="card-text">{{ props.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  login: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>
