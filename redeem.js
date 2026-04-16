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
  runTransaction,
  increment,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js';

// ─────────────────────────────────────────
// Firebase 初始化
// ─────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// SEC-005 Stage 1: Firebase App Check (reCAPTCHA v3)
// ⚠️ 在 Firebase Console → App Check → Web 取得 reCAPTCHA v3 Site Key 後填入
// 步驟：Firebase Console → App Check → 新增應用程式 → Web → 選 reCAPTCHA v3 → 貼入 Site Key
const RECAPTCHA_V3_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
if (RECAPTCHA_V3_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

const auth = getAuth(app);
const db = getFirestore(app);

// Apple OAuth Provider
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// ─────────────────────────────────────────
// 多語系字串
// ─────────────────────────────────────────
const i18n = {
  'zh-HK': {
    pageTitle: '兌換碼',
    pageSubtitle: '登入後輸入兌換碼，即可升級帳號或獲得 AceCoins。',
    signinBtn: '以 Google 帳號登入',
    appleSigninBtn: '以 Apple ID 登入',
    signinOr: '或',
    signoutBtn: '登出',
    inputPlaceholder: '輸入兌換碼',
    submitBtn: '立即兌換',
    submitting: '兌換中...',
    successTier: (tier, days) => `🎉 兌換成功！您的帳號已升級為 ${tier}，有效期 ${days} 天。重開 AceSpeller App 即可生效。`,
    successCoins: (coins) => `🎉 兌換成功！獲得 ${coins} 🪙 AceCoins，請重開 App 查看最新餘額。`,
    errNotFound: '無效的兌換碼，請確認後再試。',
    errExpired: '此兌換碼已過期。',
    errLimitReached: '此兌換碼已達使用上限。',
    errAlreadyRedeemed: '你已兌換過此序號了。',
    errDowngrade: '此兌換碼的等級低於您目前的方案，無法兌換。',
    errSchoolMismatch: '此兌換碼屬於另一所學校，無法使用。',
    errGeneric: '兌換失敗，請稍後再試。',
    errLoginRequired: '請先登入才能兌換。',
    errEmptyCode: '請輸入兌換碼。',
    tierNames: { ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
    // PTA 同意書
    ptaConsentTitle: '學校資料共享同意書',
    ptaConsentBody: (school) => `此兌換碼由 <strong>${school}</strong> 家長教師會（PTA）提供。兌換後，您的以下資料將提供予 ${school} 及其 PTA 作教學分析用途：`,
    ptaConsentItems: ['帳號登入活躍度（登入次數及最後登入日期）', '默書練習次數', '訂閱狀態及有效期'],
    ptaConsentNote: '上述資料僅供 PTA 評估學習進度之用，不會對外分享或用於商業目的。',
    ptaConsentCheckbox: '本人已閱讀上述說明，並同意提供相關資料予學校及 PTA。',
    ptaConsentAgree: '同意並繼續',
    ptaConsentCancel: '取消',
  },
  'zh-CN': {
    pageTitle: '兑换码',
    pageSubtitle: '登录后输入兑换码，即可升级账号或获得 AceCoins。',
    signinBtn: '以 Google 账号登录',
    appleSigninBtn: '以 Apple ID 登录',
    signinOr: '或',
    signoutBtn: '登出',
    inputPlaceholder: '输入兑换码',
    submitBtn: '立即兑换',
    submitting: '兑换中...',
    successTier: (tier, days) => `🎉 兑换成功！您的账号已升级为 ${tier}，有效期 ${days} 天。重启 AceSpeller App 即可生效。`,
    successCoins: (coins) => `🎉 兑换成功！获得 ${coins} 🪙 AceCoins，请重启 App 查看最新余额。`,
    errNotFound: '无效的兑换码，请确认后再试。',
    errExpired: '此兑换码已过期。',
    errLimitReached: '此兑换码已达使用上限。',
    errAlreadyRedeemed: '你已兑换过此序号了。',
    errDowngrade: '此兑换码的等级低于您目前的方案，无法兑换。',
    errSchoolMismatch: '此兑换码属于另一所学校，无法使用。',
    errGeneric: '兑换失败，请稍后再试。',
    errLoginRequired: '请先登录才能兑换。',
    errEmptyCode: '请输入兑换码。',
    tierNames: { ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
    ptaConsentTitle: '学校资料共享同意书',
    ptaConsentBody: (school) => `此兑换码由 <strong>${school}</strong> 家长教师会（PTA）提供。兑换后，您的以下资料将提供予 ${school} 及其 PTA 作教学分析用途：`,
    ptaConsentItems: ['账号登录活跃度（登录次数及最后登录日期）', '默书练习次数', '订阅状态及有效期'],
    ptaConsentNote: '上述资料仅供 PTA 评估学习进度之用，不会对外分享或用于商业目的。',
    ptaConsentCheckbox: '本人已阅读上述说明，并同意提供相关资料予学校及 PTA。',
    ptaConsentAgree: '同意并继续',
    ptaConsentCancel: '取消',
  },
  'en-US': {
    pageTitle: 'Redeem Code',
    pageSubtitle: 'Sign in to redeem your code and upgrade your account or earn AceCoins.',
    signinBtn: 'Sign in with Google',
    appleSigninBtn: 'Sign in with Apple',
    signinOr: 'or',
    signoutBtn: 'Sign out',
    inputPlaceholder: 'Enter redeem code',
    submitBtn: 'Redeem',
    submitting: 'Redeeming...',
    successTier: (tier, days) => `🎉 Success! Your account has been upgraded to ${tier} for ${days} days. Reopen AceSpeller to apply.`,
    successCoins: (coins) => `🎉 Success! You earned ${coins} 🪙 AceCoins. Reopen the app to see your balance.`,
    errNotFound: 'Invalid code. Please check and try again.',
    errExpired: 'This code has expired.',
    errLimitReached: 'This code has reached its usage limit.',
    errAlreadyRedeemed: 'You have already redeemed this code.',
    errDowngrade: 'This code is a lower tier than your current plan.',
    errSchoolMismatch: 'This code belongs to a different school.',
    errGeneric: 'Redemption failed. Please try again later.',
    errLoginRequired: 'Please sign in before redeeming.',
    errEmptyCode: 'Please enter a code.',
    tierNames: { ace_plus: 'Ace Plus 💎', ace_pro: 'Ace Pro 👑' },
    ptaConsentTitle: 'School Data Sharing Consent',
    ptaConsentBody: (school) => `This code is provided by <strong>${school}</strong> PTA. After redemption, the following data will be shared with ${school} and its PTA for educational analytics:`,
    ptaConsentItems: ['Login activity (login count and last active date)', 'Number of dictation sessions', 'Subscription status and expiry'],
    ptaConsentNote: 'The above data is used solely for PTA learning progress assessment and will not be shared externally or used for commercial purposes.',
    ptaConsentCheckbox: 'I have read the above and consent to sharing my data with the school and PTA.',
    ptaConsentAgree: 'Agree & Continue',
    ptaConsentCancel: 'Cancel',
  },
};

// ─────────────────────────────────────────
// 狀態
// ─────────────────────────────────────────
let currentLang = 'zh-HK';
let currentUser = null;

// ─────────────────────────────────────────
// DOM 取得
// ─────────────────────────────────────────
const sectionSignin = document.getElementById('section-signin');
const sectionRedeem = document.getElementById('section-redeem');
const btnGoogleSignin = document.getElementById('btn-google-signin');
const btnGoogleText = document.getElementById('btn-google-text');
const btnAppleSignin = document.getElementById('btn-apple-signin');
const btnAppleText = document.getElementById('btn-apple-text');
const signinOrText = document.getElementById('signin-or');
const btnSignout = document.getElementById('btn-signout');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const codeInput = document.getElementById('code-input');
const redeemForm = document.getElementById('redeem-form');
const resultBanner = document.getElementById('result-banner');
const btnSubmit = document.getElementById('btn-submit');
const btnSubmitText = document.getElementById('btn-submit-text');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const langBtns = document.querySelectorAll('.lang-btn');

// ─────────────────────────────────────────
// 語言切換
// ─────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  const t = i18n[lang];
  pageTitle.textContent = t.pageTitle;
  pageSubtitle.innerHTML = t.pageSubtitle;
  btnGoogleText.textContent = t.signinBtn;
  btnAppleText.textContent = t.appleSigninBtn;
  signinOrText.textContent = t.signinOr;
  btnSignout.textContent = t.signoutBtn;
  codeInput.placeholder = t.inputPlaceholder;
  btnSubmitText.textContent = t.submitBtn;
  document.documentElement.lang = lang;
  langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  hideResult();
}

langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

// ─────────────────────────────────────────
// Auth 狀態監聽
// ─────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    sectionSignin.style.display = 'none';
    sectionRedeem.style.display = 'block';
    userAvatar.src = user.photoURL || '';
    userAvatar.alt = user.displayName || '';
    userName.textContent = user.displayName || user.email || user.uid;
  } else {
    sectionSignin.style.display = 'block';
    sectionRedeem.style.display = 'none';
  }
  hideResult();
});

