# Ahi Evran Camii · Haftalık Dersler

Ahi Evran Camii hafta sonu sınıfı için hazırlanmış tekrar sitesi. Her hafta dört konu: temel dinî bilgiler, Peygamberimizin hayatı, Kur'an ve tecvid, ezber. Metinler önce Hollandaca, altında Türkçe.

Adres (Pages açıldıktan sonra): https://tecviddedektif.github.io/Ahi_Evran_Haftalik_Dersler/

## Sitede neler var

- **Sohbet:** konular hikâye gibi adım adım açılır. Çocuk "Sen ne dersin?" sorusuna cevap seçer, sonra ters köşe gelir.
- **İşaret kalemi:** konu sayfalarında sağ alttaki "Stift · Kalem" düğmesi. Dört renk ve silgi var. Kelimeye dokununca ya da parmak cümlenin üstünden yana kaydırılınca işaretlenir.
- **Zor yarış ve puan tablosu:** 40 zor sorudan her oyunda 20'si (her konudan 5), soru başına 30 saniye. Doğru cevap gösterilmez; sonda bilinemeyen sorular, cevabın bulunacağı konuya bağlantıyla listelenir. Hocanın açtığı hesapla giriş yapılır, günde bir hak vardır, haftanın en iyi puanı ortak tabloya yazılır.
- **Canlı yarış** (`#/canli`): derste büyük ekranla oynanır. Hoca büyük ekranda "hoca" hesabıyla girer (çocuk ekranının altındaki "Hoca mısın?"), haftayı, soru türünü (normal ya da zor), soru sayısını ve süreyi seçer; ekranda 4 haneli kod çıkar. Çocuklar **hesapsız** katılır: telefonda kodu ve adını yazar. Hoca lobide bir ismi ✕ ile çıkarabilir. Soru büyük ekranda, cevap telefonda. Doğru cevap 500 ile 1000 arası puan alır, hızlı olan daha çok. Her sorudan sonra büyük ekranda doğru cevap, kaç kişinin neyi seçtiği ve ara sıralama; sonda podyum. Hocanın ekranı yenilenirse yarış kaldığı yerden devam eder; telefon yenilenirse kod sormadan döner.
- **Rozetler** (`#/rozetler`): 22 rozet, dört grupta (öğrenme, tecvid, yarışlar, devamlılık). Oyunlardan yıldız, sonuna kadar okunan hikâyeler, kalemle işaretlenen kelimeler, zor yarış, canlı yarış, ödevler ve farklı haftalarda oynamak rozet kazandırır. Kazanılınca üstte bildirim çıkar (aynı anda kazanılanlar tek bildirimde). Kazanılmamış rozetlerde nasıl kazanılacağı ve ilerleme yazar. Ana sayfada "Rozetlerim" şeridi. Rozetler sadece çocuğun cihazında saklanır. Yeni rozet eklemek: `js/dersler.js` içindeki `ROZETLER` listesine bir satır.
- **Sınıf yarışı:** haftanın sorularıyla isimli yarış. Tek telefonda ya da büyük ekranda sırayla oynanır, tek başına da olur. Herkese 5 soru, soru başına 20 saniye; doğru cevap 100 puan, hızlı cevap 50 puana kadar ek puan.
- **Tecvid bölümü** (`#/tecvid`): derste öğrenilen bütün tecvid kuralları müfredat sırasıyla; her kuralın anlatımı, renkli örnekleri, oyunu ve quizi var. Bir de bütün kurallardan **karışık tekrar** oyunu. Haftalardaki Kur'an sekmesi o haftanın kuralına bağlanır.
- **Haftanın açılışı:** her hafta, dersi yapılan cumartesi saat 13:00'te (ders bitince) açılır. O saate kadar ana sayfada kilitli kart görünür: konular yazmaz, sadece ne zaman açılacağı yazar. O haftanın tecvid kuralı da kilitli kalır, karışık tekrar o kuralın kelimelerini sormaz. Açılış saatinde sayfa açıksa kendiliğinden açılır.
- **Hoca kodu:** kilitli sayfanın altındaki "Leraar? · Hoca mısın?" ile hoca kodunu yazınca kilitler o ekranda açılır (derste büyük ekranda göstermek için). Sadece o sekmede geçerlidir; üstteki "Kapat" düğmesiyle ya da tarayıcı kapanınca kilit geri gelir. Kodun kendisi hiçbir dosyada yazmaz, `js/dersler.js` içinde sadece özeti (`HOCA_OZET`) var; kodu değiştirmek için özet yeniden hesaplanır.
- **Kelimelerin sesi:** her tecvid kelimesinde (örnekler, "Hangi med?" oyununda cevaptan sonra, canlı yarışta sonuç ekranında) bir "Dinle" düğmesi. Tek kelimeler Quran.com'un kelime kelime kayıtlarından (her kelime ayrı okunmuş, başı sonu temiz); munfasıl gibi iki kelimelik örnekler ve birkaç kelime Mahmud Halil el-Husarî'nin muallim (öğretici) kıraatinden, iki kelime bağlanarak okunur. Dosyalar `ses/kelime/`, liste `tecvid/sesler.js`, kesim araçları ve yeni kelime ekleme `araclar/ses/BENIOKU.md`.
- **Canlı yarış müziği:** sadece hocanın büyük ekranında. Bekleme ekranında sakin ve neşeli bir ezgi, soru sırasında daha hareketli bir ezgi (son 5 saniyede hızlanır), sonuçta sessizlik, podyumda kısa bir kutlama. Ezgiler bu site için yazıldı ve tarayıcıda üretilir (`js/ses.js`, `PARCALAR`). Üst şeritteki nota düğmesi müziği açıp kapatır; hoparlör kapalıysa müzik de çalmaz.
- **Sesler:** sadece oyunlarda. Doğru ve yanlış cevap, yarışta her saniye tik-tak (son 5 saniyede daha tiz ve sık), süre dolması, bitiş ve rekor. Ses dosyası yok, sesler tarayıcıda üretilir (`js/ses.js`). Üst şeritteki hoparlör düğmesi sesi açıp kapatır, tercih cihazda saklanır. İlk açılışta sesin açık mı kapalı mı olacağı `ACIK_BASLA` satırından değiştirilir.
- **Oyunlar ve yıldızlar:** dönen kartlar, mini quiz, "hangi med" oyunu, âyet sıralama.
- **Mini quiz:** her quizin 10 soruluk havuzu var, her açılışta 6'sı karışık gelir; her soruda 4 seçenek. Cevaplanan soruya "Geri" ile dönülür: verilen cevap ve açıklama görünür ama değiştirilemez. Sonuç ekranında "Cevaplara bak".
- **Latin okunuş yok:** âyetler ve tecvid kelimeleri sadece Arapçası ve anlamıyla gösterilir; çocuk okumayı Arapçadan yapsın diye. Okunuşu duymak için "Dinle" düğmesi var (kelimelerde ve ezber sûresinin her âyetinde). Bir soru bir âyeti ya da kelimeyi soruyorsa Arapçası sorunun üstünde görünür (`ar` alanı). Hafta dosyalarındaki `okunus` alanları sadece bilgi için durur, ekranda gösterilmez.
- **Ödevler** (`#/hafta-N/odev`): her haftanın sayfasında "Bu haftanın ödevleri" şeridi, ana sayfadaki kartta "Huiswerk · Ödev 1/4" düğmesi. Dört parça: ezber (sûreyi âyet âyet dinleyip ezberle, "Ezberledim"), tecvid avı (âyette kurala uyan kelimeleri bul), haftanın testi (haftanın bütün mini quizlerinden 10 soru, en az 7 doğru) ve hayatta uygula (10. hafta 7 günlük namaz çizelgesi, 11. hafta cesaret ve abdest görevlerinden en az ikisi). Teslim: bir sonraki ders. Her şey sadece çocuğun cihazında kalır; hoca kimin yaptığını siteden görmez, çocuk derste telefonundan gösterir. Bir haftanın bütün ödevini bitirene "Ödev tamam" rozeti.

