// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from '../components/Home.vue';
import LoginVue from '../components/Login.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'Home', component: HomeVue },
  { path: '/login', name: 'Login', component: LoginVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const code = to.query.code;

  // Si l'utilisateur est authentifié, passez à la page suivante
  if (isAuthenticated) {
    next();
    return;
  }

  // Si nous avons un code et que l'utilisateur n'est pas authentifié, chargeons le token
  if (typeof code === 'string' && code) {
    try {
      await authStore.loadToken(code);
      // Après avoir chargé le token, nettoyez l'URL
      next({ path: '/', query: {} }); // Redirigez vers la page d'accueil sans code dans l'URL
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      next('/login'); // Redirigez vers la page de connexion en cas d'erreur
    }
  } else {
    // Redirigez vers l'URL de Cognito pour s'authentifier
    window.location.href = "https://saturn.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=69bjltclm7jhdmgpf2pj0rhq0p&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fd2jbfajeqng3d3.cloudfront.net";
  }
});

export default router;
