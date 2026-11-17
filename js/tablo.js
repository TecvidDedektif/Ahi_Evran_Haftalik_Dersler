/* ============================================================
   Ortak puan tablosu (Firebase Firestore, REST)

   Kütüphane yüklemeyiz: tarayıcının kendi fetch'i yeter. Sunucuya sadece
   çocuk "Puanı gönder"e basarsa bir şey gider: isim, puan, doğru sayısı.
   Tablo okunurken hiçbir şey gönderilmez.

   Veri yeri:  haftalar/<hafta>/skorlar/<isim>   (isim küçük harfe çevrilmiş)
   Her isim için haftada tek satır tutulur, en iyi puan kalır.
   Güvenlik kuralları firestore.rules dosyasındadır; Firebase panelinde
   Firestore > Rules sekmesine yapıştırılır.

   Not: apiKey gizli değildir, web uygulamalarında herkese açık durur.
   Kimin ne yazabileceğini anahtar değil kurallar belirler.
   ============================================================ */

window.TABLO = (function () {
  var AYAR = {
    proje: 'ahi-evran-haftalik-dersler',
    anahtar: 'AIzaSyBDzgQjKQF4F7TKMGAjVg-_Ti0nxbGYCHs',
  };
  var ZAMAN_ASIMI = 10000;   // ms
  var onbellek = {};         // hafta -> { zaman, satirlar }

  function taban() { return 'https://firestore.googleapis.com/v1/projects/' + AYAR.proje + '/databases/(default)/documents'; }
  function anahtar() { return '?key=' + encodeURIComponent(AYAR.anahtar); }

  // fetch + zaman aşımı; hata olursa { durum, mesaj } ile reddeder
  function iste(url, secenek) {
    var kontrol = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var sayac = setTimeout(function () { if (kontrol) kontrol.abort(); }, ZAMAN_ASIMI);
    secenek = secenek || {};
    if (kontrol) secenek.signal = kontrol.signal;
    return fetch(url, secenek).then(function (r) {
      clearTimeout(sayac);
      if (r.status === 404) return { durum: 404 };
      if (!r.ok) throw { durum: r.status };
      return r.json().then(function (j) { return { durum: r.status, json: j }; });
    }, function () { clearTimeout(sayac); throw { durum: 0 }; });
  }

  // İsimden belge adı: küçük harf, boşluk ve / . yerine tire
  function kimlik(ad) {
    return String(ad).trim().toLocaleLowerCase('tr').replace(/[\s\/.]+/g, '-').slice(0, 40) || 'isimsiz';
  }
  function sayi(alan) { return alan && alan.integerValue != null ? parseInt(alan.integerValue, 10) : 0; }
  function satir(belge) {
    var f = belge.fields || {};
    var ad = (f.ad && f.ad.stringValue) || '';
    return { id: String(belge.name || '').split('/').pop(), ad: ad, puan: sayi(f.puan), dogru: sayi(f.dogru) };
  }

  // İlk N satır, puana göre. Haftalık, sınıf başına tek tablo.
  function oku(hafta, adet, yenile) {
    var o = onbellek[hafta];
    if (!yenile && o && Date.now() - o.zaman < 60000) return Promise.resolve(o.satirlar);
    var govde = { structuredQuery: { from: [{ collectionId: 'skorlar' }], orderBy: [{ field: { fieldPath: 'puan' }, direction: 'DESCENDING' }], limit: adet || 10 } };
    return iste(taban() + '/haftalar/' + encodeURIComponent(hafta) + ':runQuery' + anahtar(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(govde),
    }).then(function (r) {
      var l = (r.json || []).filter(function (x) { return x.document; }).map(function (x) { return satir(x.document); });
      onbellek[hafta] = { zaman: Date.now(), satirlar: l };
      return l;
    });
  }

  // Puanı gönder. Aynı isim daha iyi bir puanla zaten varsa yazmaz.
  // Çözüm: { durum: 'yazildi' | 'daha-iyi-var', eski: sayı }
  function gonder(hafta, ad, puan, dogru) {
    ad = String(ad).replace(/\s+/g, ' ').trim().slice(0, 14);
    var yol = taban() + '/haftalar/' + encodeURIComponent(hafta) + '/skorlar/' + encodeURIComponent(kimlik(ad));
    return iste(yol + anahtar()).then(function (r) {
      if (r.durum !== 404) {
        var eski = sayi(((r.json || {}).fields || {}).puan);
        if (eski >= puan) return { durum: 'daha-iyi-var', eski: eski };
      }
      var belge = { fields: { ad: { stringValue: ad }, puan: { integerValue: String(puan) }, dogru: { integerValue: String(dogru) } } };
      return iste(yol + anahtar(), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(belge) })
        .then(function () { delete onbellek[hafta]; return { durum: 'yazildi', eski: r.durum === 404 ? 0 : sayi(((r.json || {}).fields || {}).puan) }; });
    });
  }

  return { oku: oku, gonder: gonder, kimlik: kimlik, ayar: AYAR };
})();
