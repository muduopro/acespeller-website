import './style.css';
import { auth, db, signInWithGoogle, signInWithApple, signOutUser } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// ─────────────────────────────────────────
// 多語系
// ─────────────────────────────────────────
const i18n = {
  'zh-HK': {
    pageTitle: '我的帳號',
    loading: '載入中...',
    signinTitle: '登入以查看帳號',
    signinDesc: '使用與 AceSpeller App 相同的帳號登入，即可查看訂閱狀態與 AceCoins 餘額。',
    googleBtn: '以 Google 帳號登入',
    appleBtn: '以 Apple ID 登入',
    signoutBtn: '登出',
    tierFree: '免費版',
    tierPlus: 'Ace Plus 💎',
    tierPro: 'Ace Pro 👑',
    tierLabel: '訂閱方案',
    expiryLabel: '到期日',
    coinsLabel: 'AceCoins',
    upgradeBtn: '升級方案',
    redeemBtn: '兌換碼',
    noExpiry: '永久（已到期或未訂閱）',
    downloadApp: '下載 App',
    profileNav: '我的帳號',
    errLoad: '載入失敗，請重新整理。',
  },
  'zh-CN': {
    pageTitle: '我的账号',
    loading: '加载中...',
    signinTitle: '登录以查看账号',
    signinDesc: '使用与 AceSpeller App 相同的账号登录，即可查看订阅状态与 AceCoins 余额。',
    googleBtn: '以 Google 账号登录',
    appleBtn: '以 Apple ID 登录',
    signoutBtn: '登出',
    tierFree: '免费版',
    tierPlus: 'Ace Plus 💎',
    tierPro: 'Ace Pro 👑',
    tierLabel: '订阅方案',
    expiryLabel: '到期日',
    coinsLabel: 'AceCoins',
    upgradeBtn: '升级方案',
    redeemBtn: '兑换码',
    noExpiry: '永久（已到期或未订阅）',
    downloadApp: '下载 App',
    profileNav: '我的账号',
    errLoad: '加载失败，请刷新页面。',
  },
  'en-US': {
    pageTitle: 'My Account',
    loading: 'Loading...',
    signinTitle: 'Sign in to view your account',
    signinDesc: 'Sign in with the same account as the AceSpeller app to view your subscription and AceCoins balance.',
    googleBtn: 'Sign in with Google',
    appleBtn: 'Sign in with Apple',
    signoutBtn: 'Sign out',
    tierFree: 'Free',
    tierPlus: 'Ace Plus 💎',
    tierPro: 'Ace Pro 👑',
    tierLabel: 'Plan',
    expiryLabel: 'Expires',
    coinsLabel: 'AceCoins',
    upgradeBtn: 'Upgrade',
    redeemBtn: 'Redeem Code',
    noExpiry: 'N/A',
    downloadApp: 'Download App',
    profileNav: 'My Account',
    errLoad: 'Failed to load. Please refresh.',
  },
};

// ─────────────────────────────────────────
// 語言偵測
// ─────────────────────────────────────────
const storedLang = localStorage.getItem('acespeller-lang');
const browserLang = navigator.language;
function detectLang() {
  if (storedLang && i18n[storedLang]) return storedLang;
  if (browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-TW')) return 'zh-HK';
  if (browserLang.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}
let currentLang = detectLang();

// ─────────────────────────────────────────
// DOM refs
// ─────────────────────────────────────────
const loadingEl = document.getElementById('profile-loading');
const signinSection = document.getElementById('profile-signin');
const profileSection = document.getElementById('profile-main');
const errEl = document.getElementById('profile-error');

const btnGoogle = document.getElementById('btn-google');
const btnApple = document.getElementById('btn-apple');
const btnSignout = document.getElementById('btn-signout');

const avatarEl = document.getElementById('profile-avatar');
const nameEl = document.getElementById('profile-name');
const emailEl = document.getElementById('profile-email');
const tierEl = document.getElementById('profile-tier');
const expiryEl = document.getElementById('profile-expiry');
const coinsEl = document.getElementById('profile-coins');

const langBtns = document.querySelectorAll('.lang-btn');

// ─────────────────────────────────────────
// 語言切換
// ─────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('acespeller-lang', lang);
  const t = i18n[lang];
  document.documentElement.lang = lang;
  document.getElementById('page-heading').textContent = t.pageTitle;
  document.getElementById('signin-title').textContent = t.signinTitle;
  document.getElementById('signin-desc').textContent = t.signinDesc;
  document.getElementById('btn-google-text').textContent = t.googleBtn;
  document.getElementById('btn-apple-text').textContent = t.appleBtn;
  btnSignout.textContent = t.signoutBtn;
  document.getElementById('lbl-tier').textContent = t.tierLabel;
  document.getElementById('lbl-expiry').textContent = t.expiryLabel;
  document.getElementById('lbl-coins').textContent = t.coinsLabel;
  document.getElementById('btn-upgrade').textContent = t.upgradeBtn;
  document.getElementById('btn-redeem').textContent = t.redeemBtn;
  langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}

langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

// ─────────────────────────────────────────
// 工具
// ─────────────────────────────────────────
function tierLabel(tier) {
  const t = i18n[currentLang];
  if (tier === 'ace_pro') return t.tierPro;
  if (tier === 'ace_plus') return t.tierPlus;
  return t.tierFree;
}

function formatDate(ts) {
  if (!ts) return i18n[currentLang].noExpiry;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (d < new Date()) return i18n[currentLang].noExpiry;
  return d.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─────────────────────────────────────────
// Auth state
// ─────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  loadingEl.style.display = 'none';

  if (!user) {
    signinSection.style.display = 'block';
    profileSection.style.display = 'none';
    return;
  }

  signinSection.style.display = 'none';
  profileSection.style.display = 'block';

  // Fill basic info
  avatarEl.src = user.photoURL || '/logo.png';
  avatarEl.alt = user.displayName || '';
  nameEl.textContent = user.displayName || '—';
  emailEl.textContent = user.email || '—';

  // Load Firestore data
  try {
    const [userSnap, statsSnap] = await Promise.all([
      getDoc(doc(db, 'users', user.uid)),
      getDoc(doc(db, 'users', user.uid, 'stats', 'general')),
    ]);

    const userData = userSnap.exists() ? userSnap.data() : {};
    const statsData = statsSnap.exists() ? statsSnap.data() : {};

    tierEl.textContent = tierLabel(userData.subscriptionTier);
    expiryEl.textContent = formatDate(userData.subscriptionExpiry);
    coinsEl.textContent = `${statsData.aceCoins ?? 0} 🪙`;
  } catch {
    errEl.textContent = i18n[currentLang].errLoad;
    errEl.style.display = 'block';
  }
});

// ─────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────
btnGoogle.addEventListener('click', async () => {
  try { await signInWithGoogle(); } catch (e) { console.error(e); }
});

btnApple.addEventListener('click', async () => {
  try { await signInWithApple(); } catch (e) { console.error(e); }
});

btnSignout.addEventListener('click', async () => {
  await signOutUser();
});

// ─────────────────────────────────────────
// 初始化語言
// ─────────────────────────────────────────
applyLang(currentLang);
