import './style.css'
import { translations } from './locales.js';

let currentLang = 'zh-HK';

function renderApp() {
  document.querySelector('#app').innerHTML = `
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
  `;
}

function renderFrame() {
  document.querySelector('#navbar').innerHTML = `
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
  `;

  document.querySelector('#footer').innerHTML = `
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
  `;
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}

function init() {
  renderFrame();
  renderApp();

  const switcher = document.getElementById('langSwitcher');
  switcher.value = currentLang;

  switcher.addEventListener('change', (e) => {
    currentLang = e.target.value;
    applyTranslations(currentLang);
  });

  applyTranslations(currentLang);
}

// Start application
init();