## Gizlilik

Yıldızlar, kalem işaretleri, ödevler (namaz çizelgesi dahil) ve sınıf yarışında yazılan isimler sadece o cihazın tarayıcısında durur. Yarış sayfasındaki "İsimleri ve sıralamayı sil" düğmesi isimleri o cihazdan siler.

Zor yarış için hesapları hoca açar (velilerden izin alındı). Sunucuda tutulanlar: kullanıcı adı ve şifre (Firebase Authentication), tabloda görünen ön ad (`ogrenciler`), haftanın en iyi puanı, doğru sayısı ve deneme bilgisi. Canlı yarışta hesap yoktur: sunucuda sadece o anki yarış durur (kod, sorular, çocukların yazdığı ad, cevap ve puan) ve yeni yarış açılınca öncekiler adlarıyla birlikte silinir. Oturum bilgisi çocuğun cihazında durur, "Çıkış" ile silinir. Tablo okunurken hiçbir şey gönderilmez; ana sayfa ve konu sayfaları sunucuya hiç bağlanmaz.

## Puan tablosu ve hesaplar (Firebase)

- Proje: `ahi-evran-haftalik-dersler`. Kod `js/tablo.js` içinde, kütüphane yüklenmez.
- Hesaplar: Firebase Authentication, e-posta/şifre. E-posta uydurmadır: `orhan@ahievran.example`. Çocuk girişte sadece `orhan` yazar.
- Sınıf listesi: `ogrenciler/<UID>` belgesi, tek alan `ad` (tabloda görünen isim, Türkçe harfler olur). Listede olmayan hesap puan yazamaz.
- Puanlar: `haftalar/<hafta>/skorlar/<UID>`: `ad`, `puan`, `dogru` (haftanın en iyisi), `son` (son denemenin başlangıcı), `acik`, `deneme`.
- Günde bir hak: deneme, yarış başlarken yazılır; aynı gün ikinci başlangıcı kurallar reddeder. Gün sunucu saatine (UTC) göre değişir: Hollanda'da kışın 01:00, yazın 02:00. Yarıda bırakılan oyun o günün hakkını kullanmış sayılır. Başlangıçtan 20 dakika sonra bitirilen tur kaydedilmez.
- Güvenlik kuralları `firestore.rules` dosyasında: Firebase paneli > Firestore Database > Rules > yapıştır > Publish.

