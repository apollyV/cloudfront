<template>
    <div>
        <button @click="redirectToCognito">Connexion</button>
    </div>
</template>

<script setup lang="ts">
const redirectToCognito = () => {
const clientId = '69bjltclm7jhdmgpf2pj0rhq0p';
const redirectUri = 'https://d2jbfajeqng3d3.cloudfront.net';
const responseType = 'code';
const cognitoUrl = `https://saturn.auth.eu-west-1.amazoncognito.com/login?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
window.location.href = cognitoUrl;
};
</script>
  