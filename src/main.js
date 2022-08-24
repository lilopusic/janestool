import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import routes from '~pages'

import './index.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(autoAnimatePlugin).mount('#app')
