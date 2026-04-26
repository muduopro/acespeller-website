import './nav.js';
import { auth, db, signInWithGoogle, signInWithApple } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// ─────────────────────────────────────────
// 文章 slug（從容器 data-slug 取得）
// ─────────────────────────────────────────
const container = document.getElementById('comments-section');
if (!container) throw new Error('comments.js: #comments-section not found');
const SLUG = container.dataset.slug;
if (!SLUG) throw new Error('comments.js: data-slug missing on #comments-section');

// ─────────────────────────────────────────
// 多語系（固定繁中，與 blog 文章一致）
// ─────────────────────────────────────────
const t = {
  title: '讀者討論',
  loginPrompt: '登入後即可留言',
  loginDesc: '以 Google 或 Apple 帳號登入，加入討論。',
  googleBtn: '以 Google 登入',
  appleBtn: '以 Apple 登入',
  placeholder: '分享你的想法或問題…（最多 500 字）',
  submitBtn: '發表留言',
  submitting: '送出中…',
  deleteBtn: '刪除',
  noComments: '暫無留言，成為第一個留言的人！',
  errEmpty: '請輸入留言內容。',
  errTooLong: '留言最多 500 字。',
  errSubmit: '留言失敗，請稍後再試。',
  loggedInAs: '已登入：',
  signoutLink: '登出',
  justNow: '剛剛',
  minutesAgo: (n) => `${n} 分鐘前`,
  hoursAgo: (n) => `${n} 小時前`,
  daysAgo: (n) => `${n} 天前`,
};

// ─────────────────────────────────────────
// 時間格式化
// ─────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return t.justNow;
  if (diff < 3600) return t.minutesAgo(Math.floor(diff / 60));
  if (diff < 86400) return t.hoursAgo(Math.floor(diff / 3600));
  return t.daysAgo(Math.floor(diff / 86400));
}

// ─────────────────────────────────────────
// 狀態
// ─────────────────────────────────────────
let currentUser = null;
let unsubscribeComments = null;
let lastCommentTime = 0;
const COMMENT_COOLDOWN_MS = 10_000; // 10 秒冷卻，防洪水攻擊

// ─────────────────────────────────────────
// 渲染整個留言區塊
// ─────────────────────────────────────────
function render() {
  container.innerHTML = `
    <div class="comments-wrap">
      <h2 class="comments-title">💬 ${t.title}</h2>

      ${currentUser
        ? `<div class="comments-auth-bar">
            <img class="comments-avatar-sm" src="${esc(currentUser.photoURL || '')}" alt="" onerror="this.style.display='none'" />
            <span class="comments-auth-info">${t.loggedInAs}<strong>${esc(currentUser.displayName || currentUser.email || '')}</strong></span>
            <button id="comments-signout" class="comments-signout-link">${t.signoutLink}</button>
           </div>
           <form id="comments-form" class="comments-form">
             <textarea id="comments-input" class="comments-input" maxlength="500" placeholder="${t.placeholder}" rows="3"></textarea>
             <div class="comments-form-footer">
               <span id="comments-char" class="comments-char">0 / 500</span>
               <button id="comments-submit" type="submit" class="comments-submit-btn">${t.submitBtn}</button>
             </div>
             <p id="comments-err" class="comments-err" style="display:none"></p>
           </form>`
        : `<div class="comments-login">
            <p class="comments-login-desc">${t.loginDesc}</p>
            <div class="comments-login-btns">
              <button id="comments-google-btn" class="comments-auth-btn comments-google-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                ${t.googleBtn}
              </button>
              <button id="comments-apple-btn" class="comments-auth-btn comments-apple-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                ${t.appleBtn}
              </button>
            </div>
           </div>`
      }

      <div id="comments-list" class="comments-list">
        <p class="comments-loading">⏳</p>
      </div>
    </div>
  `;

  bindEvents();
  subscribeComments();
}

