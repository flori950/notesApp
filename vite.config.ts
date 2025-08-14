/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    },
    server: {
      deps: {
        inline: ['@testing-library/jest-dom']
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React-DOM in separate chunk
          'react-vendor': ['react', 'react-dom'],
          // PDF library in separate chunk (large)
          'pdf-vendor': ['jspdf'],
          // Canvas library in separate chunk (large)
          'canvas-vendor': ['html2canvas']
        }
      }
    },
    // Increase chunk size warning limit to 1MB
    chunkSizeWarningLimit: 1000
  }
})
