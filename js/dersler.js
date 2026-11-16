/* ============================================================
   Haftalık Dersler: uygulama

   Her hafta haftalar/ klasöründe ayrı bir dosyadır ve
   DERS.haftaEkle(...) ile eklenir. Sıra haftalar/liste.js içinde.

   Adresler:
     #/                    ana sayfa
     #/hafta-10            haftanın ilk konusu
     #/hafta-10/sabir      haftanın "sabir" konusu

   Bir konunun içindeki parçalar (bloklar):
     ozet     kısa maddeler
     hikaye   adım adım anlatılan bir misal
     kartlar  çevirmeli kartlar (önde soru, arkada cevap)
     quiz     çoktan seçmeli sorular, sonunda yıldız
     ezber    âyet âyet okunuş ve anlam + sıraya dizme oyunu
     medd     Arapça kelimede hangi med var oyunu
     baglanti başka bir sayfaya düğme
   ============================================================ */

window.DERS = {
  haftalar: {},
  sira: [],
  haftaEkle: function (h) { this.haftalar[h.id] = h; },
  liste: function (l) { this.sira = l; },
};

(function () {
  var D = window.DERS;
  var ust = document.getElementById('ust');
  var govde = document.getElementById('govde');
  var hatalar = [];

  // =========================================================
  // Yardımcılar
  // =========================================================
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function nl(x) { return typeof x === 'string' ? x : (x && x.nl) || ''; }
  function tr(x) { return typeof x === 'string' ? '' : (x && x.tr) || ''; }
  // Hollandaca satır, altında Türkçesi
  function iki(x, etiket) {
    etiket = etiket || 'p';
    return '<' + etiket + '>' + nl(x) + '</' + etiket + '>' + (tr(x) ? '<' + etiket + ' class="tr" lang="tr">' + tr(x) + '</' + etiket + '>' : '');
  }
  function ikiSatir(x) { return nl(x) + (tr(x) ? '<small class="tr" lang="tr">' + tr(x) + '</small>' : ''); }
  function karistir(l) {
    var a = l.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // ---------- Yıldızlar: sadece bu cihazda saklanır ----------
  var yildizlar = {};
  try { yildizlar = JSON.parse(localStorage.getItem('dersler-yildiz') || '{}'); } catch (e) {}
  function yildizVer(hafta, anahtar, adet) {
    var k = hafta + ':' + anahtar;
    if ((yildizlar[k] || 0) >= adet) return;
    yildizlar[k] = adet;
    try { localStorage.setItem('dersler-yildiz', JSON.stringify(yildizlar)); } catch (e) {}
  }
  function haftaYildizi(h) {
    var kazanilan = 0, toplam = 0;
    h.konular.forEach(function (k) {
      k.bloklar.forEach(function (b, bi) {
        if (['quiz', 'ezber', 'medd'].indexOf(b.tur) === -1) return;
        toplam += 3;
        kazanilan += yildizlar[h.id + ':' + k.id + ':' + bi] || 0;
      });
    });
    return { kazanilan: kazanilan, toplam: toplam };
  }
  function yildizCiz(n, toplam) {
    var s = '';
    for (var i = 0; i < (toplam || 3); i++) s += '<span class="yildiz' + (i < n ? ' dolu' : '') + '" aria-hidden="true">★</span>';
    return '<span class="yildizlar" aria-label="' + n + ' / ' + (toplam || 3) + ' ster">' + s + '</span>';
  }
  // Ana sayfada yıldızlar tek tek çizilmez (15 yıldız telefona sığmaz), sayı olarak gösterilir.
  function yildizSayac(n, toplam) {
    return '<span class="yildiz-sayac" aria-label="' + n + ' / ' + toplam + ' ster"><span class="yildiz' + (n > 0 ? ' dolu' : '') +
      '" aria-hidden="true">★</span><b>' + n + '</b> / ' + toplam + '</span>';
  }
  function puandanYildiz(dogru, toplam) {
    var oran = dogru / toplam;
    return oran === 1 ? 3 : oran >= 0.7 ? 2 : oran >= 0.4 ? 1 : 0;
  }

  // ---------- Arapça kelime: ( ) med mavi, [ ] hemze kırmızı, { } sükûn mor ----------
  var ISARET = { '(': 'med', ')': 'med', '[': 'hemze', ']': 'hemze', '{': 'sukun', '}': 'sukun' };
  var ZWJ = '‍';
  var HAREKE = /[ً-ٰٟۖ-ۭ]/g;
  var BAGLANAN = 'بتثجحخسشصضطظعغفقكلمنهيئى';
  function harfler(m) { return m.replace(HAREKE, '').replace(/‍/g, ''); }
  function ileri(m) { var h = harfler(m); return BAGLANAN.indexOf(h.charAt(h.length - 1)) !== -1; }
  function geri(m) { var i = harfler(m).charAt(0); return i !== '' && i !== 'ء'; }
  function kelimeCoz(yazi) {
    return yazi.trim().split(/\s+/).map(function (soz) {
      var p = [], metin = '', acik = null;
      Array.from(soz).forEach(function (c) {
        var r = ISARET[c];
        if (!r) { metin += c; return; }
        if (acik === null) { if (metin) p.push({ y: metin, r: '' }); metin = ''; acik = r; }
        else { p.push({ y: metin, r: r }); metin = ''; acik = null; }
      });
      if (metin) p.push({ y: metin, r: '' });
      return p;
    });
  }
  function kelimeCiz(yazi, renkli, kopru) {
    var html = '';
    kelimeCoz(yazi).forEach(function (parcalar, si) {
      if (si > 0) html += '<span class="ara" aria-hidden="true"><span class="kopru"></span></span>';
      var ic = '';
      if (!renkli) ic = esc(parcalar.map(function (p) { return p.y; }).join(''));
      else parcalar.forEach(function (p, i) {
        var t = p.y;
        if (i > 0 && ileri(parcalar[i - 1].y) && geri(p.y)) t = ZWJ + t;
        if (i < parcalar.length - 1 && ileri(p.y) && geri(parcalar[i + 1].y)) t = t + ZWJ;
        ic += p.r ? '<span class="' + p.r + '">' + esc(t) + '</span>' : esc(t);
      });
      html += '<span class="kutu">' + ic + '</span>';
    });
    return '<div class="kelime' + (renkli ? ' kutulu' : '') + (renkli && kopru ? ' koprulu' : '') + '" lang="ar">' + html + '</div>';
  }

  // =========================================================
  // Bloklar
  // =========================================================
  var BLOK = {};

  BLOK.ozet = function (b) {
    return '<section class="blok ozet">' + (b.baslik ? '<h3>' + ikiSatir(b.baslik) + '</h3>' : '') +
      '<ul class="maddeler">' + b.maddeler.map(function (m) {
        return '<li><span class="simge" aria-hidden="true">' + esc(m.simge || '•') + '</span><div>' + iki(m) +
          (m.kaynak ? '<p class="kaynak">' + esc(m.kaynak) + '</p>' : '') + '</div></li>';
      }).join('') + '</ul></section>';
  };

  BLOK.hikaye = function (b) {
    return '<section class="blok hikaye"><h3>' + ikiSatir(b.baslik) + '</h3>' +
      '<ol class="adimlar">' + b.adimlar.map(function (a) { return '<li><div>' + iki(a) + '</div></li>'; }).join('') + '</ol>' +
      (b.anlam ? '<div class="anlam-kutu"><h4>' + ikiSatir(b.anlam.baslik) + '</h4><ul>' +
        b.anlam.eslesmeler.map(function (e) { return '<li><b>' + nl(e[0]) + '</b> = ' + nl(e[1]) + '<small class="tr" lang="tr">' + tr(e[0]) + ' = ' + tr(e[1]) + '</small></li>'; }).join('') +
        '</ul>' + (b.anlam.soru ? '<div class="dusun">' + iki(b.anlam.soru) + '</div>' : '') + '</div>' : '') +
      '</section>';
  };

  BLOK.kartlar = function (b) {
    return '<section class="blok"><h3>' + ikiSatir(b.baslik || { nl: 'Draai de kaartjes om', tr: 'Kartları çevir' }) + '</h3>' +
      '<div class="kartlar">' + b.kartlar.map(function (k) {
        return '<button type="button" class="kart" aria-pressed="false"><span class="on">' + ikiSatir(k.on) + '</span>' +
          '<span class="arka" hidden>' + ikiSatir(k.arka) + '</span><span class="cevir" aria-hidden="true">↻</span></button>';
      }).join('') + '</div></section>';
  };
  function kartlariBagla(kok) {
    kok.querySelectorAll('.kart').forEach(function (k) {
      k.addEventListener('click', function () {
        var acik = k.getAttribute('aria-pressed') === 'true';
        k.setAttribute('aria-pressed', String(!acik));
        k.querySelector('.on').hidden = !acik;
        k.querySelector('.arka').hidden = acik;
      });
    });
  }

  // ---------- Quiz ----------
  BLOK.quiz = function (b, yer) {
    return '<section class="blok oyun" data-quiz="' + yer.bi + '"><h3>' + ikiSatir(b.baslik || { nl: 'Mini-quiz', tr: 'Mini quiz' }) + '</h3><div class="oyun-ic"></div></section>';
  };
  function quizKur(kok, b, yer) {
    var ic = kok.querySelector('.oyun-ic'), sira = 0, dogru = 0, sorular;
    function soru() {
      var s = sorular[sira];
      var secenekler = karistir(s.secenekler.map(function (x, i) { return { x: x, dogru: i === s.dogru }; }));
      ic.innerHTML = '<p class="sayac">Vraag ' + (sira + 1) + ' van ' + sorular.length + '<span class="tr" lang="tr"> · Soru ' + (sira + 1) + ' / ' + sorular.length + '</span></p>' +
        '<div class="soru">' + iki(s.soru) + '</div><div class="secenekler">' +
        secenekler.map(function (c, i) { return '<button type="button" class="secenek" data-d="' + (c.dogru ? 1 : 0) + '">' + ikiSatir(c.x) + '</button>'; }).join('') +
        '</div><div class="sonuc" role="status"></div>';
      ic.querySelectorAll('.secenek').forEach(function (d) {
        d.addEventListener('click', function () {
          var iyi = d.dataset.d === '1';
          if (iyi) dogru++;
          ic.querySelectorAll('.secenek').forEach(function (x) { x.disabled = true; if (x.dataset.d === '1') x.classList.add('dogru'); else if (x === d) x.classList.add('yanlis'); });
          ic.querySelector('.sonuc').innerHTML = '<div class="geri-bildirim ' + (iyi ? 'dogru' : 'yanlis') + '"><b>' + (iyi ? 'Goed! · Doğru!' : 'Bijna! · Neredeyse!') + '</b>' +
            (s.aciklama ? iki(s.aciklama) : '') + '</div><button type="button" class="dugme ana sonraki">' +
            (sira + 1 < sorular.length ? 'Volgende<small>Sonraki</small>' : 'Uitslag<small>Sonuç</small>') + '</button>';
          var sn = ic.querySelector('.sonraki');
          sn.addEventListener('click', function () { sira++; if (sira < sorular.length) soru(); else bitis(); });
          sn.focus({ preventScroll: true });
        });
      });
    }
    function bitis() {
      var y = puandanYildiz(dogru, sorular.length);
      yildizVer(yer.hafta, yer.konu + ':' + yer.bi, y);
      ic.innerHTML = '<div class="bitis"><div class="puan">' + dogru + ' / ' + sorular.length + '</div>' + yildizCiz(y) +
        '<p>' + (y === 3 ? 'Alles goed! · <span class="tr" lang="tr">Hepsi doğru!</span>' : y >= 1 ? 'Goed bezig! · <span class="tr" lang="tr">Güzel gidiyorsun!</span>' : 'Lees het nog eens en probeer opnieuw. · <span class="tr" lang="tr">Bir daha oku ve tekrar dene.</span>') + '</p>' +
        '<button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    function basla() { sorular = karistir(b.sorular); sira = 0; dogru = 0; soru(); }
    basla();
  }

  // ---------- Ezber: âyetler + sıraya dizme ----------
  BLOK.ezber = function (b, yer) {
    return '<section class="blok ezber"><h3>' + ikiSatir(b.baslik) + '</h3>' +
      '<ol class="ayetler">' + b.ayetler.map(function (a) {
        return '<li><p class="ar ayet" lang="ar">' + esc(a.ar) + '</p><p class="okunus">' + esc(a.okunus) + '</p>' + iki(a) + '</li>';
      }).join('') + '</ol></section>' +
      '<section class="blok oyun" data-ezber="' + yer.bi + '"><h3>Zet de âyets in de goede volgorde<small class="tr" lang="tr">Âyetleri doğru sıraya diz</small></h3><div class="oyun-ic"></div></section>';
  };
  function ezberKur(kok, b, yer) {
    var ic = kok.querySelector('.oyun-ic'), sira, hata;
    function basla() {
      sira = 0; hata = 0;
      var karisik = karistir(b.ayetler.map(function (a, i) { return { a: a, i: i }; }));
      ic.innerHTML = '<p class="sayac">Tik op de âyet die nu komt. <span class="tr" lang="tr">Sıradaki âyete dokun.</span></p>' +
        '<ol class="dizilen"></ol><div class="ayet-secenekler">' +
        karisik.map(function (k) { return '<button type="button" class="ayet-dugme ar" lang="ar" data-i="' + k.i + '">' + esc(k.a.ar) + '</button>'; }).join('') +
        '</div><div class="sonuc" role="status"></div>';
      ic.querySelectorAll('.ayet-dugme').forEach(function (d) {
        d.addEventListener('click', function () {
          if (Number(d.dataset.i) === sira) {
            var li = document.createElement('li');
            li.innerHTML = '<span class="ar" lang="ar">' + esc(b.ayetler[sira].ar) + '</span><small>' + esc(b.ayetler[sira].okunus) + '</small>';
            ic.querySelector('.dizilen').appendChild(li);
            d.remove(); sira++;
            if (sira === b.ayetler.length) bitis();
          } else {
            hata++;
            d.classList.add('yanlis');
            setTimeout(function () { d.classList.remove('yanlis'); }, 500);
          }
        });
      });
    }
    function bitis() {
      var y = hata === 0 ? 3 : hata <= 2 ? 2 : 1;
      yildizVer(yer.hafta, yer.konu + ':' + yer.bi, y);
      ic.querySelector('.ayet-secenekler').remove();
      ic.querySelector('.sonuc').innerHTML = '<div class="bitis">' + yildizCiz(y) + '<p>' +
        (hata === 0 ? 'Zonder fout! · <span class="tr" lang="tr">Hatasız!</span>' : hata + ' keer mis. · <span class="tr" lang="tr">' + hata + ' yanlış.</span>') +
        '</p><button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    basla();
  }

  // ---------- Medd oyunu ----------
  var MEDD = {
    tabii: { ad: 'Tabiî', ipucu: { nl: 'Geen hemze', tr: 'Hemze yok' }, neden: { nl: 'Na de med-letter komt geen hemze: Medd-i Tabiî, 2 tellen.', tr: 'Med harfinden sonra hemze yok: Medd-i Tabiî, 2 hareke.' } },
    muttasil: { ad: 'Muttasıl', ipucu: { nl: 'Eén hokje', tr: 'Tek kutu' }, neden: { nl: 'Med-letter en hemze in hetzelfde woord: Muttasıl, 4 tellen.', tr: 'Med harfi ile hemze aynı kelimede: Muttasıl, 4 hareke.' } },
    munfasil: { ad: 'Munfasıl', ipucu: { nl: 'Twee hokjes', tr: 'İki kutu' }, neden: { nl: 'Med-letter aan het einde, hemze in het volgende woord: Munfasıl, 4 tellen.', tr: 'Med harfi kelime sonunda, hemze sonraki kelimede: Munfasıl, 4 hareke.' }, kopru: true },
    lazim: { ad: 'Lâzım', ipucu: { nl: 'Şedde of sukûn', tr: 'Şedde ya da sükûn' }, neden: { nl: 'Na de med-letter komt een şedde of sukûn: Lâzım, 6 tellen.', tr: 'Med harfinden sonra şedde ya da sükûn: Lâzım, 6 hareke.' } },
  };
  BLOK.medd = function (b, yer) {
    return '<section class="blok oyun" data-medd="' + yer.bi + '"><h3>' + ikiSatir(b.baslik) + '</h3><div class="oyun-ic"></div></section>';
  };
  function meddKur(kok, b, yer) {
    var ic = kok.querySelector('.oyun-ic'), liste, sira, dogru;
    function soru() {
      var k = liste[sira];
      ic.innerHTML = '<p class="sayac">Woord ' + (sira + 1) + ' van ' + liste.length + '<span class="tr" lang="tr"> · Kelime ' + (sira + 1) + ' / ' + liste.length + '</span></p>' +
        '<div class="medd-kelime"><div class="kelime-yer">' + kelimeCiz(k.yazi, false) + '</div><p class="kaynak">' + esc(k.kaynak) + '</p></div>' +
        '<div class="secenekler uc">' + b.secenekler.map(function (t) {
          return '<button type="button" class="secenek" data-t="' + t + '">' + MEDD[t].ad + '<small>' + nl(MEDD[t].ipucu) + ' · ' + tr(MEDD[t].ipucu) + '</small></button>';
        }).join('') + '</div><div class="sonuc" role="status"></div>';
      ic.querySelectorAll('.secenek').forEach(function (d) {
        d.addEventListener('click', function () {
          var iyi = d.dataset.t === k.tur;
          if (iyi) dogru++;
          ic.querySelectorAll('.secenek').forEach(function (x) { x.disabled = true; if (x.dataset.t === k.tur) x.classList.add('dogru'); else if (x === d) x.classList.add('yanlis'); });
          ic.querySelector('.kelime-yer').innerHTML = kelimeCiz(k.yazi, true, MEDD[k.tur].kopru);
          ic.querySelector('.sonuc').innerHTML = '<div class="geri-bildirim ' + (iyi ? 'dogru' : 'yanlis') + '"><b>' + (iyi ? 'Goed! · Doğru!' : 'Bijna! · Neredeyse!') + '</b>' +
            iki(MEDD[k.tur].neden) + '<p class="okunus"><b>' + esc(k.okunus) + '</b> · ' + esc(k.nl) + ' · <span class="tr" lang="tr">' + esc(k.tr) + '</span></p></div>' +
            '<button type="button" class="dugme ana sonraki">' + (sira + 1 < liste.length ? 'Volgende<small>Sonraki</small>' : 'Uitslag<small>Sonuç</small>') + '</button>';
          var sn = ic.querySelector('.sonraki');
          sn.addEventListener('click', function () { sira++; if (sira < liste.length) soru(); else bitis(); });
          sn.focus({ preventScroll: true });
        });
      });
    }
    function bitis() {
      var y = puandanYildiz(dogru, liste.length);
      yildizVer(yer.hafta, yer.konu + ':' + yer.bi, y);
      ic.innerHTML = '<div class="bitis"><div class="puan">' + dogru + ' / ' + liste.length + '</div>' + yildizCiz(y) +
        '<button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    function basla() { liste = karistir(b.kelimeler); sira = 0; dogru = 0; soru(); }
    basla();
  }

  BLOK.baglanti = function (b) {
    return '<section class="blok baglanti">' + (b.metin ? iki(b.metin) : '') +
      '<a class="dugme ana" href="' + esc(b.adres) + '" target="_blank" rel="noopener">' + ikiSatir(b.dugme) + '</a></section>';
  };

  // =========================================================
  // Sayfalar
  // =========================================================
  function anaSayfa() {
    document.title = 'Haftalık Dersler';
    ust.innerHTML = '<div class="kap"><a class="marka" href="#/">Haftalık Dersler</a><span class="alt-yazi">Weeklessen · Ahi Evran</span></div>';
    var kartlar = D.sira.slice().reverse().map(function (id, i) {
      var h = D.haftalar[id];
      if (!h) return '';
      var y = haftaYildizi(h);
      return '<a class="hafta-kart' + (i === 0 ? ' yeni' : '') + '" href="#/' + esc(h.id) + '">' +
        '<div class="hafta-no"><span>Week</span><b>' + esc(h.no) + '</b><small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></div>' +
        '<div class="hafta-bilgi">' + (i === 0 ? '<span class="rozet">Deze week<span class="tr" lang="tr"> · Bu hafta</span></span>' : '') +
        '<ul>' + h.konular.map(function (k) { return '<li class="renk-' + esc(k.renk) + '"><span class="nokta"></span>' + nl(k.ad) + '<small class="tr" lang="tr">' + tr(k.ad) + '</small></li>'; }).join('') + '</ul>' +
        '<div class="hafta-alt">' + yildizSayac(y.kazanilan, y.toplam) + '<span class="basla">Open<small>Aç</small></span></div></div></a>';
    }).join('');
    govde.innerHTML = '<div class="ana"><h1>Kies een week<span class="tr" lang="tr"> · Bir hafta seç</span></h1>' +
      '<p class="giris">Lees, draai de kaartjes om en verdien sterren met de spellen. <span class="tr" lang="tr">Oku, kartları çevir ve oyunlarla yıldız topla.</span></p>' +
      (hatalar.length ? '<div class="hata">' + hatalar.map(esc).join('<br>') + '</div>' : '') + kartlar + '</div>';
  }

  var acik = null;   // { hafta, konu }
  function haftaSayfasi(h, konuId) {
    var konu = h.konular.filter(function (k) { return k.id === konuId; })[0] || h.konular[0];
    document.title = 'Week ' + h.no + ' · Haftalık Dersler';
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/">‹ Alle weken<span class="tr" lang="tr"> · Tüm haftalar</span></a>' +
      '<span class="marka kucuk">Week ' + esc(h.no) + '<span class="tr" lang="tr"> · ' + esc(h.no) + '. hafta</span></span></div>';
    var sekmeler = h.konular.map(function (k) {
      return '<a class="sekme renk-' + esc(k.renk) + '" href="#/' + esc(h.id) + '/' + esc(k.id) + '"' + (k === konu ? ' aria-current="page"' : '') + '>' +
        nl(k.kisa) + '<small lang="tr">' + tr(k.kisa) + '</small></a>';
    }).join('');
    var bloklar = konu.bloklar.map(function (b, bi) {
      return BLOK[b.tur] ? BLOK[b.tur](b, { bi: bi }) : '';
    }).join('');
    var i = h.konular.indexOf(konu), sonraki = h.konular[i + 1];
    govde.innerHTML = '<nav class="sekmeler" aria-label="Onderwerpen · Konular">' + sekmeler + '</nav>' +
      '<article class="konu renk-' + esc(konu.renk) + '"><header class="konu-bas"><h1>' + nl(konu.ad) + '</h1><p class="tr" lang="tr">' + tr(konu.ad) + '</p></header>' +
      bloklar +
      (sonraki ? '<p class="devam"><a class="dugme" href="#/' + esc(h.id) + '/' + esc(sonraki.id) + '">Volgende: ' + nl(sonraki.kisa) + '<small>Sıradaki: ' + tr(sonraki.kisa) + '</small></a></p>'
               : '<p class="devam"><a class="dugme" href="#/">Klaar! Terug naar de weken<small>Bitti! Haftalara dön</small></a></p>') +
      '</article>';
    kartlariBagla(govde);
    konu.bloklar.forEach(function (b, bi) {
      var yer = { hafta: h.id, konu: konu.id, bi: bi };
      var q = govde.querySelector('[data-quiz="' + bi + '"]'); if (q) quizKur(q, b, yer);
      var e = govde.querySelector('[data-ezber="' + bi + '"]'); if (e) ezberKur(e, b, yer);
      var m = govde.querySelector('[data-medd="' + bi + '"]'); if (m) meddKur(m, b, yer);
    });
  }

  function yonlendir() {
    var p = location.hash.split('/');
    var h = D.haftalar[p[1]];
    if (!h) { acik = null; anaSayfa(); }
    else { haftaSayfasi(h, p[2]); }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', yonlendir);

  window.addEventListener('error', function (e) {
    var f = e.filename || '';
    if (f.indexOf('/haftalar/') !== -1) hatalar.push(f.split('/haftalar/')[1] + ', ' + e.lineno + '. satır: yazım hatası (' + e.message + ')');
  });

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all(D.sira.map(function (id) {
      return new Promise(function (bitti) {
        var s = document.createElement('script');
        s.src = 'haftalar/' + id + '.js';
        s.onload = function () { if (!D.haftalar[id]) hatalar.push('haftalar/' + id + '.js içinde id, dosya adıyla aynı olmalı.'); bitti(); };
        s.onerror = function () { hatalar.push('haftalar/' + id + '.js bulunamadı.'); bitti(); };
        document.head.appendChild(s);
      });
    })).then(yonlendir);
  });
})();
