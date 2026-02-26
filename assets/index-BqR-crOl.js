(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(t){if(t.ep)return;t.ep=!0;const e=s(t);fetch(t.href,e)}})();const l={"zh-HK":{title:"AceSpeller 默書100分",nav_features:"特色功能",nav_testimonials:"家長推薦",nav_download:"立即免費下載",hero_title:"讓小朋友愛上默書的終極神器！",hero_desc:"獨家 AI 拍照辨識，一秒匯入學校默書表。<br>支援粵普雙語標準發音，結合遊戲化獎勵機制，讓家長輕鬆退居幕後，孩子主動學習！",btn_ios:"完全免費，下載 iOS 版",btn_android:"下載 Android 版",feat_title:"核心特色功能",feat1_title:"AI 拍照辨識",feat1_desc:"再也不用手動輸入！對著學校派發的默書表拍張照，一秒自動轉換成電子溫習清單。",feat2_title:"粵普雙語發音",feat2_desc:"告別發音不標準的煩惱，提供純正的廣東話與普通話真人發音，家長陪讀零壓力。",feat3_title:"遊戲化獎勵",feat3_desc:"完成默書即可賺取金幣「AceCoins」，在虛擬商店兌換頭像框與稱號，滿滿成就感！",hiw_title:"✨ 超簡單 3 步驟搞定默書",hiw_desc:"不需要手動慢慢打字輸入，AI 小幫手替您節省寶貴時間。",hiw1_title:"拍照掃描",hiw1_desc:"用手機對準學校的默書範圍表拍張照，AI 自動擷取文字。",hiw2_title:"標準發音",hiw2_desc:"系統自動生成粵/普雙語標準發音，家長不需親自朗讀即可開始聽寫。",hiw3_title:"獲得獎勵",hiw3_desc:"孩子邊聽邊寫，完成後賺取虛擬金幣去商店解鎖可愛虛寶！",test_title:"👨‍👩‍👧 聽聽其他家長怎麼說",test1_desc:"「以前每天下班還要幫小朋友念中英文默書，發音又不標準。現在用這個 App，拍照一秒就搞定，我終於可以喘口氣了！」",test1_author:"— 陳媽媽 (全職雙薪家庭)",test2_desc:"「原本兒子很抗拒溫習，但看到裡面可以賺硬幣換扭蛋，現在居然會自己主動拿手機出來練習，太神奇了！」",test2_author:"— 張爸爸 (二年級學生家長)",test3_desc:"「廣東話跟普通話的發音都很準確，還有標音拼音提示，介面很可愛也沒有多餘的廣告，非常推薦！」",test3_author:"— 李太 (小一學生家長)",faq_title:"❓ 常見問題",faq1_q:"這款 App 是免費的嗎？",faq1_a:"是的！核心的拍照辨識與雙語默書功能完全免費提供給所有家長。我們另有進階的 Plus 方案提供雲端同步與無限次數功能。",faq2_q:"支援哪些語言的默書？",faq2_a:"目前完整支持 <strong>中文（提供純正廣東話及普通話發音）</strong> 以及 <strong>英文</strong>，完美對接香港本地小學的學習需求。",faq3_q:"照片辨識的準確率高嗎？",faq3_a:"我們採用頂尖的 AI 雲端文字辨識技術，針對繁體中文與列印字體優化，準確率極高。若是有些微辨識錯誤，家長也可以隨時手動編輯修改喔！",footer_desc:"讓語言學習變成有趣的挑戰。",footer_privacy:"隱私權政策 (Privacy Policy)",footer_terms:"服務條款 (Terms of Service)",footer_contact:"聯絡我們"},"zh-CN":{title:"AceSpeller 听写100分",nav_features:"特色功能",nav_testimonials:"家长推荐",nav_download:"立即免费下载",hero_title:"让小朋友爱上听写的终极神器！",hero_desc:"独家 AI 拍照识别，一秒导入学校听写表。<br>支持粤普双语标准发音，结合游戏化奖励机制，让家长轻松退居幕后，孩子主动学习！",btn_ios:"完全免费，下载 iOS 版",btn_android:"下载 Android 版",feat_title:"核心特色功能",feat1_title:"AI 拍照识别",feat1_desc:"再也不用手动输入！对着学校派发的听写表拍张照，一秒自动转换成电子复习清单。",feat2_title:"粤普双语发音",feat2_desc:"告别发音不标准的烦恼，提供纯正的广东话与普通话真人发音，家长陪读零压力。",feat3_title:"游戏化奖励",feat3_desc:"完成听写即可赚取金币「AceCoins」，在虚拟商店兑换头像框与称号，满满成就感！",hiw_title:"✨ 超简单 3 步骤搞定听写",hiw_desc:"不需要手动慢慢打字输入，AI 小帮手替您节省宝贵时间。",hiw1_title:"拍照扫描",hiw1_desc:"用手机对准学校的听写范围表拍张照，AI 自动截取文字。",hiw2_title:"标准发音",hiw2_desc:"系统自动生成粤/普双语标准发音，家长不需亲自朗读即可开始听写。",hiw3_title:"获得奖励",hiw3_desc:"孩子边听边写，完成后赚取虚拟金币去商店解锁可爱虚宝！",test_title:"👨‍👩‍👧 听听其他家长怎么说",test1_desc:"「以前每天下班还要帮小朋友念中英文听写，发音又不标准。现在用这个 App，拍照一秒就搞定，我终于可以喘口气了！」",test1_author:"— 陈妈妈 (全职双薪家庭)",test2_desc:"「原本儿子很抗拒复习，但看到里面可以赚金币换扭蛋，现在居然会自己主动拿手机出来练习，太神奇了！」",test2_author:"— 张爸爸 (二年级学生家长)",test3_desc:"「广东话跟普通话的发音都很准确，还有拼音提示，界面很可爱也没有多余的广告，非常推荐！」",test3_author:"— 李太 (小一学生家长)",faq_title:"❓ 常见问题",faq1_q:"这款 App 是免费的吗？",faq1_a:"是的！核心的拍照识别与双语听写功能完全免费提供给所有家长。我们另有进阶的 Plus 方案提供云端同步与无限次数功能。",faq2_q:"支持哪些语言的听写？",faq2_a:"目前完整支持 <strong>中文（提供纯正广东话及普通话发音）</strong> 以及 <strong>英文</strong>，完美对接香港及内地小学的学习需求。",faq3_q:"照片识别的准确率高吗？",faq3_a:"我们采用顶尖的 AI 云端文字识别技术，针对繁体中文、简体中文与打印字体优化，准确率极高。若是有些微识别错误，家长也可以随时手动编辑修改哦！",footer_desc:"让语言学习变成有趣的挑战。",footer_privacy:"隐私权政策 (Privacy Policy)",footer_terms:"服务条款 (Terms of Service)",footer_contact:"联系我们"},"en-US":{title:"AceSpeller",nav_features:"Features",nav_testimonials:"Testimonials",nav_download:"Download Free",hero_title:"The Ultimate Dictation App for Kids!",hero_desc:"Exclusive AI photo recognition imports school dictation lists in a second.<br>With standard bilingual pronunciation and gamified rewards, parents can relax while kids learn independently!",btn_ios:"Free Download for iOS",btn_android:"Download for Android",feat_title:"Core Features",feat1_title:"AI Photo Scanner",feat1_desc:"No more manual typing! Snap a photo of the dictation list, and it converts into a digital practice list instantly.",feat2_title:"Bilingual Audio",feat2_desc:"Native Cantonese and Mandarin voiceovers ensure accurate pronunciation. No more stress for non-native parents.",feat3_title:"Gamified Rewards",feat3_desc:'Earn "AceCoins" after completing dictations to exchange for avatar frames and titles. Learning becomes fun!',hiw_title:"✨ 3 Simple Steps",hiw_desc:"Say goodbye to typing. Let our AI assistant save your precious time.",hiw1_title:"Snap a Photo",hiw1_desc:"Use your phone to scan the dictation vocabulary list to extract text automatically.",hiw2_title:"Listen & Write",hiw2_desc:"The system generates standard bilingual pronunciation. Kids can start dictation without parents reading aloud.",hiw3_title:"Earn Rewards",hiw3_desc:"Kids practice while listening, then earn virtual coins to unlock cute treasures in the shop!",test_title:"👨‍👩‍👧 What Parents Say",test1_desc:'"I used to struggle with reading dictation to my kids after work, especially with my accent. This app does it in one snap. I can finally catch a breath!"',test1_author:"— Mrs. Chan (Working Mom)",test2_desc:'"My son hated revising, but after seeing the gacha machines and coins, he actually takes out his phone to practice by himself. Amazing!"',test2_author:"— Mr. Cheung (Parent of Grade 2 Student)",test3_desc:'"The pronunciation is spot on, and the interface is ad-free and cute. Highly recommended!"',test3_author:"— Mrs. Lee (Parent of Grade 1 Student)",faq_title:"❓ FAQ",faq1_q:"Is this app free?",faq1_a:"Yes! The core photo recognition and dictation features are completely free. We also offer a Plus plan for cloud sync and unlimited usage.",faq2_q:"What languages does it support?",faq2_a:"We fully support <strong>Chinese (standard Cantonese and Mandarin)</strong> and <strong>English</strong> vocabularies.",faq3_q:"How accurate is the photo recognition?",faq3_a:"We use cutting-edge AI OCR technology optimized for printed text, making it highly accurate. You can always edit the text manually if needed!",footer_desc:"Making language learning a fun challenge.",footer_privacy:"Privacy Policy",footer_terms:"Terms of Service",footer_contact:"Contact Us"}};let r="zh-HK";function c(){document.querySelector("#app").innerHTML=`
    <!-- Hero Section -->
    <section class="section text-center">
      <div class="container">
        <h1 class="mb-4" data-i18n="hero_title"></h1>
        <p class="mb-8" style="max-width: 600px; margin: 0 auto 2rem auto;" data-i18n="hero_desc">
        </p>
        <div class="flex justify-center gap-4">
          <a href="#" class="btn btn-primary" style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"></path></svg>
            <span data-i18n="btn_ios"></span>
          </a>
          <a href="#" class="btn btn-outline" style="display: flex; align-items: center; gap: 8px;">
             <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"></path></svg>
            <span data-i18n="btn_android"></span>
          </a>
        </div>
        
        <!-- Placeholder for Mockup Image -->
        <div style="margin-top: 60px;">
          <div style="width: 100%; max-width: 800px; padding: 40px; background: linear-gradient(135deg, var(--secondary-light), var(--primary-light)); border-radius: var(--border-radius-lg); margin: 0 auto; box-shadow: var(--shadow-lg); display: flex; align-items: center; justify-content: center;">
            <img src="/images/shop.png" alt="AceSpeller App Preview" style="max-width: 100%; height: auto; border-radius: var(--border-radius-md); transform: rotate(-2deg); box-shadow: var(--shadow-md); transition: transform 0.3s ease;" onmouseover="this.style.transform='rotate(0deg) scale(1.02)'" onmouseout="this.style.transform='rotate(-2deg)'" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="section" style="background-color: white;">
      <div class="container">
        <h2 class="text-center mb-8" data-i18n="feat_title"></h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center;">
            <img src="/images/asset.png" alt="AI Feature" style="width: 120px; height: 120px; object-fit: contain; margin-bottom: 24px; drop-shadow: 0 10px 15px rgba(0,0,0,0.1);" />
            <h3 data-i18n="feat1_title"></h3>
            <p data-i18n="feat1_desc"></p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem; color: var(--secondary-color);">🗣️</div>
            <h3 data-i18n="feat2_title"></h3>
            <p data-i18n="feat2_desc"></p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center;">
            <img src="/images/gacha.png" alt="Gamification Feature" style="width: 120px; height: 120px; object-fit: contain; margin-bottom: 24px; drop-shadow: 0 10px 15px rgba(0,0,0,0.1);" />
            <h3 data-i18n="feat3_title"></h3>
            <p data-i18n="feat3_desc"></p>
          </div>

        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section" style="background-color: var(--bg-color);">
      <div class="container text-center">
        <h2 class="mb-4" data-i18n="hiw_title"></h2>
        <p class="mb-8" data-i18n="hiw_desc"></p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div>
            <div class="step-number">1</div>
            <h3 data-i18n="hiw1_title"></h3>
            <p data-i18n="hiw1_desc"></p>
          </div>
          <div>
            <div class="step-number">2</div>
            <h3 data-i18n="hiw2_title"></h3>
            <p data-i18n="hiw2_desc"></p>
          </div>
          <div>
            <div class="step-number">3</div>
            <h3 data-i18n="hiw3_title"></h3>
            <p data-i18n="hiw3_desc"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="section" style="background-color: white;">
      <div class="container">
        <h2 class="text-center mb-8" data-i18n="test_title"></h2>
        <div class="flex-col gap-8">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            
            <div class="card">
              <div style="color: #FFD700; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
              <p style="font-style: italic;" data-i18n="test1_desc"></p>
              <div style="font-weight: 700; margin-top: 1rem;" data-i18n="test1_author"></div>
            </div>

            <div class="card">
              <div style="color: #FFD700; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
              <p style="font-style: italic;" data-i18n="test2_desc"></p>
              <div style="font-weight: 700; margin-top: 1rem;" data-i18n="test2_author"></div>
            </div>

            <div class="card">
              <div style="color: #FFD700; font-size: 1.5rem; margin-bottom: 1rem;">★★★★★</div>
              <p style="font-style: italic;" data-i18n="test3_desc"></p>
              <div style="font-weight: 700; margin-top: 1rem;" data-i18n="test3_author"></div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section" style="background-color: var(--bg-color);">
      <div class="container" style="max-width: 800px;">
        <h2 class="text-center mb-8" data-i18n="faq_title"></h2>
        
        <details>
          <summary data-i18n="faq1_q"></summary>
          <p style="margin-top: 0.5rem; color: var(--text-muted);" data-i18n="faq1_a"></p>
        </details>
        
        <details>
          <summary data-i18n="faq2_q"></summary>
          <p style="margin-top: 0.5rem; color: var(--text-muted);" data-i18n="faq2_a"></p>
        </details>

        <details>
          <summary data-i18n="faq3_q"></summary>
          <p style="margin-top: 0.5rem; color: var(--text-muted);" data-i18n="faq3_a"></p>
        </details>
      </div>
    </section>
  `}function p(){document.querySelector("#navbar").innerHTML=`
    <div class="container flex justify-between items-center" style="padding: 16px 24px;">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="AceSpeller Logo" style="width: 48px; height: 48px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        <div class="font-bold" style="font-size: 1.5rem; color: var(--primary-dark);" data-i18n="title">
        </div>
      </div>
      <div class="flex gap-4 items-center">
        <select id="langSwitcher" style="padding: 4px; border-radius: 4px; border: 1px solid var(--text-muted); color: var(--text-main);">
          <option value="zh-HK">繁體中文</option>
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
        <a href="#features" data-i18n="nav_features"></a>
        <a href="#testimonials" style="color: var(--text-muted); font-weight: 500;" data-i18n="nav_testimonials"></a>
        <button class="btn btn-primary" style="padding: 8px 16px; font-size: 14px; box-shadow: none;" data-i18n="nav_download"></button>
      </div>
    </div>
  `,document.querySelector("#footer").innerHTML=`
    <div style="background-color: var(--text-main); color: white; padding: 40px 0;">
      <div class="container flex justify-between" style="flex-wrap: wrap;">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="AceSpeller Logo" style="width: 36px; height: 36px; border-radius: 8px;" />
            <h3 style="color: white; margin-bottom: 0;" data-i18n="title"></h3>
          </div>
          <p style="color: var(--text-muted); font-size: 14px;" data-i18n="footer_desc"></p>
        </div>
        <div>
          <div style="display: flex; gap: 24px; margin-top: 16px;">
            <a href="/privacy.html" style="color: var(--text-muted);" data-i18n="footer_privacy"></a>
            <a href="/terms.html" style="color: var(--text-muted);" data-i18n="footer_terms"></a>
            <a href="mailto:support@acespeller.com.hk" style="color: var(--text-muted);" data-i18n="footer_contact"></a>
          </div>
        </div>
      </div>
      <div class="container text-center" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: var(--text-muted); font-size: 14px;">
        &copy; ${new Date().getFullYear()} AceSpeller. All rights reserved.
      </div>
    </div>
  `}function d(i){const a=l[i];a&&(document.documentElement.lang=i,document.querySelectorAll("[data-i18n]").forEach(s=>{const o=s.getAttribute("data-i18n");a[o]&&(s.innerHTML=a[o])}))}function h(){p(),c();const i=document.getElementById("langSwitcher");i.value=r,i.addEventListener("change",a=>{r=a.target.value,d(r)}),d(r)}h();
