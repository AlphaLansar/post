import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Le `base` correspond au nom du dépôt GitHub Pages : https://<user>.github.io/poste-ai/
// Surchargeable via la variable d'environnement VITE_BASE lors du build.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/post/',
  plugins: [react()],
})