### Yeni çocuk eklemek

1. Authentication > Users > Add user: `kullaniciadi@ahievran.example` ve en az 6 karakterli şifre.
2. Listede çıkan **User UID**'yi kopyala.
3. Firestore Database > Data > `ogrenciler` > Add document: Document ID = UID, alan `ad` (string) = tabloda görünecek isim.
4. Kullanıcı adını ve şifreyi çocuğa kâğıtla ver.

### Canlı yarış için hoca hesabı

1. Authentication > Users > Add user: `hoca@ahievran.example` ve en az 6 karakterli şifre. Bu hesap `ogrenciler` listesine **eklenmez**.
2. Kuralları (`firestore.rules`) yeniden yapıştırıp Publish et. Kurallar canlı yarışı yönetme yetkisini sadece bu e-postaya verir.
3. Derste büyük ekranda Canlı yarış > Hoca mısın? > kullanıcı adı `hoca` ve şifre.

Çocukların hesabı gerekmez. Sunucudaki yerler: `canli/<kod>` (yarışın durumu; kodu bilen okur, sadece hoca yazar) ve `canli/<kod>/oyuncular/<rastgele kimlik>` (çocuğun adı ve cevabı). Kurallar şunları reddeder: aynı soruya ikinci cevap, süre bittikten sonra cevap, seçenek dışı cevap, 20 harften uzun ad, bitmiş yarışa katılma. Yarışları listelemek ve silmek sadece hocanın. Puanı hocanın ekranı sunucu saatine göre hesaplar.

