import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from './firebaseConfig.js';

// ─────────────────────────────────────────
// Firebase 初始化
// ─────────────────────────────────────────
const app = initializeApp(firebaseConfig);

const RECAPTCHA_V3_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
if (RECAPTCHA_V3_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const fns = getFunctions(app, 'us-central1');

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// ─────────────────────────────────────────
// 多語系
// ─────────────────────────────────────────
const i18n = {
  'zh-HK': {
    pageTitle: '升級方案',
    pageSubtitle: '解鎖完整功能，讓學習更上一層樓。',
    loginHint: '請先登入以繼續升級。',
    signinBtn: '以 Google 帳號登入',
    appleSigninBtn: '以 Apple ID 登入',
    signinOr: '或',
    signoutBtn: '登出',
    labelChoosePlan: '選擇方案',
    perMonth: '/ 月',
    perYear: '/ 年',
    plusFeatures: ['AI 拍照辨識（無限次）', '雲端同步', '無廣告', '優先支援'],
    proFeatures: ['Plus 全部功能', 'AI Speaking 評估', '進階統計', '轉蛋機 × 2'],
    btnPayDefault: '請先選擇方案',
    btnPay: (name) => `以 HKD 付款 — ${name}`,
    btnPayProcessing: '處理中...',
    payNote: '付款由 Airwallex 安全處理，AceSpeller 不儲存您的卡號。',
    successTitle: '升級成功！',
    successDesc: '您的帳號已升級。請重新開啟 AceSpeller App 即可生效。',
    btnOpenApp: '開啟 App',
    errGeneric: '付款失敗，請稍後再試。',
    errAuthRequired: '請先登入。',
    demoBanner: '⚠️ 測試模式（Demo）— 請使用測試卡號 4111 1111 1111 1111',
    navBack: '返回首頁',
  },
  'zh-CN': {
    pageTitle: '升级方案',
    pageSubtitle: '解锁完整功能，让学习更上一层楼。',
    loginHint: '请先登录以继续升级。',
    signinBtn: '以 Google 账号登录',
    appleSigninBtn: '以 Apple ID 登录',
    signinOr: '或',
    signoutBtn: '登出',
    labelChoosePlan: '选择方案',
    perMonth: '/ 月',
    perYear: '/ 年',
    plusFeatures: ['AI 拍照识别（无限次）', '云端同步', '无广告', '优先支持'],
    proFeatures: ['Plus 全部功能', 'AI Speaking 评估', '进阶统计', '转蛋机 × 2'],
    btnPayDefault: '请先选择方案',
    btnPay: (name) => `以 HKD 付款 — ${name}`,
    btnPayProcessing: '处理中...',
    payNote: '付款由 Airwallex 安全处理，AceSpeller 不储存您的卡号。',
    successTitle: '升级成功！',
    successDesc: '您的账号已升级。请重新开启 AceSpeller App 即可生效。',
    btnOpenApp: '打开 App',
    errGeneric: '付款失败，请稍后再试。',
    errAuthRequired: '请先登录。',
    demoBanner: '⚠️ 测试模式（Demo）— 请使用测试卡号 4111 1111 1111 1111',
    navBack: '返回首页',
  },
  'en-US': {
    pageTitle: 'Upgrade Plan',
    pageSubtitle: 'Unlock full features and take learning to the next level.',
    loginHint: 'Please sign in to continue.',
    signinBtn: 'Sign in with Google',
    appleSigninBtn: 'Sign in with Apple',
    signinOr: 'or',
    signoutBtn: 'Sign out',
    labelChoosePlan: 'Choose a plan',
    perMonth: '/ mo',
    perYear: '/ yr',
    plusFeatures: ['Unlimited AI Photo Scan', 'Cloud Sync', 'Ad-free', 'Priority Support'],
    proFeatures: ['Everything in Plus', 'AI Speaking Assessment', 'Advanced Stats', 'Gacha × 2'],
    btnPayDefault: 'Select a plan first',
    btnPay: (name) => `Pay in HKD — ${name}`,
    btnPayProcessing: 'Processing...',
    payNote: 'Payment securely processed by Airwallex. AceSpeller never stores your card details.',
    successTitle: 'Upgrade Successful!',
    successDesc: 'Your account has been upgraded. Reopen AceSpeller to apply.',
    btnOpenApp: 'Open App',
    errGeneric: 'Payment failed. Please try again later.',
    errAuthRequired: 'Please sign in first.',
    demoBanner: '⚠️ Demo mode — Use test card 4111 1111 1111 1111',
    navBack: 'Back to Home',
  },
};

// Plan display names
const planNames = {
  'zh-HK': {
    ace_plus_monthly: 'Ace Plus 💎 月費',
    ace_plus_yearly:  'Ace Plus 💎 年費',
    ace_pro_monthly:  'Ace Pro 👑 月費',
    ace_pro_yearly:   'Ace Pro 👑 年費',
  },
  'zh-CN': {
    ace_plus_monthly: 'Ace Plus 💎 月费',
    ace_plus_yearly:  'Ace Plus 💎 年费',
    ace_pro_monthly:  'Ace Pro 👑 月费',
    ace_pro_yearly:   'Ace Pro 👑 年费',
  },
  'en-US': {
    ace_plus_monthly: 'Ace Plus 💎 Monthly',
    ace_plus_yearly:  'Ace Plus 💎 Yearly',
    ace_pro_monthly:  'Ace Pro 👑 Monthly',
    ace_pro_yearly:   'Ace Pro 👑 Yearly',
  },
};

// ─────────────────────────────────────────
// 狀態
// ─────────────────────────────────────────
let currentLang = 'zh-HK';
let currentUser = null;
let selectedPlan = null; // { plan, tier, days, amount }
let dropInMounted = false;
let unsubscribeSnapshot = null;

// ─────────────────────────────────────────
// DOM
// ─────────────────────────────────────────
const sectionSignin   = document.getElementById('section-signin');
const sectionPlans    = document.getElementById('section-plans');
const sectionSuccess  = document.getElementById('section-success');
const btnGoogleSignin = document.getElementById('btn-google-signin');
const btnAppleSignin  = document.getElementById('btn-apple-signin');
const btnSignout      = document.getElementById('btn-signout');
const userAvatar      = document.getElementById('user-avatar');
const userNameEl      = document.getElementById('user-name');
const btnPay          = document.getElementById('btn-pay');
const btnPayText      = document.getElementById('btn-pay-text');
const resultBanner    = document.getElementById('result-banner');
const dropin          = document.getElementById('airwallex-dropin');
const pageTitle       = document.getElementById('page-title');
const pageSubtitle    = document.getElementById('page-subtitle');
const loginHintEl     = document.getElementById('login-hint');
const demoBannerEl    = document.getElementById('demo-banner');
const navBackText     = document.getElementById('nav-back-text');
const btnOpenApp      = document.getElementById('btn-open-app');
const langBtns        = document.querySelectorAll('.lang-btn');

// ─────────────────────────────────────────
// 語言切換
// ─────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  const t = i18n[lang];
  pageTitle.textContent = t.pageTitle;
  pageSubtitle.textContent = t.pageSubtitle;
  loginHintEl.textContent = t.loginHint;
  document.getElementById('btn-google-text').textContent = t.signinBtn;
  document.getElementById('btn-apple-text').textContent = t.appleSigninBtn;
  document.getElementById('signin-or').textContent = t.signinOr;
  btnSignout.textContent = t.signoutBtn;
  document.getElementById('label-choose-plan').textContent = t.labelChoosePlan;
  demoBannerEl.textContent = t.demoBanner;
  navBackText.textContent = t.navBack;
  document.getElementById('pay-note').textContent = t.payNote;
  document.getElementById('success-title').textContent = t.successTitle;
  document.getElementById('success-desc').textContent = t.successDesc;
  btnOpenApp.textContent = t.btnOpenApp;

  // period labels
  ['per-month-1','per-month-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t.perMonth;
  });
  ['per-year-1','per-year-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t.perYear;
  });

  // plan features
  renderPlanFeatures('features-plus',   t.plusFeatures);
  renderPlanFeatures('features-plus-yr', t.plusFeatures);
  renderPlanFeatures('features-pro',    t.proFeatures);
  renderPlanFeatures('features-pro-yr', t.proFeatures);

  // pay button
  if (selectedPlan) {
    const name = planNames[lang][selectedPlan.plan];
    btnPayText.textContent = t.btnPay(name);
  } else {
    btnPayText.textContent = t.btnPayDefault;
  }

  document.documentElement.lang = lang;
  langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  hideResult();
}

