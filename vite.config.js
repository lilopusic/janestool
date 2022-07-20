import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    host: true,
  },
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    Pages(),
    // crx({ manifest }),
  ],
})
