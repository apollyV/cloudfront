<template>
  <div class="input-group shadow rounded">
    <textarea
      class="form-control"
      v-model="message"
      aria-label="With textarea"
    ></textarea>
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="sendMessage"
    >
      Send
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from '../stores/auth'; // Supposons que vous utilisez Pinia pour gérer l'authentification

const message = ref("");
const authStore = useAuthStore();
const token = authStore.accessToken; // Obtenez le token d'authentification du store

const sendMessage = async () => {
  if (!token) {
    console.error('Aucun token d\'authentification fourni');
    return;
  }

  try {
    const response = await axios.post(
      "https://bzel021qe5.execute-api.eu-west-1.amazonaws.com/postMessages/message",
      {
        message: message.value,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
</script>


<style>
.btn {
  background-color: white;
}
</style>
