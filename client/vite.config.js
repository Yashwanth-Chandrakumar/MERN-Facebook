import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [basicSsl(),react()],
  server: {
    https: true,
    port:3000,
  }
})