// ─────────────────────────────────────────
// Google 登入 / 登出
// ─────────────────────────────────────────
btnGoogleSignin.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    console.error('Google sign-in error:', e);
  }
});

btnAppleSignin.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, appleProvider);
  } catch (e) {
    // 用戶手動取消不需要顯示錯誤
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
      console.error('Apple sign-in error:', e);
    }
  }
});

btnSignout.addEventListener('click', () => signOut(auth));

// ─────────────────────────────────────────
// 兌換碼邏輯
// ─────────────────────────────────────────

/** 訂閱方案兌換碼（無 coins 欄位）— 對應 RedemptionService.dart */
async function redeemSubscriptionCode(userId, codeId) {
  const tierValue = { free: 0, ace_plus: 1, ace_pro: 2 };
  const codeRef = doc(db, 'redeem_codes', codeId);
  const userRef = doc(db, 'users', userId);

  return await runTransaction(db, async (tx) => {
    const codeSnap = await tx.get(codeRef);
    if (!codeSnap.exists()) return { result: 'not_found' };

    const data = codeSnap.data();
    if (!data.active) return { result: 'not_found' };

    if (data.expiryDate && data.expiryDate.toDate() < new Date()) return { result: 'expired' };
    const maxUses = data.maxUses ?? 0;
    const usedCount = data.usedCount ?? 0;
    if (maxUses > 0 && usedCount >= maxUses) return { result: 'limit_reached' };
    if ((data.redeemedBy ?? []).includes(userId)) return { result: 'already_redeemed' };

    const tier = data.tier ?? 'ace_plus';
    const durationDays = data.durationDays ?? 30;
    const codeSchool = data.school ?? null;
    const codeBatchYear = data.batchYear ?? null;

    // 防降級 + 學校綁定檢查
    const userSnap = await tx.get(userRef);
    if (userSnap.exists()) {
      const ud = userSnap.data();
      const currentExpiry = ud.subscriptionExpiry?.toDate?.();
      const isExpired = !currentExpiry || new Date() > currentExpiry;
      if (!isExpired) {
        const currentVal = tierValue[ud.subscriptionTier] ?? 0;
        const codeVal = tierValue[tier] ?? 0;
        if (codeVal < currentVal) return { result: 'downgrade' };
      }
      // PTA: 學校綁定保護
      if (codeSchool && ud.schoolInfo?.school && ud.schoolInfo.school !== codeSchool) {
        return { result: 'school_mismatch' };
      }
    }

    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + durationDays);

    // 用戶資料更新
    const userUpdate = {
      subscriptionTier: tier,
      subscriptionSource: 'redemption',
      subscriptionExpiry: newExpiry,
      redemptionCodeUsed: codeId,
      lastUpdated: serverTimestamp(),
    };
    // PTA: 寫入 schoolInfo + ptaConsentAt
    if (codeSchool) {
      userUpdate.schoolInfo = { school: codeSchool, ...(codeBatchYear ? { batchYear: codeBatchYear } : {}) };
      userUpdate.ptaConsentAt = serverTimestamp();
    }

    tx.set(userRef, userUpdate, { merge: true });

    // 碼更新：usedCount + redeemedBy + redemptionTimestamps
    const codeUpdate = {
      usedCount: increment(1),
      redeemedBy: arrayUnion(userId),
      [`redemptionTimestamps.${userId}`]: serverTimestamp(),
    };
    tx.update(codeRef, codeUpdate);

    return { result: 'success', tier, durationDays };
  });
}

