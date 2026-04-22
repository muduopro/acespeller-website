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
  getDoc,
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
    plusFeatures: ['AI 拍照辨識（無限次）', '雲端同步', '無廣告', 'AI 出題（即將推出）', '進階語音設定'],
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
    plusFeatures: ['AI 拍照识别（无限次）', '云端同步', '无广告', 'AI 出题（即将推出）', '进阶语音设置'],
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
    plusFeatures: ['Unlimited AI Photo Scan', 'Cloud Sync', 'Ad-free', 'AI Quiz (Coming Soon)', 'Advanced Voice Settings'],
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
let currentSubData = null; // { tier, expiry (Date|null), source, isActive }

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
const navBackText     = document.getElementById('nav-back-text');
const btnOpenApp      = document.getElementById('btn-open-app');
const langBtns        = document.querySelectorAll('.lang-btn');
const subStatusEl     = document.getElementById('sub-status');
const checkoutModal   = document.getElementById('checkout-modal');

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
  updateSubStatusBanner();
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
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    sectionSignin.style.display = 'none';
    sectionSuccess.style.display = 'none';
    sectionPlans.style.display = 'block';
    userAvatar.src = user.photoURL || '';
    userAvatar.alt = user.displayName || '';
    userNameEl.textContent = user.displayName || user.email || user.uid;
    // 若已在 success 畫面則保持
    await loadUserSubData(user.uid);
  } else {
    sectionSignin.style.display = 'block';
    sectionPlans.style.display = 'none';
    sectionSuccess.style.display = 'none';
    selectedPlan = null;
    dropInMounted = false;
    dropin.innerHTML = '';
    currentSubData = null;
    updateSubStatusBanner();
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

  // Pre-checkout validation
  const check = checkPreCheckout(selectedPlan);
  if (check.type !== 'ok') {
    const proceed = await showCheckoutModal(check);
    if (!proceed) return;
  }

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
    // SEC-015: Guard against Airwallex CDN load failure
    if (typeof Airwallex === 'undefined') {
      showResult('error', i18n[currentLang].errGeneric);
      setPayLoading(false);
      btnPay.style.display = '';
      console.error('[upgrade] Airwallex SDK not loaded — check CDN');
      return;
    }
    await Airwallex.init({
      env: 'prod',
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
// 訂閱狀態載入 & Pre-checkout 驗證
// ─────────────────────────────────────────
const TIER_RANK  = { free: 0, ace_plus: 1, ace_pro: 2 };
const TIER_NAMES = {
  'zh-HK': { free: '免費版',  ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
  'zh-CN': { free: '免费版',  ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
  'en-US': { free: 'Free',    ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
};
// subscriptionSource values: 'google_play' | 'app_store' | 'web' | 'redemption'
const IAP_SOURCES = new Set(['google_play', 'app_store', 'iap']); // 'iap' kept as fallback
const REDEEM_WARN_THRESHOLD = 1; // days ≤ this → skip warning for redeemed tiers

function getTierName(tier, lang) {
  return (TIER_NAMES[lang] || TIER_NAMES['en-US'])[tier] || tier;
}

function formatDate(date, lang) {
  if (!date) return '';
  const locale = lang === 'zh-CN' ? 'zh-CN' : lang === 'zh-HK' ? 'zh-HK' : 'en-US';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadUserSubData(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) { currentSubData = null; updateSubStatusBanner(); return; }
    const d = snap.data();
    const tier      = d.subscriptionTier || 'free';
    const expiry    = d.subscriptionExpiry ? d.subscriptionExpiry.toDate() : null;
    const source    = d.subscriptionSource || null;
    const productId = d.subscription?.productId || null;
    const isActive  = !!expiry && expiry > new Date() && tier !== 'free';
    // isYearly: explicit productId (IAP) or remaining days > 31 (web/redemption proxy)
    const remainingNow = expiry ? Math.ceil((expiry - new Date()) / 86400000) : 0;
    const isYearly  = productId?.includes('yearly') || remainingNow > 31;
    currentSubData  = { tier, expiry, source, productId, isActive, isYearly };
  } catch (e) {
    console.error('[upgrade] loadUserSubData error:', e);
    currentSubData = null;
  }
  updateSubStatusBanner();
}

function updateSubStatusBanner() {
  if (!subStatusEl) return;
  if (!currentSubData || !currentSubData.isActive) {
    subStatusEl.style.display = 'none';
    return;
  }
  const { tier, expiry, source } = currentSubData;
  const tierName  = getTierName(tier, currentLang);
  const expiryStr = formatDate(expiry, currentLang);
  const srcLabel  = {
    'zh-HK': source === 'iap' ? '(App Store / Play Store)' : '(網頁付款)',
    'zh-CN': source === 'iap' ? '(App Store / Play Store)' : '(网页付款)',
    'en-US': source === 'iap' ? '(App Store / Play Store)' : '(Web)',
  }[currentLang] || '';
  const labels = {
    'zh-HK': { cur: '目前方案', exp: '到期日' },
    'zh-CN': { cur: '当前方案', exp: '到期日' },
    'en-US': { cur: 'Current plan', exp: 'Expires' },
  }[currentLang];
  subStatusEl.style.display = 'flex';
  subStatusEl.innerHTML =
    `<span class="sub-status-icon">ℹ️</span>` +
    `<span>${labels.cur}: <strong>${tierName}</strong> ${srcLabel}&nbsp;·&nbsp;${labels.exp}: <strong>${expiryStr}</strong></span>`;
}

function checkPreCheckout(plan) {
  const { tier: buyTier, days } = plan;
  const now       = new Date();
  const newExpiry = new Date(now.getTime() + days * 86400000);

  if (!currentSubData || !currentSubData.isActive || currentSubData.tier === 'free') {
    return { type: 'ok', newExpiry };
  }

  const { tier: curTier, expiry: curExpiry, source } = currentSubData;
  const curRank      = TIER_RANK[curTier] ?? 0;
  const buyRank      = TIER_RANK[buyTier] ?? 0;
  const remainingDays = curExpiry ? Math.max(0, Math.ceil((curExpiry - now) / 86400000)) : 0;

  // ── BLOCK: downgrade while active ──
  if (buyRank < curRank) {
    return { type: 'block', newExpiry, curTier, buyTier, remainingDays, source };
  }
  // ── BLOCK: yearly ace_plus → ace_pro upgrade (contact CS for proration) ──
  if (curTier === 'ace_plus' && buyRank > curRank && currentSubData.isYearly && remainingDays > 1) {
    return { type: 'block_yearly_upgrade', newExpiry, curTier, buyTier, remainingDays, source };
  }
  // ── BLOCK: active IAP subscription — must cancel App sub first ──
  if (IAP_SOURCES.has(source)) {
    return { type: 'block_iap', newExpiry, curTier, buyTier, remainingDays, source };
  }
  // ── REDEMPTION: free tier from redeem code ──
  if (source === 'redemption') {
    // ≤7 days left → almost expired, just let them buy silently
    if (remainingDays <= REDEEM_WARN_THRESHOLD) return { type: 'ok', newExpiry };
    // >7 days left → gentle heads-up (free days will be replaced)
    return { type: 'warn_redeem', newExpiry, curTier, buyTier, remainingDays, source };
  }
  // ── WARN: active web subscription (days won't carry over) ──
  if (remainingDays > 0) {
    return { type: 'warn_web', newExpiry, curTier, buyTier, remainingDays, source };
  }
  return { type: 'ok', newExpiry };
}

function buildModalContent(result, lang) {
  const { type, curTier, buyTier, remainingDays, newExpiry } = result;
  const curName     = getTierName(curTier, lang);
  const buyName     = getTierName(buyTier, lang);
  const newExpiryStr = formatDate(newExpiry, lang);
  const curExpiryStr = formatDate(currentSubData?.expiry, lang);
  const isUpgrade   = (TIER_RANK[buyTier] ?? 0) > (TIER_RANK[curTier] ?? 0);

  const newExpiryLabel = {
    'zh-HK': `新到期日：${newExpiryStr}`,
    'zh-CN': `新到期日：${newExpiryStr}`,
    'en-US': `New expiry: ${newExpiryStr}`,
  }[lang];
  const remainingLabel = {
    'zh-HK': `剩餘 ${remainingDays} 天`,
    'zh-CN': `剩余 ${remainingDays} 天`,
    'en-US': `${remainingDays} days remaining`,
  }[lang];

  if (type === 'block') {
    return {
      icon: '🚫',
      title: { 'zh-HK': '無法完成購買', 'zh-CN': '无法完成购买', 'en-US': 'Cannot Proceed' }[lang],
      body: {
        'zh-HK': `<p>你目前訂閱了較高階的 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>無法降級購買 <strong>${buyName}</strong>，請等現有訂閱到期後再購買。</p>`,
        'zh-CN': `<p>你当前订阅了较高阶的 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>无法降级购买 <strong>${buyName}</strong>，请等当前订阅到期后再购买。</p>`,
        'en-US': `<p>You have an active <strong>${curName}</strong> subscription (expires: ${curExpiryStr}, ${remainingLabel}).</p><p>Purchasing <strong>${buyName}</strong> is not allowed as it is a lower tier. Please wait until your current subscription expires.</p>`,
      }[lang],
      expiryText: null,
      canProceed: false,
    };
  }

  if (type === 'block_yearly_upgrade') {
    const body = {
      'zh-HK': `<p>你目前持有<strong>年費 ${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>年費方案無法直接升級至 <strong>${buyName}</strong>，請聯絡客服協助處理（可按比例折算剩餘價值）。</p><p>📧 <a href="mailto:support@acespeller.com">support@acespeller.com</a></p>`,
      'zh-CN': `<p>你当前持有<strong>年费 ${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>年费方案无法直接升级至 <strong>${buyName}</strong>，请联系客服协助处理（可按比例折算剩余价值）。</p><p>📧 <a href="mailto:support@acespeller.com">support@acespeller.com</a></p>`,
      'en-US': `<p>You have an active <strong>yearly ${curName}</strong> subscription (expires: ${curExpiryStr}, ${remainingLabel}).</p><p>Yearly plans cannot be upgraded directly to <strong>${buyName}</strong>. Please contact support for assistance (remaining value can be prorated).</p><p>📧 <a href="mailto:support@acespeller.com">support@acespeller.com</a></p>`,
    }[lang];
    return {
      icon: '🚫',
      title: { 'zh-HK': '請聯絡客服升級', 'zh-CN': '请联系客服升级', 'en-US': 'Contact Support to Upgrade' }[lang],
      body,
      expiryText: null,
      canProceed: false,
    };
  }

  if (type === 'block_iap') {
    const body = {
      'zh-HK': `<p>你已透過 App Store / Play Store 訂閱 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>為避免重複付費，請先在 <strong>App Store / Play Store 取消現有訂閱</strong>，等到期後再於此頁購買。</p>`,
      'zh-CN': `<p>你已通过 App Store / Play Store 订阅 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>为避免重复付费，请先在 <strong>App Store / Play Store 取消现有订阅</strong>，等到期后再于此页购买。</p>`,
      'en-US': `<p>You have an active <strong>${curName}</strong> subscription via App Store / Play Store (expires: ${curExpiryStr}, ${remainingLabel}).</p><p>To avoid double billing, please <strong>cancel your App Store / Play Store subscription first</strong>, then return here after it expires to purchase.</p>`,
    }[lang];
    return {
      icon: '🚫',
      title: { 'zh-HK': '無法完成購買', 'zh-CN': '无法完成购买', 'en-US': 'Cannot Proceed' }[lang],
      body,
      expiryText: null,
      canProceed: false,
    };
  }

  if (type === 'warn_web') {
    const body = {
      'zh-HK': isUpgrade
        ? `<p>你將從 <strong>${curName}</strong> 升級至 <strong>${buyName}</strong>（現有到期日：${curExpiryStr}，${remainingLabel}）。</p><p>升級後到期日從今天起重新計算，<strong>現有剩餘天數不會累加</strong>到新方案。</p>`
        : `<p>你已有 <strong>${curName}</strong> 訂閱（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>購買後到期日從今天起重新計算，<strong>現有剩餘天數不會累加</strong>。建議等到期後再續訂。</p>`,
      'zh-CN': isUpgrade
        ? `<p>你将从 <strong>${curName}</strong> 升级至 <strong>${buyName}</strong>（当前到期日：${curExpiryStr}，${remainingLabel}）。</p><p>升级后到期日从今天起重新计算，<strong>现有剩余天数不会累加</strong>到新方案。</p>`
        : `<p>你已有 <strong>${curName}</strong> 订阅（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>购买后到期日从今天起重新计算，<strong>现有剩余天数不会累加</strong>。建议等到期后再续订。</p>`,
      'en-US': isUpgrade
        ? `<p>You are upgrading from <strong>${curName}</strong> to <strong>${buyName}</strong> (current expiry: ${curExpiryStr}, ${remainingLabel}).</p><p>The new expiry will be calculated from today. <strong>Remaining days will not carry over</strong> to the new plan.</p>`
        : `<p>You have an active <strong>${curName}</strong> subscription (expires: ${curExpiryStr}, ${remainingLabel}).</p><p>The new expiry will be recalculated from today. <strong>Remaining days will not carry over.</strong> We recommend waiting until your subscription expires before renewing.</p>`,
    }[lang];
    return {
      icon: '⚠️',
      title: { 'zh-HK': '購買前請注意', 'zh-CN': '购买前请注意', 'en-US': 'Please Note' }[lang],
      body,
      expiryText: newExpiryLabel,
      canProceed: true,
    };
  }

  if (type === 'warn_redeem') {
    const body = {
      'zh-HK': `<p>你目前持有以兌換碼獲得的 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>購買後到期日從今天起重新計算，免費兌換的剩餘天數不會累加。</p>`,
      'zh-CN': `<p>你当前持有以兑换码获得的 <strong>${curName}</strong>（到期日：${curExpiryStr}，${remainingLabel}）。</p><p>购买后到期日从今天起重新计算，免费兑换的剩余天数不会累加。</p>`,
      'en-US': `<p>You have a <strong>${curName}</strong> subscription from a redeemed code (expires: ${curExpiryStr}, ${remainingLabel}).</p><p>The new expiry will be calculated from today. The remaining free days will not carry over.</p>`,
    }[lang];
    return {
      icon: 'ℹ️',
      title: { 'zh-HK': '即將購買付費方案', 'zh-CN': '即将购买付费方案', 'en-US': 'Switching to Paid Plan' }[lang],
      body,
      expiryText: newExpiryLabel,
      canProceed: true,
    };
  }

  return { icon: 'ℹ️', title: '', body: '', expiryText: null, canProceed: true };
}

function showCheckoutModal(result) {
  return new Promise((resolve) => {
    const c = buildModalContent(result, currentLang);
    document.getElementById('modal-icon').textContent  = c.icon;
    document.getElementById('modal-title').textContent = c.title;
    document.getElementById('modal-body').innerHTML    = c.body;

    const expiryEl = document.getElementById('modal-expiry');
    if (c.expiryText) {
      expiryEl.textContent  = c.expiryText;
      expiryEl.style.display = 'block';
    } else {
      expiryEl.style.display = 'none';
    }

    const proceedBtn = document.getElementById('modal-proceed-btn');
    const cancelBtn  = document.getElementById('modal-cancel-btn');

    const close = (val) => { checkoutModal.style.display = 'none'; resolve(val); };

    if (c.canProceed) {
      proceedBtn.style.display = '';
      proceedBtn.onclick = () => close(true);
    } else {
      proceedBtn.style.display = 'none';
    }
    cancelBtn.onclick = () => close(false);

    checkoutModal.style.display = 'flex';
  });
}

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