Ücretsiz Firebase planında günde 50.000 okuma var. 15 çocukla 10 soruluk bir canlı yarış yaklaşık 10.000–15.000 okuma tutar; günde birkaç yarış rahat sığar.

### Şifre unutulunca

Authentication > Users > hesabın sağındaki üç nokta > **Reset password** e-posta gönderir; adres uydurma olduğu için işe yaramaz. Bunun yerine hesabı silip aynı kullanıcı adıyla yeniden aç; yeni UID'yi `ogrenciler`'e ekle, eskisini sil. Puanlar UID'ye bağlı olduğundan o haftanın puanı yeni hesaba geçmez.

### Bir satırı silmek

Firestore Database > Data > `haftalar` > `hafta-10` > `skorlar` > satırı seç > üç nokta > Delete document. Hesabı kapatmak için Authentication > Users > Disable account.

`apiKey` gizli değildir; web sitelerinde herkese açık durur. Kimin ne yapabileceğini kurallar belirler.

## Dosyalar

```
index.html            sayfanın iskeleti
css/stil.css          görünüm
js/dersler.js         uygulama (sayfalar, sohbet, oyunlar, kalem, yarış)
haftalar/liste.js     hangi haftalar var, hangi sırayla
haftalar/hafta-10.js  10. haftanın bütün içeriği
fonts/                yazı tipleri (lisansları yanında)
js/tablo.js           ortak puan tablosu ve canlı yarış (Firebase)
js/ses.js             oyun sesleri
tecvid/kurallar.js    tecvid bölümünün bütün içeriği
firestore.rules       puan tablosu ve canlı yarışın güvenlik kuralları
ikon.svg              sekme simgesi
```

Kurulum ya da derleme yok. `index.html` dosyasını tarayıcıda açmak yeter.

## Yeni hafta eklemek

1. `haftalar/hafta-10.js` dosyasını kopyala, adını `hafta-11.js` yap.
2. İçinde `id: 'hafta-11'`, `no: 11` ve açılış zamanını yaz, konuları değiştir:
   ```js
   acilis: '2026-11-28T13:00',   // yıl-ay-gün, T, saat:dakika (Hollanda saati)
   ```
   `acilis` yazılmazsa hafta hemen açık olur. Yanlış yazılırsa hafta kilitlenmez ve ana sayfada uyarı çıkar.
3. `haftalar/liste.js` içindeki listeye `'hafta-11'` ekle.

Açık olan en yeni hafta ana sayfada "Bu hafta" etiketiyle görünür; henüz açılmamış haftalar onun üstünde kilitli durur.

Bu kilit telefonda çalışır: hafta dosyası GitHub'da herkese açıktır ve telefonun saatini ileri alan biri içeriği görebilir. Çocuklar için yeterli, gizli bilgi için değil.

## Bir haftanın yapısı

Her haftada `konular` listesi, her konuda `bloklar` listesi vardır. Her metin `{ nl: '...', tr: '...' }` biçimindedir.

Konu renkleri (`renk`): `ibadet` yeşil, `siyer` turuncu, `kuran` mavi, `ezber` mor.

