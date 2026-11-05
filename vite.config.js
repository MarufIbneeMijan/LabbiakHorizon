import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { app as expressApp } from './server/server.js'

function apiServerPlugin() {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(expressApp);
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiServerPlugin()],
  server: {
    port: 5173
  }
})

