import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude large PDF assets from file watcher to prevent EBUSY errors
      ignored: ['**/public/textbooks/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/firebase/')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('src/data/cbseRAGKnowledgeBase') || id.includes('src/data/icseRAGKnowledgeBase')) {
            return 'rag-data';
          }
          if (id.includes('src/data/questions/')) {
            return 'questions-data';
          }
          if (id.includes('src/data/chapters')) {
            return 'chapters-data';
          }
        }
      }
    }
  }
})