function renderPlanFeatures(containerId, features) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  ul.innerHTML = features.map(f => `<li>${f}</li>`).join('');
}

langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

// ─────────────────────────────────────────
// Auth
// ─────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    sectionSignin.style.display = 'none';
    sectionSuccess.style.display = 'none';
    sectionPlans.style.display = 'block';
    userAvatar.src = user.photoURL || '';
    userAvatar.alt = user.displayName || '';
    userNameEl.textContent = user.displayName || user.email || user.uid;
    // 若已在 success 畫面則保持
  } else {
    sectionSignin.style.display = 'block';
    sectionPlans.style.display = 'none';
    sectionSuccess.style.display = 'none';
    selectedPlan = null;
    dropInMounted = false;
    dropin.innerHTML = '';
    if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }
  }
  hideResult();
});

btnGoogleSignin.addEventListener('click', async () => {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (e) { console.error('Google sign-in error:', e); }
});

btnAppleSignin.addEventListener('click', async () => {
  try { await signInWithPopup(auth, appleProvider); }
  catch (e) {
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
      console.error('Apple sign-in error:', e);
    }
  }
});

btnSignout.addEventListener('click', () => signOut(auth));

// ─────────────────────────────────────────
// 方案卡片選擇
// ─────────────────────────────────────────
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('click', () => {
    // 重置已掛載的 Drop-in（如果已掛載，重新選擇方案需重新初始化）
    if (dropInMounted) {
      dropin.innerHTML = '';
      dropInMounted = false;
      btnPay.style.display = '';
    }

    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    selectedPlan = {
      plan:   card.dataset.plan,
      tier:   card.dataset.tier,
      days:   parseInt(card.dataset.days, 10),
      amount: parseInt(card.dataset.amount, 10),
    };

    const name = planNames[currentLang][selectedPlan.plan];
    btnPayText.textContent = i18n[currentLang].btnPay(name);
    btnPay.disabled = false;
    hideResult();
  });
});

