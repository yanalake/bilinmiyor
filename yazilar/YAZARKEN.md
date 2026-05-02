# Yazı Eklemek

Bu sistem üç adımla çalışır: dosya, kayıt, push.

## 1. Yazıyı yaz

`yazilar/` klasöründe yeni bir `.md` dosyası oluştur. Dosya adı **slug** olur — URL'de görünür, kalıcıdır, sonradan değiştirme.

İyi bir slug formatı:
```
yazilar/2026-04-zaman-uzerine.md
yazilar/2026-04-cumartesi-notlari.md
yazilar/2026-05-tarkovsky-yagmuru.md
```

`YYYY-AY-konu-anahtari` — sıralama, arşivleme, hatırlama için ideal.

İçinde Markdown yaz. Markdown referansı:

```markdown
# Bu bir h1 (büyük başlık)
## Bu bir h2 (orta başlık)

Normal paragraf. **Kalın**, *italik*, [bağlantı](https://example.com).

> Bu bir alıntı bloğu.
> İtalik ve altın renkte görünür.

- Liste
- Liste

---

Yatay çizgi (üç tire) ile bölümler ayrılır.

`Kod` satır içi.
```

İlk paragrafın ilk harfi otomatik olarak büyük altın drop-cap olur.

## 2. yazilar.json'a kaydet

`yazilar.json` dosyasını aç. `yazilar` dizisinin **başına** yeni girdi ekle:

```json
{
  "slug": "2026-04-zaman-uzerine",
  "baslik": "Zaman Üzerine Bir Not",
  "tarih": "2026-04-12",
  "ozet": "Bu yazıyı kart üzerinde gören biri içeriği merak etsin diye, bir-iki cümle.",
  "etiketler": ["sinema", "deneme"],
  "okuma": 5
}
```

**Alanlar:**
- `slug` — `.md` dosya adı (uzantısız). URL parametresi olur.
- `baslik` — Kart ve sayfa başlığı.
- `tarih` — `YYYY-AY-GG` (sıralama buna göre yapılır).
- `ozet` — Liste/anasayfa kartında ve OG meta'sında görünür.
- `etiketler` — Filtreleme için. Tutarlı kelime hazinesi tut: `sinema`, `deneme`, `günlük`, `hikaye`, `karakter`, `fanzin` gibi.
- `okuma` — Kaç dakika okuma. Yaklaşık (200 kelime/dk).

JSON virgüllerine dikkat: son girdiden sonra **virgül yok**.

## 3. Push et

```bash
git add yazilar/2026-04-yeni-yazi.md yazilar.json
git commit -m "Yeni yazı: Zaman Üzerine"
git push
```

GitHub Pages 1-2 dakikada güncelleyecek. Yazı şuralarda otomatik görünür:

- **Anasayfa** → "Son Yazılar" bölümünde (en yeni 3)
- **yazilar.html** → tüm liste, etiketle filtrelenebilir
- **yazi.html?slug=...** → tam metin
- Aynı etikette başka yazılar → "İlgili yazılar" bölümünde

## Hızlı bir yazı şablonu

Yeni yazıya başlarken kopyala:

```markdown
İlk paragraf. Drop-cap olacak — bu yüzden ilk harfin önemli.

Metin metin metin. **Kalın bir vurgu**. *İtalik bir hatırlatma.* Bağlantılar [şöyle](url) görünür.

> Bir alıntı, italik bir cümle, atmosfer için.

Devam eden paragraf.

---

E42TT
```

## Editöryal notlar

- **Kısa tut.** İyi bir yazı 600-1200 kelime arası, 3-5 dakika okuma. Daha uzunsa iki yazıya böl.
- **Etiket az olsun.** 1-3 etiket. Çok etiket filtrelemeyi anlamsızlaştırır.
- **Tarih gerçek olsun.** İleri tarihli yazı koyarsan listede görünür ama kullanıcı kafası karışır.
- **Slug değiştirme.** URL'de bağlantı verdiğin yazının slug'ını sonradan değiştirirsen eski bağlantılar kırılır.
- **Resim eklemek istersen** dosyayı repo'ya yükle (`yazilar/gorseller/...`), yazıda `![alt](yazilar/gorseller/dosya.jpg)` olarak referans ver.
