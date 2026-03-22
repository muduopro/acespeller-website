// Firebase Web 設定
// ⚠️  appId 需要從 Firebase Console 填入：
//    Firebase Console → 專案設定 → 您的應用程式 → 網頁 App → 複製 appId
//    若尚未建立網頁 App：點「新增應用程式」→ 選「網頁 (</>)」→ 取得設定

export const firebaseConfig = {
  apiKey: "AIzaSyByko7MLl_MH3Oy5GFp7iVNnWvqIFvZKFQ",
  authDomain: "muduopro-dictation-659c2.firebaseapp.com",
  projectId: "muduopro-dictation-659c2",
  storageBucket: "muduopro-dictation-659c2.firebasestorage.app",
  messagingSenderId: "1027564395784",
  appId: "1:1027564395784:web:bca1419dac7816243160bd", // ← 已自動填入
};

// Google Sign-In 授權域名設定提醒：
// Firebase Console → Authentication → Settings → 已授權網域
// 需加入：acespeller.com.hk（部署後）、localhost（本地開發）
