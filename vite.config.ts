import react from '@vitejs/plugin-react-swc'
import 'dotenv/config'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  },
  server: { host: true },
  preview: {
    port: Number(process.env.VITE_PORT_BUILDER)
  }
})
