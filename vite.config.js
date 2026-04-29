import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        faq: resolve(__dirname, 'faq.html'),
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
        blogStudentMacbookVsIpad: resolve(__dirname, 'blog/student-macbook-vs-ipad-2026.html'),
        blogDse2026ElectiveExamTips: resolve(__dirname, 'blog/dse-2026-elective-exam-tips.html'),
        blogP6AssessmentExamTips: resolve(__dirname, 'blog/p6-assessment-exam-tips-2026.html'),
        blogPrimaryOnePlacementResults: resolve(__dirname, 'blog/primary-one-placement-results-2026.html'),
        blogHkAiEducationBlueprint: resolve(__dirname, 'blog/hk-ai-education-blueprint-2026.html'),
        blogEnglishPhonicsHkStudents: resolve(__dirname, 'blog/english-phonics-hk-students.html'),
        profile: resolve(__dirname, 'profile.html'),
        blogPrivateTutoringGuide: resolve(__dirname, 'blog/hk-private-tutoring-guide-2026.html'),
      },
    },
  },
})
