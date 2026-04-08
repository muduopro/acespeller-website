import './style.css'
import { translations } from './locales.js';

let currentLang = 'zh-HK';

/* ===================================
   Navbar 渲染 (含漢堡選單)
   =================================== */
function renderFrame() {
  document.querySelector('#navbar').innerHTML = `
    <div class="nav-inner">
      <a class="nav-brand" href="/">
        <img src="/logo.png" alt="AceSpeller Logo" />
        <span class="nav-brand-name" data-i18n="title"></span>
      </a>

      <!-- 桌面右側操作區 -->
      <div class="nav-right">
        <nav class="nav-links">
          <a href="#features" data-i18n="nav_features"></a>
          <!-- <a href="#testimonials" data-i18n="nav_testimonials"></a> 隱藏評價區塊連結 -->
          <a href="/redeem" data-i18n="nav_redeem"></a>
          <!-- <a href="/upgrade" data-i18n="nav_upgrade"></a> 暫時隱藏升級連結（Demo 卡片階段） -->
        </nav>
        <select id="langSwitcher" aria-label="語言切換">
          <option value="zh-HK">繁體中文</option>
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
        <a href="#download" class="nav-cta-btn" data-i18n="nav_download"></a>
      </div>

      <!-- 手機漢堡按鈕 -->
      <button class="hamburger" id="hamburger" aria-label="開啟選單" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobileMenu" role="navigation">
      <a href="#features" data-i18n="nav_features"></a>
      <!-- <a href="#testimonials" data-i18n="nav_testimonials"></a> 隱藏評價區塊連結 -->
      <a href="/redeem" data-i18n="nav_redeem"></a>
      <!-- <a href="/upgrade" data-i18n="nav_upgrade"></a> 暫時隱藏升級連結（Demo 卡片階段） -->
      <div class="mobile-lang-row">
        <span>🌐</span>
        <select id="langSwitcherMobile" aria-label="語言切換">
          <option value="zh-HK">繁體中文</option>
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
      <a href="#download" class="mobile-cta-btn" data-i18n="nav_download"></a>
    </div>
  `;

  document.querySelector('#footer').innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="/logo.png" alt="AceSpeller Logo" />
            <span class="footer-brand-name" data-i18n="title"></span>
          </div>
          <p class="footer-desc" data-i18n="footer_desc"></p>
        </div>
        <div class="footer-links">
          <a href="/privacy" data-i18n="footer_privacy"></a>
          <a href="/terms" data-i18n="footer_terms"></a>
          <a href="mailto:cs@acespeller.com.hk" data-i18n="footer_contact"></a>
        </div>
      </div>
      <div class="footer-copy">
        ©️ 2026 MuduoPro Limited. All rights reserved. AceSpeller and its characters are trademarks of Muduopro, registered in Hong Kong.
      </div>
    </div>
  `;
}

/* ===================================
   主內容渲染
   =================================== */
function renderApp() {
  document.querySelector('#app').innerHTML = `

    <!-- ===== HERO ===== -->
    <section class="hero-section section" aria-label="主頁英雄區">
      <!-- 星星粒子容器 (JS 動態生成) -->
      <div class="star-field" id="starField" aria-hidden="true"></div>

      <div class="container">
        <div class="hero-grid">

          <!-- 左側文字區 -->
          <div class="hero-content">
            <div class="hero-badge">⭐ <span data-i18n="hero_badge"></span></div>
            <h1 class="hero-title" data-i18n="hero_title"></h1>
            <p class="hero-desc" data-i18n="hero_desc"></p>

            <div class="hero-btns">
              <a href="https://apple.co/47kzZUF" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span data-i18n="btn_ios"></span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.muduopro.dictationHelper" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M3.18 23.76c.3.17.64.2.96.1l12.82-7.4-2.82-2.82-10.96 10.12zm-1.06-20.3C2.06 3.73 2 4.01 2 4.32v15.36c0 .31.06.59.12.86l11.37-11.36L2.12 3.46zM20.1 10.24l-2.72-1.57-3.16 3.16 3.16 3.16 2.76-1.59c.79-.45.79-1.71-.04-2.16zM4.14.24c-.32-.1-.67-.07-.96.1L14.45 11.5l2.82-2.82L4.14.24z"/>
                </svg>
                <span data-i18n="btn_android"></span>
              </a>
            </div>

            <!-- 數據指標 (暫時隱藏以保持真實性) -->
            <!--
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">4.9 ★</div>
                <div class="stat-label" data-i18n="stat_rating"></div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label" data-i18n="stat_downloads"></div>
              </div>
              <div class="stat-item">
                <div class="stat-number">🆓</div>
                <div class="stat-label" data-i18n="stat_free"></div>
              </div>
            </div>
            -->
          </div>

          <!-- 右側手機視覺 -->
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-phone-wrapper">
              <div class="hero-phone-glow"></div>
              <img
                src="/images/hero-visual.png"
                class="hero-phone-img"
                alt="AceSpeller App 畫面預覽"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="features-section section" aria-label="特色功能">
      <div class="container">
        <div class="text-center">
          <div class="section-tag">✨ Features</div>
          <h2 data-i18n="feat_title"></h2>
        </div>

        <div class="features-grid">

          <div class="glass-card feature-card reveal">
            <span class="feature-emoji" aria-hidden="true">📸</span>
            <h3 data-i18n="feat1_title"></h3>
            <p data-i18n="feat1_desc"></p>
          </div>

          <div class="glass-card feature-card reveal reveal-delay-1">
            <span class="feature-emoji" aria-hidden="true">🗣️</span>
            <h3 data-i18n="feat2_title"></h3>
            <p data-i18n="feat2_desc"></p>
          </div>

          <div class="glass-card feature-card reveal reveal-delay-2">
            <span class="feature-emoji" aria-hidden="true">🎁</span>
            <h3 data-i18n="feat3_title"></h3>
            <p data-i18n="feat3_desc"></p>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="hiw-section section" aria-label="使用步驟">
      <div class="container text-center">
        <div class="section-tag">🚀 How It Works</div>
        <h2 data-i18n="hiw_title"></h2>
        <p style="max-width:560px; margin: 0 auto 0 auto;" data-i18n="hiw_desc"></p>

        <div class="steps-grid">
          <div class="step-item reveal">
            <div class="step-num">1</div>
            <h3 data-i18n="hiw1_title"></h3>
            <p data-i18n="hiw1_desc"></p>
          </div>
          <div class="step-item reveal reveal-delay-1">
            <div class="step-num">2</div>
            <h3 data-i18n="hiw2_title"></h3>
            <p data-i18n="hiw2_desc"></p>
          </div>
          <div class="step-item reveal reveal-delay-2">
            <div class="step-num">3</div>
            <h3 data-i18n="hiw3_title"></h3>
            <p data-i18n="hiw3_desc"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS (暫時隱藏) ===== -->
    <!--
    <section id="testimonials" class="testimonials-section section" aria-label="用戶評價">
      <div class="container">
        <div class="text-center">
          <div class="section-tag">💬 Reviews</div>
          <h2 data-i18n="test_title"></h2>
        </div>

        <div class="testimonials-grid">

          <div class="glass-card reveal">
            <div class="stars-row" aria-label="五星評價">★★★★★</div>
            <p class="testimonial-text" data-i18n="test1_desc"></p>
            <p class="testimonial-author" data-i18n="test1_author"></p>
          </div>

          <div class="glass-card reveal reveal-delay-1">
            <div class="stars-row" aria-label="五星評價">★★★★★</div>
            <p class="testimonial-text" data-i18n="test2_desc"></p>
            <p class="testimonial-author" data-i18n="test2_author"></p>
          </div>

          <div class="glass-card reveal reveal-delay-2">
            <div class="stars-row" aria-label="五星評價">★★★★★</div>
            <p class="testimonial-text" data-i18n="test3_desc"></p>
            <p class="testimonial-author" data-i18n="test3_author"></p>
          </div>

        </div>
      </div>
    </section>
    -->

    <!-- ===== FAQ ===== -->
    <section class="faq-section section" aria-label="常見問題">
      <div class="container" style="max-width: 780px;">
        <div class="text-center" style="margin-bottom: 40px;">
          <div class="section-tag">❓ FAQ</div>
          <h2 data-i18n="faq_title"></h2>
        </div>

        <details>
          <summary data-i18n="faq1_q"></summary>
          <p data-i18n="faq1_a"></p>
        </details>

        <details>
          <summary data-i18n="faq2_q"></summary>
          <p data-i18n="faq2_a"></p>
        </details>

        <details>
          <summary data-i18n="faq3_q"></summary>
          <p data-i18n="faq3_a"></p>
        </details>
      </div>
    </section>

    <!-- ===== CTA BANNER ===== -->
    <section id="download" class="cta-section section" aria-label="下載呼籲">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="container">
        <span class="cta-emoji" aria-hidden="true">🌟</span>
        <h2 data-i18n="cta_title"></h2>
        <p style="max-width: 520px; margin: 0 auto;" data-i18n="cta_desc"></p>
        <div class="cta-btns">
          <a href="https://apple.co/47kzZUF" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span data-i18n="btn_ios"></span>
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.muduopro.dictationHelper" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M3.18 23.76c.3.17.64.2.96.1l12.82-7.4-2.82-2.82-10.96 10.12zm-1.06-20.3C2.06 3.73 2 4.01 2 4.32v15.36c0 .31.06.59.12.86l11.37-11.36L2.12 3.46zM20.1 10.24l-2.72-1.57-3.16 3.16 3.16 3.16 2.76-1.59c.79-.45.79-1.71-.04-2.16zM4.14.24c-.32-.1-.67-.07-.96.1L14.45 11.5l2.82-2.82L4.14.24z"/>
            </svg>
            <span data-i18n="btn_android"></span>
          </a>
        </div>
      </div>
    </section>
  `;
}

/* ===================================
   星星粒子生成器
   =================================== */
function generateStarField() {
  const field = document.getElementById('starField');
  if (!field) return;

  // 細小閃爍星點
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = Math.random() * 2.5 + 1;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay: ${(Math.random() * 4).toFixed(1)}s;
      --max-op: ${(Math.random() * 0.5 + 0.3).toFixed(2)};
    `;
    field.appendChild(star);
  }

  // 漂浮吉祥物 Emoji
  const emojis = ['⭐', '✨', '🌟', '💫', '⭐', '✨'];
  emojis.forEach((emoji, i) => {
    const el = document.createElement('div');
    el.className = 'float-emoji';
    el.textContent = emoji;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `
      left: ${10 + i * 15}%;
      top: ${15 + (i % 3) * 25}%;
      --size: ${Math.random() * 1 + 1.2}rem;
      --dur: ${(Math.random() * 4 + 5).toFixed(1)}s;
      --delay: ${(i * 0.8).toFixed(1)}s;
    `;
    field.appendChild(el);
  });
}

