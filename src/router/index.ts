import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeVue from '../components/Home.vue';
import AuthentificationVue from '../components/Authentification.vue';
import MessagesComponentVue from '../components/Messages-component.vue';
import { useAuthStore } from '../assets/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeVue
  },
  {
    path: '/authentification',
    name: 'authentification',
    component: AuthentificationVue
  },
  {
    path: '/messages',
    name: 'messages',
    component: MessagesComponentVue
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const awsHostedUiUrl = 'https://saturn.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=69bjltclm7jhdmgpf2pj0rhq0p&response_type=code&scope=email+openid+phone&redirect_uri='
const buildedUrl = `${awsHostedUiUrl}${encodeURIComponent(import.meta.env.VITE_COGNITO_REDIRECT_URI_AUTHENTICATE)}`

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  console.log(`isAuthenticated: ${isAuthenticated}`)
  console.log(authStore.id_token)
  if (isAuthenticated) {
    next()
  } else {
    const code = to.query.code

    if (code && !authStore.id_token) {
      await authStore.loadToken(code as string)
    }

    if (authStore.isAuthenticated) {
      if (typeof to.name === 'string') {
        next({ name: to.name })
      } else {
        next('/')
      }
    } else {
      window.location.href = buildedUrl
    }
  }
})

export default router