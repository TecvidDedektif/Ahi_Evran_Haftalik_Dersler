/* ============================================================
   Ses efektleri (sadece oyunlarda)

   Ses dosyası yok: sesler tarayıcının kendi ses motoruyla (Web Audio)
   üretilir. Telif ya da indirme derdi olmaz.

   Kullanım:  SES.cal('dogru')   dogru, yanlis, sure, tik, tak, acil, bitis, rekor, adim
   Geri sayım: var t = SES.sayac(); ... t(kalanSaniye)  her yeni saniyede tik-tak, son 5 saniyede acil
   Açma kapama: üst şeritteki hoparlör düğmesi. Tercih bu cihazda saklanır
   (dersler-ses). Varsayılan: açık (ACIK_BASLA).
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
  };

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
      if (acik) { baglam(); api.cal('adim'); }
      document.querySelectorAll('.ses-d').forEach(guncelle);
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
  function guncelle(b) {
    b.setAttribute('aria-pressed', String(acik));
    b.setAttribute('aria-label', acik ? 'Geluid uit · Sesi kapat' : 'Geluid aan · Sesi aç');
    b.title = acik ? 'Geluid uit · Sesi kapat' : 'Geluid aan · Sesi aç';
    b.classList.toggle('kapali', !acik);
  }
  return api;
})();
