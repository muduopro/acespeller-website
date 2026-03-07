# 🤖 AI 協作中樞 (AI Collaboration Workspace)

> **⚠️ 致所有 AI Agent (Antigravity, Claude, ChatGPT 等)**：
> 在開始任何開發或設計工作之前，**請務必先閱讀此檔案**。
> 這裡記錄了專案的當前進度、待辦事項、架構設計決策，以及不同身分（前端工程師、UI設計師）之間的交接事項。工作完成後，**請主動更新此檔案**。

---

## 📅 當前專案階段 (Current Project Status)
- **專案**：AceSpeller 默書100分 (Landing Page)
- **最新進度**：
  - [2024-03-x] 已更新 SEO/OpenGraph Meta Tags，加入真實 App 截圖的預覽圖片。
  - [2024-03-x] 已將文案受眾從「兒童」擴大為涵蓋各年齡層的「學生」。
  - [2024-03-x] 建立 AI 角色設定與此協作中樞。
  - [2024-03-x] 更換首頁 Hero 視覺圖，移除原本不相關的 `shop.png`，替換為全新包含 AceSpeller 教育元素（星星吉祥物、閃卡、掃描相機）的 `hero-visual.png`。
  - [2026-03-07] 更新聯絡電子郵件地址：從 `support@acespeller.com.hk` 變更為 `cs@acespeller.com.hk`。

## 🎯 待辦任務 (Backlog)
- [ ] 根據 `WEB_UI_designer.md` 建議，優化首屏 (First Fold) 的下載按鈕轉換率。
- [ ] 檢視並提升移動端的響應式版面體驗。
- [ ] [新增你的任務...]

---

## 🗣️ Agent 之間的交接與留言板 (Communication Log)

### [Antigravity Frontend Agent] 給 [UI Designer]
> (2024-03-x) 剛才替換了首頁右側的手機 Hero 展示圖 (`public/images/hero-visual.png`)。現在整體畫面的主題性更一致。請 UI Designer 下次審閱時確認這張新圖與深紫星空背景 (`#1a0533`) 的融合度是否理想，如果有需要可以建議新的 CSS 光暈效果（目前使用的是 `.hero-phone-glow` 樣式）。

### [UI Designer] 給 [Frontend Agent (Claude/Antigravity)]
> (請在此留下你建議的 CSS/版面修改，讓工程師來實作)
> 目前沒有待處理的實作問題。

---

## 🏗️ 架構與設計決策 (Architecture & Design Decisions)
- **框架**：Vite + Vanilla JS (無框架)，追求極致輕量與載入速度。
- **樣式**：純 CSS，請使用 CSS Variables 做主題管理，避免行內樣式。不使用 Tailwind 除非特別說明。
- **多語系**：目前透過 `locales.js` 處理繁/簡體切換。
