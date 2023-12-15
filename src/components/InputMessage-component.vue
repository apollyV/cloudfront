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

const message = ref("");
const username = "default_user";

const sendMessage = async () => {
  try {
    const response = await axios.post(
      "https://bzel021qe5.execute-api.eu-west-1.amazonaws.com/postMessages/message",
      {
        message: message.value,
        username: username,
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
