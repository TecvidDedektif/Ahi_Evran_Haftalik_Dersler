/* ============================================================
   Hesaplar ve ortak puan tablosu (Firebase, REST)

   Kütüphane yüklemeyiz: tarayıcının kendi fetch'i yeter.

   Hesaplar (Firebase Authentication):
     Hesapları hoca Firebase panelinden açar. Çocuk sadece kullanıcı adını
     yazar (orhan); site sonuna ALAN'ı ekler (orhan@ahievran.example).
     Giriş bilgisi (oturum anahtarı) sadece bu cihazda saklanır.

   Veri (Firestore):
     ogrenciler/<uid>                 { ad }   hoca yazar; tabloda görünen isim
     haftalar/<hafta>/skorlar/<uid>   { ad, puan, dogru, son, acik, deneme }
       puan, dogru  haftanın en iyi sonucu
       son          son denemenin başladığı an (sunucu saati)
       acik         deneme başladı, henüz bitmedi
       deneme       bu hafta kaç kez oynandı

   Günde bir hak: deneme oyun BAŞLARKEN sunucuya yazılır. Kurallar aynı gün
   ikinci başlangıcı reddeder. Gün, sunucu saatine (UTC) göre değişir:
   Hollanda'da kışın 01:00, yazın 02:00.

   Güvenlik kuralları firestore.rules dosyasındadır.
   apiKey gizli değildir; kimin ne yapabileceğini kurallar belirler.
   ============================================================ */