| Blok (`tur`) | Ne yapar | Alanlar |
| --- | --- | --- |
| `sohbet` | Adım adım açılan hikâye: soru, cevap, ters köşe | `simge`, `baslik`, `adimlar`, isteğe bağlı `anlam` |
| `ozet` | Simgeli kısa maddeler | `baslik`, `maddeler` (`simge`, `nl`, `tr`, isteğe bağlı `kaynak`) |
| `hikaye` | Hepsi birden görünen adım adım anlatım | `baslik`, `adimlar`, `anlam` (`baslik`, `eslesmeler`) |
| `kartlar` | Dokununca dönen soru-cevap kartları | `kartlar` (`on`, `arka`) |
| `quiz` | Çoktan seçmeli sorular, yıldız verir; her seferinde havuzdan `goster` kadar (varsayılan 6) | `sorular` (`soru`, `secenekler`, `dogru`, isteğe bağlı `aciklama` ve `ar`: soruda gösterilecek Arapça âyet ya da kelime; seçenek de `{ ar: '...' }` olabilir) |
| `ezber` | Âyetler (her birinde "Dinle") ve "doğru sıraya diz" oyunu, yıldız verir | `ayetler` (`ar`, `ses`: `ses/ayet/` içindeki dosya, ör. `'112-1'`, `okunus` (gösterilmez), `nl`, `tr`) |
| `sirala` | Adımları doğru sıraya dizme oyunu (abdest, namaz), yıldız verir | `baslik`, isteğe bağlı `aciklama`, `adimlar` (`simge`, `nl`, `tr`; doğru sırayla) |
| `medd` | "Hangi med?" oyunu, yıldız verir | `secenekler`, `kelimeler` (`tur`, `yazi`, `okunus`, `nl`, `tr`, `kaynak`), isteğe bağlı `adet`: her türden eşit sayıda seçilecek kelime sayısı |
| `baglanti` | Başka bir sayfaya düğme; `#/` ile başlayan adres site içinde açılır | `metin`, `dugme`, `adres` |
| `ornekler` | Renkli işaretli örnek kelimeler | `kelimeler` (`tur`, `yazi`, `okunus`, `nl`, `tr`, `kaynak`) |

`quiz` içinde `dogru`, doğru seçeneğin sırasıdır ve 0'dan başlar. Seçenekler ekranda karıştırılır.

Yıldızlar: hepsi doğruysa 3, en az yüzde 70 doğruysa 2, en az yüzde 40 doğruysa 1.

Sınıf yarışının soruları ayrıca yazılmaz: haftadaki `quiz` soruları ve `medd` kelimeleri kendiliğinden yarışa girer. Bir konunun `id` değeri `yaris` ya da `zor` olamaz, bu adlar yarış sayfalarına ayrılmıştır.

Zor yarış için haftanın dosyasının sonuna `zor` listesi eklenir (20 soru, her konudan 5). Liste yoksa o haftada Zor yarış ve puan tablosu görünmez.

```js
zor: [
  { konu: 'namaz',
    soru: { nl: '...', tr: '...' },
    secenekler: [{ nl: 'doğru cevap', tr: '...' }, { nl: '...', tr: '...' }, { nl: '...', tr: '...' }, { nl: '...', tr: '...' }],
    dogru: 0,
    aciklama: { nl: '...', tr: '...' } },
  // ...
],
```

Puan: doğru cevap 100, hız için 50'ye kadar ek puan; 20 soruda en çok 3000.

Ödevler için haftanın dosyasına `odev` eklenir (yoksa o haftada ödev yok). Ezber parçası haftanın `ezber` bloğundan, test haftanın `quiz` sorularından kendiliğinden gelir:

```js
odev: {
  tecvid: [
    { kaynak: 'Yâsîn 56', hedef: 'muttasil', dogru: [5],          // doğru kelimelerin sırası, 0'dan başlar
      kelimeler: ['هُمْ', 'وَأَزْوَٰجُهُمْ', /* … âyetin kelimeleri sırayla … */],
      aciklama: { nl: '...', tr: '...' } },
  ],
  gorev: { tur: 'namaz' },                                        // 7 günlük namaz çizelgesi
  // ya da: gorev: { enAz: 2, maddeler: [{ nl: '...', tr: '...' }, ...] }   // en az 2 tanesini yap
},
```

