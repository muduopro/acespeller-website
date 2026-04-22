import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        redeem: resolve(__dirname, 'redeem.html'),
        upgrade: resolve(__dirname, 'upgrade.html'),
        download: resolve(__dirname, 'download.html'),
        blogIndex: resolve(__dirname, 'blog/index.html'),
        blogTips: resolve(__dirname, 'blog/dictation-practice-tips.html'),
        blogAi: resolve(__dirname, 'blog/ai-dictation-guide.html'),
        blogWordList: resolve(__dirname, 'blog/primary-school-word-list.html'),
        blogAssessmentReform: resolve(__dirname, 'blog/primary-school-assessment-reform-2026.html'),
        blogSecondaryPlacement: resolve(__dirname, 'blog/secondary-school-placement-2026.html'),
        blogEnrollmentDecline: resolve(__dirname, 'blog/primary-school-enrollment-decline-2026.html'),
      },
    },
  },
})
