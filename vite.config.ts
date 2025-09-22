import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional: local run ke liye port fix
    allowedHosts: [
      // 👇 yaha apna backend domain daalna (Replit / Render / etc.)
      "4a98506b-edc7-4285-bee2-c018259ea5ea-00-115l9hqzy6sut.riker.replit.dev"
    ]
  },
  preview: {
    allowedHosts: [
      // deploy preview mode ke liye bhi same host allow karna padega
      "4a98506b-edc7-4285-bee2-c018259ea5ea-00-115l9hqzy6sut.riker.replit.dev"
    ]
  }
})