// ─────────────────────────────────────────
// XSS 防護
// ─────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 只接受 https:// 圖片 URL，防止 javascript: / data: 協議 XSS
function safeImgUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? url : '';
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────
// 綁定事件
// ─────────────────────────────────────────
function bindEvents() {
  // Login buttons
  document.getElementById('comments-google-btn')?.addEventListener('click', async () => {
    try { await signInWithGoogle(); } catch (e) { console.error(e); }
  });
  document.getElementById('comments-apple-btn')?.addEventListener('click', async () => {
    try { await signInWithApple(); } catch (e) { console.error(e); }
  });

  // Sign out
  document.getElementById('comments-signout')?.addEventListener('click', async () => {
    const { signOutUser } = await import('./auth.js');
    await signOutUser();
  });

  // Form
  const form = document.getElementById('comments-form');
  const input = document.getElementById('comments-input');
  const charEl = document.getElementById('comments-char');

  input?.addEventListener('input', () => {
    charEl.textContent = `${input.value.length} / 500`;
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('comments-err');
    const submitBtn = document.getElementById('comments-submit');
    const text = input.value.trim();

    errEl.style.display = 'none';

    if (!text) {
      errEl.textContent = t.errEmpty;
      errEl.style.display = 'block';
      return;
    }
    if (text.length > 500) {
      errEl.textContent = t.errTooLong;
      errEl.style.display = 'block';
      return;
    }
    const remaining = Math.ceil((COMMENT_COOLDOWN_MS - (Date.now() - lastCommentTime)) / 1000);
    if (remaining > 0) {
      errEl.textContent = `請等待 ${remaining} 秒再發表留言。`;
      errEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t.submitting;

    try {
      await addDoc(collection(db, 'blogComments', SLUG, 'comments'), {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email || '匿名用戶',
        photoURL: currentUser.photoURL || null,
        text,
        createdAt: serverTimestamp(),
      });
      lastCommentTime = Date.now();
      input.value = '';
      charEl.textContent = '0 / 500';
    } catch (err) {
      console.error('Comment submit error:', err);
      errEl.textContent = t.errSubmit;
      errEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t.submitBtn;
    }
  });
}

// ─────────────────────────────────────────
// 實時訂閱留言
// ─────────────────────────────────────────
function subscribeComments() {
  if (unsubscribeComments) unsubscribeComments();

  const q = query(
    collection(db, 'blogComments', SLUG, 'comments'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  unsubscribeComments = onSnapshot(q, (snap) => {
    const listEl = document.getElementById('comments-list');
    if (!listEl) return;

    if (snap.empty) {
      listEl.innerHTML = `<p class="comments-empty">${t.noComments}</p>`;
      return;
    }

    listEl.innerHTML = snap.docs.map(d => {
      const c = d.data();
      const isOwn = currentUser && c.uid === currentUser.uid;
      const avatarSrc = safeImgUrl(c.photoURL) || '/logo.png';
      return `
        <div class="comment-item" data-id="${d.id}">
          <img class="comment-avatar" src="${esc(avatarSrc)}" alt="" />
          <div class="comment-body">
            <div class="comment-header">
              <strong class="comment-name">${esc(c.displayName)}</strong>
              <span class="comment-time">${timeAgo(c.createdAt)}</span>
              ${isOwn ? `<button class="comment-delete-btn" data-id="${d.id}" title="${t.deleteBtn}">🗑</button>` : ''}
            </div>
            <p class="comment-text">${esc(c.text).replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `;
    }).join('');

    // Bind delete buttons
    listEl.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('確定刪除這則留言？')) return;
        try {
          await deleteDoc(doc(db, 'blogComments', SLUG, 'comments', btn.dataset.id));
        } catch (err) {
          console.error('Delete error:', err);
        }
      });
    });
  });
}

// ─────────────────────────────────────────
// Auth state listener
// ─────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  render();
});
