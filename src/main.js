import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import TestHub from './views/TestHub.vue'
import TestPage from './views/TestPage.vue'
import ResultPage from './views/ResultPage.vue'
import FortuneHub from './views/FortuneHub.vue'
import ConstellationResult from './views/ConstellationResult.vue'
import ChineseZodiacResult from './views/ChineseZodiacResult.vue'
import Profile from './views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/test', component: TestHub },
  { path: '/test/:type/:version', component: TestPage, props: true },
  { path: '/result/:testType/:version', component: ResultPage, props: true },
  { path: '/fortune', component: FortuneHub },
  { path: '/constellation/:sign', component: ConstellationResult, props: true },
  { path: '/chinese-zodiac/:sign', component: ChineseZodiacResult, props: true },
  { path: '/profile', component: Profile }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