## Sohbet bloğu

`adimlar` listesindeki her adım bir baloncuktur ve çocuk "Verder · Devam" düğmesine bastıkça açılır.

```js
{
  tur: 'sohbet',
  simge: '🔋',
  baslik: { nl: 'Wat doet het gebed voor jou?', tr: 'Namaz sana ne kazandırır?' },
  adimlar: [
    // Soru: çocuk bir cevap seçer, "tepki" o cevaba verilen karşılıktır
    { nl: 'Je telefoon staat op 3 procent. Wat doe je?', tr: 'Telefonunun şarjı yüzde 3. Ne yaparsın?',
      cevaplar: [
        { nl: 'Meteen aan de oplader!', tr: 'Hemen şarja takarım!', tepki: { nl: 'Logisch.', tr: 'Mantıklı.' } },
        { nl: 'Laat maar leeglopen.', tr: 'Boş ver, kapansın.', tepki: { nl: 'Stoer.', tr: 'Cesursun.' } },
      ] },
    // Düz baloncuk
    { nl: 'Voor wie laad je hem op?', tr: 'Kimin için şarj ediyorsun?' },
    // Ters köşe: koyu, "Plottwist! · Ters köşe!" etiketli baloncuk
    { ters: true, nl: 'Het gebed is jouw oplader.', tr: 'Namaz senin şarjın.', kaynak: 'Ankebût 6' },
    // Sonuç: hikâyeden çıkan ders
    { ders: true, nl: 'Hoor je de ezan? Tijd om op te laden.', tr: 'Ezanı duydun mu? Şarj vakti.' },
  ],
}
```

Cevapların doğrusu yanlışı yoktur, hangisi seçilirse seçilsin hikâye devam eder. `kaynak` yazılırsa baloncuğun altında küçük harflerle görünür.

## Arapça kelimede işaretler

`medd` bloğundaki `yazi` alanında:

- `( )` med harfi, mavi
- `[ ]` hemze, kırmızı
- `{ }` sükûn ya da şedde, mor
- boşluk yeni bir kutu başlatır (iki kelime, iki kutu)

Örnek: `'نَشَ(آ)[ءُ]'` tek kutu (muttasıl), `'يَٰبَنِ(ىٓ) [ءَ]ادَمَ'` iki kutu (munfasıl).

Med harfi oyunu için `elif`, `vav`, `ye` türleri de var. Med türleri (`tur`): `tabii` 2 hareke, `muttasil` 4, `munfasil` 4, `lazim` 6, `ariz` (durakta; 2, 4 ya da 6, derste 4). `ariz` kelimelerinde durakta sakin olan son harf `{ }` ile işaretlenir: `'يَشْكُرُ(و){نَ}'`.

Arapça metni elle yazma; mushaftan ya da güvenilir bir Kur'an sitesinden kopyala.

## Bağlantılı site

Tecvid oyunu ayrı bir sitededir: https://tecviddedektif.github.io/tecvid-dedektif/

## Tecvid bölümüne yeni kural eklemek

`tecvid/kurallar.js` dosyasındaki `kurallar` listesinin sonuna bir kural eklenir:

```js
{
  id: 'lin',                 // adres: #/tecvid/lin
  hafta: 12,                 // derste işlendiği hafta
  ad: { nl: 'Medd-i Lîn', tr: 'Medd-i Lîn' },
  kisa: { nl: 'Lîn', tr: 'Lîn' },
  bloklar: [ /* ozet, ornekler, medd, quiz ... haftalardaki gibi */ ],
},
```

Karışık tekrar oyunu kendiliğinden güncellenir: bütün kuralların `medd` oyunlarındaki kelimelerden her türden eşit sayıda seçer. Haftanın Kur'an sekmesine bir `baglanti` bloğu (`adres: '#/tecvid/lin'`) eklemek yeter.