/** AceCoins 兌換碼（有 coins 欄位）— 對應 GamificationService.claimRedeemCode() */
async function claimCoinsCode(userId, codeId) {
  const codeRef = doc(db, 'redeem_codes', codeId);
  const statsRef = doc(db, 'users', userId, 'stats', 'general');

  let coinsEarned = 0;

  await runTransaction(db, async (tx) => {
    const codeDoc = await tx.get(codeRef);
    if (!codeDoc.exists()) throw new Error('not_found');

    const data = codeDoc.data();
    const expiresAt = data.expiresAt?.toDate?.();
    const maxUses = data.maxUses ?? null;
    const usedCount = data.usedCount ?? 0;
    const redeemedBy = data.redeemedBy ?? [];

    if (expiresAt && expiresAt < new Date()) throw new Error('expired');
    if (maxUses !== null && usedCount >= maxUses) throw new Error('limit_reached');
    if (redeemedBy.includes(userId)) throw new Error('already_claimed');

    coinsEarned = data.coins ?? 0;

    tx.update(codeRef, {
      usedCount: usedCount + 1,
      redeemedBy: [...redeemedBy, userId],
    });

    const statsDoc = await tx.get(statsRef);
    if (statsDoc.exists()) {
      tx.update(statsRef, { aceCoins: increment(coinsEarned) });
    } else {
      tx.set(statsRef, { aceCoins: coinsEarned });
    }
  });

  return coinsEarned;
}

