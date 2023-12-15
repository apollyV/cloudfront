<template>
  <ul class="list-group gap-3 m-3 list-messages">
    <MessageComponent 
      v-for="(message, index) in displayedMessages"
      :key="index"
      :login="message.login"
      :date="message.date"
      :message="message.message"
    />
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MessageComponent from './Message-component.vue';
import InfiniteLoading from "v3-infinite-loading";
import axios from 'axios';

interface Message {
  message: string;
  timestamp_utc_iso8601: string;
  id: string;
  channel_id: string;
  username?: string;
}

interface MessagesDisplay {
  login: string;
  date: string;
  message: string;
}

const messagesPerPage = 10;
const messages = ref<Message[]>([]);
let displayedMessages = ref<MessagesDisplay[]>([]);

// Fonction pour récupérer et formater les messages
const fetchMessages = async () => {
  try {
    // Envoi de la requête HTTP à l'API avec axios
    const response = await axios.get<{ messages: Message[] }>('https://bzel021qe5.execute-api.eu-west-1.amazonaws.com/postMessages/message');

    const messagesArray = response.data.messages;

    // Tri des messages par date en ordre décroissant
    messagesArray.sort((a: Message, b: Message) => {
      const dateA = new Date(a.timestamp_utc_iso8601).getTime();
      const dateB = new Date(b.timestamp_utc_iso8601).getTime();
      return dateB - dateA;
    });

    // Formatage des messages pour l'affichage
    displayedMessages.value = messagesArray.map(msg => {
      const date = new Date(msg.timestamp_utc_iso8601);
      const formattedDate = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
      return {
        login: msg.username || 'Anonyme',
        date: formattedDate,
        message: msg.message || 'empty message !'
      };
    });

  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des messages:', error);
    displayedMessages.value = [];
  }
};



fetchMessages();



// Gestionnaire pour l'événement de défilement infini
const infiniteHandler = ($state: any) => {
  const startIndex = displayedMessages.value.length;
  const endIndex = startIndex + messagesPerPage;

  // Récupère les messages suivants de 'messages'
  const nextMessages = messages.value.slice(startIndex, endIndex);

  // Convertit 'nextMessages' en 'MessagesDisplay[]'
  const formattedNextMessages = nextMessages.map(msg => {
    const date = new Date(msg.timestamp_utc_iso8601);
    const formattedDate = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
    return {
      login: msg.username || 'Anonyme',
      date: formattedDate,
      message: msg.message || 'empty message !'
    };
  });

  if (formattedNextMessages.length) {
    displayedMessages.value = [...displayedMessages.value, ...formattedNextMessages];
    $state.loaded();
  } else {
    $state.complete();
  }
};


</script>

<style>
.list-messages {
  margin-bottom: 9rem!important;

  span {
    text-align: center;
  }
}
</style>
