/* ============================================================
   Ses efektleri (sadece oyunlarda)

   Ses dosyası yok: sesler tarayıcının kendi ses motoruyla (Web Audio)
   üretilir. Telif ya da indirme derdi olmaz.

   Kullanım:  SES.cal('dogru')   dogru, yanlis, sure, tik, tak, acil, bitis, rekor, adim
   Geri sayım: var t = SES.sayac(); ... t(kalanSaniye)  her yeni saniyede tik-tak, son 5 saniyede acil
   Açma kapama: üst şeritteki hoparlör düğmesi. Tercih bu cihazda saklanır
   (dersler-ses). Varsayılan: açık (ACIK_BASLA).

   Müzik (sadece canlı yarışta büyük ekran): SES.muzik('lobi' | 'soru' | null)
     lobi  bekleme ekranı: sakin, neşeli bir ezgi (Do majör)
     soru  soru sırasında: daha hareketli (La minör); SES.muzikHiz(1.25) son saniyelerde hızlandırır
     Ezgiler bu site için yazıldı. Müzik düğmesi (SES.muzikDugme) tercihi dersler-muzik'te saklar;
     hoparlör kapalıysa müzik de çalmaz.
   ============================================================ */

window.SES = (function () {
  var ACIK_BASLA = true;     // sesler ilk açılışta açık mı?
  var SEVIYE = 0.16;         // genel ses yüksekliği (0-1); kısık tutuldu
  var ctx = null, ana = null, acik = ACIK_BASLA;
  try { var k = localStorage.getItem('dersler-ses'); if (k !== null) acik = k === '1'; } catch (e) {}

  function baglam() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
      ana = ctx.createGain(); ana.gain.value = SEVIYE; ana.connect(ctx.destination);
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }
  // Telefonlar sesi ancak bir dokunuştan sonra çalar: ilk dokunuşta ses motorunu uyandır
  function uyandir() { if (acik) baglam(); }
  document.addEventListener('pointerdown', uyandir, { passive: true });
  document.addEventListener('keydown', uyandir);

  // Tek nota: frekans (Hz), başlangıç (sn), süre (sn), dalga, yükseklik, bitiş frekansı
  function nota(f, bas, sure, tip, yuk, kayma) {
    var t = ctx.currentTime + bas, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tip || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (kayma) o.frequency.exponentialRampToValueAtTime(kayma, t + sure);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(yuk || 1, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g); g.connect(ana);
    o.start(t); o.stop(t + sure + 0.03);
  }

  var SESLER = {
    dogru: function () { nota(784, 0, 0.12, 'sine', 0.9); nota(1175, 0.08, 0.24, 'sine', 0.9); },          // kısa "ding-ding"
    adim: function () { nota(988, 0, 0.1, 'sine', 0.6); },                                                  // âyet sıralamada doğru adım
    yanlis: function () { nota(230, 0, 0.22, 'triangle', 0.8, 160); },                                      // yumuşak "tık"
    sure: function () { nota(330, 0, 0.18, 'triangle', 0.8); nota(247, 0.16, 0.32, 'triangle', 0.8); },    // süre doldu
    tik: function () { nota(1100, 0, 0.03, 'sine', 0.3); },                                                 // her saniye: tik
    tak: function () { nota(820, 0, 0.03, 'sine', 0.3); },                                                  // her saniye: tak
    acil: function () { nota(1500, 0, 0.05, 'square', 0.35); nota(1500, 0.5, 0.05, 'square', 0.35); },     // son 5 saniye: tiz ve iki kez
    bitis: function () { [523, 659, 784, 1047].forEach(function (f, i) { nota(f, i * 0.1, 0.28, 'sine', 0.8); }); },
    rekor: function () {
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { nota(f, i * 0.08, 0.3, 'sine', 0.8); });
      nota(1568, 0.45, 0.5, 'sine', 0.5); nota(2093, 0.5, 0.6, 'sine', 0.35);
    },
    // Podyum: kısa bir kutlama ezgisi
    kutlama: function () {
      [[0, 67], [0.14, 72], [0.28, 76], [0.42, 79]].forEach(function (x) { nota(hz(x[1]), x[0], 0.2, 'triangle', 0.8); });
      [72, 76, 79, 84].forEach(function (m) { nota(hz(m), 0.6, 1.2, 'triangle', 0.45); });
      nota(hz(48), 0.6, 1.2, 'triangle', 0.7);
      [0.62, 0.78, 0.94].forEach(function (t, i) { nota(hz(91 + i * 2), t, 0.3, 'sine', 0.3); });
    },
  };

  // ---------- Müzik ----------
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  var MUZIK_SEVIYE = 0.55;   // müziğin, efektlere göre yüksekliği
  var muzikAcik = true;
  try { var mk = localStorage.getItem('dersler-muzik'); if (mk !== null) muzikAcik = mk === '1'; } catch (e) {}
  // Bir parça: bpm, adım sayısı (sekizlik), akorlar (her 8 adımda bir), ezgi [adım, nota, uzunluk], bas, davul
  var PARCALAR = {
    lobi: {
      bpm: 108, uzunluk: 32,
      akor: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]],          // C Am F G
      bas: [48, 45, 41, 43],
      ezgi: [[0, 76, 1], [1, 79, 1], [2, 81, 1], [3, 79, 1], [4, 76, 2], [6, 74, 1], [7, 72, 1],
             [8, 76, 2], [10, 79, 1], [11, 81, 1], [12, 84, 2], [14, 81, 1], [15, 79, 1],
             [16, 81, 1], [17, 79, 1], [18, 77, 1], [19, 76, 1], [20, 74, 2], [22, 72, 1], [23, 74, 1],
             [24, 76, 1], [25, 74, 1], [26, 71, 1], [27, 74, 1], [28, 67, 4]],
      basDesen: 'lobi', davul: 'hafif',
    },
    soru: {
      bpm: 128, uzunluk: 32,
      akor: [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]],          // Am F C G
      bas: [45, 41, 48, 43],
      ezgi: [[0, 69, 1], [1, 72, 1], [2, 76, 1], [3, 81, 1], [4, 79, 1], [5, 76, 1], [6, 74, 1], [7, 76, 1],
             [8, 77, 1], [9, 81, 1], [10, 84, 2], [12, 81, 1], [13, 77, 1], [14, 76, 1], [15, 74, 1],
             [16, 76, 1], [17, 79, 1], [18, 84, 1], [19, 79, 1], [20, 76, 1], [21, 79, 1], [22, 81, 2],
             [24, 83, 1], [25, 81, 1], [26, 79, 1], [27, 74, 1], [28, 71, 1], [29, 74, 1], [30, 79, 2]],
      basDesen: 'surekli', davul: 'canli',
    },
  };
  var gurultu = null;
  function gurultuTamponu() {
    if (gurultu) return gurultu;
    gurultu = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    var v = gurultu.getChannelData(0);
    for (var i = 0; i < v.length; i++) v[i] = Math.random() * 2 - 1;
    return gurultu;
  }
  // Mutlak zamanda nota (müzik için): f Hz, t saniye, süre, dalga, yükseklik, çıkış
  function calNota(f, t, sure, tip, yuk, cikis) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tip; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(yuk, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g); g.connect(cikis);
    o.start(t); o.stop(t + sure + 0.05);
  }
  function zil(t, yuk, cikis) {                     // kısa, yumuşak zil (hi-hat)
    var k = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    k.buffer = gurultuTamponu(); f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(yuk, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    k.connect(f); f.connect(g); g.connect(cikis); k.start(t); k.stop(t + 0.05);
  }
  function tum(t, yuk, cikis) {                     // yumuşak vuruş
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.14);
    g.gain.setValueAtTime(yuk, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(cikis); o.start(t); o.stop(t + 0.18);
  }
  var calan = null, istenen = null;
  function adimCal(p, a, t, d, cikis) {
    var olcu = Math.floor(a / 8), ic = a % 8;
    p.ezgi.forEach(function (x) { if (x[0] === a) { calNota(hz(x[1]), t, d * x[2] * 0.95, 'triangle', 0.5, cikis); calNota(hz(x[1] + 12), t, d * x[2] * 0.6, 'sine', 0.08, cikis); } });
    var kok = p.bas[olcu];
    if (p.basDesen === 'lobi') { if (ic % 4 === 0) calNota(hz(kok), t, d * 1.8, 'triangle', 0.42, cikis); else if (ic % 4 === 2) calNota(hz(kok + 7), t, d * 0.9, 'triangle', 0.3, cikis); }
    else calNota(hz(ic % 2 ? kok + 12 : kok), t, d * 0.8, 'triangle', 0.36, cikis);
    if (ic % 2 === 1) p.akor[olcu].forEach(function (m) { calNota(hz(m), t, d * 0.7, 'triangle', 0.09, cikis); });
    if (p.davul === 'hafif') { if (ic % 2 === 1) zil(t, 0.12, cikis); }
    else { zil(t, ic % 2 ? 0.14 : 0.07, cikis); if (ic % 4 === 0) tum(t, 0.55, cikis); }
    api.notaSayisi++;
  }
  function muzikBaslat(ad) {
    var p = PARCALAR[ad];
    if (!p || !acik || !muzikAcik || !baglam()) return;
    var c = { ad: ad, hiz: 1, adim: 0, zaman: ctx.currentTime + 0.08, cikis: ctx.createGain() };
    c.cikis.gain.setValueAtTime(0.0001, ctx.currentTime);
    c.cikis.gain.exponentialRampToValueAtTime(MUZIK_SEVIYE, ctx.currentTime + 0.8);
    c.cikis.connect(ana);
    c.saat = setInterval(function () {
      try {
        while (c.zaman < ctx.currentTime + 0.2) {
          var d = 60 / (p.bpm * c.hiz) / 2;
          adimCal(p, c.adim, c.zaman, d, c.cikis);
          c.zaman += d; c.adim = (c.adim + 1) % p.uzunluk;
        }
      } catch (e) {}
    }, 50);
    calan = c;
  }
  function muzikSustur() {
    if (!calan) return;
    var c = calan; calan = null;
    clearInterval(c.saat);
    try { c.cikis.gain.cancelScheduledValues(ctx.currentTime); c.cikis.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.12); } catch (e) {}
    setTimeout(function () { try { c.cikis.disconnect(); } catch (e) {} }, 1200);
  }

  var api = {
    son: null,   // en son çalınan ses (deneme için)
    cal: function (ad) {
      if (!acik || !SESLER[ad] || !baglam()) return;
      try { SESLER[ad](); api.son = ad; } catch (e) {}
    },
    // Geri sayım: süre sayacı her güncellendiğinde kalan saniyeyle çağrılır; ses saniye değişince çalar
    sayac: function () {
      var onceki = null;
      return function (kalan) {
        var s = Math.ceil(kalan);
        if (s === onceki || kalan <= 0) return;
        var ilk = onceki === null; onceki = s;
        if (ilk) return;                         // soru açılınca hemen ses yapmasın
        api.cal(s <= 5 ? 'acil' : s % 2 ? 'tik' : 'tak');
      };
    },
    acikMi: function () { return acik; },
    ayarla: function (a) {
      acik = !!a;
      try { localStorage.setItem('dersler-ses', acik ? '1' : '0'); } catch (e) {}
      if (acik) { baglam(); api.cal('adim'); if (istenen && !calan) muzikBaslat(istenen); }
      else muzikSustur();
      document.querySelectorAll('.ses-d').forEach(guncelle);
      document.querySelectorAll('.muzik-d').forEach(muzikGuncelle);
    },
    // ---------- Müzik ----------
    notaSayisi: 0,
    muzik: function (ad) {
      istenen = ad || null;
      if (calan && calan.ad === ad) return;
      muzikSustur();
      if (ad) muzikBaslat(ad);
    },
    muzikHiz: function (x) { if (calan) calan.hiz = x || 1; },
    muzikDurum: function () { return { parca: calan ? calan.ad : null, hiz: calan ? calan.hiz : 1, acik: muzikAcik, istenen: istenen }; },
    muzikDugme: function () {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'muzik-d';
      b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 17.5V6l10-2v11.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="6.5" cy="17.5" r="2.5" fill="currentColor"/><circle cx="16.5" cy="15.5" r="2.5" fill="currentColor"/>' +
        '<path class="carpi" d="M3 3l18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      b.addEventListener('click', function () {
        muzikAcik = !muzikAcik;
        try { localStorage.setItem('dersler-muzik', muzikAcik ? '1' : '0'); } catch (e) {}
        if (muzikAcik) { if (istenen && !calan) muzikBaslat(istenen); } else muzikSustur();
        document.querySelectorAll('.muzik-d').forEach(muzikGuncelle);
      });
      muzikGuncelle(b);
      return b;
    },
    // Üst şeritteki hoparlör düğmesi
    dugme: function () {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ses-d';
      b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/>' +
        '<path class="dalga" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '<path class="carpi" d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      b.addEventListener('click', function () { api.ayarla(!acik); });
      guncelle(b);
      return b;
    },
  };
  function muzikGuncelle(b) {
    var on = muzikAcik && acik;
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Muziek uit · Müziği kapat' : 'Muziek aan · Müziği aç');
    b.title = b.getAttribute('aria-label');
    b.classList.toggle('kapali', !on);
  }
  function guncelle(b) {
    b.setAttribute('aria-pressed', String(acik));
    b.setAttribute('aria-label', acik ? 'Geluid uit · Sesi kapat' : 'Geluid aan · Sesi aç');
    b.title = acik ? 'Geluid uit · Sesi kapat' : 'Geluid aan · Sesi aç';
    b.classList.toggle('kapali', !acik);
  }
  return api;
})();
