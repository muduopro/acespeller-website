import { auth } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';

// ─────────────────────────────────────────
// 在所有含 .shared-nav-right 的頁面注入登入/帳號連結
// ─────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  const navRight = document.querySelector('.shared-nav-right');
  if (!navRight) return;

  let link = navRight.querySelector('.nav-profile-link');
  if (!link) {
    link = document.createElement('a');
    link.className = 'shared-nav-link nav-profile-link';
    link.href = '/profile';
    const cta = navRight.querySelector('.shared-nav-cta');
    if (cta) navRight.insertBefore(link, cta);
    else navRight.appendChild(link);
  }

  link.textContent = user ? `👤 ${user.displayName || '我的帳號'}` : '登入';
});
