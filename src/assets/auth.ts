import {defineStore} from 'pinia';
import {awsAuth} from "./api";
import axios from "axios";
import type { User } from "../models/user";

interface State {
    id_token: string | undefined;
    access_token: string | undefined;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id_token: undefined,
        access_token: undefined
    }) as State,
    getters: {
        isAuthenticated(state: State): boolean {
            return !!state.id_token;
        },
        async userInfo(state: State): Promise<User | undefined> {
            try {
                const response = await axios.get<User>(`${awsAuth.url}/${awsAuth.userInfo}`, {
                    headers: {
                        Authorization: `Bearer ${state.access_token}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur :', error);
            }
        }
    },
    actions: {
        async loadToken(code: string) {
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('client_id', import.meta.env.COGNITO_CLIENT_ID);
            params.append('code', code);
            params.append('redirect_uri', import.meta.env.VITE_COGNITO_REDIRECT_URI_AUTHENTICATE);

            try {
                const response = await axios.post(`${awsAuth.url}/${awsAuth.token}`, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                this.$state = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération du token :', error);
            }
        },
        async logout() {
            if (!this.id_token) {
                return;
            }

            const logoutUrl = new URL(`${awsAuth.url}/logout`);
            logoutUrl.searchParams.append('client_id', import.meta.env.COGNITO_CLIENT_ID); 
            logoutUrl.searchParams.append('logout_uri', import.meta.env.VITE_COGNITO_REDIRECT_URI_LOGOUT); // Replace with your redirect URI after logout

            this.$state = {
                id_token: undefined,
                access_token: undefined
            };

            window.location.assign(logoutUrl);
        }
    }
});