window.TABLO = (function () {
  var AYAR = {
    proje: 'ahi-evran-haftalik-dersler',
    anahtar: 'AIzaSyBDzgQjKQF4F7TKMGAjVg-_Ti0nxbGYCHs',
    alan: '@ahievran.example',
  };
  var ZAMAN_ASIMI = 12000;   // ms
  var onbellek = {};         // hafta -> { zaman, satirlar }
  var ANAHTAR = 'dersler-hesap';

  function veriYolu() { return 'projects/' + AYAR.proje + '/databases/(default)/documents'; }
  function taban() { return 'https://firestore.googleapis.com/v1/' + veriYolu(); }
  function anahtar() { return '?key=' + encodeURIComponent(AYAR.anahtar); }

  // fetch + zaman aşımı. Hata: { durum, kod }  (kod: sunucunun hata adı)
  function iste(url, secenek) {
    var kontrol = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var sayac = setTimeout(function () { if (kontrol) kontrol.abort(); }, ZAMAN_ASIMI);
    secenek = secenek || {};
    if (kontrol) secenek.signal = kontrol.signal;
    return fetch(url, secenek).then(function (r) {
      clearTimeout(sayac);
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 404) return { durum: 404, json: j };
        if (!r.ok) throw { durum: r.status, kod: (j && j.error && (j.error.message || j.error.status)) || '' };
        return { durum: r.status, json: j };
      });
    }, function () { clearTimeout(sayac); throw { durum: 0, kod: 'AG' }; });
  }
  function jsonGonder(url, govde, token) {
    var bas = { 'Content-Type': 'application/json' };
    if (token) bas.Authorization = 'Bearer ' + token;
    return iste(url, { method: 'POST', headers: bas, body: JSON.stringify(govde) });
  }

  // ---------- Hesap ----------
  function oku() { try { return JSON.parse(localStorage.getItem(ANAHTAR) || 'null'); } catch (e) { return null; } }
  function yaz(h) { try { if (h) localStorage.setItem(ANAHTAR, JSON.stringify(h)); else localStorage.removeItem(ANAHTAR); } catch (e) {} }
  function hesap() { var h = oku(); return h && h.uid ? { uid: h.uid, kullanici: h.kullanici } : null; }

  function kullaniciAdi(k) { return String(k || '').trim().toLowerCase().replace(/\s+/g, ''); }
  function girisYap(kullanici, sifre) {
    var k = kullaniciAdi(kullanici);
    var eposta = k.indexOf('@') === -1 ? k + AYAR.alan : k;
    return jsonGonder('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword' + anahtar(),
      { email: eposta, password: String(sifre || ''), returnSecureToken: true })
      .then(function (r) {
        var j = r.json || {};
        if (!j.idToken) throw { durum: r.durum, kod: 'BILINMIYOR' };
        var h = { uid: j.localId, kullanici: k.split('@')[0], id: j.idToken, yenile: j.refreshToken, bitis: Date.now() + (Number(j.expiresIn) || 3600) * 1000 };
        yaz(h);
        return hesap();
      });
  }
  function cikis() { yaz(null); }

  // Geçerli oturum anahtarı; süresi dolmak üzereyse yeniler.
  function token() {
    var h = oku();
    if (!h) return Promise.reject({ durum: 401, kod: 'GIRIS_YOK' });
    if (h.id && h.bitis - Date.now() > 5 * 60000) return Promise.resolve(h.id);
    return iste('https://securetoken.googleapis.com/v1/token' + anahtar(), {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(h.yenile),
    }).then(function (r) {
      var j = r.json || {};
      h.id = j.id_token; h.yenile = j.refresh_token || h.yenile; h.bitis = Date.now() + (Number(j.expires_in) || 3600) * 1000;
      yaz(h);
      return h.id;
    }, function (e) {
      // Hesap silindiyse ya da kapatıldıysa oturumu kapat
      if (e.durum === 400 || e.durum === 401 || e.durum === 403) yaz(null);
      throw e;
    });
  }

  // Tabloda görünen isim: hocanın ogrenciler listesinden
  function ogrenci() {
    var h = oku();
    if (!h) return Promise.reject({ durum: 401, kod: 'GIRIS_YOK' });
    return token().then(function (t) {
      return iste(taban() + '/ogrenciler/' + encodeURIComponent(h.uid) + anahtar(), { headers: { Authorization: 'Bearer ' + t } });
    }).then(function (r) {
      var ad = r.durum === 404 ? '' : ((((r.json || {}).fields || {}).ad || {}).stringValue || '');
      if (!ad) throw { durum: 404, kod: 'LISTEDE_YOK' };
      return { uid: h.uid, ad: ad };
    }, function (e) { if (e.durum === 403) throw { durum: 403, kod: 'LISTEDE_YOK' }; throw e; });
  }

  // ---------- Puan ----------
  function sayi(alan) { return alan && alan.integerValue != null ? parseInt(alan.integerValue, 10) : 0; }
  function satir(belge) {
    var f = belge.fields || {};
    return {
      id: String(belge.name || '').split('/').pop(),
      ad: (f.ad && f.ad.stringValue) || '',
      puan: sayi(f.puan), dogru: sayi(f.dogru), deneme: sayi(f.deneme),
      acik: !!(f.acik && f.acik.booleanValue),
      son: f.son && f.son.timestampValue ? new Date(f.son.timestampValue) : null,
    };
  }
  function utcGun(d) { return d.toISOString().slice(0, 10); }
  // Yeni hakkın açılacağı an (bir sonraki UTC gece yarısı), yerel saatle
  function yeniHak() { var n = new Date(Date.now()); return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1)); }

  // Bu öğrencinin haftalık durumu: { var, puan, dogru, deneme, bugunOynadi }
  function durum(hafta, uid) {
    return iste(taban() + '/haftalar/' + encodeURIComponent(hafta) + '/skorlar/' + encodeURIComponent(uid) + anahtar()).then(function (r) {
      if (r.durum === 404) return { var: false, puan: 0, dogru: 0, deneme: 0, bugunOynadi: false };
      var s = satir(r.json);
      s.var = true;
      s.bugunOynadi = !!s.son && utcGun(s.son) === utcGun(new Date(Date.now()));
      return s;
    });
  }

  function yaz1(hafta, uid, alanlar, maske, sunucuZamani) {
    var w = {
      update: { name: veriYolu() + '/haftalar/' + hafta + '/skorlar/' + uid, fields: alanlar },
      updateMask: { fieldPaths: maske },
    };
    if (sunucuZamani) w.updateTransforms = [{ fieldPath: 'son', setToServerValue: 'REQUEST_TIME' }];
    return token().then(function (t) { return jsonGonder(taban() + ':commit' + anahtar(), { writes: [w] }, t); });
  }
  function tamsayi(n) { return { integerValue: String(n) }; }

  // Yarış başlıyor: bugünün hakkı kullanılır. onceki = durum() sonucu
  function basla(hafta, ogr, onceki) {
    return yaz1(hafta, ogr.uid, {
      ad: { stringValue: ogr.ad },
      puan: tamsayi(onceki.var ? onceki.puan : 0),
      dogru: tamsayi(onceki.var ? onceki.dogru : 0),
      acik: { booleanValue: true },
      deneme: tamsayi((onceki.deneme || 0) + 1),
    }, ['ad', 'puan', 'dogru', 'acik', 'deneme'], true).then(function () { delete onbellek[hafta]; });
  }
  // Yarış bitti: deneme kapanır, puan sadece daha iyiyse yazılır
  function bitir(hafta, ogr, onceki, puan, dogru) {
    var daha = puan > (onceki.puan || 0);
    return yaz1(hafta, ogr.uid, {
      puan: tamsayi(daha ? puan : onceki.puan || 0),
      dogru: tamsayi(daha ? dogru : onceki.dogru || 0),
      acik: { booleanValue: false },
    }, ['puan', 'dogru', 'acik'], false).then(function () {
      delete onbellek[hafta];
      return { rekor: daha, enIyi: daha ? puan : onceki.puan || 0 };
    });
  }

  // Tablo: puanı olanlar, en yüksekten. Okumak için giriş gerekmez.
  function liste(hafta, adet, yenile) {
    var o = onbellek[hafta];
    if (!yenile && o && Date.now() - o.zaman < 60000) return Promise.resolve(o.satirlar);
    var q = { structuredQuery: {
      from: [{ collectionId: 'skorlar' }],
      where: { fieldFilter: { field: { fieldPath: 'puan' }, op: 'GREATER_THAN', value: { integerValue: '0' } } },
      orderBy: [{ field: { fieldPath: 'puan' }, direction: 'DESCENDING' }],
      limit: adet || 10,
    } };
    return jsonGonder(taban() + '/haftalar/' + encodeURIComponent(hafta) + ':runQuery' + anahtar(), q).then(function (r) {
      var l = (r.json || []).filter(function (x) { return x.document; }).map(function (x) { return satir(x.document); });
      onbellek[hafta] = { zaman: Date.now(), satirlar: l };
      return l;
    });
  }

  return { hesap: hesap, girisYap: girisYap, cikis: cikis, ogrenci: ogrenci, durum: durum, basla: basla, bitir: bitir, oku: liste, yeniHak: yeniHak, ayar: AYAR };
})();
