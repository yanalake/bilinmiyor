# Zaman Makinesi

> *Kelimelerden üretilen bir protesto gösterisi.*
> Tüm dünya türkülerine adanmıştır. — **E42TT**

Edebi bir fanzin–web projesi. Dört sayfalı, statik, build adımı yok. GitHub Pages'e doğrudan açılır.

---

## Yapı

```
.
├── index.html         BAŞLANGIÇ — manifesto + son yazılar + replikler
├── yazilar.html       YAZILAR   — tüm yazılar listesi, etiket filtresi
├── yazi.html          (tek yazı görüntüleyici, ?slug=... ile çalışır)
├── music.html         FREKANS   — canlı yayın + ses modülleri
├── makine.html        MAKİNE    — sintezatör atölyesi
├── sinema.html        SİNEMA    — zaman çizelgesi + makale arşivi
├── video.html         KAYITLAR  — featured + dikey reel grid
│
├── styles.css         Tüm sayfaların paylaştığı stil sistemi
├── script.js          Kalıcı müzik, modal, nav durumu
├── replikler.js       index.html'e özel veri havuzu
│
├── yazilar.json       Blog manifesti (yazı meta listesi)
├── yazilar/           Markdown yazılar klasörü
│   └── *.md
├── YAZARKEN.md        Yazı eklemek için rehber
│
├── arkaplan.png       Arkaplan görseli
├── 107142-...mp4      sinema.html arkaplan videosu
└── delosound-...mp3   Arka plan müziği
```

## Mimari kararlar

**Multi-page, ortak çekirdek.** URL'ler stabil, her sayfa bağımsız çalışır. CSS ve JS ortak `styles.css` + `script.js` üzerinden gelir; bir kez değiştirir, dört yerde görür.

**Sinematik geçişler.** `@view-transition: navigation: auto` ile sayfalar arası crossfade + ince blur. Destekleyen tarayıcılarda (Chrome 126+, Safari 18+) film makarası gibi geçer; eski tarayıcılarda sessizce yok sayılır.

**Kalıcı müzik.** Müzik durumu `localStorage`'de saklanır (`zaman-makinesi-audio` key'i). Sayfa değişiminde:
1. Eski sayfa `beforeunload`'da pozisyonu kaydeder.
2. Yeni sayfa `restoreAudio()` ile aynı pozisyondan + geçen süre kadar ileri sarar.
3. Tarayıcı autoplay engellerse `playing: false` durumuna döner; kullanıcı tıklamasını bekler.

Volume fade in/out 350-500 ms, kesintiyi yumuşatır.

**Modal sistemi.** `window.zmOpenModal({ title, meta, html })` global fonksiyonu. Sinema makaleleri bunu kullanır; başka sayfalar da kullanabilir.

## Erişilebilirlik

- Skip link (`#main`'e atlar)
- Tüm interaktif elementler `<button>` veya semantic tag
- `aria-pressed`, `aria-expanded`, `aria-modal`, `aria-label` doğru yerlerde
- `:focus-visible` ile klavye gezintisi görünür
- `prefers-reduced-motion` desteği — animasyonlar tamamen susar
- ESC modal'ı kapatır, focus modal-body'ye geçer

## SEO

- Her sayfada title, description, canonical
- Open Graph + Twitter Card meta'ları
- `og:image` olarak `arkaplan.png`
- Inline SVG favicon (saat ikonu, altın renk)

## Sayfa-bazlı içerik

**index.html — replik rotasyonu:** `replikler.js`'i düzenle, sayfayı yenile. 8 replik şu an, istenildiği kadar eklenebilir.

**sinema.html — makale arşivi:** `<script>` içindeki `ARTICLES` dizisine yeni obje eklemek yeter. Slug, başlık, özet, meta, HTML içerik.

**video.html — gerçek videolar eklemek:** Placeholder kartların yerine `<iframe src="https://www.youtube.com/embed/VIDEO_ID">` koyup `placeholder` class'ını çıkar.

## Çalıştırma

Yerel olarak:

```bash
python3 -m http.server 8000
# veya
npx serve .
```

GitHub Pages: Settings → Pages → Source: `main` / `(root)`.

## Değişiklik notları

Önceki sürüme göre (özet):

- Dört HTML'in inline CSS'leri tek `styles.css`'e taşındı (~80 satır tekrar silindi)
- `styles.css`, `script.js`, `liste.js` ölü dosyaları gerçek modüllere dönüştürüldü
- music.html'e eksik olan ses anahtarı eklendi
- Müzik artık sayfa değişiminde sıfırlanmıyor
- View Transitions API ile sinematik geçiş
- Sinema timeline 3 → 6 nokta
- Sinema makale kartları artık gerçekten açılıyor (modal sistemi)
- Video sayfası tek-iframe'den featured + 3'lü dikey grid'e
- Tüm meta/SEO/erişilebilirlik standartları
- Hover-only hover effect'leri dokunmatik cihazlarda devre dışı
- Reduced motion ve focus management
