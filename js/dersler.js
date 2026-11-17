/* ============================================================
   Ahi Evran Camii · Haftalık Dersler: uygulama

   Her hafta haftalar/ klasöründe ayrı bir dosyadır ve
   DERS.haftaEkle(...) ile eklenir. Sıra haftalar/liste.js içinde.

   Adresler:
     #/                    ana sayfa
     #/hafta-10            haftanın ilk konusu
     #/hafta-10/sabir      haftanın "sabir" konusu
     #/hafta-10/yaris      yarış sayfası: ortak puan tablosu + sınıf yarışı
     #/hafta-10/zor        zor yarış: tek kişilik, 20 soru, puan tabloya gönderilebilir

   Bir konunun içindeki parçalar (bloklar):
     sohbet   adım adım açılan hikâye: soru, cevap, ters köşe
     ozet     kısa maddeler
     hikaye   adım adım anlatılan bir misal
     kartlar  çevirmeli kartlar (önde soru, arkada cevap)
     quiz     çoktan seçmeli sorular, sonunda yıldız
     ezber    âyet âyet okunuş ve anlam + sıraya dizme oyunu
     medd     Arapça kelimede hangi med var oyunu
     baglanti başka bir sayfaya düğme

   Sunucu (js/tablo.js): Zor yarış hocanın açtığı hesaplarla oynanır, günde bir hak; puan tabloya kendiliğinden yazılır.
   Bu cihazda saklananlar (hiçbiri dışarı gönderilmez):
     dersler-yildiz   oyunlardan kazanılan yıldızlar
     dersler-isaret   kalemle yapılan renkli işaretler
     dersler-kalem    son seçilen kalem rengi
     dersler-yaris    sınıf yarışı isimleri ve en iyi puanlar
     dersler-hesap    Zor yarış oturumu (çıkış yapınca silinir)
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
  var kalemKutu = document.getElementById('kalem');
  var hatalar = [];
  var acik = null;        // açık konu: { hafta, konu }
  var temizlik = [];      // sayfa değişince durdurulacak sayaçlar
  var azHareket = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

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
  function oku(anahtar, yoksa) { try { return JSON.parse(localStorage.getItem(anahtar) || 'null') || yoksa; } catch (e) { return yoksa; } }
  function yaz(anahtar, deger) { try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) {} }

  // ---------- İşaretlenebilir metin ----------
  // Her kelime ayrı bir parçadır; kalem açıkken dokununca renklenir.
  // Metnin kısa bir özeti (data-ik) işaretin hangi cümleye ait olduğunu tutar.
  function ozetle(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function kw(metin) {
    metin = String(metin || '').trim();
    if (!metin) return '';
    var kelimeler = metin.split(/\s+/);
    // Boşluk kelimenin içinde kalır; böylece yan yana işaretli kelimeler kesintisiz boyanır.
    return '<span class="ik" data-ik="' + ozetle(metin) + '">' + kelimeler.map(function (k, i) {
      return '<span class="kw" data-i="' + i + '">' + esc(k) + (i < kelimeler.length - 1 ? ' ' : '') + '</span>';
    }).join('') + '</span>';
  }
  function ikiI(x) { return '<p>' + kw(nl(x)) + '</p>' + (tr(x) ? '<p class="tr" lang="tr">' + kw(tr(x)) + '</p>' : ''); }

  // ---------- Yıldızlar: sadece bu cihazda saklanır ----------
  var yildizlar = oku('dersler-yildiz', {});
  function yildizVer(hafta, anahtar, adet) {
    var k = hafta + ':' + anahtar;
    if ((yildizlar[k] || 0) >= adet) return;
    yildizlar[k] = adet;
    yaz('dersler-yildiz', yildizlar);
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
      var p = [], metin = '', acikIsaret = null;
      Array.from(soz).forEach(function (c) {
        var r = ISARET[c];
        if (!r) { metin += c; return; }
        if (acikIsaret === null) { if (metin) p.push({ y: metin, r: '' }); metin = ''; acikIsaret = r; }
        else { p.push({ y: metin, r: r }); metin = ''; acikIsaret = null; }
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
        return '<li><span class="simge" aria-hidden="true">' + esc(m.simge || '•') + '</span><div>' + ikiI(m) +
          (m.kaynak ? '<p class="kaynak">' + esc(m.kaynak) + '</p>' : '') + '</div></li>';
      }).join('') + '</ul></section>';
  };

  function anlamKutu(an) {
    return '<div class="anlam-kutu"><h4>' + ikiSatir(an.baslik) + '</h4><ul>' +
      an.eslesmeler.map(function (e) { return '<li><b>' + nl(e[0]) + '</b> = ' + nl(e[1]) + '<small class="tr" lang="tr">' + tr(e[0]) + ' = ' + tr(e[1]) + '</small></li>'; }).join('') +
      '</ul>' + (an.soru ? '<div class="dusun">' + iki(an.soru) + '</div>' : '') + '</div>';
  }

  BLOK.hikaye = function (b) {
    return '<section class="blok hikaye"><h3>' + ikiSatir(b.baslik) + '</h3>' +
      '<ol class="adimlar">' + b.adimlar.map(function (a) { return '<li><div>' + ikiI(a) + '</div></li>'; }).join('') + '</ol>' +
      (b.anlam ? anlamKutu(b.anlam) : '') + '</section>';
  };

  // ---------- Sohbet: adım adım açılan hikâye ----------
  // Her adım bir baloncuktur. Adımda "cevaplar" varsa çocuk bir cevap seçer,
  // "ters: true" ters köşe baloncuğudur, "ders: true" hikâyeden çıkan sonuçtur.
  BLOK.sohbet = function (b, yer) {
    return '<section class="blok sohbet" data-sohbet="' + yer.bi + '"><h3><span class="simge" aria-hidden="true">' + esc(b.simge || '💬') + '</span><span>' + ikiSatir(b.baslik) + '</span></h3>' +
      '<div class="balonlar" aria-live="polite"></div><div class="sohbet-alt"></div></section>';
  };
  function sohbetKur(kok, b) {
    var balonlar = kok.querySelector('.balonlar'), alt = kok.querySelector('.sohbet-alt'), i = 0;
    function ekle(html, sinif) {
      var d = document.createElement('div');
      d.className = 'balon' + (sinif ? ' ' + sinif : '');
      d.innerHTML = html;
      balonlar.appendChild(d);
      isaretleriUygula(d);
    }
    function gorunsun() { alt.scrollIntoView({ block: 'nearest', behavior: azHareket ? 'auto' : 'smooth' }); }
    function odak() { var d = alt.querySelector('button'); if (d) d.focus({ preventScroll: true }); }
    function adim() {
      var a = b.adimlar[i++];
      ekle((a.ters ? '<b class="etiket">Plottwist!<span class="tr" lang="tr"> · Ters köşe!</span></b>' : '') + ikiI(a) +
        (a.kaynak ? '<p class="kaynak">' + esc(a.kaynak) + '</p>' : ''), a.ters ? 'ters' : a.ders ? 'ders' : '');
      if (!a.cevaplar) { devam(); return; }
      alt.innerHTML = '<p class="sayac">Wat denk jij?<span class="tr" lang="tr"> · Sen ne dersin?</span></p><div class="cevaplar">' +
        a.cevaplar.map(function (c, ci) { return '<button type="button" class="cevap" data-c="' + ci + '">' + ikiSatir(c) + '</button>'; }).join('') + '</div>';
      alt.querySelectorAll('.cevap').forEach(function (d) {
        d.addEventListener('click', function () {
          var c = a.cevaplar[Number(d.dataset.c)];
          ekle(iki(c), 'ben');
          if (c.tepki) ekle(ikiI(c.tepki));
          devam(); gorunsun(); odak();
        });
      });
    }
    function devam() {
      if (i >= b.adimlar.length) {
        alt.innerHTML = (b.anlam ? anlamKutu(b.anlam) : '') + '<button type="button" class="dugme bastan">Opnieuw lezen<small>Baştan oku</small></button>';
        alt.querySelector('.bastan').addEventListener('click', function () { basla(); kok.scrollIntoView({ block: 'start', behavior: azHareket ? 'auto' : 'smooth' }); odak(); });
        return;
      }
      alt.innerHTML = '<button type="button" class="dugme ana">' + (b.adimlar[i].ters ? 'En toen?<small>Peki sonra?</small>' : 'Verder<small>Devam</small>') + '</button>';
      alt.querySelector('button').addEventListener('click', function () { adim(); gorunsun(); odak(); });
    }
    function basla() { balonlar.innerHTML = ''; i = 0; adim(); }
    basla();
  }

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
        var acikMi = k.getAttribute('aria-pressed') === 'true';
        k.setAttribute('aria-pressed', String(!acikMi));
        k.querySelector('.on').hidden = !acikMi;
        k.querySelector('.arka').hidden = acikMi;
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
        secenekler.map(function (c) { return '<button type="button" class="secenek" data-d="' + (c.dogru ? 1 : 0) + '">' + ikiSatir(c.x) + '</button>'; }).join('') +
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
        return '<li><p class="ar ayet" lang="ar">' + kw(a.ar) + '</p><p class="okunus">' + kw(a.okunus) + '</p>' + ikiI(a) + '</li>';
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
  function meddDugmeleri(secenekler) {
    return '<div class="secenekler uc">' + secenekler.map(function (t) {
      return '<button type="button" class="secenek" data-t="' + t + '">' + MEDD[t].ad + '<small>' + nl(MEDD[t].ipucu) + ' · ' + tr(MEDD[t].ipucu) + '</small></button>';
    }).join('') + '</div>';
  }
  function meddAciklama(k) {
    return iki(MEDD[k.tur].neden) + '<p class="okunus"><b>' + esc(k.okunus) + '</b> · ' + esc(k.nl) + ' · <span class="tr" lang="tr">' + esc(k.tr) + '</span></p>';
  }
  BLOK.medd = function (b, yer) {
    return '<section class="blok oyun" data-medd="' + yer.bi + '"><h3>' + ikiSatir(b.baslik) + '</h3><div class="oyun-ic"></div></section>';
  };
  function meddKur(kok, b, yer) {
    var ic = kok.querySelector('.oyun-ic'), liste, sira, dogru;
    function soru() {
      var k = liste[sira];
      ic.innerHTML = '<p class="sayac">Woord ' + (sira + 1) + ' van ' + liste.length + '<span class="tr" lang="tr"> · Kelime ' + (sira + 1) + ' / ' + liste.length + '</span></p>' +
        '<div class="medd-kelime"><div class="kelime-yer">' + kelimeCiz(k.yazi, false) + '</div><p class="kaynak">' + esc(k.kaynak) + '</p></div>' +
        meddDugmeleri(b.secenekler) + '<div class="sonuc" role="status"></div>';
      ic.querySelectorAll('.secenek').forEach(function (d) {
        d.addEventListener('click', function () {
          var iyi = d.dataset.t === k.tur;
          if (iyi) dogru++;
          ic.querySelectorAll('.secenek').forEach(function (x) { x.disabled = true; if (x.dataset.t === k.tur) x.classList.add('dogru'); else if (x === d) x.classList.add('yanlis'); });
          ic.querySelector('.kelime-yer').innerHTML = kelimeCiz(k.yazi, true, MEDD[k.tur].kopru);
          ic.querySelector('.sonuc').innerHTML = '<div class="geri-bildirim ' + (iyi ? 'dogru' : 'yanlis') + '"><b>' + (iyi ? 'Goed! · Doğru!' : 'Bijna! · Neredeyse!') + '</b>' +
            meddAciklama(k) + '</div>' +
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
  // İşaret kalemi
  // Kalem açıkken: kelimeye dokun ya da parmağını cümlenin üstünden
  // yana doğru kaydır. Aşağı yukarı kaydırma sayfayı kaydırır.
  // İşaretler konu konu bu cihazda saklanır.
  // =========================================================
  var KALEM_RENKLERI = ['Geel · Sarı', 'Groen · Yeşil', 'Roze · Pembe', 'Blauw · Mavi'];
  var isaretler = oku('dersler-isaret', {});
  var kalem = { acik: false, renk: 1 };   // renk 0 = silgi
  (function () { var r = Number(oku('dersler-kalem', 1)); if (r >= 1 && r <= 4) kalem.renk = r; })();

  function sayfaAnahtari() { return acik ? acik.hafta + ':' + acik.konu : null; }
  function isaretleriUygula(kok) {
    var s = isaretler[sayfaAnahtari()];
    if (!s) return;
    kok.querySelectorAll('.ik').forEach(function (el) {
      var d = s[el.dataset.ik];
      if (!d) return;
      for (var n = 0; n < el.children.length && n < d.length; n++) if (d.charAt(n) !== '0') el.children[n].classList.add('m' + d.charAt(n));
    });
  }
  function kelimeRengi(w) { var m = /(?:^|\s)m([1-4])(?:\s|$)/.exec(w.className); return m ? Number(m[1]) : 0; }
  function boya(w, r) {
    w.classList.remove('m1', 'm2', 'm3', 'm4');
    if (r) w.classList.add('m' + r);
  }
  function isaretKaydet(el) {
    var a = sayfaAnahtari();
    if (!a) return;
    var d = '';
    for (var n = 0; n < el.children.length; n++) d += kelimeRengi(el.children[n]);
    d = d.replace(/0+$/, '');
    var s = isaretler[a] || (isaretler[a] = {});
    if (d) s[el.dataset.ik] = d; else delete s[el.dataset.ik];
    if (!Object.keys(s).length) delete isaretler[a];
    yaz('dersler-isaret', isaretler);
    // Aynı cümle sayfada iki kez varsa (baştan okunan sohbet gibi) ikisi de aynı görünsün
    govde.querySelectorAll('.ik[data-ik="' + el.dataset.ik + '"]').forEach(function (es) {
      if (es === el) return;
      for (var n = 0; n < es.children.length; n++) boya(es.children[n], Number(d.charAt(n)) || 0);
    });
  }

  var KALEM_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 3.5l6 6-9 9H5.5v-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path class="iz" d="M4 21.5h10" fill="none" stroke-width="3" stroke-linecap="round"/></svg>';
  function kalemCiz() {
    kalemKutu.innerHTML = '<button type="button" class="kalem-ac" aria-expanded="false">' + KALEM_SVG + '<span>Stift<small>Kalem</small></span></button>' +
      '<div class="kalem-cubuk" hidden><div class="kap">' +
      '<div class="kalem-ust"><p class="kalem-ipucu">Tik op een woord of veeg over de zin. <span class="tr" lang="tr">Kelimeye dokun ya da cümlenin üstünden kaydır.</span></p>' +
      '<button type="button" class="arac kalem-kapat">Klaar<small>Bitti</small></button></div>' +
      '<div class="kalem-dugmeler" role="toolbar" aria-label="Markeerstift · İşaret kalemi">' +
      KALEM_RENKLERI.map(function (ad, i) { return '<button type="button" class="renk m' + (i + 1) + '" data-r="' + (i + 1) + '" aria-label="' + ad + '" aria-pressed="false"></button>'; }).join('') +
      '<button type="button" class="arac silgi" data-r="0" aria-pressed="false">Gum<small>Silgi</small></button>' +
      '<button type="button" class="arac temizle">Wis alles<small>Hepsini sil</small></button>' +
      '</div></div></div>';
    kalemKutu.querySelector('.kalem-ac').addEventListener('click', function () { kalemAc(true); });
    kalemKutu.querySelector('.kalem-kapat').addEventListener('click', function () { kalemAc(false); });
    kalemKutu.querySelectorAll('[data-r]').forEach(function (d) {
      d.addEventListener('click', function () {
        kalem.renk = Number(d.dataset.r);
        if (kalem.renk) yaz('dersler-kalem', kalem.renk);
        kalemGuncelle();
      });
    });
    var temizle = kalemKutu.querySelector('.temizle'), eminMi = null;
    temizle.addEventListener('click', function () {
      if (!eminMi) {   // yanlışlıkla silinmesin diye iki dokunuş
        temizle.innerHTML = 'Zeker?<small>Emin misin?</small>';
        temizle.classList.add('emin');
        eminMi = setTimeout(sifirla, 3000);
        return;
      }
      delete isaretler[sayfaAnahtari()];
      yaz('dersler-isaret', isaretler);
      govde.querySelectorAll('.kw').forEach(function (w) { boya(w, 0); });
      sifirla();
    });
    function sifirla() { clearTimeout(eminMi); eminMi = null; temizle.innerHTML = 'Wis alles<small>Hepsini sil</small>'; temizle.classList.remove('emin'); }
    kalemGuncelle();
  }
  function kalemGuncelle() {
    kalemKutu.querySelectorAll('[data-r]').forEach(function (d) { d.setAttribute('aria-pressed', String(Number(d.dataset.r) === kalem.renk)); });
    kalemKutu.setAttribute('data-renk', kalem.renk);
  }
  function kalemAc(ac) {
    kalem.acik = ac;
    if (ac && !kalem.renk) kalem.renk = Number(oku('dersler-kalem', 1)) || 1;   // silgide kalmasın
    document.body.classList.toggle('kalem-acik', ac);
    kalemKutu.querySelector('.kalem-ac').hidden = ac;
    kalemKutu.querySelector('.kalem-ac').setAttribute('aria-expanded', String(ac));
    kalemKutu.querySelector('.kalem-cubuk').hidden = !ac;
    kalemGuncelle();
    var odak = kalemKutu.querySelector(ac ? '[aria-pressed="true"]' : '.kalem-ac');
    if (odak) odak.focus({ preventScroll: true });
  }
  function kalemGoster(goster) {
    if (!kalemKutu) return;
    if (!goster) { if (kalem.acik) kalemAc(false); kalemKutu.hidden = true; return; }
    if (!kalemKutu.firstChild) kalemCiz();
    kalemKutu.hidden = false;
  }

  // Çizim: dokunma ve fare aynı olaylarla gelir (pointer events)
  var cizim = null;
  function kelimeBul(x, y) { var el = document.elementFromPoint(x, y); return el && el.closest ? el.closest('.kw') : null; }
  function arayiBoya(a, b) {
    var kap = b.parentNode;
    cizim.kirli.push(kap);
    if (a.parentNode !== kap) { boya(b, kalem.renk); return; }
    var i = Number(a.dataset.i), j = Number(b.dataset.i);
    for (var n = Math.min(i, j); n <= Math.max(i, j); n++) boya(kap.children[n], kalem.renk);
  }
  govde.addEventListener('pointerdown', function (e) {
    if (!kalem.acik || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var w = e.target.closest ? e.target.closest('.kw') : null;
    if (!w) return;
    cizim = { ilk: w, son: w, oynadi: false, kirli: [w.parentNode] };
    if (e.pointerType === 'mouse') e.preventDefault();   // metin seçilmesin
  });
  govde.addEventListener('pointermove', function (e) {
    if (!cizim) return;
    var w = kelimeBul(e.clientX, e.clientY);
    if (!w || w === cizim.son) return;
    if (!cizim.oynadi) { cizim.oynadi = true; boya(cizim.ilk, kalem.renk); }
    arayiBoya(cizim.son, w);
    cizim.son = w;
  });
  function cizimBitti(e) {
    if (!cizim) return;
    // Tek dokunuş: aynı renkse kaldır, değilse boya. Kaydırma iptal olduysa (sayfa kaydı) dokunma sayılmaz.
    var dokunus = !cizim.oynadi && e.type === 'pointerup';
    if (dokunus) boya(cizim.ilk, kelimeRengi(cizim.ilk) === kalem.renk ? 0 : kalem.renk);
    if (dokunus || cizim.oynadi) cizim.kirli.filter(function (k, i, l) { return l.indexOf(k) === i; }).forEach(isaretKaydet);
    cizim = null;
  }
  window.addEventListener('pointerup', cizimBitti);
  window.addEventListener('pointercancel', cizimBitti);

  // =========================================================
  // Yarış: isimle oynanan quiz
  // Sorular haftanın quiz ve med bloklarından gelir. Tek cihazda sırayla
  // oynanır. İsimler ve en iyi puanlar sadece bu cihazda saklanır.
  // =========================================================
  var YARIS = { tur: 5, sure: 20, enCok: 8, puan: 100, hiz: 50 };
  var yarisKayit = oku('dersler-yaris', { isimler: [], skor: {} });
  if (!yarisKayit.isimler) yarisKayit.isimler = [];
  if (!yarisKayit.skor) yarisKayit.skor = {};

  function yarisSorulari(h) {
    var l = [];
    h.konular.forEach(function (k) {
      k.bloklar.forEach(function (b) {
        if (b.tur === 'quiz') b.sorular.forEach(function (s) { l.push({ konu: k, soru: s }); });
        if (b.tur === 'medd') b.kelimeler.forEach(function (w) { l.push({ konu: k, medd: w, secenekler: b.secenekler }); });
      });
    });
    return l;
  }
  // Med kelimeleri soruların en çok üçte biri olur; havuz yetmezse sorular yeniden dağıtılır.
  function soruSec(havuz, adet) {
    var quiz = karistir(havuz.filter(function (s) { return !s.medd; })), medd = karistir(havuz.filter(function (s) { return s.medd; }));
    var nM = Math.min(medd.length, Math.floor(adet / 3));
    if (quiz.length < adet - nM) nM = Math.min(medd.length, adet - quiz.length);
    var l = quiz.slice(0, adet - nM).concat(medd.slice(0, nM)), hepsi = karistir(havuz), k = 0;
    while (l.length < adet) l.push(hepsi[k++ % hepsi.length]);
    return karistir(l);
  }
  function siralamaCiz(h) {
    var s = yarisKayit.skor[h.id] || {};
    var l = Object.keys(s).map(function (ad) { return { ad: ad, puan: s[ad] }; }).sort(function (a, b) { return b.puan - a.puan; }).slice(0, 10);
    return '<section class="blok siralama"><h3>Ranglijst op dit apparaat<small class="tr" lang="tr">Bu cihazdaki sıralama</small></h3>' +
      (l.length ? '<ol class="sira-liste">' + l.map(function (o, i) { return '<li><span class="sira-no">' + (i + 1) + '</span><span class="sira-ad">' + esc(o.ad) + '</span><b>' + o.puan + '</b></li>'; }).join('') + '</ol>' +
        '<button type="button" class="dugme kucuk sil">Wis namen en ranglijst<small>İsimleri ve sıralamayı sil</small></button>'
        : '<p class="sayac">Nog geen scores. <span class="tr" lang="tr">Henüz puan yok.</span></p>') + '</section>';
  }

  function yarisSayfasi(h) {
    var havuz = yarisSorulari(h), oyuncular = [], sorular = [], sira = 0, sayac = null;
    document.title = 'Wedstrijd week ' + h.no + ' · Ahi Evran Camii';
    ust.className = 'ust';
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/' + esc(h.id) + '">‹ Week ' + esc(h.no) + '<span class="tr" lang="tr"> · ' + esc(h.no) + '. hafta</span></a>' +
      '<span class="marka kucuk">Wedstrijd<span class="tr" lang="tr"> · Yarış</span></span></div>';
    temizlik.push(function () { clearInterval(sayac); });
    if (!havuz.length) { govde.innerHTML = '<p class="giris">Deze week heeft nog geen vragen. <span class="tr" lang="tr">Bu haftanın henüz sorusu yok.</span></p>'; return; }
    kurulum();

    // ---------- 1. Kimler yarışıyor? ----------
    function kurulum(uyari) {
      var eski = yarisKayit.isimler.filter(function (ad) { return !oyuncular.some(function (o) { return o.ad.toLowerCase() === ad.toLowerCase(); }); });
      var zorVar = !!(h.zor && h.zor.length && window.TABLO);
      govde.innerHTML = '<div class="yaris"><h1>Wedstrijd van week ' + esc(h.no) + '<span class="tr" lang="tr"> · ' + esc(h.no) + '. hafta yarışı</span></h1>' +
        (zorVar ? '<a class="zor-kart" href="#/' + esc(h.id) + '/zor"><span class="zor-yazi"><b>Moeilijke wedstrijd<small class="tr" lang="tr">Zor yarış</small></b>' +
          '<span>' + ZOR.tur + ' moeilijke vragen, elke dag één kans. Log in en zet je naam op het scorebord!<small class="tr" lang="tr">' + ZOR.tur + ' zor soru, her gün bir hak. Giriş yap, ismini tabloya yazdır!</small></span></span><span class="ok" aria-hidden="true">›</span></a>' + tabloKutusu() +
          '<h2 class="alt-baslik">Klaswedstrijd<span class="tr" lang="tr"> · Sınıf yarışı</span></h2>' : '') +
        '<p class="giris">Iedereen krijgt ' + YARIS.tur + ' vragen en ' + YARIS.sure + ' seconden per vraag. Goed is ' + YARIS.puan + ' punten, snel antwoorden geeft tot ' + YARIS.hiz + ' extra. ' +
        '<span class="tr" lang="tr">Herkese ' + YARIS.tur + ' soru, her soruya ' + YARIS.sure + ' saniye. Doğru cevap ' + YARIS.puan + ' puan, hızlı cevap ' + YARIS.hiz + ' puana kadar ek puan.</span></p>' +
        '<section class="blok"><h3>Wie doet mee?<small class="tr" lang="tr">Kimler yarışıyor?</small></h3>' +
        '<form class="isim-form"><label for="isim">Naam of teamnaam<span class="tr" lang="tr"> · İsim ya da takım adı</span></label>' +
        '<div class="isim-satir"><input id="isim" type="text" maxlength="14" autocomplete="off" autocapitalize="words" enterkeyhint="done">' +
        '<button type="submit" class="dugme">Voeg toe<small>Ekle</small></button></div>' +
        '<p class="uyari" role="alert">' + (uyari || '') + '</p></form>' +
        (oyuncular.length ? '<ul class="oyuncular">' + oyuncular.map(function (o, i) {
          return '<li><span>' + esc(o.ad) + '</span><button type="button" class="cikar" data-i="' + i + '" aria-label="' + esc(o.ad) + ': verwijder · çıkar">×</button></li>';
        }).join('') + '</ul>' : '') +
        (eski.length ? '<p class="sayac">Eerder op dit apparaat<span class="tr" lang="tr"> · Bu cihazda daha önce</span></p><div class="eski">' +
          eski.map(function (ad) { return '<button type="button" class="eski-ad" data-ad="' + esc(ad) + '">+ ' + esc(ad) + '</button>'; }).join('') + '</div>' : '') +
        '<p class="not">Eén telefoon of het grote scherm, om de beurt. Alleen spelen kan ook. Namen blijven op dit apparaat, er wordt niets verstuurd. ' +
        '<span class="tr" lang="tr">Tek telefon ya da büyük ekran, sırayla. Tek başına da oynanır. İsimler bu cihazda kalır, hiçbir yere gönderilmez.</span></p>' +
        '<button type="button" class="dugme ana buyuk yaris-basla"' + (oyuncular.length ? '' : ' disabled') + '>Start de wedstrijd<small>Yarışı başlat</small></button></section>' +
        siralamaCiz(h) + '</div>';
      var giris = govde.querySelector('#isim');
      govde.querySelector('.isim-form').addEventListener('submit', function (e) { e.preventDefault(); ekle(giris.value); });
      govde.querySelectorAll('.cikar').forEach(function (d) { d.addEventListener('click', function () { oyuncular.splice(Number(d.dataset.i), 1); kurulum(); }); });
      govde.querySelectorAll('.eski-ad').forEach(function (d) { d.addEventListener('click', function () { ekle(d.dataset.ad); }); });
      govde.querySelector('.yaris-basla').addEventListener('click', basla);
      silmeyiBagla(function () { kurulum(); });
      if (zorVar) tabloDoldur(govde, h, null, false);
      if (uyari !== undefined) giris.focus({ preventScroll: true });
    }
    function ekle(ad) {
      ad = String(ad || '').replace(/\s+/g, ' ').trim().slice(0, 14);
      if (!ad) { kurulum(''); return; }
      if (oyuncular.length >= YARIS.enCok) { kurulum('Maximaal ' + YARIS.enCok + ' spelers. <span class="tr" lang="tr">En fazla ' + YARIS.enCok + ' oyuncu.</span>'); return; }
      if (oyuncular.some(function (o) { return o.ad.toLowerCase() === ad.toLowerCase(); })) { kurulum('Deze naam doet al mee. <span class="tr" lang="tr">Bu isim zaten var.</span>'); return; }
      oyuncular.push({ ad: ad, puan: 0, dogru: 0 });
      kurulum('');
    }
    function silmeyiBagla(sonra) {
      var sil = govde.querySelector('.siralama .sil'), eminMi = false;
      if (!sil) return;
      sil.addEventListener('click', function () {
        // Yanlışlıkla silinmesin diye iki dokunuş
        if (!eminMi) { eminMi = true; sil.innerHTML = 'Zeker? Tik nog een keer<small>Emin misin? Bir daha dokun</small>'; sil.classList.add('emin'); return; }
        yarisKayit = { isimler: [], skor: {} };
        yaz('dersler-yaris', yarisKayit);
        sonra();
      });
    }

    // ---------- 2. Oyun ----------
    function basla() {
      oyuncular.forEach(function (o) { o.puan = 0; o.dogru = 0; });
      sorular = soruSec(havuz, oyuncular.length * YARIS.tur);
      sira = 0;
      // İsimler bir sonraki sefer tek dokunuşla eklensin
      oyuncular.forEach(function (o) { if (yarisKayit.isimler.indexOf(o.ad) === -1) yarisKayit.isimler.push(o.ad); });
      yarisKayit.isimler = yarisKayit.isimler.slice(-30);
      yaz('dersler-yaris', yarisKayit);
      govde.innerHTML = '<div class="yaris hazir"><p class="sayac">Wedstrijd van week ' + esc(h.no) + '<span class="tr" lang="tr"> · ' + esc(h.no) + '. hafta yarışı</span></p>' +
        '<p class="kim-buyuk">' + esc(oyuncular[0].ad) + '</p>' +
        '<p class="hazir-yazi">' + (oyuncular.length > 1 ? 'begint! Geef de telefoon aan ' + esc(oyuncular[0].ad) + '.<span class="tr" lang="tr">İlk sıra onda. Telefonu ona ver.</span>'
                                                         : 'Klaar? ' + YARIS.tur + ' vragen.<span class="tr" lang="tr">Hazır mısın? ' + YARIS.tur + ' soru.</span>') + '</p>' +
        '<button type="button" class="dugme ana buyuk">Start<small>Başla</small></button></div>';
      govde.querySelector('button').addEventListener('click', soru);
      window.scrollTo(0, 0);
    }
    function skorMini(aktif) {
      if (oyuncular.length < 2) return '';
      return '<ol class="skor-mini">' + oyuncular.map(function (o, i) { return '<li' + (i === aktif ? ' class="aktif"' : '') + '><span>' + esc(o.ad) + '</span><b>' + o.puan + '</b></li>'; }).join('') + '</ol>';
    }
    function soru() {
      var s = sorular[sira], oi = sira % oyuncular.length, o = oyuncular[oi], tur = Math.floor(sira / oyuncular.length) + 1;
      var bitti = false, bas = Date.now();
      var secenekler = s.medd ? null : karistir(s.soru.secenekler.map(function (x, i) { return { x: x, dogru: i === s.soru.dogru }; }));
      govde.innerHTML = '<div class="yaris oyunda renk-' + esc(s.konu.renk) + '">' +
        '<div class="yaris-ust"><div class="kim"><small>Aan de beurt<span class="tr" lang="tr"> · Sırada</span></small><b>' + esc(o.ad) + '</b></div>' +
        '<div class="tur-no"><b>' + o.puan + '</b><small>Vraag ' + tur + ' / ' + YARIS.tur + '<span class="tr" lang="tr"> · Soru ' + tur + ' / ' + YARIS.tur + '</span></small></div></div>' +
        '<div class="sure" role="timer" aria-label="Tijd · Süre"><div class="sure-yol"><div class="sure-cubuk"></div></div><span class="sure-sn">' + YARIS.sure + '</span></div>' +
        '<section class="blok oyun"><p class="konu-etiket">' + nl(s.konu.kisa) + '<span class="tr" lang="tr"> · ' + tr(s.konu.kisa) + '</span></p>' +
        (s.medd
          ? '<div class="soru"><p>Welke medd zie je?</p><p class="tr" lang="tr">Hangi med?</p></div><div class="medd-kelime"><div class="kelime-yer">' + kelimeCiz(s.medd.yazi, false) + '</div><p class="kaynak">' + esc(s.medd.kaynak) + '</p></div>' + meddDugmeleri(s.secenekler)
          : '<div class="soru">' + iki(s.soru.soru) + '</div><div class="secenekler">' + secenekler.map(function (c) { return '<button type="button" class="secenek" data-d="' + (c.dogru ? 1 : 0) + '">' + ikiSatir(c.x) + '</button>'; }).join('') + '</div>') +
        '<div class="sonuc" role="status"></div></section>' + skorMini(oi) + '</div>';
      window.scrollTo(0, 0);
      var cubuk = govde.querySelector('.sure-cubuk'), sn = govde.querySelector('.sure-sn'), sureKutu = govde.querySelector('.sure');
      function kalan() { return Math.max(0, YARIS.sure - (Date.now() - bas) / 1000); }
      clearInterval(sayac);
      sayac = setInterval(function () {
        var k = kalan();
        cubuk.style.transform = 'scaleX(' + (k / YARIS.sure) + ')';
        sn.textContent = Math.ceil(k);
        sureKutu.classList.toggle('az', k <= 5);
        if (k <= 0) cevap(null);
      }, 100);
      govde.querySelectorAll('.secenek').forEach(function (d) { d.addEventListener('click', function () { cevap(d); }); });

      function cevap(d) {
        if (bitti) return;
        bitti = true;
        clearInterval(sayac);
        var k = kalan();
        var iyi = !!d && (s.medd ? d.dataset.t === s.medd.tur : d.dataset.d === '1');
        var kazanc = iyi ? YARIS.puan + Math.round(YARIS.hiz * k / YARIS.sure) : 0;
        o.puan += kazanc; if (iyi) o.dogru++;
        govde.querySelectorAll('.secenek').forEach(function (x) {
          x.disabled = true;
          var dogruMu = s.medd ? x.dataset.t === s.medd.tur : x.dataset.d === '1';
          if (dogruMu) x.classList.add('dogru'); else if (x === d) x.classList.add('yanlis');
        });
        if (s.medd) govde.querySelector('.kelime-yer').innerHTML = kelimeCiz(s.medd.yazi, true, MEDD[s.medd.tur].kopru);
        govde.querySelector('.tur-no b').textContent = o.puan;
        var mini = govde.querySelector('.skor-mini'); if (mini) mini.outerHTML = skorMini(oi);
        var son = sira + 1 >= sorular.length, sonraki = son ? null : oyuncular[(sira + 1) % oyuncular.length];
        govde.querySelector('.sonuc').innerHTML = '<div class="geri-bildirim ' + (iyi ? 'dogru' : 'yanlis') + '"><b>' +
          (iyi ? '+' + kazanc + ' · Goed! · Doğru!' : d ? 'Helaas! · Olmadı!' : 'Tijd is om! · Süre doldu!') + '</b>' +
          (s.medd ? meddAciklama(s.medd) : s.soru.aciklama ? iki(s.soru.aciklama) : '') + '</div>' +
          '<button type="button" class="dugme ana buyuk sonraki">' +
          (son ? 'Uitslag<small>Sonuç</small>' : oyuncular.length > 1 ? 'Nu: ' + esc(sonraki.ad) + '<small>Sıra: ' + esc(sonraki.ad) + '</small>' : 'Volgende<small>Sonraki</small>') + '</button>';
        var dugme = govde.querySelector('.sonraki');
        dugme.addEventListener('click', function () { sira++; if (son) sonuc(); else soru(); });
        dugme.focus({ preventScroll: true });
        dugme.scrollIntoView({ block: 'nearest' });
      }
    }

    // ---------- 3. Sonuç ----------
    function sonuc() {
      var l = oyuncular.slice().sort(function (a, b) { return b.puan - a.puan || b.dogru - a.dogru; });
      var skor = yarisKayit.skor[h.id] || (yarisKayit.skor[h.id] = {});
      var rekor = false;
      oyuncular.forEach(function (o) { if (o.puan > (skor[o.ad] || 0)) { if (skor[o.ad] !== undefined) rekor = true; skor[o.ad] = o.puan; } });
      yaz('dersler-yaris', yarisKayit);
      var berabere = l.length > 1 && l[0].puan === l[1].puan;
      var basari = l.length === 1 ? '<p class="kim-buyuk">' + l[0].puan + '</p><p class="hazir-yazi">punten, ' + esc(l[0].ad) + '!' + (rekor ? ' Nieuw record!' : '') + '<span class="tr" lang="tr">puan, ' + esc(l[0].ad) + '!' + (rekor ? ' Yeni rekor!' : '') + '</span></p>'
        : berabere ? '<p class="kim-buyuk">Gelijkspel!</p><p class="hazir-yazi tr" lang="tr">Berabere!</p>'
        : '<p class="kim-buyuk">' + esc(l[0].ad) + '</p><p class="hazir-yazi">wint de wedstrijd!<span class="tr" lang="tr">yarışı kazandı!</span></p>';
      var no = 0;
      govde.innerHTML = '<div class="yaris sonuc-ekrani"><div class="kazanan">' + basari + '</div>' +
        '<section class="blok"><h3>Uitslag<small class="tr" lang="tr">Sonuç</small></h3><ol class="sira-liste buyuk">' +
        l.map(function (o, i) {
          if (i === 0 || o.puan !== l[i - 1].puan) no = i + 1;
          return '<li class="s' + no + '"><span class="sira-no">' + no + '</span><span class="sira-ad">' + esc(o.ad) + '<small>' + o.dogru + ' / ' + YARIS.tur + ' goed · doğru</small></span><b>' + o.puan + '</b></li>';
        }).join('') + '</ol>' +
        '<div class="yaris-dugmeler"><button type="button" class="dugme ana tekrar-oyna">Nog een keer<small>Tekrar oyna</small></button>' +
        '<button type="button" class="dugme degistir">Andere spelers<small>Oyuncuları değiştir</small></button>' +
        '<a class="dugme" href="#/' + esc(h.id) + '">Terug naar week ' + esc(h.no) + '<small>' + esc(h.no) + '. haftaya dön</small></a></div></section>' +
        siralamaCiz(h) + '</div>';
      govde.querySelector('.tekrar-oyna').addEventListener('click', basla);
      govde.querySelector('.degistir').addEventListener('click', function () { kurulum(); window.scrollTo(0, 0); });
      silmeyiBagla(function () { govde.querySelector('.siralama').outerHTML = siralamaCiz(h); });
      window.scrollTo(0, 0);
    }
  }

  // =========================================================
  // Ortak puan tablosu (görünüm) ve Zor yarış
  // Sunucu işi js/tablo.js içindedir.
  // =========================================================
  var ZOR = { tur: 20, sure: 30, puan: 100, hiz: 50 };

  function tabloKutusu() {
    return '<section class="blok tablo" data-tablo><h3>Scorebord<small class="tr" lang="tr">Puan tablosu</small></h3>' +
      '<div class="tablo-ic" aria-live="polite"><p class="sayac">Laden…<span class="tr" lang="tr"> · Yükleniyor…</span></p></div></section>';
  }
  // yenile: önbelleği atla (puan gönderdikten sonra)
  function tabloDoldur(kok, h, benimId, yenile) {
    var ic = kok.querySelector('.tablo-ic');
    if (!ic) return;
    ic.innerHTML = '<p class="sayac">Laden…<span class="tr" lang="tr"> · Yükleniyor…</span></p>';
    window.TABLO.oku(h.id, 10, yenile).then(function (l) {
      if (!ic.isConnected) return;   // sayfa değişti
      if (!l.length) { ic.innerHTML = '<p class="sayac">Nog niemand op het scorebord. Wees de eerste!<span class="tr" lang="tr"> · Tabloda henüz kimse yok. İlk sen ol!</span></p>'; return; }
      var no = 0;
      ic.innerHTML = '<ol class="sira-liste buyuk">' + l.map(function (o, i) {
        if (i === 0 || o.puan !== l[i - 1].puan) no = i + 1;
        return '<li class="s' + no + (o.id === benimId ? ' ben' : '') + '"><span class="sira-no">' + no + '</span><span class="sira-ad">' + esc(o.ad) + '<small>' + o.dogru + ' / ' + ZOR.tur + ' goed · doğru</small></span><b>' + o.puan + '</b></li>';
      }).join('') + '</ol>';
    }, function () {
      if (!ic.isConnected) return;
      ic.innerHTML = '<p class="uyari">Het scorebord is nu niet bereikbaar. Controleer je internet en probeer opnieuw.<span class="tr" lang="tr"> · Puan tablosu şu an açılmıyor. İnternetini kontrol edip tekrar dene.</span></p>' +
        '<button type="button" class="dugme kucuk yeniden">Opnieuw proberen<small>Tekrar dene</small></button>';
      ic.querySelector('.yeniden').addEventListener('click', function () { tabloDoldur(kok, h, benimId, true); });
    });
  }

  // Havuzdan her konudan eşit sayıda rastgele soru seçer (40 soru, 4 konu -> her konudan 5).
  function zorSec(havuz, adet) {
    var gruplar = {}, konular = [], l = [], i = 0;
    karistir(havuz).forEach(function (z) { if (!gruplar[z.konu]) { gruplar[z.konu] = []; konular.push(z.konu); } gruplar[z.konu].push(z); });
    adet = Math.min(adet, havuz.length);
    while (l.length < adet) { var g = gruplar[konular[i++ % konular.length]]; if (g.length) l.push(g.shift()); }
    return karistir(l);
  }

  function zorSayfasi(h) {
    var T = window.TABLO, havuz = h.zor || [], adet = Math.min(ZOR.tur, havuz.length);
    var ogr = null, onceki = null;                       // öğrenci { uid, ad } ve haftalık durumu
    var sorular = [], kacan = [], sira = 0, puan = 0, dogru = 0, sayac = null;
    document.title = 'Moeilijke wedstrijd week ' + h.no + ' · Ahi Evran Camii';
    ust.className = 'ust';
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/' + esc(h.id) + '/yaris">‹ Wedstrijd<span class="tr" lang="tr"> · Yarış</span></a>' +
      '<span class="marka kucuk">Zor yarış<span class="tr" lang="tr"> · Moeilijk</span></span></div>';
    temizlik.push(function () { clearInterval(sayac); });
    if (!havuz.length || !T) { govde.innerHTML = '<p class="giris">Deze wedstrijd is er nog niet. <span class="tr" lang="tr">Bu yarış henüz hazır değil.</span></p>'; return; }
    if (T.hesap()) yukle(); else girisEkrani();

    // Sayfa iskeleti: başlık, değişen kısım, puan tablosu
    function sayfa(ic) {
      govde.innerHTML = '<div class="yaris"><h1>Moeilijke wedstrijd<span class="tr" lang="tr"> · Zor yarış</span></h1>' + ic + tabloKutusu() + '</div>';
      tabloDoldur(govde, h, ogr ? ogr.uid : null, false);
    }
    function bekle() { sayfa('<section class="blok"><p class="sayac">Laden…<span class="tr" lang="tr"> · Yükleniyor…</span></p></section>'); }
    function hataYazi(e) {
      if (e && e.kod === 'AG') return 'Geen verbinding. Controleer je internet. <span class="tr" lang="tr">Bağlantı yok. İnternetini kontrol et.</span>';
      return 'Er ging iets mis. Probeer het opnieuw. <span class="tr" lang="tr">Bir şeyler ters gitti. Tekrar dene.</span>';
    }

    // ---------- 1. Giriş ----------
    function girisEkrani(uyari) {
      ogr = null;
      sayfa('<p class="giris">' + adet + ' moeilijke vragen over week ' + esc(h.no) + '. Elke dag één kans. Log in met de gebruikersnaam en het wachtwoord van je leraar. ' +
        '<span class="tr" lang="tr">' + esc(h.no) + '. haftadan ' + adet + ' zor soru, her gün bir hak. Hocanın verdiği kullanıcı adı ve şifreyle giriş yap.</span></p>' +
        '<section class="blok"><h3>Inloggen<small class="tr" lang="tr">Giriş yap</small></h3><form class="giris-form" novalidate>' +
        '<label for="kullanici">Gebruikersnaam<span class="tr" lang="tr"> · Kullanıcı adı</span></label>' +
        '<input id="kullanici" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="40">' +
        '<label for="sifre">Wachtwoord<span class="tr" lang="tr"> · Şifre</span></label>' +
        '<input id="sifre" type="password" autocomplete="current-password" maxlength="100">' +
        '<p class="uyari" role="alert">' + (uyari || '') + '</p>' +
        '<button type="submit" class="dugme ana buyuk">Inloggen<small>Giriş yap</small></button></form>' +
        '<p class="not">Wachtwoord vergeten? Vraag het aan je leraar. <span class="tr" lang="tr">Şifreni unuttuysan hocana sor.</span></p></section>');
      var form = govde.querySelector('.giris-form');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var k = form.querySelector('#kullanici').value, sf = form.querySelector('#sifre').value;
        if (!k.trim() || !sf) { form.querySelector('.uyari').innerHTML = 'Vul je gebruikersnaam en wachtwoord in. <span class="tr" lang="tr">Kullanıcı adını ve şifreni yaz.</span>'; return; }
        var d = form.querySelector('button'); d.disabled = true; d.innerHTML = 'Bezig…<small>Giriş yapılıyor…</small>';
        T.girisYap(k, sf).then(yukle, function (x) {
          var m = /TOO_MANY/.test(x.kod) ? 'Te vaak geprobeerd. Wacht even en probeer het later opnieuw. <span class="tr" lang="tr">Çok fazla deneme oldu. Biraz bekleyip tekrar dene.</span>'
            : /DISABLED/.test(x.kod) ? 'Dit account is uitgezet. Vraag het aan je leraar. <span class="tr" lang="tr">Bu hesap kapatılmış. Hocana sor.</span>'
            : x.kod === 'AG' ? hataYazi(x)
            : 'Gebruikersnaam of wachtwoord klopt niet. <span class="tr" lang="tr">Kullanıcı adı ya da şifre yanlış.</span>';
          girisEkrani(m);
          govde.querySelector('#kullanici').value = k;
          govde.querySelector('#sifre').focus({ preventScroll: true });
        });
      });
      if (uyari === undefined) { var ilk = govde.querySelector('#kullanici'); if (ilk && !('ontouchstart' in window)) ilk.focus({ preventScroll: true }); }
    }

    // ---------- 2. Kim, bugün hakkı var mı? ----------
    function yukle() {
      bekle();
      T.ogrenci().then(function (o) {
        ogr = o;
        return T.durum(h.id, o.uid);
      }).then(function (d) { onceki = d; hazir(); }, function (e) {
        if (e && e.kod === 'LISTEDE_YOK') {
          sayfa('<section class="blok"><p class="uyari">Je account staat nog niet op de klassenlijst. Vraag het aan je leraar. <span class="tr" lang="tr">Hesabın henüz sınıf listesinde değil. Hocana söyle.</span></p>' +
            '<button type="button" class="dugme kucuk cikis">Uitloggen<small>Çıkış</small></button></section>');
          govde.querySelector('.cikis').addEventListener('click', function () { T.cikis(); girisEkrani(); });
        } else if (!T.hesap()) girisEkrani('Log opnieuw in. <span class="tr" lang="tr">Tekrar giriş yap.</span>');
        else {
          sayfa('<section class="blok"><p class="uyari">' + hataYazi(e) + '</p><button type="button" class="dugme kucuk yeniden">Opnieuw proberen<small>Tekrar dene</small></button></section>');
          govde.querySelector('.yeniden').addEventListener('click', yukle);
        }
      });
    }
    function saatYazi() { return T.yeniHak().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }); }
    function hazir(uyari) {
      var kim = '<div class="hesap-satir"><span>Ingelogd als <b>' + esc(ogr.ad) + '</b><span class="tr" lang="tr"> · <b>' + esc(ogr.ad) + '</b> olarak girdin</span></span>' +
        '<button type="button" class="dugme kucuk cikis">Uitloggen<small>Çıkış</small></button></div>';
      var enIyi = onceki.puan > 0 ? '<p class="en-iyi">Je beste score deze week: <b>' + onceki.puan + '</b><span class="tr" lang="tr"> · Bu haftaki en iyi puanın: <b>' + onceki.puan + '</b></span></p>' : '';
      var ic = onceki.bugunOynadi
        ? '<section class="blok">' + kim + enIyi + '<div class="geri-bildirim"><b>Je hebt vandaag al gespeeld · Bugünkü hakkını kullandın</b>' +
            '<p>Morgen na ' + saatYazi() + ' mag je weer. Lees intussen de lessen nog eens door.</p><p class="tr" lang="tr">Yarın ' + saatYazi() + '’den sonra tekrar oynayabilirsin. Bu arada dersleri bir daha oku.</p></div>' +
            '<div class="yaris-dugmeler"><a class="dugme" href="#/' + esc(h.id) + '">Naar de lessen<small>Derslere git</small></a></div></section>'
        : '<section class="blok">' + kim + enIyi +
            '<p>' + adet + ' moeilijke vragen, ' + ZOR.sure + ' seconden per vraag. Goed is ' + ZOR.puan + ' punten, snel antwoorden geeft tot ' + ZOR.hiz + ' extra. Het goede antwoord zie je niet: zoek het daarna op in de les.</p>' +
            '<p class="tr" lang="tr">' + adet + ' zor soru, her soruya ' + ZOR.sure + ' saniye. Doğru cevap ' + ZOR.puan + ' puan, hızlı cevap ' + ZOR.hiz + ' puana kadar ek puan. Doğru cevap gösterilmez: sonra derste bul.</p>' +
            '<p class="not gizlilik"><b>Eén kans per dag.</b> Je kans telt zodra je op Start drukt. Stop je halverwege, dan is je kans voor vandaag op. Je beste score van de week komt op het scorebord. ' +
            '<span class="tr" lang="tr"><b>Günde bir hak.</b> Başla’ya bastığın an hakkın sayılır. Yarıda bırakırsan bugünkü hakkın gider. Haftanın en iyi puanın tabloya yazılır.</span></p>' +
            '<p class="uyari" role="alert">' + (uyari || '') + '</p>' +
            '<button type="button" class="dugme ana buyuk zor-basla">Start<small>Başla</small></button></section>';
      sayfa(ic);
      govde.querySelector('.cikis').addEventListener('click', function () { T.cikis(); girisEkrani(); });
      var b = govde.querySelector('.zor-basla');
      if (b) b.addEventListener('click', function () {
        b.disabled = true; b.innerHTML = 'Bezig…<small>Hazırlanıyor…</small>';
        T.basla(h.id, ogr, onceki).then(oyna, function (e) {
          // Reddedildiyse büyük ihtimalle bugün başka bir cihazdan oynandı: durumu yeniden oku
          T.durum(h.id, ogr.uid).then(function (d) { onceki = d; hazir(d.bugunOynadi ? undefined : hataYazi(e)); }, function () { hazir(hataYazi(e)); });
        });
      });
    }

    // ---------- 3. Oyun ----------
    function oyna() {
      sorular = zorSec(havuz, adet); kacan = []; sira = 0; puan = 0; dogru = 0;
      soru();
    }
    function soru() {
      var z = sorular[sira], bas = Date.now(), bitti = false;
      var konu = h.konular.filter(function (k) { return k.id === z.konu; })[0] || h.konular[0];
      // Hangi şıkkın doğru olduğu sayfaya yazılmaz, sadece burada bilinir
      var secenekler = karistir(z.secenekler.map(function (x, i) { return { x: x, dogru: i === z.dogru }; }));
      govde.innerHTML = '<div class="yaris oyunda renk-' + esc(konu.renk) + '">' +
        '<div class="yaris-ust"><div class="kim"><small>Speler<span class="tr" lang="tr"> · Oyuncu</span></small><b>' + esc(ogr.ad) + '</b></div>' +
        '<div class="tur-no"><b>' + puan + '</b><small>Vraag ' + (sira + 1) + ' / ' + sorular.length + '<span class="tr" lang="tr"> · Soru ' + (sira + 1) + ' / ' + sorular.length + '</span></small></div></div>' +
        '<div class="sure" role="timer" aria-label="Tijd · Süre"><div class="sure-yol"><div class="sure-cubuk"></div></div><span class="sure-sn">' + ZOR.sure + '</span></div>' +
        '<section class="blok oyun"><p class="konu-etiket">' + nl(konu.kisa) + '<span class="tr" lang="tr"> · ' + tr(konu.kisa) + '</span></p>' +
        '<div class="soru">' + iki(z.soru) + '</div><div class="secenekler">' +
        secenekler.map(function (c, i) { return '<button type="button" class="secenek" data-i="' + i + '">' + ikiSatir(c.x) + '</button>'; }).join('') +
        '</div><div class="sonuc" role="status"></div></section></div>';
      window.scrollTo(0, 0);
      var cubuk = govde.querySelector('.sure-cubuk'), sn = govde.querySelector('.sure-sn'), sureKutu = govde.querySelector('.sure');
      function kalan() { return Math.max(0, ZOR.sure - (Date.now() - bas) / 1000); }
      clearInterval(sayac);
      sayac = setInterval(function () {
        var k = kalan();
        cubuk.style.transform = 'scaleX(' + (k / ZOR.sure) + ')';
        sn.textContent = Math.ceil(k);
        sureKutu.classList.toggle('az', k <= 5);
        if (k <= 0) cevap(null);
      }, 100);
      govde.querySelectorAll('.secenek').forEach(function (d) { d.addEventListener('click', function () { cevap(d); }); });

      function cevap(d) {
        if (bitti) return;
        bitti = true;
        clearInterval(sayac);
        var k = kalan(), iyi = !!d && secenekler[Number(d.dataset.i)].dogru;
        var kazanc = iyi ? ZOR.puan + Math.round(ZOR.hiz * k / ZOR.sure) : 0;
        puan += kazanc; if (iyi) dogru++; else kacan.push(z);
        // Doğru şık gösterilmez: sadece çocuğun seçtiği şık yeşil ya da kırmızı olur
        govde.querySelectorAll('.secenek').forEach(function (x) { x.disabled = true; if (x === d) x.classList.add(iyi ? 'dogru' : 'yanlis'); });
        govde.querySelector('.tur-no b').textContent = puan;
        var son = sira + 1 >= sorular.length;
        govde.querySelector('.sonuc').innerHTML = '<div class="geri-bildirim ' + (iyi ? 'dogru' : 'yanlis') + '"><b>' +
          (iyi ? '+' + kazanc + ' · Goed! · Doğru!' : d ? 'Helaas! · Olmadı!' : 'Tijd is om! · Süre doldu!') + '</b>' +
          (iyi ? '' : '<p>Het goede antwoord zie je niet. Zoek het na de wedstrijd op in de les.</p><p class="tr" lang="tr">Doğru cevap gösterilmez. Yarıştan sonra derste bul.</p>') + '</div>' +
          '<button type="button" class="dugme ana buyuk sonraki">' + (son ? 'Uitslag<small>Sonuç</small>' : 'Volgende<small>Sonraki</small>') + '</button>';
        var dugme = govde.querySelector('.sonraki');
        dugme.addEventListener('click', function () { sira++; if (son) kaydet(); else soru(); });
        dugme.focus({ preventScroll: true });
        dugme.scrollIntoView({ block: 'nearest' });
      }
    }

    // ---------- 4. Kaydet ve sonuç ----------
    function kaydet(hata) {
      govde.innerHTML = '<div class="yaris sonuc-ekrani"><div class="kazanan"><p class="sayac">' + esc(ogr.ad) + '</p><p class="kim-buyuk">' + puan + '</p>' +
        '<p class="hazir-yazi">' + dogru + ' / ' + sorular.length + ' goed<span class="tr" lang="tr">' + dogru + ' / ' + sorular.length + ' doğru</span></p></div>' +
        '<section class="blok kayit">' + (hata
          ? '<p class="uyari">Opslaan is niet gelukt. ' + hataYazi(hata) + '</p><button type="button" class="dugme ana buyuk yeniden">Opnieuw opslaan<small>Tekrar kaydet</small></button>'
          : '<p class="sayac">Opslaan…<span class="tr" lang="tr"> · Kaydediliyor…</span></p>') + '</section></div>';
      window.scrollTo(0, 0);
      if (hata) { govde.querySelector('.yeniden').addEventListener('click', function () { kaydet(); }); return; }
      T.bitir(h.id, ogr, onceki, puan, dogru).then(sonuc, function (e) {
        // 403: süre aşıldı ya da deneme zaten kapandı; tekrar denemek işe yaramaz
        if (e && e.durum === 403) sonuc(null); else kaydet(e);
      });
    }
    function sonuc(r) {
      var mesaj = !r
        ? '<div class="geri-bildirim yanlis"><b>Niet opgeslagen · Kaydedilemedi</b><p>Deze ronde duurde te lang of was al afgesloten.</p><p class="tr" lang="tr">Bu tur çok uzun sürdü ya da zaten kapanmıştı.</p></div>'
        : r.rekor
          ? '<div class="geri-bildirim dogru"><b>Opgeslagen! Je beste score van deze week · Kaydedildi! Bu haftaki en iyi puanın</b><p>Je staat op het scorebord.</p><p class="tr" lang="tr">Tablodasın.</p></div>'
          : '<div class="geri-bildirim"><b>Opgeslagen · Kaydedildi</b><p>Je beste score deze week blijft ' + r.enIyi + '.</p><p class="tr" lang="tr">Bu haftaki en iyi puanın ' + r.enIyi + ' olarak kalıyor.</p></div>';
      var kutu = govde.querySelector('.kayit');
      kutu.innerHTML = mesaj + '<p class="not">Morgen na ' + saatYazi() + ' mag je weer. <span class="tr" lang="tr">Yarın ' + saatYazi() + '’den sonra tekrar oynayabilirsin.</span></p>' +
        '<div class="yaris-dugmeler"><a class="dugme" href="#/' + esc(h.id) + '">Naar de lessen<small>Derslere git</small></a></div>';
      kutu.insertAdjacentHTML('afterend', kacanlar() + tabloKutusu());
      tabloDoldur(govde, h, ogr.uid, true);
    }

    // Bilemediği sorular, cevapsız. Her sorunun yanında cevabı bulacağı konu.
    function kacanlar() {
      if (!kacan.length) return '<section class="blok kacan"><h3>Alles goed!<small class="tr" lang="tr">Hepsi doğru!</small></h3></section>';
      return '<section class="blok kacan"><h3>Deze vragen had je niet goed<small class="tr" lang="tr">Bu soruları bilemedin</small></h3>' +
        '<p class="not">Zoek het antwoord op in de les. <span class="tr" lang="tr">Cevabı derste bul.</span></p><ol class="kacan-liste">' +
        kacan.map(function (z) {
          var k = h.konular.filter(function (x) { return x.id === z.konu; })[0] || h.konular[0];
          return '<li class="renk-' + esc(k.renk) + '"><div class="soru">' + iki(z.soru) + '</div>' +
            '<a class="kacan-git" href="#/' + esc(h.id) + '/' + esc(k.id) + '">Zoek op: ' + nl(k.kisa) + '<small>Derste bul: ' + tr(k.kisa) + '</small></a></li>';
        }).join('') + '</ol></section>';
    }
  }

  // =========================================================
  // Sayfalar
  // =========================================================
  var AMBLEM = '<svg class="amblem" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="currentColor" opacity=".14"/>' +
    '<path fill="currentColor" d="M9 38v-9.5a10.5 10.5 0 0 1 21 0V38zM33 38V17l2.5-5 2.5 5v21zM6 38h36v2.5H6z"/>' +
    '<path class="hilal" d="M21.4 6.6a4.6 4.6 0 1 0 3.4 7.4 3.7 3.7 0 0 1-3.4-7.4z"/></svg>';

  function anaSayfa() {
    document.title = 'Ahi Evran Camii · Haftalık Dersler';
    ust.className = 'ust bant';
    ust.innerHTML = '<div class="kap"><a class="marka" href="#/">' + AMBLEM + '<span>Ahi Evran Camii<small>Weekendles<span class="tr" lang="tr"> · Hafta sonu dersleri</span></small></span></a></div>';
    var kartlar = D.sira.slice().reverse().map(function (id, i) {
      var h = D.haftalar[id];
      if (!h) return '';
      var y = haftaYildizi(h);
      return '<div class="hafta-kart' + (i === 0 ? ' yeni' : '') + '">' +
        '<div class="hafta-no"><span>Week</span><b>' + esc(h.no) + '</b><small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></div>' +
        '<div class="hafta-bilgi">' + (i === 0 ? '<span class="rozet">Deze week<span class="tr" lang="tr"> · Bu hafta</span></span>' : '') +
        '<ul>' + h.konular.map(function (k) { return '<li class="renk-' + esc(k.renk) + '"><span class="nokta"></span>' + nl(k.ad) + '<small class="tr" lang="tr">' + tr(k.ad) + '</small></li>'; }).join('') + '</ul>' +
        '<div class="hafta-alt">' + yildizSayac(y.kazanilan, y.toplam) + '<span class="hafta-dugmeler">' +
        '<a class="yaris-d" href="#/' + esc(h.id) + '/yaris">Wedstrijd<small>Yarış</small></a>' +
        '<a class="basla" href="#/' + esc(h.id) + '">Open<small>Aç</small></a></span></div></div></div>';
    }).join('');
    govde.innerHTML = '<div class="ana"><h1>Selam! Kies een week<span class="tr" lang="tr"> · Bir hafta seç</span></h1>' +
      '<p class="giris">Lees de verhalen, markeer met de stift, verdien sterren en doe mee met de wedstrijd. <span class="tr" lang="tr">Hikâyeleri oku, kalemle işaretle, yıldız topla ve yarışa katıl.</span></p>' +
      (hatalar.length ? '<div class="hata">' + hatalar.map(esc).join('<br>') + '</div>' : '') + kartlar + '</div>';
  }

  function haftaSayfasi(h, konuId) {
    var konu = h.konular.filter(function (k) { return k.id === konuId; })[0] || h.konular[0];
    acik = { hafta: h.id, konu: konu.id };
    document.title = 'Week ' + h.no + ' · Ahi Evran Camii';
    ust.className = 'ust';
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
      '<a class="yaris-serit" href="#/' + esc(h.id) + '/yaris"><span>Wedstrijd: wie weet het meeste?<small class="tr" lang="tr">Yarış: en çok kim biliyor?</small></span><span class="ok" aria-hidden="true">›</span></a>' +
      '<article class="konu renk-' + esc(konu.renk) + '"><header class="konu-bas"><h1>' + nl(konu.ad) + '</h1><p class="tr" lang="tr">' + tr(konu.ad) + '</p></header>' +
      bloklar +
      (sonraki ? '<p class="devam"><a class="dugme" href="#/' + esc(h.id) + '/' + esc(sonraki.id) + '">Volgende: ' + nl(sonraki.kisa) + '<small>Sıradaki: ' + tr(sonraki.kisa) + '</small></a></p>'
               : '<p class="devam"><a class="dugme ana" href="#/' + esc(h.id) + '/yaris">Klaar! Doe de wedstrijd<small>Bitti! Yarışa katıl</small></a></p>') +
      '</article>';
    kartlariBagla(govde);
    konu.bloklar.forEach(function (b, bi) {
      var yer = { hafta: h.id, konu: konu.id, bi: bi };
      var s = govde.querySelector('[data-sohbet="' + bi + '"]'); if (s) sohbetKur(s, b);
      var q = govde.querySelector('[data-quiz="' + bi + '"]'); if (q) quizKur(q, b, yer);
      var e = govde.querySelector('[data-ezber="' + bi + '"]'); if (e) ezberKur(e, b, yer);
      var m = govde.querySelector('[data-medd="' + bi + '"]'); if (m) meddKur(m, b, yer);
    });
    isaretleriUygula(govde);
    kalemGoster(true);
  }

  function yonlendir() {
    temizlik.forEach(function (f) { f(); });
    temizlik = [];
    var p = location.hash.split('/');
    var h = D.haftalar[p[1]];
    if (!h) { acik = null; kalemGoster(false); anaSayfa(); }
    else if (p[2] === 'yaris') { acik = null; kalemGoster(false); yarisSayfasi(h); }
    else if (p[2] === 'zor') { acik = null; kalemGoster(false); zorSayfasi(h); }
    else haftaSayfasi(h, p[2]);
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
