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
     #/canli               canlı yarış: hoca büyük ekranda açar, çocuklar telefondan katılır
     #/rozetler            kazanılan ve kazanılacak rozetler
     #/tecvid              tecvid bölümü: bütün kurallar
     #/tecvid/ariz         bir kural
     #/tecvid/karisik      bütün kurallardan karışık tekrar oyunu

   Haftanın açılışı: hafta dosyasında acilis: '2026-11-28T13:00' (Hollanda saati).
   O saate kadar hafta (ve o haftanın tecvid kuralı) çocuklara kilitlidir, o saatte kendiliğinden açılır.
   Hoca, kilitli sayfada hoca kodunu yazınca kilitler o ekranda açılır.

   Bir konunun içindeki parçalar (bloklar):
     sohbet   adım adım açılan hikâye: soru, cevap, ters köşe
     ozet     kısa maddeler
     hikaye   adım adım anlatılan bir misal
     kartlar  çevirmeli kartlar (önde soru, arkada cevap)
     quiz     çoktan seçmeli sorular, sonunda yıldız
     ezber    âyet âyet okunuş ve anlam + sıraya dizme oyunu
     sirala   adımları doğru sıraya dizme oyunu (abdest, namaz gibi)
     medd     Arapça kelimede hangi med var oyunu
     baglanti başka bir sayfaya düğme (#/ ile başlıyorsa site içi)
     ornekler renkli işaretli örnek kelimeler

   Sunucu (js/tablo.js): Zor yarış hocanın açtığı hesaplarla oynanır, günde bir hak; puan tabloya kendiliğinden yazılır.
   Bu cihazda saklananlar (hiçbiri dışarı gönderilmez):
     dersler-yildiz   oyunlardan kazanılan yıldızlar
     dersler-isaret   kalemle yapılan renkli işaretler
     dersler-kalem    son seçilen kalem rengi
     dersler-yaris    sınıf yarışı isimleri ve en iyi puanlar
     dersler-hesap    Zor yarış oturumu (çıkış yapınca silinir)
     dersler-hoca     hoca modu (sadece bu sekmede; tarayıcı kapanınca silinir)
     dersler-canli    hocanın ekranında yarım kalan canlı yarış (sorular ve sıra)
     dersler-rozet    rozetler ve onlar için sayılanlar (okunan hikâyeler, yarışlar, haftalar)
   ============================================================ */

window.DERS = {
  haftalar: {},
  sira: [],
  haftaEkle: function (h) { this.haftalar[h.id] = h; },
  liste: function (l) { this.sira = l; },
  tecvid: null,
  tecvidEkle: function (t) { this.tecvid = t; },
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
    if ((yildizlar[k] || 0) < adet) { yildizlar[k] = adet; yaz('dersler-yildiz', yildizlar); }
    rozetOlay('yildiz');            // oyun bitti: rozetlere bak
  }
  function haftaYildizi(h) {
    var kazanilan = 0, toplam = 0;
    h.konular.forEach(function (k) {
      k.bloklar.forEach(function (b, bi) {
        if (['quiz', 'ezber', 'medd', 'sirala'].indexOf(b.tur) === -1) return;
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
  function sohbetKur(kok, b, yer) {
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
        if (yer) rozetOlay('sohbet', yer.hafta + ':' + yer.konu + ':' + yer.bi);
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
          if (window.SES) SES.cal(iyi ? 'dogru' : 'yanlis');
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
      if (window.SES) SES.cal(y === 3 ? 'rekor' : 'bitis');
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
            if (sira === b.ayetler.length) bitis(); else if (window.SES) SES.cal('adim');
          } else {
            hata++;
            if (window.SES) SES.cal('yanlis');
            d.classList.add('yanlis');
            setTimeout(function () { d.classList.remove('yanlis'); }, 500);
          }
        });
      });
    }
    function bitis() {
      var y = hata === 0 ? 3 : hata <= 2 ? 2 : 1;
      yildizVer(yer.hafta, yer.konu + ':' + yer.bi, y);
      if (window.SES) SES.cal(y === 3 ? 'rekor' : 'bitis');
      ic.querySelector('.ayet-secenekler').remove();
      ic.querySelector('.sonuc').innerHTML = '<div class="bitis">' + yildizCiz(y) + '<p>' +
        (hata === 0 ? 'Zonder fout! · <span class="tr" lang="tr">Hatasız!</span>' : hata + ' keer mis. · <span class="tr" lang="tr">' + hata + ' yanlış.</span>') +
        '</p><button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    basla();
  }

  // ---------- Sırala: adımları doğru sıraya dizme (abdest, namaz gibi) ----------
  BLOK.sirala = function (b, yer) {
    return '<section class="blok oyun" data-sirala="' + yer.bi + '"><h3>' + ikiSatir(b.baslik) + '</h3>' +
      (b.aciklama ? '<div class="sirala-not">' + iki(b.aciklama) + '</div>' : '') + '<div class="oyun-ic"></div></section>';
  };
  function siralaKur(kok, b, yer) {
    var ic = kok.querySelector('.oyun-ic'), sira, hata;
    function basla() {
      sira = 0; hata = 0;
      var karisik = karistir(b.adimlar.map(function (a, i) { return { a: a, i: i }; }));
      ic.innerHTML = '<p class="sayac">Tik op de stap die nu komt. <span class="tr" lang="tr">Sıradaki adıma dokun.</span></p>' +
        '<ol class="dizilen metinli"></ol><div class="adim-secenekler">' +
        karisik.map(function (k) { return '<button type="button" class="adim-dugme" data-i="' + k.i + '">' + (k.a.simge ? '<span class="simge" aria-hidden="true">' + esc(k.a.simge) + '</span>' : '') + '<span>' + ikiSatir(k.a) + '</span></button>'; }).join('') +
        '</div><div class="sonuc" role="status"></div>';
      ic.querySelectorAll('.adim-dugme').forEach(function (d) {
        d.addEventListener('click', function () {
          if (Number(d.dataset.i) === sira) {
            var li = document.createElement('li');
            li.innerHTML = ikiSatir(b.adimlar[sira]);
            ic.querySelector('.dizilen').appendChild(li);
            d.remove(); sira++;
            if (sira === b.adimlar.length) bitis(); else if (window.SES) SES.cal('adim');
          } else {
            hata++;
            if (window.SES) SES.cal('yanlis');
            d.classList.add('yanlis');
            setTimeout(function () { d.classList.remove('yanlis'); }, 500);
          }
        });
      });
    }
    function bitis() {
      var y = hata === 0 ? 3 : hata <= 2 ? 2 : 1;
      yildizVer(yer.hafta, yer.konu + ':' + yer.bi, y);
      if (window.SES) SES.cal(y === 3 ? 'rekor' : 'bitis');
      ic.querySelector('.adim-secenekler').remove();
      ic.querySelector('.sonuc').innerHTML = '<div class="bitis">' + yildizCiz(y) + '<p>' +
        (hata === 0 ? 'Zonder fout! · <span class="tr" lang="tr">Hatasız!</span>' : hata + ' keer mis. · <span class="tr" lang="tr">' + hata + ' yanlış.</span>') +
        '</p><button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    basla();
  }

  // ---------- Medd oyunu ----------
  var MEDD = {
    elif: { ad: 'Elif', ipucu: { nl: 'Na üstün', tr: 'Üstünden sonra' }, neden: { nl: 'De letter ervoor heeft een üstün: de elif maakt een lange “â”. Medd-i Tabiî, 2 tellen.', tr: 'Önceki harf üstünlü: elif uzun bir “â” sesi verir. Medd-i Tabiî, 2 hareke.' } },
    vav: { ad: 'Vav', ipucu: { nl: 'Na ötre', tr: 'Ötreden sonra' }, neden: { nl: 'De letter ervoor heeft een ötre: de vav maakt een lange “û”. Medd-i Tabiî, 2 tellen.', tr: 'Önceki harf ötreli: vav uzun bir “û” sesi verir. Medd-i Tabiî, 2 hareke.' } },
    ye: { ad: 'Ye', ipucu: { nl: 'Na esre', tr: 'Esreden sonra' }, neden: { nl: 'De letter ervoor heeft een esre: de ye maakt een lange “î”. Medd-i Tabiî, 2 tellen.', tr: 'Önceki harf esreli: ye uzun bir “î” sesi verir. Medd-i Tabiî, 2 hareke.' } },
    tabii: { ad: 'Tabiî', ipucu: { nl: 'Geen hemze', tr: 'Hemze yok' }, neden: { nl: 'Na de med-letter komt geen hemze: Medd-i Tabiî, 2 tellen.', tr: 'Med harfinden sonra hemze yok: Medd-i Tabiî, 2 hareke.' } },
    muttasil: { ad: 'Muttasıl', ipucu: { nl: 'Eén hokje', tr: 'Tek kutu' }, neden: { nl: 'Med-letter en hemze in hetzelfde woord: Muttasıl, 4 tellen.', tr: 'Med harfi ile hemze aynı kelimede: Muttasıl, 4 hareke.' } },
    munfasil: { ad: 'Munfasıl', ipucu: { nl: 'Twee hokjes', tr: 'İki kutu' }, neden: { nl: 'Med-letter aan het einde, hemze in het volgende woord: Munfasıl, 4 tellen.', tr: 'Med harfi kelime sonunda, hemze sonraki kelimede: Munfasıl, 4 hareke.' }, kopru: true },
    ariz: { ad: 'Ârız', ipucu: { nl: 'Stoppen aan het eind', tr: 'Durakta (vakıf)' }, neden: { nl: 'Na de med-letter komt de laatste letter. Stop je daar, dan wordt die letter sakin: Medd-i ‘Ârız. Je mag 2, 4 of 6 tellen rekken; in de les rekken we 4. Lees je door zonder te stoppen, dan is het een gewone Tabiî.', tr: 'Med harfinden sonra son harf gelir. Orada durunca o harf sakin olur: Medd-i Ârız. 2, 4 ya da 6 hareke uzatılabilir; derste 4 hareke uzatıyoruz. Durmadan devam edersen normal tabiî med gibi okunur.' } },
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
          if (window.SES) SES.cal(iyi ? 'dogru' : 'yanlis');
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
      if (window.SES) SES.cal(y === 3 ? 'rekor' : 'bitis');
      ic.innerHTML = '<div class="bitis"><div class="puan">' + dogru + ' / ' + liste.length + '</div>' + yildizCiz(y) +
        '<button type="button" class="dugme ana tekrar">Opnieuw<small>Tekrar</small></button></div>';
      ic.querySelector('.tekrar').addEventListener('click', basla);
    }
    function basla() { liste = b.adet ? dengeliSec(b.kelimeler, b.adet, 'tur') : karistir(b.kelimeler); sira = 0; dogru = 0; soru(); }
    basla();
  }

  // Site içi bağlantı (#/ ile başlayan) aynı sekmede açılır, dış bağlantı yeni sekmede
  BLOK.baglanti = function (b) {
    var ic = /^#/.test(b.adres);
    return '<section class="blok baglanti">' + (b.metin ? iki(b.metin) : '') +
      '<a class="dugme ana" href="' + esc(b.adres) + '"' + (ic ? '' : ' target="_blank" rel="noopener"') + '>' + ikiSatir(b.dugme) + '</a></section>';
  };

  // Renkli işaretli örnek kelimeler (tecvid kuralları için)
  BLOK.ornekler = function (b) {
    return '<section class="blok ornekler"><h3>' + ikiSatir(b.baslik || { nl: 'Voorbeelden', tr: 'Örnekler' }) + '</h3>' +
      '<p class="renk-anahtar"><span class="med">blauw</span> med-letter · <span class="hemze">rood</span> hemze · <span class="sukun">paars</span> sukûn of şedde' +
      '<span class="tr" lang="tr"><span class="med">mavi</span> med harfi · <span class="hemze">kırmızı</span> hemze · <span class="sukun">mor</span> sükûn ya da şedde</span></p>' +
      '<div class="ornek-liste">' + b.kelimeler.map(function (k) {
        return '<div class="ornek">' + kelimeCiz(k.yazi, true, MEDD[k.tur] && MEDD[k.tur].kopru) +
          '<p class="okunus"><b>' + esc(k.okunus) + '</b></p><p>' + esc(k.nl) + '<small class="tr" lang="tr">' + esc(k.tr) + '</small></p>' +
          '<p class="kaynak">' + esc(k.kaynak) + '</p></div>';
      }).join('') + '</div></section>';
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
    rozetKontrol();
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
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/' + esc(h.id) + '">‹ Week ' + esc(h.no) + '<small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></a>' +
      '<span class="marka kucuk">Wedstrijd<small class="tr" lang="tr">Yarış</small></span></div>';
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
      var tiktak = window.SES ? SES.sayac() : function () {};
      sayac = setInterval(function () {
        var k = kalan();
        cubuk.style.transform = 'scaleX(' + (k / YARIS.sure) + ')';
        sn.textContent = Math.ceil(k);
        sureKutu.classList.toggle('az', k <= 5);
        tiktak(k);
        if (k <= 0) cevap(null);
      }, 100);
      govde.querySelectorAll('.secenek').forEach(function (d) { d.addEventListener('click', function () { cevap(d); }); });

      function cevap(d) {
        if (bitti) return;
        bitti = true;
        clearInterval(sayac);
        var k = kalan();
        var iyi = !!d && (s.medd ? d.dataset.t === s.medd.tur : d.dataset.d === '1');
        if (window.SES) SES.cal(iyi ? 'dogru' : d ? 'yanlis' : 'sure');
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
      if (window.SES) SES.cal('rekor');
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

  // Listeden her gruptan eşit sayıda rastgele öğe seçer (40 soru, 4 konu -> her konudan 5).
  function dengeliSec(havuz, adet, alan) {
    var gruplar = {}, adlar = [], l = [], i = 0;
    karistir(havuz).forEach(function (z) { var a = z[alan]; if (!gruplar[a]) { gruplar[a] = []; adlar.push(a); } gruplar[a].push(z); });
    adet = Math.min(adet, havuz.length);
    while (l.length < adet) { var g = gruplar[adlar[i++ % adlar.length]]; if (g.length) l.push(g.shift()); }
    return karistir(l);
  }
  function zorSec(havuz, adet) { return dengeliSec(havuz, adet, 'konu'); }

  // ---------- Hesapla giriş (zor yarış ve canlı yarış) ----------
  function baglantiHatasi(e) {
    if (e && e.kod === 'AG') return 'Geen verbinding. Controleer je internet. <span class="tr" lang="tr">Bağlantı yok. İnternetini kontrol et.</span>';
    return 'Er ging iets mis. Probeer het opnieuw. <span class="tr" lang="tr">Bir şeyler ters gitti. Tekrar dene.</span>';
  }
  function girisKutusu(uyari) {
    return '<section class="blok"><h3>Inloggen<small class="tr" lang="tr">Giriş yap</small></h3><form class="giris-form" novalidate>' +
      '<label for="kullanici">Gebruikersnaam<span class="tr" lang="tr"> · Kullanıcı adı</span></label>' +
      '<input id="kullanici" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="40">' +
      '<label for="sifre">Wachtwoord<span class="tr" lang="tr"> · Şifre</span></label>' +
      '<input id="sifre" type="password" autocomplete="current-password" maxlength="100">' +
      '<p class="uyari" role="alert">' + (uyari || '') + '</p>' +
      '<button type="submit" class="dugme ana buyuk">Inloggen<small>Giriş yap</small></button></form>' +
      '<p class="not">Wachtwoord vergeten? Vraag het aan je leraar. <span class="tr" lang="tr">Şifreni unuttuysan hocana sor.</span></p></section>';
  }
  // tamam: giriş olunca; tekrar(uyari): formu uyarıyla yeniden çizer
  function girisBagla(tamam, tekrar, uyari) {
    var form = govde.querySelector('.giris-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var k = form.querySelector('#kullanici').value, sf = form.querySelector('#sifre').value;
      if (!k.trim() || !sf) { form.querySelector('.uyari').innerHTML = 'Vul je gebruikersnaam en wachtwoord in. <span class="tr" lang="tr">Kullanıcı adını ve şifreni yaz.</span>'; return; }
      var d = form.querySelector('button'); d.disabled = true; d.innerHTML = 'Bezig…<small>Giriş yapılıyor…</small>';
      window.TABLO.girisYap(k, sf).then(tamam, function (x) {
        var m = /TOO_MANY/.test(x.kod) ? 'Te vaak geprobeerd. Wacht even en probeer het later opnieuw. <span class="tr" lang="tr">Çok fazla deneme oldu. Biraz bekleyip tekrar dene.</span>'
          : /DISABLED/.test(x.kod) ? 'Dit account is uitgezet. Vraag het aan je leraar. <span class="tr" lang="tr">Bu hesap kapatılmış. Hocana sor.</span>'
          : x.kod === 'AG' ? baglantiHatasi(x)
          : /CONFIGURATION_NOT_FOUND|OPERATION_NOT_ALLOWED|API_KEY|PROJECT_NOT_FOUND/.test(x.kod) ? 'Inloggen is nog niet ingesteld. Vraag het aan je leraar. <span class="tr" lang="tr">Giriş henüz ayarlanmamış. Hocana söyle.</span>'
          : 'Gebruikersnaam of wachtwoord klopt niet. <span class="tr" lang="tr">Kullanıcı adı ya da şifre yanlış.</span>';
        tekrar(m);
        var g = govde.querySelector('#kullanici'); if (g) g.value = k;
        var s2 = govde.querySelector('#sifre'); if (s2) s2.focus({ preventScroll: true });
      });
    });
    if (uyari === undefined) { var ilk = govde.querySelector('#kullanici'); if (ilk && !('ontouchstart' in window)) ilk.focus({ preventScroll: true }); }
  }

  function zorSayfasi(h) {
    var T = window.TABLO, havuz = h.zor || [], adet = Math.min(ZOR.tur, havuz.length);
    var ogr = null, onceki = null;                       // öğrenci { uid, ad } ve haftalık durumu
    var sorular = [], kacan = [], sira = 0, puan = 0, dogru = 0, sayac = null;
    document.title = 'Moeilijke wedstrijd week ' + h.no + ' · Ahi Evran Camii';
    ust.className = 'ust';
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/' + esc(h.id) + '/yaris">‹ Wedstrijd<small class="tr" lang="tr">Yarış</small></a>' +
      '<span class="marka kucuk">Moeilijk<small class="tr" lang="tr">Zor yarış</small></span></div>';
    temizlik.push(function () { clearInterval(sayac); });
    if (!havuz.length || !T) { govde.innerHTML = '<p class="giris">Deze wedstrijd is er nog niet. <span class="tr" lang="tr">Bu yarış henüz hazır değil.</span></p>'; return; }
    if (T.hesap()) yukle(); else girisEkrani();

    // Sayfa iskeleti: başlık, değişen kısım, puan tablosu
    function sayfa(ic) {
      govde.innerHTML = '<div class="yaris"><h1>Moeilijke wedstrijd<span class="tr" lang="tr"> · Zor yarış</span></h1>' + ic + tabloKutusu() + '</div>';
      tabloDoldur(govde, h, ogr ? ogr.uid : null, false);
    }
    function bekle() { sayfa('<section class="blok"><p class="sayac">Laden…<span class="tr" lang="tr"> · Yükleniyor…</span></p></section>'); }
    var hataYazi = baglantiHatasi;

    // ---------- 1. Giriş ----------
    function girisEkrani(uyari) {
      ogr = null;
      sayfa('<p class="giris">' + adet + ' moeilijke vragen over week ' + esc(h.no) + '. Elke dag één kans. Log in met de gebruikersnaam en het wachtwoord van je leraar. ' +
        '<span class="tr" lang="tr">' + esc(h.no) + '. haftadan ' + adet + ' zor soru, her gün bir hak. Hocanın verdiği kullanıcı adı ve şifreyle giriş yap.</span></p>' +
        girisKutusu(uyari));
      girisBagla(yukle, girisEkrani, uyari);
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
      var tiktak = window.SES ? SES.sayac() : function () {};
      sayac = setInterval(function () {
        var k = kalan();
        cubuk.style.transform = 'scaleX(' + (k / ZOR.sure) + ')';
        sn.textContent = Math.ceil(k);
        sureKutu.classList.toggle('az', k <= 5);
        tiktak(k);
        if (k <= 0) cevap(null);
      }, 100);
      govde.querySelectorAll('.secenek').forEach(function (d) { d.addEventListener('click', function () { cevap(d); }); });

      function cevap(d) {
        if (bitti) return;
        bitti = true;
        clearInterval(sayac);
        var k = kalan(), iyi = !!d && secenekler[Number(d.dataset.i)].dogru;
        if (window.SES) SES.cal(iyi ? 'dogru' : d ? 'yanlis' : 'sure');
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
      rozetOlay('zor', { dogru: dogru });
      if (window.SES) SES.cal(r && r.rekor ? 'rekor' : 'bitis');
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
  // Haftanın açılışı ve hoca kodu
  // Bu bir telefon kilididir: hafta dosyası GitHub'da açık durur,
  // telefonun saatini ileri alan da görebilir. 13-14 yaş için yeterli.
  // =========================================================
  var HOCA_OZET = 'r0s1ea';          // hoca kodunun özeti; kodun kendisi hiçbir dosyada yazmaz
  var hocaAcik = false;              // sessionStorage çalışmazsa yedek
  var kilitGorundu = false;          // sayfada kilitli bir şey var mı (açılış saatinde sayfa yenilenir)
  var KILIT = '<svg class="kilit-simge" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zm2 0h6V7a3 3 0 0 0-6 0z"/></svg>';

  // '2026-11-28T13:00' Hollanda saatiyle hangi an? (yaz ve kış saati dahil)
  function hollandaZamani(s) {
    var m = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(String(s || ''));
    if (!m) return NaN;
    var yerel = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    try {
      var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      var fark = function (t) { var p = {}; f.formatToParts(new Date(t)).forEach(function (x) { p[x.type] = Number(x.value); }); return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - t; };
      return yerel - fark(yerel - fark(yerel));
    } catch (e) { return new Date(s).getTime(); }
  }
  function acilisi(h) { return h && h.acilis ? hollandaZamani(h.acilis) : 0; }
  function hocaModu() { if (hocaAcik) return true; try { return sessionStorage.getItem('dersler-hoca') === '1'; } catch (e) { return false; } }
  function hocaAyarla(ac) { hocaAcik = ac; try { if (ac) sessionStorage.setItem('dersler-hoca', '1'); else sessionStorage.removeItem('dersler-hoca'); } catch (e) {} }
  function kilitBekliyor(h) { return acilisi(h) > Date.now(); }           // öğrenciler için henüz açılmadı
  function kilitli(h) { return kilitBekliyor(h) && !hocaModu(); }
  function kuralHaftasi(k) { return k && k.hafta ? D.haftalar['hafta-' + k.hafta] : null; }
  function kuralKilitli(k) { return kilitli(kuralHaftasi(k)); }
  function acilisYazi(t) {
    var d = new Date(t);
    function y(dil, o) { try { return d.toLocaleString(dil, Object.assign({ timeZone: 'Europe/Amsterdam' }, o)); } catch (e) { return d.toLocaleString(dil, o); } }
    var gun = { weekday: 'long', day: 'numeric', month: 'long' }, kisa = { day: 'numeric', month: 'long' }, saat = { hour: '2-digit', minute: '2-digit' };
    return { nl: y('nl-NL', gun) + ' om ' + y('nl-NL', saat), tr: y('tr-TR', gun) + ', saat ' + y('tr-TR', saat), kisaNl: y('nl-NL', kisa), kisaTr: y('tr-TR', kisa) };
  }
  function kalanYazi(t) {
    var dk = Math.max(1, Math.ceil((t - Date.now()) / 60000));
    if (dk > 36 * 60) { var g = Math.round(dk / 1440); return 'Nog ' + g + ' dagen<span class="tr" lang="tr"> · ' + g + ' gün kaldı</span>'; }
    if (dk > 90) { var s = Math.round(dk / 60); return 'Nog ' + s + ' uur<span class="tr" lang="tr"> · ' + s + ' saat kaldı</span>'; }
    return 'Nog ' + dk + (dk === 1 ? ' minuut' : ' minuten') + '<span class="tr" lang="tr"> · ' + dk + ' dakika kaldı</span>';
  }
  function kilitKarti(h) {
    var a = acilisYazi(acilisi(h));
    kilitGorundu = true;
    return '<a class="hafta-kart kilitli" href="#/' + esc(h.id) + '">' +
      '<div class="hafta-no"><span>Week</span><b>' + esc(h.no) + '</b><small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></div>' +
      '<div class="hafta-bilgi"><span class="rozet kilit-rozet">' + KILIT + 'Nog op slot<span class="tr" lang="tr"> · Henüz kilitli</span></span>' +
      '<p class="kilit-yazi">Gaat open op ' + a.nl + ', na de les.<small class="tr" lang="tr">' + a.tr + ', dersten sonra açılır.</small></p></div></a>';
  }
  // Kilitli hafta ya da kural: ne zaman açılacağı, kalan süre ve hoca girişi
  function kilitSayfasi(o) {
    var a = acilisYazi(o.t);
    kilitGorundu = true;
    govde.innerHTML = '<section class="kilit-sayfa">' + KILIT.replace('kilit-simge', 'kilit-simge buyuk') +
      '<h1>' + o.baslikNl + '<span class="tr" lang="tr">' + o.baslikTr + '</span></h1>' +
      (o.notNl ? '<p>' + o.notNl + ' <span class="tr" lang="tr">' + o.notTr + '</span></p>' : '') +
      '<p class="kilit-zaman"><b>Gaat open op ' + a.nl + ', na de les.</b><small class="tr" lang="tr">' + a.tr + ', dersten sonra açılır.</small></p>' +
      '<p class="kilit-kalan">' + kalanYazi(o.t) + '</p>' +
      '<p>Tot in de les! <span class="tr" lang="tr">Derste görüşürüz!</span></p>' +
      '<details class="hoca-giris"><summary>Leraar?<span class="tr" lang="tr"> · Hoca mısın?</span></summary>' +
      '<form class="giris-form" autocomplete="off" novalidate><label for="hoca-kod">Leraarcode<span class="tr" lang="tr"> · Hoca kodu</span></label>' +
      '<input id="hoca-kod" type="password" inputmode="numeric" autocomplete="off" maxlength="12">' +
      '<button class="dugme ana" type="submit">Open op dit scherm<small>Bu ekranda aç</small></button>' +
      '<p class="uyari" role="alert"></p>' +
      '<p class="hoca-not">Alleen op dit scherm, tot je de browser sluit. <span class="tr" lang="tr">Sadece bu ekranda, tarayıcıyı kapatana kadar.</span></p></form></details></section>';
    var form = govde.querySelector('.hoca-giris form'), giris = form.querySelector('input');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (ozetle('ahi-evran-hoca:' + giris.value.trim()) === HOCA_OZET) { hocaAyarla(true); yonlendir(); return; }
      form.querySelector('.uyari').innerHTML = 'Verkeerde code. <span class="tr" lang="tr">Kod yanlış.</span>';
      giris.value = ''; giris.focus();
    });
  }
  function haftaKilidi(h) {
    document.title = 'Week ' + h.no + ' · Ahi Evran Camii';
    ustGeri('#/', 'Alle weken', 'Tüm haftalar', 'Week ' + esc(h.no), esc(h.no) + '. hafta');
    kilitSayfasi({ t: acilisi(h), baslikNl: 'Week ' + esc(h.no) + ' is nog op slot', baslikTr: esc(h.no) + '. hafta henüz kilitli' });
  }
  function kuralKilidi(kural) {
    var i = D.tecvid.kurallar.indexOf(kural), h = kuralHaftasi(kural);
    document.title = nl(kural.ad) + ' · Tecvid';
    ustGeri('#/tecvid', 'Alle regels', 'Bütün kurallar', 'Regel ' + (i + 1), (i + 1) + '. kural');
    kilitSayfasi({ t: acilisi(h), baslikNl: nl(kural.ad) + ' is nog op slot', baslikTr: tr(kural.ad) + ' henüz kilitli',
      notNl: 'Deze regel leren we in week ' + esc(h.no) + '.', notTr: 'Bu kuralı ' + esc(h.no) + '. haftada öğreniyoruz.' });
  }
  // Hoca modu açıkken ve kilitli bir hafta varken üstte görünür, "Kapat" kilitleri geri getirir.
  var hocaKutu = document.createElement('div');
  hocaKutu.className = 'kap hoca-kap'; hocaKutu.hidden = true;
  govde.parentNode.insertBefore(hocaKutu, govde);
  function hocaSeridi() {
    var goster = hocaModu() && D.sira.some(function (id) { return kilitBekliyor(D.haftalar[id]); });
    hocaKutu.hidden = !goster;
    if (!goster) { hocaKutu.innerHTML = ''; return; }
    hocaKutu.innerHTML = '<div class="hoca-serit" role="status">' + KILIT + '<span>Leraarmodus: wat nog op slot is, staat open op dit scherm.<small class="tr" lang="tr">Hoca modu: kilitli olanlar bu ekranda açık.</small></span>' +
      '<button type="button" class="hoca-kapat">Sluiten<small>Kapat</small></button></div>';
    hocaKutu.querySelector('.hoca-kapat').addEventListener('click', function () { hocaAyarla(false); yonlendir(); });
  }
  // Kilitli bir şey görünüyorsa açılış saatinde sayfayı kendiliğinden yeniler.
  function acilistaYenile() {
    if (!kilitGorundu) return;
    var simdi = Date.now(), en = 0;
    D.sira.forEach(function (id) { var t = acilisi(D.haftalar[id]); if (t > simdi && (!en || t < en)) en = t; });
    if (!en || en - simdi > 2e9) return;
    var z = setTimeout(yonlendir, en - simdi + 1000);
    temizlik.push(function () { clearTimeout(z); });
  }

  // =========================================================
  // Canlı yarış: derste büyük ekran + çocukların telefonları
  //   Hoca büyük ekranda "hoca" hesabıyla girer, haftayı seçip yarışı açar; ekranda 4 haneli kod çıkar.
  //   Çocuk telefonda kendi hesabıyla girer ve kodu yazar. Soru büyük ekranda, cevap telefonda.
  //   Doğru cevap 500-1000 puan: ne kadar hızlıysa o kadar çok. Puanı hocanın ekranı hesaplar.
  //   Yarım kalan yarış (ekran yenilenirse) bu cihazda saklanır: dersler-canli.
  // =========================================================
  var CANLI = { adetler: [10, 15, 20], sureler: [15, 20, 30], enAz: 500, enCok: 1000, okuma: 1000, lobiOkuma: 2000, pay: 2500 };
  var SEKILLER = [
    '<path d="M15.6 3.1A9.2 9.2 0 1 0 21 15.5 7.4 7.4 0 0 1 15.6 3.1z"/>',                                                         // hilal
    '<rect x="5.6" y="5.6" width="12.8" height="12.8"/><rect x="5.6" y="5.6" width="12.8" height="12.8" transform="rotate(45 12 12)"/>', // sekiz köşeli yıldız
    '<path d="M12 2.4C8.1 7.9 5.4 11.4 5.4 15a6.6 6.6 0 0 0 13.2 0c0-3.6-2.7-7.1-6.6-12.6z"/>',                                       // damla
    '<path d="M12 2.4l8.6 5v9.9L12 21.6l-8.6-4.9V7.4z"/>',                                                                              // altıgen
  ];
  function sekil(i) { return '<svg class="sekil" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + SEKILLER[i] + '</svg>'; }
  function canliPlanOku() { return oku('dersler-canli', null); }
  function canliPlanYaz(p) { if (p) yaz('dersler-canli', p); else { try { localStorage.removeItem('dersler-canli'); } catch (e) {} } }

  // Bir yarışın soruları: { konu, soru{nl,tr}, ar, kaynak, tur, secenekler[{nl,tr}], dogru, aciklama }
  function canliSoru(h, konuId, soru, secenekler, dogru, aciklama) {
    var k = h.konular.filter(function (x) { return x.id === konuId; })[0] || h.konular[0];
    var l = karistir(secenekler.map(function (x, i) { return { x: x, d: i === dogru }; }));
    return { konu: { nl: nl(k.kisa), tr: tr(k.kisa), renk: k.renk }, soru: { nl: nl(soru), tr: tr(soru) }, ar: '', kaynak: '', tur: '',
      secenekler: l.map(function (c) { return { nl: nl(c.x), tr: tr(c.x) }; }),
      dogru: l.map(function (c) { return c.d; }).indexOf(true),
      aciklama: aciklama ? { nl: nl(aciklama), tr: tr(aciklama) } : null };
  }
  function canliMedd(s) {
    var w = s.medd, t = s.secenekler.slice(0, 4);
    return { konu: { nl: nl(s.konu.kisa), tr: tr(s.konu.kisa), renk: s.konu.renk }, soru: { nl: 'Welke medd zie je?', tr: 'Hangi med?' },
      ar: w.yazi, kaynak: w.kaynak || '', tur: w.tur,
      secenekler: t.map(function (x) { return { nl: MEDD[x].ad, tr: '' }; }), dogru: t.indexOf(w.tur),
      aciklama: { nl: MEDD[w.tur].neden.nl + ' ' + w.okunus + ' = ' + w.nl, tr: MEDD[w.tur].neden.tr + ' ' + w.okunus + ' = ' + w.tr } };
  }
  function canliSorular(h, zor, adet) {
    var l = zor
      ? zorSec(h.zor || [], Math.min(adet, (h.zor || []).length)).map(function (z) { return canliSoru(h, z.konu, z.soru, z.secenekler, z.dogru, z.aciklama); })
      : soruSec(yarisSorulari(h), adet).map(function (s) { return s.medd ? canliMedd(s) : canliSoru(h, s.konu.id, s.soru.soru, s.soru.secenekler, s.soru.dogru, s.soru.aciklama); });
    return l.filter(function (s) { return s.secenekler.length >= 2 && s.secenekler.length <= 4 && s.dogru >= 0; });
  }
  function canliSiralama(oyuncular) {
    return Object.keys(oyuncular || {}).map(function (uid) { var o = oyuncular[uid]; return { uid: uid, ad: o.ad, puan: o.puan || 0, son: o.son || 0, dogru: !!o.dogru, secim: o.secim }; })
      .sort(function (a, b) { return b.puan - a.puan || String(a.ad).localeCompare(String(b.ad)); });
  }
  // Seçenek kutuları; dogru >= 0 ise doğru olan işaretli, dagilim varsa kaç kişinin seçtiği
  function canliSecenekler(secenekler, dogru, dagilim) {
    var enCok = dagilim ? Math.max.apply(null, dagilim.concat([1])) : 1;
    return '<ol class="canli-secenekler n' + secenekler.length + '">' + secenekler.map(function (c, i) {
      return '<li class="cs cs' + i + (dogru >= 0 ? (i === dogru ? ' dogru' : ' soluk') : '') + '">' + sekil(i) +
        '<span class="cs-yazi"><b>' + esc(c.nl) + '</b>' + (c.tr ? '<small lang="tr">' + esc(c.tr) + '</small>' : '') + '</span>' +
        (dagilim ? '<span class="cs-sayi"><i style="--oran:' + ((dagilim[i] || 0) / enCok).toFixed(3) + '"></i><b>' + (dagilim[i] || 0) + '</b></span>' : '') +
        (dogru === i ? '<span class="cs-tik">✓<span class="gizli"> Goed · Doğru</span></span>' : '') + '</li>';
    }).join('') + '</ol>';
  }
  function canliSure(sn) {
    return '<div class="sure" role="timer" aria-label="Tijd · Süre"><div class="sure-yol"><div class="sure-cubuk"></div></div><span class="sure-sn">' + sn + '</span></div>';
  }
  var CANLI_AG = '<p class="canli-ag uyari" role="status" hidden>Geen verbinding, we proberen het opnieuw… <span class="tr" lang="tr">Bağlantı yok, tekrar deneniyor…</span></p>';

  function canliSayfasi() {
    var T = window.TABLO, C = T && T.canli;
    var nesil = 0, sayac = null, durdu = false;
    document.title = 'Live wedstrijd · Ahi Evran Camii';
    ustGeri('#/', 'Alle weken', 'Tüm haftalar', 'Live wedstrijd', 'Canlı yarış');
    temizlik.push(function () { durdu = true; nesil++; clearInterval(sayac); document.body.classList.remove('genis'); });
    if (!C) { govde.innerHTML = '<p class="giris">De live wedstrijd is nu niet beschikbaar. <span class="tr" lang="tr">Canlı yarış şu an açılmıyor.</span></p>'; return; }

    // Her ekran değişince nesil artar; eski sayaçlar ve okumalar kendiliğinden durur.
    function yeni() { nesil++; clearInterval(sayac); return nesil; }
    function suAn(n) { return !durdu && n === nesil; }
    function dongu(n, ms, is) {
      var hata = 0;
      (function tur() {
        if (!suAn(n)) return;
        Promise.resolve().then(is).then(function () { hata = 0; ag(true); }, function () { if (++hata >= 3) ag(false); })
          .then(function () { if (suAn(n)) setTimeout(tur, typeof ms === 'function' ? ms() : ms); });
      })();
    }
    function ag(var_) { var el = govde.querySelector('.canli-ag'); if (el) el.hidden = var_; }
    function yukleniyor() { govde.innerHTML = '<div class="canli"><p class="sayac">Laden…<span class="tr" lang="tr"> · Yükleniyor…</span></p></div>'; }
    function hataEkrani(e, yeniden, hocaMi) {
      yeni();
      var m = hocaMi && e && e.durum === 403
        ? 'Geen toegang. Zijn de nieuwe regels in Firebase gepubliceerd? <span class="tr" lang="tr">Yetki yok. Yeni kurallar Firebase’de yayınlandı mı?</span>'
        : baglantiHatasi(e);
      govde.innerHTML = '<div class="canli"><section class="blok"><p class="uyari">' + m + '</p><button type="button" class="dugme kucuk yeniden">Opnieuw proberen<small>Tekrar dene</small></button></section></div>';
      govde.querySelector('.yeniden').addEventListener('click', yeniden);
    }
    function cikisBagla() {
      var c = govde.querySelector('.cikis');
      if (c) c.addEventListener('click', function () { T.cikis(); giris(); });
    }

    if (T.hesap()) basla(); else giris();
    function basla() { if ((T.hesap() || {}).kullanici === 'hoca') hocaBasla(); else ogrenciBasla(); }
    function giris(uyari) {
      yeni();
      document.body.classList.remove('genis');
      govde.innerHTML = '<div class="canli"><h1>Live wedstrijd<span class="tr" lang="tr"> · Canlı yarış</span></h1>' +
        '<p class="giris">Speel mee in de les: de vragen staan op het grote scherm, jij antwoordt op je telefoon. Log in met je account. ' +
        '<span class="tr" lang="tr">Derste birlikte oyna: sorular büyük ekranda, sen telefonundan cevaplarsın. Hesabınla giriş yap.</span></p>' +
        girisKutusu(uyari) + '</div>';
      girisBagla(basla, giris, uyari);
    }

    // =====================================================
    // Hoca: büyük ekran
    // =====================================================
    var plan = null, oyun = null;      // plan: sorular ve sıra (bu cihazda); oyun: sunucudaki durum
    function planKaydet() { plan.oyun = oyun; canliPlanYaz(plan); }

    function hocaBasla() {
      document.body.classList.add('genis');
      var n = yeni();
      yukleniyor();
      C.oyun().then(function (o) {
        if (!suAn(n)) return;
        var p = canliPlanOku();
        kurulum(o && p && p.oyun && p.pin === o.pin && o.durum !== 'bitti' ? p : null);
      }, function (e) { hataEkrani(e, hocaBasla, true); });
    }

    function varsayilanHafta() {
      var l = D.sira.filter(function (id) { return D.haftalar[id]; });
      for (var i = 0; i < l.length; i++) if (kilitBekliyor(D.haftalar[l[i]])) return l[i];     // bugünün dersi: henüz açılmamış ilk hafta
      return l[l.length - 1];
    }
    function kurulum(yarim) {
      var n = yeni();
      var secim = { hafta: varsayilanHafta(), zor: false, adet: 10, sure: 20 };
      function dugmeler(ad, l) {
        return '<div class="kies" role="group">' + l.map(function (x) {
          return '<button type="button" class="kies-d" data-a="' + ad + '" data-v="' + esc(x.v) + '" aria-pressed="' + (String(secim[ad]) === String(x.v)) + '"' + (x.kapali ? ' disabled' : '') + '>' + x.nl + '<small>' + x.tr + '</small></button>';
        }).join('') + '</div>';
      }
      function ciz() {
        var h = D.haftalar[secim.hafta];
        if (!(h.zor || []).length) secim.zor = false;
        govde.innerHTML = '<div class="canli hoca-ekran kurulum"><h1>Live wedstrijd<span class="tr" lang="tr"> · Canlı yarış</span></h1>' +
          '<p class="giris">De vragen komen op dit scherm, de kinderen antwoorden op hun telefoon. Hoe sneller het goede antwoord, hoe meer punten. ' +
          '<span class="tr" lang="tr">Sorular bu ekranda, çocuklar telefondan cevaplar. Doğru cevap ne kadar hızlıysa o kadar çok puan.</span></p>' +
          (yarim ? '<section class="blok yarim"><p><b>Er is nog een wedstrijd bezig (code ' + esc(yarim.pin) + ').</b> <span class="tr" lang="tr">Yarım kalan bir yarış var (kod ' + esc(yarim.pin) + ').</span></p>' +
            '<button type="button" class="dugme ana devam">Verder spelen<small>Devam et</small></button></section>' : '') +
          '<section class="blok"><h3>Week<small class="tr" lang="tr">Hafta</small></h3>' +
          dugmeler('hafta', D.sira.slice().reverse().filter(function (id) { return D.haftalar[id]; }).map(function (id) { var x = D.haftalar[id]; return { v: id, nl: 'Week ' + esc(x.no), tr: esc(x.no) + '. hafta' }; })) +
          '<h3>Vragen<small class="tr" lang="tr">Sorular</small></h3>' +
          dugmeler('zor', [{ v: false, nl: 'Normaal', tr: 'Normal' }, { v: true, nl: 'Moeilijk', tr: 'Zor', kapali: !(h.zor || []).length }]) +
          '<h3>Aantal vragen<small class="tr" lang="tr">Kaç soru</small></h3>' +
          dugmeler('adet', CANLI.adetler.map(function (a) { return { v: a, nl: String(a), tr: 'soru' }; })) +
          '<h3>Tijd per vraag<small class="tr" lang="tr">Soru başına süre</small></h3>' +
          dugmeler('sure', CANLI.sureler.map(function (a) { return { v: a, nl: a + ' sec', tr: a + ' sn' }; })) +
          '<p class="uyari" role="alert"></p>' +
          '<button type="button" class="dugme ana buyuk ac">Wedstrijd openen<small>Yarışı aç</small></button></section>' +
          '<p class="not">Ingelogd als leraar. <span class="tr" lang="tr">Hoca olarak giriş yapıldı.</span> <button type="button" class="dugme kucuk cikis">Uitloggen<small>Çıkış</small></button></p></div>';
        govde.querySelectorAll('.kies-d').forEach(function (d) {
          d.addEventListener('click', function () {
            var v = d.dataset.v; secim[d.dataset.a] = d.dataset.a === 'hafta' ? v : d.dataset.a === 'zor' ? v === 'true' : Number(v);
            ciz();
          });
        });
        govde.querySelector('.ac').addEventListener('click', ac);
        var dv = govde.querySelector('.devam');
        if (dv) dv.addEventListener('click', function () { plan = yarim; oyun = yarim.oyun; devamEt(); });
        cikisBagla();
      }
      function ac() {
        var h = D.haftalar[secim.hafta], sorular = canliSorular(h, secim.zor, secim.adet);
        var d = govde.querySelector('.ac'), uy = govde.querySelector('.uyari');
        if (!sorular.length) { uy.innerHTML = 'Deze week heeft nog geen vragen. <span class="tr" lang="tr">Bu haftanın henüz sorusu yok.</span>'; return; }
        d.disabled = true; d.innerHTML = 'Bezig…<small>Açılıyor…</small>';
        var pin;
        do { pin = String(1000 + Math.floor(Math.random() * 9000)); } while (yarim && pin === yarim.pin);
        plan = { pin: pin, hafta: h.id, sorular: sorular, no: 0 };
        oyun = { pin: pin, durum: 'bekle', hafta: h.id, no: -1, toplam: sorular.length, sure: secim.sure, secenek: 0, basla: null,
          soru: null, secenekler: [], dogruSecim: -1, dagilim: [], oyuncular: {} };
        C.temizle().then(function () { return C.yaz(oyun, false); }).then(function () {
          if (!suAn(n)) return;
          planKaydet(); lobi();
        }, function (e) {
          if (!suAn(n)) return;
          d.disabled = false; d.innerHTML = 'Wedstrijd openen<small>Yarışı aç</small>';
          uy.innerHTML = e && e.durum === 403 ? 'Geen toegang. Zijn de nieuwe regels in Firebase gepubliceerd? <span class="tr" lang="tr">Yetki yok. Yeni kurallar Firebase’de yayınlandı mı?</span>' : baglantiHatasi(e);
        });
      }
      ciz();
    }
    function devamEt() {
      if (oyun.durum === 'bekle') lobi();
      else if (oyun.durum === 'soru') topla();
      else if (oyun.durum === 'cevap') sonucEkrani();
      else podyum();
    }

    function lobi() {
      var n = yeni(), katilan = [];
      var adres = location.host + location.pathname.replace(/index\.html$/, '');
      govde.innerHTML = '<div class="canli hoca-ekran lobi">' +
        '<div class="pin-kutu"><p>Code<span class="tr" lang="tr"> · Kod</span></p><b class="pin" aria-label="Code ' + esc(oyun.pin) + '">' + esc(oyun.pin) + '</b>' +
        '<p class="nasil">Op je telefoon: open de site, tik op <b>Live wedstrijd</b> en typ de code.<span class="tr" lang="tr">Telefonunda siteyi aç, <b>Canlı yarış</b>’a dokun ve kodu yaz.</span></p>' +
        '<p class="adres">' + esc(adres) + '</p></div>' +
        '<div class="lobi-alt"><h2><span class="oyuncu-sayi">0</span> spelers<span class="tr" lang="tr"> · oyuncu</span></h2>' +
        '<ul class="oyuncular canli-oyuncular" aria-live="polite"></ul>' +
        '<p class="not bos-not">Nog niemand. Wacht even… <span class="tr" lang="tr">Henüz kimse yok. Biraz bekle…</span></p></div>' + CANLI_AG +
        '<div class="canli-dugmeler"><button type="button" class="dugme ana buyuk baslat" disabled>Start de wedstrijd<small>Yarışı başlat</small></button>' +
        '<button type="button" class="dugme kucuk iptal">Stoppen<small>Vazgeç</small></button></div></div>';
      var liste = govde.querySelector('.canli-oyuncular'), bas = govde.querySelector('.baslat');
      dongu(n, CANLI.lobiOkuma, function () {
        return C.oyuncular().then(function (l) {
          if (!suAn(n)) return;
          katilan = l.filter(function (p) { return p.pin === oyun.pin; }).sort(function (a, b) { return (a.zaman || 0) - (b.zaman || 0); });
          var once = liste.children.length, yeniHtml = katilan.map(function (p) { return '<li>' + esc(p.ad) + '</li>'; }).join('');
          if (liste.innerHTML !== yeniHtml) liste.innerHTML = yeniHtml;      // değişmediyse dokunma (titremesin)
          govde.querySelector('.oyuncu-sayi').textContent = katilan.length;
          govde.querySelector('.bos-not').hidden = katilan.length > 0;
          bas.disabled = !katilan.length;
          if (katilan.length > once && window.SES) SES.cal('adim');
        });
      });
      bas.addEventListener('click', function () {
        katilan.forEach(function (p) { if (!oyun.oyuncular[p.uid]) oyun.oyuncular[p.uid] = { ad: p.ad, puan: 0, son: 0, dogru: false, secim: -1 }; });
        plan.no = 0; soruBaslat();
      });
      govde.querySelector('.iptal').addEventListener('click', function () {
        var m = yeni();
        oyun.durum = 'bitti';
        C.yaz(oyun, false).then(function () { if (suAn(m)) { canliPlanYaz(null); kurulum(null); } }, function (e) { hataEkrani(e, lobi, true); });
      });
    }

    function soruBaslat() {
      var n = yeni(), s = plan.sorular[plan.no];
      yukleniyor();
      var o = JSON.parse(JSON.stringify(oyun));
      o.durum = 'soru'; o.no = plan.no; o.secenek = s.secenekler.length; o.dogruSecim = -1; o.dagilim = []; o.basla = null;
      o.soru = { nl: s.soru.nl, tr: s.soru.tr, ar: s.ar || '' }; o.secenekler = s.secenekler;
      C.yaz(o, true).then(function (bas) {
        if (!suAn(n)) return;
        o.basla = bas || Date.now(); oyun = o; planKaydet(); soruEkrani();
      }, function (e) { hataEkrani(e, soruBaslat, true); });
    }
    function canliUst(s) {
      return '<div class="canli-ust"><span class="soru-no">Vraag ' + (oyun.no + 1) + ' / ' + oyun.toplam + '<span class="tr" lang="tr"> · Soru ' + (oyun.no + 1) + ' / ' + oyun.toplam + '</span></span>' +
        '<span class="konu-etiket">' + esc(s.konu.nl) + '<span class="tr" lang="tr"> · ' + esc(s.konu.tr) + '</span></span></div>';
    }
    function canliSoruMetni(s, renkli) {
      return '<div class="canli-soru">' + (s.ar ? '<div class="medd-kelime"><div class="kelime-yer">' + kelimeCiz(s.ar, !!renkli, renkli && MEDD[s.tur] ? MEDD[s.tur].kopru : false) + '</div>' +
        (s.kaynak ? '<p class="kaynak">' + esc(s.kaynak) + '</p>' : '') + '</div>' : '') +
        '<p class="soru-nl">' + esc(s.soru.nl) + '</p>' + (s.soru.tr ? '<p class="tr soru-tr" lang="tr">' + esc(s.soru.tr) + '</p>' : '') + '</div>';
    }
    function soruEkrani() {
      var n = yeni(), s = plan.sorular[oyun.no], bitis = Date.now() + oyun.sure * 1000, bitti = false;
      var kac = Object.keys(oyun.oyuncular).length;
      govde.innerHTML = '<div class="canli hoca-ekran soru-ekran renk-' + esc(s.konu.renk) + '">' + canliUst(s) + canliSure(oyun.sure) + canliSoruMetni(s, false) +
        canliSecenekler(s.secenekler, -1) +
        '<div class="canli-alt"><span class="cevap-sayi"><b>0</b> / ' + kac + ' antwoorden<span class="tr" lang="tr"> · cevap</span></span>' +
        '<button type="button" class="dugme kucuk erken">Stop de tijd<small>Süreyi bitir</small></button></div>' + CANLI_AG + '</div>';
      var cubuk = govde.querySelector('.sure-cubuk'), sn = govde.querySelector('.sure-sn'), sureKutu = govde.querySelector('.sure');
      var tiktak = window.SES ? SES.sayac() : function () {};
      sayac = setInterval(function () {
        var k = Math.max(0, (bitis - Date.now()) / 1000);
        cubuk.style.transform = 'scaleX(' + (k / oyun.sure) + ')';
        sn.textContent = Math.ceil(k);
        sureKutu.classList.toggle('az', k <= 5);
        tiktak(k);
        if (k <= 0) sureBitti(true);
      }, 100);
      dongu(n, CANLI.okuma, function () {
        return C.cevapSayisi(oyun.no).then(function (c) {
          if (!suAn(n) || bitti) return;
          govde.querySelector('.cevap-sayi b').textContent = c;
          if (kac && c >= kac) sureBitti(false);
        });
      });
      govde.querySelector('.erken').addEventListener('click', function () { sureBitti(true); });
      // Süre bitince geç kalan cevaplar için kısa bir pay bırakılır
      function sureBitti(bekle) {
        if (bitti) return;
        bitti = true; clearInterval(sayac);
        if (window.SES) SES.cal('sure');
        govde.querySelector('.canli-alt').innerHTML = '<span class="cevap-sayi">Tijd is om! Antwoorden tellen…<span class="tr" lang="tr"> · Süre doldu! Cevaplar sayılıyor…</span></span>';
        sn.textContent = '0'; cubuk.style.transform = 'scaleX(0)';
        if (bekle) setTimeout(function () { if (suAn(n)) topla(); }, CANLI.pay); else topla();
      }
    }
    function topla() {
      var n = yeni(), s = plan.sorular[oyun.no];
      var o = JSON.parse(JSON.stringify(oyun)), dag = s.secenekler.map(function () { return 0; });
      C.oyuncular().then(function (l) {
        if (!suAn(n)) return;
        Object.keys(o.oyuncular).forEach(function (uid) { var x = o.oyuncular[uid]; x.son = 0; x.dogru = false; x.secim = -1; });
        l.forEach(function (p) {
          if (p.pin !== o.pin) return;
          var x = o.oyuncular[p.uid] || (o.oyuncular[p.uid] = { ad: p.ad, puan: 0, son: 0, dogru: false, secim: -1 });
          x.ad = p.ad;
          if (p.cevapNo !== o.no || !(p.secim >= 0 && p.secim < dag.length)) return;
          dag[p.secim]++; x.secim = p.secim;
          if (p.secim !== s.dogru) return;
          var oran = Math.min(1, Math.max(0, ((p.zaman || o.basla) - o.basla) / (o.sure * 1000)));
          x.son = Math.round(CANLI.enCok - (CANLI.enCok - CANLI.enAz) * oran);
          x.puan += x.son; x.dogru = true;
        });
        o.durum = 'cevap'; o.dogruSecim = s.dogru; o.dagilim = dag;
        return C.yaz(o, false).then(function () { if (!suAn(n)) return; oyun = o; planKaydet(); sonucEkrani(); });
      }).catch(function (e) { if (suAn(n)) hataEkrani(e, topla, true); });
    }
    function sonucEkrani() {
      var n = yeni(), s = plan.sorular[oyun.no], son = oyun.no + 1 >= oyun.toplam;
      var l = canliSiralama(oyun.oyuncular), dogruSay = l.filter(function (x) { return x.dogru; }).length;
      govde.innerHTML = '<div class="canli hoca-ekran sonuc-ekran renk-' + esc(s.konu.renk) + '">' + canliUst(s) + canliSoruMetni(s, true) +
        canliSecenekler(s.secenekler, s.dogru, oyun.dagilim) +
        (s.aciklama ? '<div class="geri-bildirim dogru canli-aciklama"><p>' + esc(s.aciklama.nl) + '</p>' + (s.aciklama.tr ? '<p class="tr" lang="tr">' + esc(s.aciklama.tr) + '</p>' : '') + '</div>' : '') +
        '<section class="blok ara-sira"><h3>Tussenstand<small class="tr" lang="tr">Ara sıralama · ' + dogruSay + ' / ' + l.length + ' doğru</small></h3>' +
        '<ol class="sira-liste buyuk">' + l.slice(0, 5).map(function (x, i) {
          return '<li class="s' + (i + 1) + '"><span class="sira-no">' + (i + 1) + '</span><span class="sira-ad">' + esc(x.ad) + (x.son ? '<small>+' + x.son + '</small>' : '') + '</span><b>' + x.puan + '</b></li>';
        }).join('') + '</ol></section>' +
        '<div class="canli-dugmeler"><button type="button" class="dugme ana buyuk sonraki">' + (son ? 'Uitslag<small>Sonuç</small>' : 'Volgende vraag<small>Sonraki soru</small>') + '</button></div></div>';
      var d = govde.querySelector('.sonraki');
      d.addEventListener('click', function () {
        if (!suAn(n)) return;
        d.disabled = true;
        if (son) bitir(); else { plan.no = oyun.no + 1; soruBaslat(); }
      });
      d.focus({ preventScroll: true });
    }
    function bitir() {
      var n = yeni(), o = JSON.parse(JSON.stringify(oyun));
      o.durum = 'bitti';
      C.yaz(o, false).then(function () { if (!suAn(n)) return; oyun = o; canliPlanYaz(null); podyum(); }, function (e) { hataEkrani(e, bitir, true); });
    }
    function podyum() {
      yeni();
      var l = canliSiralama(oyun.oyuncular);
      govde.innerHTML = '<div class="canli hoca-ekran podyum-ekran"><h1>Uitslag<span class="tr" lang="tr"> · Sonuç</span></h1>' +
        '<ol class="podyum">' + [1, 0, 2].map(function (i) {
          var x = l[i];
          return x ? '<li class="p' + (i + 1) + '"><span class="p-ad">' + esc(x.ad) + '</span><b class="p-puan">' + x.puan + '</b><span class="p-blok">' + (i + 1) + '</span></li>' : '<li class="p' + (i + 1) + ' bos"><span class="p-blok"></span></li>';
        }).join('') + '</ol>' +
        (l.length > 3 ? '<ol class="sira-liste canli-geri" start="4">' + l.slice(3).map(function (x, i) {
          return '<li><span class="sira-no">' + (i + 4) + '</span><span class="sira-ad">' + esc(x.ad) + '</span><b>' + x.puan + '</b></li>';
        }).join('') + '</ol>' : '') +
        '<div class="canli-dugmeler"><button type="button" class="dugme ana buyuk yeni">Nieuwe wedstrijd<small>Yeni yarış</small></button></div></div>';
      govde.querySelector('.yeni').addEventListener('click', function () { kurulum(null); });
      if (window.SES && l.length) SES.cal('rekor');
    }

    // =====================================================
    // Çocuk: telefon
    // =====================================================
    var ogr = null, pinim = null;
    function ogrenciBasla() {
      var n = yeni();
      yukleniyor();
      T.ogrenci().then(function (o) {
        ogr = o;
        return Promise.all([C.oyun(), C.benim(o.uid)]);
      }).then(function (r) {
        if (!suAn(n)) return;
        var o = r[0], b = r[1];
        if (o && b && b.pin === o.pin && o.durum !== 'bitti') { pinim = o.pin; oyunda(); } else pinEkrani();
      }, function (e) {
        if (!suAn(n)) return;
        if (e && e.kod === 'LISTEDE_YOK') {
          govde.innerHTML = '<div class="canli"><section class="blok"><p class="uyari">Je account staat nog niet op de klassenlijst. Vraag het aan je leraar. <span class="tr" lang="tr">Hesabın henüz sınıf listesinde değil. Hocana söyle.</span></p>' +
            '<button type="button" class="dugme kucuk cikis">Uitloggen<small>Çıkış</small></button></section></div>';
          cikisBagla();
        } else if (!T.hesap()) giris('Log opnieuw in. <span class="tr" lang="tr">Tekrar giriş yap.</span>');
        else hataEkrani(e, ogrenciBasla);
      });
    }
    function pinEkrani(uyari) {
      var n = yeni();
      govde.innerHTML = '<div class="canli"><h1>Live wedstrijd<span class="tr" lang="tr"> · Canlı yarış</span></h1>' +
        '<p class="giris">Hoi ' + esc(ogr.ad) + '! Typ de code die op het grote scherm staat. <span class="tr" lang="tr">Selam! Büyük ekrandaki kodu yaz.</span></p>' +
        '<section class="blok"><form class="giris-form pin-form" novalidate><label for="pin">Code<span class="tr" lang="tr"> · Kod</span></label>' +
        '<input id="pin" class="pin-giris" type="text" inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]*">' +
        '<p class="uyari" role="alert">' + (uyari || '') + '</p>' +
        '<button type="submit" class="dugme ana buyuk">Doe mee<small>Katıl</small></button></form></section>' +
        '<p class="not">Ingelogd als ' + esc(ogr.ad) + '. <button type="button" class="dugme kucuk cikis">Uitloggen<small>Çıkış</small></button></p></div>';
      cikisBagla();
      var form = govde.querySelector('.pin-form'), giris_ = form.querySelector('#pin');
      if (!('ontouchstart' in window)) giris_.focus({ preventScroll: true });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var pin = giris_.value.replace(/\D/g, ''), d = form.querySelector('button'), uy = form.querySelector('.uyari');
        if (pin.length !== 4) { uy.innerHTML = 'De code heeft 4 cijfers. <span class="tr" lang="tr">Kod 4 rakamlı.</span>'; return; }
        d.disabled = true; d.innerHTML = 'Bezig…<small>Katılıyor…</small>';
        Promise.all([C.oyun(), C.benim(ogr.uid)]).then(function (r) {
          var o = r[0], b = r[1];
          if (!o || o.durum === 'bitti') throw { kod: 'YOK' };
          if (o.pin !== pin) throw { kod: 'PIN' };
          if (b && b.pin === pin) return;                 // zaten katılmış (sayfa yenilendi)
          return C.katil(ogr, pin);
        }).then(function () { if (suAn(n)) { pinim = pin; oyunda(); } }, function (x) {
          if (!suAn(n)) return;
          pinEkrani(x.kod === 'YOK' ? 'Er is nu geen wedstrijd. Wacht tot je leraar hem opent. <span class="tr" lang="tr">Şu an yarış yok. Hocan açınca tekrar dene.</span>'
            : x.kod === 'PIN' ? 'Deze code klopt niet. Kijk nog eens naar het scherm. <span class="tr" lang="tr">Kod yanlış. Ekrana tekrar bak.</span>'
            : baglantiHatasi(x));
          govde.querySelector('#pin').value = pin;
        });
      });
    }
    function oyunda() {
      var n = yeni(), anahtar = '', cevaplar = {}, aralik = CANLI.okuma;
      govde.innerHTML = '<div class="canli oyuncu-ekran"><div class="oyuncu-ust"><b>' + esc(ogr.ad) + '</b><span class="oyuncu-puan"></span></div>' +
        '<div class="oyuncu-ic" aria-live="polite"></div>' + CANLI_AG + '</div>';
      var ic = govde.querySelector('.oyuncu-ic');
      dongu(n, function () { return aralik; }, function () {
        return C.oyun().then(function (o) {
          if (!suAn(n)) return;
          aralik = o && o.durum === 'bitti' ? 5000 : CANLI.okuma;      // yarış bitince daha seyrek bak
          if (!o || o.pin !== pinim) { pinEkrani(o ? undefined : 'De wedstrijd is gestopt. <span class="tr" lang="tr">Yarış kapandı.</span>'); return; }
          var a = o.durum + ':' + o.no;
          if (a === anahtar) return;
          anahtar = a; goster(o);
        });
      });
      function goster(o) {
        clearInterval(sayac);
        var ben = (o.oyuncular || {})[ogr.uid];
        govde.querySelector('.oyuncu-puan').innerHTML = ben ? ben.puan + ' <small>punten · puan</small>' : '';
        if (o.durum === 'bekle') ic.innerHTML = '<div class="oyuncu-bekle"><p class="ob-baslik">Je doet mee!<span class="tr" lang="tr">Katıldın!</span></p>' +
          '<p>Kijk naar het grote scherm. De wedstrijd begint zo. <span class="tr" lang="tr">Büyük ekrana bak. Yarış birazdan başlıyor.</span></p><span class="nokta-nokta" aria-hidden="true"><i></i><i></i><i></i></span></div>';
        else if (o.durum === 'soru') soruGoster(o);
        else if (o.durum === 'cevap') sonucGoster(o, ben);
        else bittiGoster(o, ben);
      }
      function soruGoster(o) {
        var no = o.no, gorulme = Date.now(), sure = o.sure * 1000 - 300;
        if (cevaplar[no] != null) { gonderildi(cevaplar[no]); return; }
        ic.innerHTML = '<p class="oyuncu-no">Vraag ' + (no + 1) + ' / ' + o.toplam + '<span class="tr" lang="tr"> · Soru ' + (no + 1) + ' / ' + o.toplam + '</span></p>' + canliSure(o.sure) +
          '<div class="oyuncu-soru">' + (o.soru && o.soru.ar ? '<div class="kelime-yer">' + kelimeCiz(o.soru.ar, false) + '</div>' : '') +
          '<p>' + esc(o.soru ? o.soru.nl : '') + '</p>' + (o.soru && o.soru.tr ? '<p class="tr" lang="tr">' + esc(o.soru.tr) + '</p>' : '') + '</div>' +
          '<div class="cevap-dugmeler n' + o.secenekler.length + '">' + o.secenekler.map(function (c, i) {
            return '<button type="button" class="cd cs' + i + '" data-i="' + i + '">' + sekil(i) + '<span><b>' + esc(c.nl) + '</b>' + (c.tr ? '<small lang="tr">' + esc(c.tr) + '</small>' : '') + '</span></button>';
          }).join('') + '</div><p class="uyari" role="alert"></p>';
        var cubuk = ic.querySelector('.sure-cubuk'), sn = ic.querySelector('.sure-sn'), sureKutu = ic.querySelector('.sure');
        sayac = setInterval(function () {
          var k = Math.max(0, (sure - (Date.now() - gorulme)) / 1000);
          cubuk.style.transform = 'scaleX(' + Math.min(1, k / o.sure) + ')';
          sn.textContent = Math.ceil(k);
          sureKutu.classList.toggle('az', k <= 5);
          if (k <= 0) {
            clearInterval(sayac);
            ic.innerHTML = '<div class="oyuncu-bekle"><p class="ob-baslik">Tijd is om!<span class="tr" lang="tr">Süre doldu!</span></p><p>Kijk naar het grote scherm. <span class="tr" lang="tr">Büyük ekrana bak.</span></p></div>';
          }
        }, 100);
        ic.querySelectorAll('.cd').forEach(function (d) {
          d.addEventListener('click', function () {
            var i = Number(d.dataset.i);
            ic.querySelectorAll('.cd').forEach(function (x) { x.disabled = true; x.classList.toggle('secildi', x === d); });
            clearInterval(sayac);
            cevaplar[no] = i;
            C.cevapla(ogr.uid, no, i).then(function () { if (suAn(n) && anahtar === 'soru:' + no) gonderildi(i); }, function (e) {
              if (!suAn(n) || anahtar !== 'soru:' + no) return;
              if (e && e.durum === 403) { ic.innerHTML = '<div class="oyuncu-bekle"><p class="ob-baslik">Te laat!<span class="tr" lang="tr">Geç kaldın!</span></p><p>Kijk naar het grote scherm. <span class="tr" lang="tr">Büyük ekrana bak.</span></p></div>'; return; }
              delete cevaplar[no];
              ic.querySelectorAll('.cd').forEach(function (x) { x.disabled = false; x.classList.remove('secildi'); });
              ic.querySelector('.uyari').innerHTML = 'Niet verstuurd. Tik nog een keer. <span class="tr" lang="tr">Gönderilemedi. Tekrar dokun.</span>';
            });
          });
        });
      }
      function gonderildi(i) {
        ic.innerHTML = '<div class="gonderildi cs' + i + '">' + sekil(i) + '<p class="ob-baslik">Antwoord verstuurd!<span class="tr" lang="tr">Cevabın gitti!</span></p>' +
          '<p>Kijk naar het grote scherm. <span class="tr" lang="tr">Büyük ekrana bak.</span></p></div>';
      }
      function yerYazi(o) {
        var l = canliSiralama(o.oyuncular), yer = 0;
        l.forEach(function (x, i) { if (x.uid === ogr.uid) yer = i + 1; });
        return { yer: yer, kac: l.length, l: l };
      }
      function sonucGoster(o, ben) {
        var y = yerYazi(o), verdi = cevaplar[o.no] != null;
        var iyi = ben && ben.dogru, cevapli = ben && ben.secim >= 0;
        var b = iyi ? ['Goed!', 'Doğru!'] : cevapli ? ['Helaas, fout', 'Olmadı'] : verdi ? ['Je antwoord was te laat', 'Cevabın geç kaldı'] : ['Geen antwoord', 'Cevap vermedin'];
        ic.innerHTML = '<div class="oyuncu-sonuc ' + (iyi ? 'dogru' : 'yanlis') + '"><p class="ob-baslik">' + b[0] + (iyi ? ' +' + ben.son : '') + '<span class="tr" lang="tr">' + b[1] + '</span></p>' +
          (y.yer ? '<p class="os-yer">Je staat <b>' + y.yer + 'e</b> van ' + y.kac + '<span class="tr" lang="tr">' + y.kac + ' kişiden <b>' + y.yer + '.</b> sıradasın</span></p>' : '') + '</div>';
        if (window.SES) SES.cal(iyi ? 'dogru' : 'yanlis');
      }
      function bittiGoster(o, ben) {
        var y = yerYazi(o);
        ic.innerHTML = '<div class="oyuncu-sonuc bitti"><p class="ob-baslik">De wedstrijd is klaar!<span class="tr" lang="tr">Yarış bitti!</span></p>' +
          (y.yer ? '<p class="os-buyuk">' + y.yer + '<small>e</small></p><p class="os-yer">Je bent <b>' + y.yer + 'e</b> geworden met ' + (ben ? ben.puan : 0) + ' punten.<span class="tr" lang="tr">' + y.yer + '. oldun, ' + (ben ? ben.puan : 0) + ' puan.</span></p>' : '') +
          '<ol class="sira-liste">' + y.l.slice(0, 3).map(function (x, i) { return '<li class="s' + (i + 1) + (x.uid === ogr.uid ? ' ben' : '') + '"><span class="sira-no">' + (i + 1) + '</span><span class="sira-ad">' + esc(x.ad) + '</span><b>' + x.puan + '</b></li>'; }).join('') + '</ol></div>';
        if (window.SES) SES.cal(y.yer && y.yer <= 3 ? 'rekor' : 'bitis');
        document.dispatchEvent(new CustomEvent('canli-bitti', { detail: { yer: y.yer, kac: y.kac, puan: ben ? ben.puan : 0 } }));
      }
    }
  }

  // =========================================================
  // Rozetler: haftalar boyunca oyunlardan, hikâyelerden ve yarışlardan kazanılır.
  // Sadece bu cihazda saklanır (dersler-rozet); hiçbir yere gönderilmez.
  //   k        kazanılan rozetler: { id: zaman }
  //   sohbet   sonuna kadar okunan hikâyeler: { "hafta:konu:blok": 1 }
  //   zor      zor yarış: { oyun, enIyi (doğru sayısı) }
  //   canli    canlı yarış: { oyun, enIyiYer }
  //   haftalar oyun oynanan takvim haftaları: { "2026-47": 1 }
  // =========================================================
  var rozet = oku('dersler-rozet', {});
  ['k', 'sohbet', 'zor', 'canli', 'haftalar'].forEach(function (a) { if (!rozet[a] || typeof rozet[a] !== 'object') rozet[a] = {}; });
  var ROZET_RENK = { ogrenme: 'var(--ibadet)', tecvid: 'var(--kuran)', yaris: 'var(--siyer)', devam: 'var(--ezber)', bronz: '#b9733a', gumus: '#8b98aa', altin: '#e2a500' };
  var ROZET_GRUP = [
    { id: 'ogrenme', nl: 'Leren', tr: 'Öğrenme' },
    { id: 'tecvid', nl: 'Tecvid', tr: 'Tecvid' },
    { id: 'yaris', nl: 'Wedstrijden', tr: 'Yarışlar' },
    { id: 'devam', nl: 'Volhouden', tr: 'Devamlılık' },
  ];
  // Simgeler 24x24, çizgi olarak çizilir
  var ROZET_SIMGE = {
    filiz: '<path d="M12 21v-9M12 12c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5zM12 12c0-4.2 3-7 7-7 0 4.2-3 7-7 7z"/>',
    yildiz: '<path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/>',
    takvimYildiz: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4M12 11.8l1.1 2.2 2.4.3-1.8 1.7.4 2.4-2.1-1.2-2.1 1.2.4-2.4-1.8-1.7 2.4-.3z"/>',
    ucYildiz: '<path d="M12 3l1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 11.2l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5zM6 13.5l1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2-1.6-1.6 2.2-.3zM18 13.5l1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2-1.6-1.6 2.2-.3z"/>',
    kitap: '<path d="M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1V19c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6.5V20"/>',
    merdiven: '<path d="M3.5 20h4.5v-4.5h4.5V11h4.5V6.5h3.5"/><path d="M3.5 20h17"/>',
    kalp: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    kalem: '<path d="M14.5 4.5l5 5L9 20H4v-5zM12.5 6.5l5 5"/>',
    buyutec: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    pusula: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    tac: '<path d="M4 19h16M5 15.5L4 7l5 4 3-6 3 6 5-4-1 8.5z"/>',
    karisik: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    kronometre: '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M10 3h4M18.2 7.3l1.5-1.5"/>',
    zirve: '<path d="M2.5 20l6.5-10.5 4 6 3-4 5.5 8.5zM9 9.5V3.5l4.5 1.6L9 6.7"/>',
    sinif: '<circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M3 19.5c0-3 2.2-5.2 5-5.2s5 2.2 5 5.2M13.6 15.3c.9-.8 1.9-1.2 3-1.2 2.5 0 4.4 1.9 4.4 4.7"/>',
    podyum: '<path d="M3 20v-6h6v6M9 20V9h6v11M15 20v-8h6v8M2.5 20h19"/>',
    kupa: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5c0 3 1.5 4.5 3.5 4.5M16 6h3c0 3-1.5 4.5-3.5 4.5M12 13v4M8.5 20h7M10 17h4v3h-4z"/>',
    takvimTik: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4M8.5 14.5l2.2 2.2 4.8-4.8"/>',
  };
  function bloklarHepsi() {             // açık haftaların ve kuralların oyun blokları
    var l = [];
    D.sira.forEach(function (id) {
      var h = D.haftalar[id];
      if (!h || kilitli(h)) return;
      h.konular.forEach(function (k) { k.bloklar.forEach(function (b, bi) { l.push({ a: h.id + ':' + k.id + ':' + bi, tur: b.tur }); }); });
    });
    if (D.tecvid) D.tecvid.kurallar.forEach(function (k) {
      if (kuralKilitli(k)) return;
      k.bloklar.forEach(function (b, bi) { l.push({ a: 'tecvid:' + k.id + ':' + bi, tur: b.tur }); });
    });
    return l;
  }
  function tamYildizVar(tur) { return bloklarHepsi().some(function (x) { return x.tur === tur && (yildizlar[x.a] || 0) >= 3; }); }
  function toplamYildiz() { return Object.keys(yildizlar).reduce(function (t, k) { return t + (Number(yildizlar[k]) || 0); }, 0); }
  function tamHafta() {
    return D.sira.some(function (id) { var h = D.haftalar[id]; if (!h || kilitli(h)) return false; var y = haftaYildizi(h); return y.toplam > 0 && y.kazanilan >= y.toplam; });
  }
  function tecvidTam() {                // { tam: tamamlanan kural sayısı, hepsi: yıldızlı açık kural sayısı }
    var tam = 0, hepsi = 0;
    if (D.tecvid) D.tecvid.kurallar.forEach(function (k) {
      if (kuralKilitli(k)) return;
      var y = haftaYildizi({ id: 'tecvid', konular: [k] });
      if (!y.toplam) return;
      hepsi++; if (y.kazanilan >= y.toplam) tam++;
    });
    return { tam: tam, hepsi: hepsi };
  }
  function isaretliKelime() {
    var n = 0;
    Object.keys(isaretler).forEach(function (a) { Object.keys(isaretler[a]).forEach(function (c) { n += String(isaretler[a][c]).replace(/0/g, '').length; }); });
    return n;
  }
  function say(o) { return Object.keys(o || {}).length; }
  // ilerleme: [şimdiki, hedef]
  var ROZETLER = [
    { id: 'ilk-adim', grup: 'ogrenme', simge: 'filiz', nl: 'Eerste stap', tr: 'İlk adım', nasilNl: 'Verdien je eerste ster in een spel.', nasilTr: 'Bir oyunda ilk yıldızını kazan.', kosul: function () { return toplamYildiz() > 0; } },
    { id: 'tam-puan', grup: 'ogrenme', simge: 'yildiz', nl: 'Foutloos', tr: 'Tam puan', nasilNl: 'Haal 3 sterren in een spel.', nasilTr: 'Bir oyunda 3 yıldız al.', kosul: function () { return Object.keys(yildizlar).some(function (k) { return yildizlar[k] >= 3; }); } },
    { id: 'hikaye', grup: 'ogrenme', simge: 'kitap', nl: 'Verhalenlezer', tr: 'Hikâye okuru', nasilNl: 'Lees 5 verhalen helemaal uit.', nasilTr: '5 hikâyeyi sonuna kadar oku.', ilerleme: function () { return [say(rozet.sohbet), 5]; } },
    { id: 'sira', grup: 'ogrenme', simge: 'merdiven', nl: 'Stap voor stap', tr: 'Adım adım', nasilNl: 'Zet de stappen in de goede volgorde, zonder fout (3 sterren).', nasilTr: 'Adımları hatasız sırala (3 yıldız).', kosul: function () { return tamYildizVar('sirala'); } },
    { id: 'ezber', grup: 'ogrenme', simge: 'kalp', nl: 'Uit het hoofd', tr: 'Ezberci', nasilNl: 'Zet de âyets van een sure in de goede volgorde (3 sterren).', nasilTr: 'Bir sûrenin âyetlerini doğru sırala (3 yıldız).', kosul: function () { return tamYildizVar('ezber'); } },
    { id: 'isaret', grup: 'ogrenme', simge: 'kalem', nl: 'Markeerder', tr: 'İşaretçi', nasilNl: 'Markeer 20 woorden met de stift.', nasilTr: 'Kalemle 20 kelime işaretle.', ilerleme: function () { return [isaretliKelime(), 20]; } },
    { id: 'hafta', grup: 'ogrenme', simge: 'takvimYildiz', nl: 'Ster van de week', tr: 'Haftanın yıldızı', nasilNl: 'Haal alle sterren van één week.', nasilTr: 'Bir haftanın bütün yıldızlarını topla.', kosul: tamHafta },
    { id: 'yildiz-25', grup: 'bronz', simge: 'ucYildiz', nl: 'Sterrenjager', tr: 'Yıldız avcısı', alt: { nl: 'brons', tr: 'bronz' }, nasilNl: 'Verzamel 25 sterren.', nasilTr: '25 yıldız topla.', ilerleme: function () { return [toplamYildiz(), 25]; } },
    { id: 'yildiz-50', grup: 'gumus', simge: 'ucYildiz', nl: 'Sterrenjager', tr: 'Yıldız avcısı', alt: { nl: 'zilver', tr: 'gümüş' }, nasilNl: 'Verzamel 50 sterren.', nasilTr: '50 yıldız topla.', ilerleme: function () { return [toplamYildiz(), 50]; } },
    { id: 'yildiz-100', grup: 'altin', simge: 'ucYildiz', nl: 'Sterrenjager', tr: 'Yıldız avcısı', alt: { nl: 'goud', tr: 'altın' }, nasilNl: 'Verzamel 100 sterren.', nasilTr: '100 yıldız topla.', ilerleme: function () { return [toplamYildiz(), 100]; } },
    { id: 'med', grup: 'tecvid', simge: 'buyutec', nl: 'Medd-detective', tr: 'Med dedektifi', nasilNl: 'Haal 3 sterren in een “Welke medd?”-spel.', nasilTr: 'Bir “Hangi med?” oyununda 3 yıldız al.', kosul: function () { return tamYildizVar('medd'); } },
    { id: 'tecvid-3', grup: 'tecvid', simge: 'pusula', nl: 'Tecvid-reiziger', tr: 'Tecvid yolcusu', nasilNl: 'Haal alle sterren bij 3 tecvidregels.', nasilTr: '3 tecvid kuralının bütün yıldızlarını al.', ilerleme: function () { return [tecvidTam().tam, 3]; } },
    { id: 'tecvid-hepsi', grup: 'tecvid', simge: 'tac', nl: 'Tecvid-meester', tr: 'Tecvid ustası', nasilNl: 'Haal alle sterren bij alle tecvidregels.', nasilTr: 'Bütün tecvid kurallarının bütün yıldızlarını al.', ilerleme: function () { var t = tecvidTam(); return [t.tam, Math.max(1, t.hepsi)]; } },
    { id: 'karisik', grup: 'tecvid', simge: 'karisik', nl: 'Alles door elkaar', tr: 'Karışık şampiyonu', nasilNl: 'Haal 3 sterren in de gemengde herhaling.', nasilTr: 'Karışık tekrarda 3 yıldız al.', kosul: function () { return (yildizlar['tecvid:karisik:0'] || 0) >= 3; } },
    { id: 'zor', grup: 'yaris', simge: 'kronometre', nl: 'Durfal', tr: 'Cesur yarışçı', nasilNl: 'Speel de Moeilijke wedstrijd.', nasilTr: 'Zor yarışı oyna.', kosul: function () { return (rozet.zor.oyun || 0) >= 1; } },
    { id: 'zirve', grup: 'yaris', simge: 'zirve', nl: 'Topper', tr: 'Zirve', nasilNl: 'Heb 16 of meer van de 20 goed in de Moeilijke wedstrijd.', nasilTr: 'Zor yarışta 20 sorudan en az 16’sını bil.', kosul: function () { return (rozet.zor.enIyi || 0) >= 16; } },
    { id: 'canli', grup: 'yaris', simge: 'sinif', nl: 'Samen in de les', tr: 'Sınıfla yarıştım', nasilNl: 'Speel een live wedstrijd mee in de les.', nasilTr: 'Derste bir canlı yarışa katıl.', kosul: function () { return (rozet.canli.oyun || 0) >= 1; } },
    { id: 'podyum', grup: 'yaris', simge: 'podyum', nl: 'Op het podium', tr: 'Podyumda', nasilNl: 'Eindig bij de eerste 3 in een live wedstrijd.', nasilTr: 'Canlı yarışta ilk 3’e gir.', kosul: function () { var y = rozet.canli.enIyiYer; return y > 0 && y <= 3; } },
    { id: 'birinci', grup: 'yaris', simge: 'kupa', nl: 'Winnaar', tr: 'Birinci', nasilNl: 'Word eerste in een live wedstrijd.', nasilTr: 'Canlı yarışta birinci ol.', kosul: function () { return rozet.canli.enIyiYer === 1; } },
    { id: 'devam', grup: 'devam', simge: 'takvimTik', nl: 'Volhouder', tr: 'Devamlı', nasilNl: 'Speel in 3 verschillende weken.', nasilTr: '3 farklı haftada oyna.', ilerleme: function () { return [say(rozet.haftalar), 3]; } },
  ];
  function rozetTamam(r) { if (r.kosul) return r.kosul(); var i = r.ilerleme(); return i[0] >= i[1]; }
  function rozetGrubu(r) { return r.grup === 'bronz' || r.grup === 'gumus' || r.grup === 'altin' ? 'ogrenme' : r.grup; }
  function madalya(r, kazanildi, sinif) {
    return '<svg class="madalya' + (kazanildi ? '' : ' kilitli') + (sinif ? ' ' + sinif : '') + '" viewBox="0 0 64 64" aria-hidden="true" style="--rr:' + ROZET_RENK[r.grup] + '">' +
      '<g class="m-dis"><rect x="13" y="13" width="38" height="38" rx="4"/><rect x="13" y="13" width="38" height="38" rx="4" transform="rotate(45 32 32)"/></g>' +
      '<circle class="m-ic" cx="32" cy="32" r="17.5"/><g class="m-simge" transform="translate(20 20)">' + ROZET_SIMGE[r.simge] + '</g></svg>';
  }
  function rozetAdi(r) { return r.nl + (r.alt ? ' (' + r.alt.nl + ')' : ''); }
  function rozetAdiTr(r) { return r.tr + (r.alt ? ' (' + r.alt.tr + ')' : ''); }
  function haftaKodu(t) {
    var d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    var y1 = new Date(d.getFullYear(), 0, 4);
    return d.getFullYear() + '-' + (1 + Math.round(((d - y1) / 864e5 - 3 + (y1.getDay() + 6) % 7) / 7));
  }
  // Bir şey yapıldı: kaydet, rozetlere bak
  function rozetOlay(tur, veri) {
    rozet.haftalar[haftaKodu(Date.now())] = 1;
    if (tur === 'sohbet') rozet.sohbet[veri] = 1;
    if (tur === 'zor') { rozet.zor.oyun = (rozet.zor.oyun || 0) + 1; rozet.zor.enIyi = Math.max(rozet.zor.enIyi || 0, veri.dogru || 0); }
    if (tur === 'canli') {
      rozet.canli.oyun = (rozet.canli.oyun || 0) + 1;
      if (veri.yer > 0 && (!rozet.canli.enIyiYer || veri.yer < rozet.canli.enIyiYer)) rozet.canli.enIyiYer = veri.yer;
    }
    yaz('dersler-rozet', rozet);
    rozetKontrol();
  }
  document.addEventListener('canli-bitti', function (e) { rozetOlay('canli', e.detail || {}); });
  var rozetSira = [], rozetGosteriliyor = false;
  function rozetKontrol(sessiz) {
    var yeni = [];
    ROZETLER.forEach(function (r) {
      if (rozet.k[r.id]) return;
      var tamam = false;
      try { tamam = rozetTamam(r); } catch (e) {}
      if (tamam) { rozet.k[r.id] = Date.now(); yeni.push(r); }
    });
    if (!yeni.length) return;
    yaz('dersler-rozet', rozet);
    if (sessiz) return;
    rozetSira.push(yeni.length > 1 ? { toplu: yeni, zaman: Date.now() } : { r: yeni[0], zaman: Date.now() });   // aynı anda kazanılanlar tek bildirimde
    rozetBildir();
  }
  var rozetKutu = document.createElement('div');
  rozetKutu.className = 'rozet-bildirim-yer';
  rozetKutu.setAttribute('role', 'status');
  document.body.appendChild(rozetKutu);
  function rozetBildir() {
    if (rozetGosteriliyor || !rozetSira.length) return;
    var x = rozetSira.shift();
    rozetGosteriliyor = true;
    var r = x.r || x.toplu[0], iki = x.toplu && x.toplu.length === 2;
    rozetKutu.innerHTML = '<a class="rozet-bildirim" href="#/rozetler">' + madalya(r, true) + '<span><small>' +
      (x.toplu ? x.toplu.length + ' nieuwe badges!<span class="tr" lang="tr"> · ' + x.toplu.length + ' yeni rozet!</span>' : 'Nieuwe badge!<span class="tr" lang="tr"> · Yeni rozet!</span>') +
      '</small><b>' + (iki ? esc(rozetAdi(x.toplu[0]) + ' + ' + rozetAdi(x.toplu[1])) : x.toplu ? 'Bekijk je badges' : esc(rozetAdi(r))) + '</b>' +
      '<small class="tr" lang="tr">' + (iki ? esc(rozetAdiTr(x.toplu[0]) + ' + ' + rozetAdiTr(x.toplu[1])) : x.toplu ? 'Rozetlerine bak' : esc(rozetAdiTr(r))) + '</small></span></a>';
    if (window.SES && Date.now() - x.zaman < 1500) SES.cal('rekor');      // sırada beklemiş bildirim ses çıkarmaz (oyunun ortasına düşmesin)
    setTimeout(function () {
      var el = rozetKutu.querySelector('.rozet-bildirim');
      if (el) el.classList.add('gidiyor');
      setTimeout(function () { rozetKutu.innerHTML = ''; rozetGosteriliyor = false; rozetBildir(); }, 350);
    }, 4200);
  }
  function rozetSeridi() {
    var kaz = ROZETLER.filter(function (r) { return rozet.k[r.id]; }).sort(function (a, b) { return rozet.k[b.id] - rozet.k[a.id]; });
    return '<a class="rozet-serit" href="#/rozetler"><span class="rs-madalyalar">' +
      (kaz.length ? kaz.slice(0, 3).map(function (r) { return madalya(r, true); }).join('') : madalya(ROZETLER[0], false)) + '</span>' +
      '<span class="rs-yazi">Mijn badges<small class="tr" lang="tr">Rozetlerim</small></span><span class="rs-sayi"><b>' + kaz.length + '</b> / ' + ROZETLER.length + '</span><span class="ok" aria-hidden="true">›</span></a>';
  }
  function rozetSayfasi() {
    document.title = 'Mijn badges · Ahi Evran Camii';
    ustGeri('#/', 'Alle weken', 'Tüm haftalar', 'Mijn badges', 'Rozetlerim');
    var kac = ROZETLER.filter(function (r) { return rozet.k[r.id]; }).length;
    var tarih = function (t) { var d = new Date(t); try { return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }); } catch (e) { return ''; } };
    govde.innerHTML = '<div class="rozetler"><h1>Mijn badges<span class="tr" lang="tr"> · Rozetlerim</span></h1>' +
      '<p class="giris"><b>' + kac + ' / ' + ROZETLER.length + '</b> behaald. Speel de spellen, lees de verhalen en doe mee met de wedstrijden. ' +
      '<span class="tr" lang="tr">' + ROZETLER.length + ' rozetten ' + kac + ' tanesi kazanıldı. Oyunları oyna, hikâyeleri oku, yarışlara katıl.</span></p>' +
      ROZET_GRUP.map(function (g) {
        var l = ROZETLER.filter(function (r) { return rozetGrubu(r) === g.id; });
        return '<section class="rozet-grup"><h2>' + g.nl + '<span class="tr" lang="tr"> · ' + g.tr + '</span></h2><ul class="rozet-liste">' + l.map(function (r) {
          var k = rozet.k[r.id], i = !k && r.ilerleme ? r.ilerleme() : null;
          return '<li class="rozet-k' + (k ? ' kazanildi' : '') + '">' + madalya(r, !!k) +
            '<b>' + esc(rozetAdi(r)) + '</b><small class="tr" lang="tr">' + esc(rozetAdiTr(r)) + '</small>' +
            '<p class="nasil-k">' + esc(r.nasilNl) + '<span class="tr" lang="tr">' + esc(r.nasilTr) + '</span></p>' +
            (k ? '<p class="ne-zaman">✓ ' + tarih(k) + '</p>'
               : i ? '<p class="ilerleme"><span class="il-yol"><span style="width:' + Math.min(100, Math.round(100 * i[0] / i[1])) + '%"></span></span>' + Math.min(i[0], i[1]) + ' / ' + i[1] + '</p>' : '') +
            '</li>';
        }).join('') + '</ul></section>';
      }).join('') +
      '<p class="not">Je badges staan alleen op dit apparaat. <span class="tr" lang="tr">Rozetlerin sadece bu cihazda durur.</span></p></div>';
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
    var ilk = true;                   // "Bu hafta" rozeti açık olan en yeni haftaya
    var kartlar = D.sira.slice().reverse().map(function (id) {
      var h = D.haftalar[id];
      if (!h) return '';
      if (kilitli(h)) return kilitKarti(h);
      var yeni = ilk; ilk = false;
      var y = haftaYildizi(h);
      return '<div class="hafta-kart' + (yeni ? ' yeni' : '') + '">' +
        '<div class="hafta-no"><span>Week</span><b>' + esc(h.no) + '</b><small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></div>' +
        '<div class="hafta-bilgi">' + (yeni ? '<span class="rozet">Deze week<span class="tr" lang="tr"> · Bu hafta</span></span>' : '') +
        (kilitBekliyor(h) ? '<span class="rozet kilit-rozet">' + KILIT + 'Leerlingen: op slot<span class="tr" lang="tr"> · Öğrencilere kilitli</span></span>' : '') +
        '<ul>' + h.konular.map(function (k) { return '<li class="renk-' + esc(k.renk) + '"><span class="nokta"></span>' + nl(k.ad) + '<small class="tr" lang="tr">' + tr(k.ad) + '</small></li>'; }).join('') + '</ul>' +
        '<div class="hafta-alt">' + yildizSayac(y.kazanilan, y.toplam) + '<span class="hafta-dugmeler">' +
        '<a class="yaris-d" href="#/' + esc(h.id) + '/yaris">Wedstrijd<small>Yarış</small></a>' +
        '<a class="basla" href="#/' + esc(h.id) + '">Open<small>Aç</small></a></span></div></div></div>';
    }).join('');
    govde.innerHTML = '<div class="ana"><h1>Selam! Kies een week<span class="tr" lang="tr"> · Bir hafta seç</span></h1>' +
      '<p class="giris">Lees de verhalen, markeer met de stift, verdien sterren en doe mee met de wedstrijd. <span class="tr" lang="tr">Hikâyeleri oku, kalemle işaretle, yıldız topla ve yarışa katıl.</span></p>' +
      (hatalar.length ? '<div class="hata">' + hatalar.map(esc).join('<br>') + '</div>' : '') +
      '<a class="yaris-serit canli-serit" href="#/canli"><span>Live wedstrijd in de les<small class="tr" lang="tr">Derste canlı yarış</small></span><span class="ok" aria-hidden="true">›</span></a>' +
      (D.tecvid ? '<a class="yaris-serit tecvid-serit" href="#/tecvid"><span>Tecvid: alle regels op één plek<small class="tr" lang="tr">Tecvid: bütün kurallar tek yerde</small></span><span class="ok" aria-hidden="true">›</span></a>' : '') +
      rozetSeridi() +
      kartlar + '</div>';
  }

  function haftaSayfasi(h, konuId) {
    var konu = h.konular.filter(function (k) { return k.id === konuId; })[0] || h.konular[0];
    acik = { hafta: h.id, konu: konu.id };
    document.title = 'Week ' + h.no + ' · Ahi Evran Camii';
    ust.className = 'ust';
    ust.innerHTML = '<div class="kap"><a class="geri" href="#/">‹ Alle weken<small class="tr" lang="tr">Tüm haftalar</small></a>' +
      '<span class="marka kucuk">Week ' + esc(h.no) + '<small class="tr" lang="tr">' + esc(h.no) + '. hafta</small></span></div>';
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
    bloklariKur(konu.bloklar, h.id, konu.id);
    isaretleriUygula(govde);
    kalemGoster(true);
  }

  function bloklariCiz(bloklar) {
    return bloklar.map(function (b, bi) { return BLOK[b.tur] ? BLOK[b.tur](b, { bi: bi }) : ''; }).join('');
  }
  // Sayfadaki oyunları çalıştırır. Yıldızlar "hafta:konu:blok" anahtarıyla saklanır (tecvid için hafta = 'tecvid').
  function bloklariKur(bloklar, haftaId, konuId) {
    kartlariBagla(govde);
    bloklar.forEach(function (b, bi) {
      var yer = { hafta: haftaId, konu: konuId, bi: bi };
      var s = govde.querySelector('[data-sohbet="' + bi + '"]'); if (s) sohbetKur(s, b, yer);
      var q = govde.querySelector('[data-quiz="' + bi + '"]'); if (q) quizKur(q, b, yer);
      var e = govde.querySelector('[data-ezber="' + bi + '"]'); if (e) ezberKur(e, b, yer);
      var si = govde.querySelector('[data-sirala="' + bi + '"]'); if (si) siralaKur(si, b, yer);
      var m = govde.querySelector('[data-medd="' + bi + '"]'); if (m) meddKur(m, b, yer);
    });
  }

  // =========================================================
  // Tecvid bölümü: bütün kurallar tek yerde (tecvid/kurallar.js)
  // =========================================================
  function ustGeri(geriAdres, geriNl, geriTr, adNl, adTr) {
    ust.className = 'ust';
    ust.innerHTML = '<div class="kap"><a class="geri" href="' + geriAdres + '">‹ ' + geriNl + '<small class="tr" lang="tr">' + geriTr + '</small></a>' +
      '<span class="marka kucuk">' + adNl + '<small class="tr" lang="tr">' + adTr + '</small></span></div>';
  }
  function tecvidKarisikBlok() {
    var gorulen = {}, kelimeler = [], turler = [];
    D.tecvid.kurallar.forEach(function (k) {
      if (kuralKilitli(k)) return;      // haftası henüz açılmadıysa kelimeleri de gelmez
      k.bloklar.forEach(function (b) {
        if (b.tur !== 'medd') return;
        b.kelimeler.forEach(function (w) {
          if (['elif', 'vav', 'ye'].indexOf(w.tur) !== -1 || gorulen[w.yazi]) return;
          gorulen[w.yazi] = 1; kelimeler.push(w);
          if (turler.indexOf(w.tur) === -1) turler.push(w.tur);
        });
      });
    });
    var sira = ['tabii', 'muttasil', 'munfasil', 'lazim', 'ariz'];
    turler.sort(function (a, b) { return sira.indexOf(a) - sira.indexOf(b); });
    return { tur: 'medd', baslik: { nl: 'Gemengde herhaling: welke medd?', tr: 'Karışık tekrar: hangi med?' }, secenekler: turler, kelimeler: kelimeler, adet: turler.length * 3 };
  }
  function tecvidAna() {
    var T = D.tecvid;
    document.title = 'Tecvid · Ahi Evran Camii';
    ustGeri('#/', 'Alle weken', 'Tüm haftalar', 'Tecvidregels', 'Tecvid kuralları');
    var karisik = tecvidKarisikBlok();
    var ky = yildizlar['tecvid:karisik:0'] || 0;
    govde.innerHTML = '<div class="tecvid-ana"><h1>Tecvid: alle regels<span class="tr" lang="tr"> · Tecvid: bütün kurallar</span></h1>' +
      '<p class="giris">Alle regels die we in de les leerden, op volgorde. Elke regel heeft uitleg, voorbeelden en een spel. ' +
      '<span class="tr" lang="tr">Derste öğrendiğimiz bütün kurallar, sırasıyla. Her kuralın anlatımı, örnekleri ve oyunu var.</span></p>' +
      '<a class="zor-kart" href="#/tecvid/karisik"><span class="zor-yazi"><b>Gemengde herhaling<small class="tr" lang="tr">Karışık tekrar</small></b>' +
      '<span>' + karisik.adet + ' woorden van alle regels door elkaar. Goed om te oefenen voor een toets.<small class="tr" lang="tr">Bütün kurallardan karışık ' + karisik.adet + ' kelime. Sınavdan önce tekrar için.</small></span></span>' +
      '<span class="tecvid-y">' + yildizCiz(ky) + '</span><span class="ok" aria-hidden="true">›</span></a>' +
      '<ol class="kural-liste">' + T.kurallar.map(function (k, i) {
        var y = haftaYildizi({ id: 'tecvid', konular: [k] }), kilit = kuralKilitli(k);
        var alt = y.toplam ? yildizSayac(y.kazanilan, y.toplam) : '';
        if (kilit) {
          var a = acilisYazi(acilisi(kuralHaftasi(k)));
          kilitGorundu = true;
          alt = '<span class="rozet kilit-rozet">' + KILIT + 'Open vanaf ' + a.kisaNl + '<span class="tr" lang="tr"> · Açılış: ' + a.kisaTr + '</span></span>';
        }
        return '<li><a class="kural-kart' + (kilit ? ' kilitli' : '') + '" href="#/tecvid/' + esc(k.id) + '"><span class="kural-no">' + (i + 1) + '</span>' +
          '<span class="kural-bilgi"><b>' + nl(k.ad) + '</b><small class="tr" lang="tr">' + tr(k.ad) + '</small>' +
          '<span class="kural-alt">' + (k.hafta ? '<span class="rozet">Week ' + esc(k.hafta) + '<span class="tr" lang="tr"> · ' + esc(k.hafta) + '. hafta</span></span>' : '') +
          alt + '</span></span><span class="ok" aria-hidden="true">›</span></a></li>';
      }).join('') + '</ol></div>';
  }
  function tecvidKural(kural) {
    var T = D.tecvid, i = T.kurallar.indexOf(kural), onceki = T.kurallar[i - 1], sonraki = T.kurallar[i + 1];
    acik = { hafta: 'tecvid', konu: kural.id };
    document.title = nl(kural.ad) + ' · Tecvid';
    ustGeri('#/tecvid', 'Alle regels', 'Bütün kurallar', 'Regel ' + (i + 1), (i + 1) + '. kural');
    govde.innerHTML = '<article class="konu renk-kuran"><header class="konu-bas"><h1>' + nl(kural.ad) + '</h1><p class="tr" lang="tr">' + tr(kural.ad) + '</p></header>' +
      bloklariCiz(kural.bloklar) +
      '<nav class="kural-gezinti">' +
      (onceki ? '<a class="dugme" href="#/tecvid/' + esc(onceki.id) + '">‹ ' + nl(onceki.kisa) + '<small>' + tr(onceki.kisa) + '</small></a>' : '<span></span>') +
      (sonraki ? '<a class="dugme ana" href="#/tecvid/' + esc(sonraki.id) + '">' + nl(sonraki.kisa) + ' ›<small>' + tr(sonraki.kisa) + '</small></a>'
               : '<a class="dugme ana" href="#/tecvid/karisik">Gemengde herhaling ›<small>Karışık tekrar</small></a>') +
      '</nav></article>';
    bloklariKur(kural.bloklar, 'tecvid', kural.id);
    isaretleriUygula(govde);
    kalemGoster(true);
  }
  function tecvidKarisik() {
    acik = null;
    document.title = 'Gemengde herhaling · Tecvid';
    ustGeri('#/tecvid', 'Alle regels', 'Bütün kurallar', 'Herhaling', 'Karışık tekrar');
    var b = tecvidKarisikBlok();
    govde.innerHTML = '<article class="konu renk-kuran"><header class="konu-bas"><h1>Gemengde herhaling</h1><p class="tr" lang="tr">Karışık tekrar</p></header>' +
      '<p class="giris">Woorden van alle regels door elkaar. Elke keer andere woorden. <span class="tr" lang="tr">Bütün kurallardan karışık kelimeler. Her seferinde başka kelimeler gelir.</span></p>' +
      BLOK.medd(b, { bi: 0 }) + '</article>';
    bloklariKur([b], 'tecvid', 'karisik');
  }

  function yonlendir() {
    temizlik.forEach(function (f) { f(); });
    temizlik = [];
    kilitGorundu = false;
    var p = location.hash.split('/');
    var h = D.haftalar[p[1]];
    if (p[1] === 'tecvid' && D.tecvid) {
      var kural = D.tecvid.kurallar.filter(function (k) { return k.id === p[2]; })[0];
      if (kural && kuralKilitli(kural)) { acik = null; kalemGoster(false); kuralKilidi(kural); }
      else if (kural) tecvidKural(kural);
      else { acik = null; kalemGoster(false); if (p[2] === 'karisik') tecvidKarisik(); else tecvidAna(); }
    }
    else if (p[1] === 'canli') { acik = null; kalemGoster(false); canliSayfasi(); }
    else if (p[1] === 'rozetler') { acik = null; kalemGoster(false); rozetSayfasi(); }
    else if (!h) { acik = null; kalemGoster(false); anaSayfa(); }
    else if (kilitli(h)) { acik = null; kalemGoster(false); haftaKilidi(h); }
    else if (p[2] === 'yaris') { acik = null; kalemGoster(false); yarisSayfasi(h); }
    else if (p[2] === 'zor') { acik = null; kalemGoster(false); zorSayfasi(h); }
    else haftaSayfasi(h, p[2]);
    var kap = ust.querySelector('.kap');
    if (kap && window.SES) kap.appendChild(SES.dugme());
    hocaSeridi();
    acilistaYenile();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', yonlendir);

  window.addEventListener('error', function (e) {
    var f = e.filename || '';
    if (f.indexOf('/haftalar/') !== -1) hatalar.push(f.split('/haftalar/')[1] + ', ' + e.lineno + '. satır: yazım hatası (' + e.message + ')');
    if (f.indexOf('/tecvid/') !== -1) hatalar.push('tecvid/' + f.split('/tecvid/')[1] + ', ' + e.lineno + '. satır: yazım hatası (' + e.message + ')');
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
    })).then(function () {
      D.sira.forEach(function (id) {
        var h = D.haftalar[id];
        if (h && h.acilis && isNaN(acilisi(h))) hatalar.push('haftalar/' + id + '.js: acilis yanlış yazılmış, örnek: 2026-11-28T13:00');
      });
      yonlendir();
      rozetKontrol();               // daha önce kazanılmış ama henüz verilmemiş rozetler
    });
  });
})();
