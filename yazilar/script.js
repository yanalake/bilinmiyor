/* ==========================================================================
   ZAMAN MAKİNESİ — Ortak Script
   - Sayfalar arası kalıcı müzik (localStorage handshake)
   - Ses anahtarı UI bağlama
   - Modal sistemi
   - Aktif nav durumu
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. Kalıcı Müzik — sayfalar arasında kaldığı yerden devam eder
     ---------------------------------------------------------------- */
  const AUDIO_STATE_KEY = 'zaman-makinesi-audio';
  const AUDIO_SRC = 'delosound-mysterious-mystical-ambient-442832.mp3';

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(AUDIO_STATE_KEY) || '{}');
    } catch (e) { return {}; }
  }

  function writeState(state) {
    try {
      localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify(state));
    } catch (e) { /* localStorage blocked, sessizce devam */ }
  }

  // Tek bir audio elementi — DOM'da varsa onu kullan, yoksa oluştur
  let audio = document.getElementById('zm-audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'zm-audio';
    audio.loop = true;
    audio.preload = 'auto';
    audio.src = AUDIO_SRC;
    document.body.appendChild(audio);
  }

  /* Restore: önceki sayfadan kaldığı yerden devam et */
  function restoreAudio() {
    const state = readState();
    if (!state.playing) return;

    // Geçen süreyi hesapla — sayfa geçişi sırasında akan zamanı yakala
    const elapsed = (Date.now() - (state.savedAt || Date.now())) / 1000;
    const targetTime = (state.time || 0) + elapsed;

    // Bekleme: src yüklenene dek seek edemeyiz
    const seek = () => {
      try {
        if (isFinite(audio.duration) && audio.duration > 0) {
          audio.currentTime = targetTime % audio.duration;
        }
      } catch (e) { /* seek başarısız, sıfırdan başlayacak */ }
      audio.play().then(() => {
        updateToggleUI(true);
      }).catch(() => {
        // Autoplay engellendi — kullanıcının tıklaması gerek
        writeState({ playing: false });
        updateToggleUI(false);
      });
    };

    if (audio.readyState >= 2) seek();
    else audio.addEventListener('loadedmetadata', seek, { once: true });
  }

  /* Save: çalarken sürekli pozisyonu kaydet, beforeunload'da da */
  function saveAudio() {
    if (!audio.paused) {
      writeState({
        playing: true,
        time: audio.currentTime,
        savedAt: Date.now()
      });
    }
  }
  setInterval(saveAudio, 1000);
  window.addEventListener('beforeunload', saveAudio);
  window.addEventListener('pagehide', saveAudio);

  /* ----------------------------------------------------------------
     2. Ses Anahtarı UI
     ---------------------------------------------------------------- */
  function updateToggleUI(playing) {
    document.querySelectorAll('.sound-toggle').forEach(btn => {
      btn.classList.toggle('playing', playing);
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      // İkonlu metin: pulse + state
      const label = playing ? 'SESİ KAPAT' : 'SESİ AÇ';
      btn.innerHTML = '<span class="pulse" aria-hidden="true"></span>' + label;
    });
  }

  // Yumuşak fade
  function fadeAudio(toVolume, duration = 400) {
    const start = audio.volume;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      audio.volume = start + (toVolume - start) * t;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function bindToggles() {
    document.querySelectorAll('.sound-toggle').forEach(btn => {
      // İlk render için ARIA hazırlığı
      if (!btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Arka plan müziği');
      }
      btn.setAttribute('type', 'button');

      btn.addEventListener('click', () => {
        if (audio.paused) {
          audio.volume = 0;
          audio.play().then(() => {
            fadeAudio(1, 500);
            updateToggleUI(true);
            writeState({ playing: true, time: audio.currentTime, savedAt: Date.now() });
          }).catch(err => {
            console.warn('Müzik başlatılamadı:', err);
          });
        } else {
          fadeAudio(0, 350);
          setTimeout(() => {
            audio.pause();
            audio.volume = 1;
            updateToggleUI(false);
            writeState({ playing: false });
          }, 360);
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     3. Aktif Nav Durumu (sayfa adına göre)
     ---------------------------------------------------------------- */
  function setActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const current = path === '' || path === '/' ? 'index.html' : path;
    document.querySelectorAll('.nav-item[href]').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current) a.classList.add('active');
    });
  }

  /* ----------------------------------------------------------------
     4. Modal Sistemi
     window.zmOpenModal({ title, meta, html }) ile açılır.
     ---------------------------------------------------------------- */
  let modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'zm-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.innerHTML = `
      <div class="zm-modal-body" tabindex="-1">
        <button class="zm-modal-close" aria-label="Kapat">×</button>
        <div class="zm-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.addEventListener('click', e => {
      if (e.target === modalEl) closeModal();
    });
    modalEl.querySelector('.zm-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalEl.classList.contains('open')) closeModal();
    });
    return modalEl;
  }

  function openModal({ title, meta, html }) {
    const m = ensureModal();
    const content = m.querySelector('.zm-modal-content');
    content.innerHTML = `
      ${meta ? `<span class="zm-modal-meta">${meta}</span>` : ''}
      <h2>${title}</h2>
      ${html}
    `;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => m.querySelector('.zm-modal-body').focus(), 100);
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Global API
  window.zmOpenModal = openModal;
  window.zmCloseModal = closeModal;

  /* ----------------------------------------------------------------
     5. Init
     ---------------------------------------------------------------- */
  function init() {
    bindToggles();
    setActiveNav();
    restoreAudio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