/* ===================================
   Scroll Reveal (Intersection Observer)
   =================================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ===================================
   漢堡選單互動
   =================================== */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // 點擊選單連結後自動關閉
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===================================
   語言切換器同步
   =================================== */
function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });
}

/* ===================================
   初始化
   =================================== */
function init() {
  renderFrame();
  renderApp();

  // 語言切換器 (桌面)
  const switcher = document.getElementById('langSwitcher');
  if (switcher) {
    switcher.value = currentLang;
    switcher.addEventListener('change', (e) => {
      currentLang = e.target.value;
      const mobileSwitcher = document.getElementById('langSwitcherMobile');
      if (mobileSwitcher) mobileSwitcher.value = currentLang;
      applyTranslations(currentLang);
    });
  }

  // 語言切換器 (手機)
  const mobileSwitcher = document.getElementById('langSwitcherMobile');
  if (mobileSwitcher) {
    mobileSwitcher.value = currentLang;
    mobileSwitcher.addEventListener('change', (e) => {
      currentLang = e.target.value;
      if (switcher) switcher.value = currentLang;
      applyTranslations(currentLang);
    });
  }

  applyTranslations(currentLang);

  // 延遲初始化視覺效果，確保 DOM 就緒
  requestAnimationFrame(() => {
    generateStarField();
    initScrollReveal();
    initHamburger();
  });
}

init();
