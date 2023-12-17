// src/stores/auth.ts
import { defineStore } from 'pinia';
import axios, { AxiosResponse } from 'axios';

interface AuthState {
  idToken: string | null;
  accessToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    idToken: null,
    accessToken: null,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.idToken,
  },
  actions: {
    async loadToken(code: string): Promise<void> {
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', '69bjltclm7jhdmgpf2pj0rhq0p');
      params.append('code', code);
      params.append('redirect_uri', 'https://d2jbfajeqng3d3.cloudfront.net');

      try {
        const response: AxiosResponse<any> = await axios.post(`https://saturn.auth.eu-west-1.amazoncognito.com/oauth2/token`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        this.idToken = response.data.id_token;
        this.accessToken = response.data.access_token;
        // Redirigez l'utilisateur où vous voulez après l'authentification
      } catch (error) {
        console.error('Erreur lors de la récupération du token :', error);
        // Gérer l'erreur
      }
    },
    signOut(): void {
      this.idToken = null;
      this.accessToken = null;
    },
  }
});