// ─────────────────────────────────────────
// PTA 同意書 Modal
// ─────────────────────────────────────────

/** 動態建立並顯示 PTA 同意書 Modal，返回 Promise<boolean>（true = 同意）*/
function showPtaConsentModal(school) {
  return new Promise((resolve) => {
    const t = i18n[currentLang];

    // 建立 overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;
      display:flex;align-items:center;justify-content:center;padding:16px;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background:#fff;color:#1a1a1a;border-radius:16px;padding:24px;max-width:480px;width:100%;
      box-shadow:0 8px 32px rgba(0,0,0,0.2);max-height:90vh;overflow-y:auto;
    `;

    const itemsHtml = t.ptaConsentItems.map(item => `<li style="margin:4px 0">${item}</li>`).join('');

    modal.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <span style="font-size:24px">🏫</span>
        <strong style="font-size:17px;color: black;">${t.ptaConsentTitle}</strong>
      </div>
      <p style="font-size:14px;margin-bottom:8px;color: black;">${t.ptaConsentBody(school)}</p>
      <ul style="font-size:14px;margin:8px 0 12px 16px;padding:0;color: black;">${itemsHtml}</ul>
      <p style="font-size:13px;color:#666;margin-bottom:16px">${t.ptaConsentNote}</p>
      <label style="display:flex;gap:8px;align-items:flex-start;cursor:pointer;margin-bottom:20px;">
        <input type="checkbox" id="pta-consent-checkbox" style="margin-top:3px;flex-shrink:0">
        <span style="color: black;font-size:13px">${t.ptaConsentCheckbox}</span>
      </label>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button id="pta-cancel-btn" style="color: black;padding:8px 16px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#333;cursor:pointer;font-size:14px">
          ${t.ptaConsentCancel}
        </button>
        <button id="pta-agree-btn" disabled style="padding:8px 20px;border:none;border-radius:8px;background:#3B82F6;color:#fff;cursor:pointer;font-size:14px;opacity:0.5">
          ${t.ptaConsentAgree}
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const checkbox = modal.querySelector('#pta-consent-checkbox');
    const agreeBtn = modal.querySelector('#pta-agree-btn');
    const cancelBtn = modal.querySelector('#pta-cancel-btn');

    checkbox.addEventListener('change', () => {
      agreeBtn.disabled = !checkbox.checked;
      agreeBtn.style.opacity = checkbox.checked ? '1' : '0.5';
    });
    agreeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(true);
    });
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(false);
    });
  });
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

function setLoading(loading) {
  btnSubmit.disabled = loading;
  btnSubmitText.innerHTML = loading
    ? `<span class="spinner"></span>${i18n[currentLang].submitting}`
    : i18n[currentLang].submitBtn;
}

// ─────────────────────────────────────────
// 表單提交
// ─────────────────────────────────────────
redeemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideResult();

  const t = i18n[currentLang];

  if (!currentUser) { showResult('error', t.errLoginRequired); return; }

  const rawCode = codeInput.value.trim().toUpperCase();
  if (!rawCode) { showResult('error', t.errEmptyCode); return; }

  setLoading(true);

  try {
    // 先讀一次 code doc 判斷類型（有無 coins 欄位）
    const codeSnap = await getDoc(doc(db, 'redeem_codes', rawCode));

    if (!codeSnap.exists()) {
      showResult('error', t.errNotFound);
      return;
    }

    const codeData = codeSnap.data();
    const isCoinsCode = codeData.coins !== undefined;

    if (isCoinsCode) {
      // AceCoins 兌換碼
      const coins = await claimCoinsCode(currentUser.uid, rawCode);
      showResult('success', t.successCoins(coins));
      codeInput.value = '';
    } else {
      // PTA 學校合約：若碼含 school 欄位，先顯示資料共享同意書
      const codeSchool = codeData.school;
      if (codeSchool) {
        setLoading(false);
        const consented = await showPtaConsentModal(codeSchool);
        if (!consented) return; // 用戶取消，不繼續兌換
        setLoading(true);
      }

      // 訂閱方案兌換碼
      const res = await redeemSubscriptionCode(currentUser.uid, rawCode);
      switch (res.result) {
        case 'success': {
          const tierName = t.tierNames[res.tier] ?? res.tier;
          showResult('success', t.successTier(tierName, res.durationDays));
          codeInput.value = '';
          break;
        }
        case 'not_found': showResult('error', t.errNotFound); break;
        case 'expired': showResult('error', t.errExpired); break;
        case 'limit_reached': showResult('error', t.errLimitReached); break;
        case 'already_redeemed': showResult('error', t.errAlreadyRedeemed); break;
        case 'downgrade': showResult('error', t.errDowngrade); break;
        case 'school_mismatch': showResult('error', t.errSchoolMismatch); break;
        default: showResult('error', t.errGeneric);
      }
    }
  } catch (err) {
    console.error('Redeem error:', err);
    const msg = err.message;
    const t = i18n[currentLang];
    if (msg === 'not_found') showResult('error', t.errNotFound);
    else if (msg === 'expired') showResult('error', t.errExpired);
    else if (msg === 'limit_reached') showResult('error', t.errLimitReached);
    else if (msg === 'already_claimed') showResult('error', t.errAlreadyRedeemed);
    else showResult('error', t.errGeneric);
  } finally {
    setLoading(false);
  }
});

// 初始化語言
applyLang(currentLang);
