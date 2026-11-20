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

   Canlı yarış (derste büyük ekran + telefonlar):
     canli/<kod>                      { durum, hafta, no, toplam, sure, basla, soru, secenekler,
                                        secenek, dogruSecim, dagilim, oyuncular }   sadece hoca yazar
       durum: bekle (katılım) | soru | cevap (sonuç gösteriliyor) | bitti
     canli/<kod>/oyuncular/<kimlik>   { ad, cevapNo, secim, zaman }   çocuk hesapsız katılır
     Kod 4 hanelidir; yarışı sadece kodu bilen okuyabilir.
     Hoca, kullanıcı adı "hoca" olan hesaptır (hoca@ahievran.example).

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

  // ---------- Canlı yarış ----------
  // canli/<kod>                      yarışın durumu; kodu bilen okur, sadece hoca yazar
  // canli/<kod>/oyuncular/<kimlik>   çocuk hesapsız katılır: rastgele kimlik + yazdığı ad
  function kodla(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'string') return { stringValue: v };
    if (v instanceof Date) return { timestampValue: v.toISOString() };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(kodla) } };
    var f = {}; Object.keys(v).forEach(function (k) { f[k] = kodla(v[k]); });
    return { mapValue: { fields: f } };
  }
  function coz(x) {
    if (!x) return undefined;
    if ('nullValue' in x) return null;
    if ('booleanValue' in x) return x.booleanValue;
    if ('integerValue' in x) return parseInt(x.integerValue, 10);
    if ('doubleValue' in x) return Number(x.doubleValue);
    if ('stringValue' in x) return x.stringValue;
    if ('timestampValue' in x) return Date.parse(x.timestampValue);          // ms
    if ('arrayValue' in x) return (x.arrayValue.values || []).map(coz);
    if ('mapValue' in x) return alanlar(x.mapValue.fields);
    return undefined;
  }
  function alanlar(f) { var o = {}; Object.keys(f || {}).forEach(function (k) { o[k] = coz(f[k]); }); return o; }
  // Tarih alanları (basla) ms olarak gelir; geri yazarken Date olur.
  function oyunKodla(o) { var k = {}; Object.keys(o).forEach(function (a) { k[a] = a === 'basla' && typeof o[a] === 'number' ? new Date(o[a]) : o[a]; }); return k; }
  function oyunYolu(kod) { return 'canli/' + encodeURIComponent(kod); }
  function oyuncuYolu(kod, id) { return oyunYolu(kod) + '/oyuncular' + (id ? '/' + encodeURIComponent(id) : ''); }
  function acikOku(yol) { return iste(taban() + '/' + yol + anahtar()); }                        // giriş gerekmez
  function hocaOku(yol, ek) {
    return token().then(function (t) { return iste(taban() + '/' + yol + anahtar() + (ek || ''), { headers: { Authorization: 'Bearer ' + t } }); });
  }
  function belgeler(r) { return (((r.json || {}).documents) || []).map(function (d) { var o = alanlar(d.fields); o.id = String(d.name).split('/').pop(); o.yol = d.name; return o; }); }
  function yazilar(w, hocaMi) {
    if (!hocaMi) return jsonGonder(taban() + ':commit' + anahtar(), { writes: w });
    return token().then(function (t) { return jsonGonder(taban() + ':commit' + anahtar(), { writes: w }, t); });
  }
  function guncelleme(yol, nesne, maske, zamanlar) {
    var f = {}; Object.keys(nesne).forEach(function (k) { f[k] = kodla(nesne[k]); });
    var w = { update: { name: veriYolu() + '/' + yol, fields: f } };
    if (maske) w.updateMask = { fieldPaths: maske };
    if (zamanlar) w.updateTransforms = zamanlar.map(function (a) { return { fieldPath: a, setToServerValue: 'REQUEST_TIME' }; });
    return w;
  }
  var canli = {
    // Herkes: yarışın durumu; kod yanlışsa ya da yarış silindiyse null
    oyun: function (kod) { return acikOku(oyunYolu(kod)).then(function (r) { return r.durum === 404 ? null : alanlar(r.json.fields); }); },
    // Çocuk: kendi satırı; çıkarıldıysa null
    benim: function (kod, id) { return acikOku(oyuncuYolu(kod, id)).then(function (r) { return r.durum === 404 ? null : alanlar(r.json.fields); }); },
    // Çocuk: yarışa katılır (hesapsız)
    katil: function (kod, id, ad) { return yazilar([guncelleme(oyuncuYolu(kod, id), { ad: ad, cevapNo: -1, secim: -1 }, null, ['zaman'])]); },
    // Çocuk: o anki soruya cevap
    cevapla: function (kod, id, no, secim) { return yazilar([guncelleme(oyuncuYolu(kod, id), { cevapNo: no, secim: secim }, ['cevapNo', 'secim'], ['zaman'])]); },
    // Hoca: bütün oyuncular
    oyuncular: function (kod) { return hocaOku(oyuncuYolu(kod), '&pageSize=300').then(belgeler); },
    // Hoca: bu soruya kaç kişi cevap verdi (ucuz sayım)
    cevapSayisi: function (kod, no) {
      var q = { structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId: 'oyuncular' }], where: { fieldFilter: { field: { fieldPath: 'cevapNo' }, op: 'EQUAL', value: { integerValue: String(no) } } } },
        aggregations: [{ alias: 'n', count: {} }] } };
      return token().then(function (t) { return jsonGonder(taban() + '/' + oyunYolu(kod) + ':runAggregationQuery' + anahtar(), q, t); }).then(function (r) {
        var a = (r.json || [])[0];
        return a && a.result && a.result.aggregateFields ? coz(a.result.aggregateFields.n) : 0;
      });
    },
    // Hoca: yarışın bütün durumunu yazar. basla=true ise soru sunucu saatiyle başlar; dönüş: o an (ms)
    yaz: function (kod, o, basla) {
      return yazilar([guncelleme(oyunYolu(kod), oyunKodla(o), null, basla ? ['basla'] : null)], true).then(function (r) {
        var w = (((r.json || {}).writeResults) || [])[0] || {}, d = (w.transformResults || [])[0];
        return d && d.timestampValue ? Date.parse(d.timestampValue) : null;
      });
    },
    // Hoca: bir oyuncuyu çıkarır
    cikar: function (kod, id) { return yazilar([{ delete: veriYolu() + '/' + oyuncuYolu(kod, id) }], true); },
    // Hoca: önceki bütün yarışları ve oyuncularını siler (isimler sunucuda kalmasın)
    temizle: function () {
      return hocaOku('canli', '&pageSize=50').then(function (r) {
        var oyunlar = belgeler(r);
        return Promise.all(oyunlar.map(function (o) { return hocaOku(oyuncuYolu(o.id), '&pageSize=300').then(belgeler); })).then(function (l) {
          var w = [];
          l.forEach(function (oy) { oy.forEach(function (x) { w.push({ delete: x.yol }); }); });
          oyunlar.forEach(function (o) { w.push({ delete: o.yol }); });
          if (w.length) return yazilar(w, true);
        });
      });
    },
  };

  return { hesap: hesap, girisYap: girisYap, cikis: cikis, ogrenci: ogrenci, durum: durum, basla: basla, bitir: bitir, oku: liste, yeniHak: yeniHak, canli: canli, ayar: AYAR };
})();