// ─────────────────────────────────────────
// 付款流程
// ─────────────────────────────────────────
btnPay.addEventListener('click', async () => {
  if (!currentUser) { showResult('error', i18n[currentLang].errAuthRequired); return; }
  if (!selectedPlan) return;

  setPayLoading(true);
  hideResult();

  try {
    // 1. 呼叫 Cloud Function 建立 PaymentIntent
    const createIntent = httpsCallable(fns, 'createAirwallexPaymentIntent');
    const result = await createIntent({ plan: selectedPlan.plan });
    const { payment_intent_id, client_secret } = result.data;

    // 2. 隱藏付款按鈕，顯示 Drop-in
    btnPay.style.display = 'none';
    setPayLoading(false);

    // 3. 初始化 Airwallex Drop-in
    await Airwallex.init({
      env: 'demo',
      origin: location.origin,
    });

    const element = Airwallex.createElement('dropIn', {
      intent_id: payment_intent_id,
      client_secret,
      currency: 'HKD',
    });

    element.mount('airwallex-dropin');
    dropInMounted = true;

    // 4. 監聽成功事件
    element.on('success', () => {
      showSuccessScreen();
      startFirestoreListener();
    });

    element.on('error', (event) => {
      console.error('[Airwallex] Drop-in error:', event);
      showResult('error', i18n[currentLang].errGeneric);
      // 重設 Drop-in，讓用戶可以再試
      dropin.innerHTML = '';
      dropInMounted = false;
      btnPay.style.display = '';
      btnPay.disabled = false;
    });

  } catch (err) {
    console.error('[upgrade] payment error:', err);
    showResult('error', i18n[currentLang].errGeneric);
    setPayLoading(false);
    btnPay.style.display = '';
  }
});

// ─────────────────────────────────────────
// Firestore 監聽（確認後端已更新 tier）
// ─────────────────────────────────────────
function startFirestoreListener() {
  if (!currentUser) return;
  const userRef = doc(db, 'users', currentUser.uid);
  unsubscribeSnapshot = onSnapshot(userRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    const tier = data.subscriptionTier;
    const source = data.subscriptionSource;
    if (source === 'web' && tier && tier !== 'free') {
      // 後端已確認更新
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
  });
}

// ─────────────────────────────────────────
// 成功畫面
// ─────────────────────────────────────────
function showSuccessScreen() {
  sectionPlans.style.display = 'none';
  sectionSuccess.style.display = 'block';
  hideResult();
}

// ─────────────────────────────────────────
// UI 輔助
// ─────────────────────────────────────────
function showResult(type, message) {
  resultBanner.className = `result-banner ${type} show`;
  resultBanner.textContent = message;
}

function hideResult() {
  resultBanner.className = 'result-banner';
  resultBanner.textContent = '';
}

function setPayLoading(loading) {
  btnPay.disabled = loading;
  if (loading) {
    btnPayText.innerHTML = `<span class="spinner"></span>${i18n[currentLang].btnPayProcessing}`;
  } else if (selectedPlan) {
    const name = planNames[currentLang][selectedPlan.plan];
    btnPayText.textContent = i18n[currentLang].btnPay(name);
  }
}

// ─────────────────────────────────────────
// 初始化
// ─────────────────────────────────────────
applyLang(currentLang);
