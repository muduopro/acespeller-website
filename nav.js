import { auth } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';

// ─────────────────────────────────────────
// 全站統一 Nav + Footer（所有含 shared-nav / shared-footer 的頁面）
// ─────────────────────────────────────────

function buildNav(user) {
  // ── Nav ──
  const navRight = document.querySelector('.shared-nav-right');
  if (navRight) {
    navRight.innerHTML = `
      <a href="/blog/" class="shared-nav-link">學習資源</a>
      <a href="/faq" class="shared-nav-link">FAQ</a>
      <a href="/upgrade" class="shared-nav-link">升級 Plus</a>
      <a href="/profile" class="shared-nav-link nav-profile-link">
        ${user ? `👤 ${escHtml(user.displayName || '我的帳號')}` : '登入'}
      </a>
      <a href="/download" class="shared-nav-cta">免費下載</a>
    `;
  }

  // ── Footer ──
  const footer = document.querySelector('.shared-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="shared-footer-inner">
        <div class="shared-footer-brand">
          <img src="/logo.png" alt="AceSpeller" width="28" height="28" />
          <span>AceSpeller 默書100分</span>
        </div>
        <div class="shared-footer-links">
          <a href="/blog/">學習資源</a>
          <a href="/faq">FAQ</a>
          <a href="/redeem">兌換碼</a>
          <a href="/upgrade">升級 Plus</a>
          <a href="/privacy">隱私政策</a>
          <a href="/terms">服務條款</a>
          <a href="mailto:cs@acespeller.com.hk">聯絡我們</a>
        </div>
        <p class="shared-footer-copy">© 2026 MuduoPro Limited · All rights reserved.</p>
      </div>
    `;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

onAuthStateChanged(auth, buildNav);
