<template>
  <MessagesComponent />
  <div class="fixed-bottom container">
    <div class="col align-self-center mb-3">
      <InputMessageComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
    import MessagesComponent from './Messages-component.vue';
    import InputMessageComponent from './InputMessage-component.vue'
</script>