# Ahi Evran Camii · Haftalık Dersler

Ahi Evran Camii hafta sonu sınıfı için hazırlanmış tekrar sitesi. Her hafta dört konu: temel dinî bilgiler, Peygamberimizin hayatı, Kur'an ve tecvid, ezber. Metinler önce Hollandaca, altında Türkçe.

Adres (Pages açıldıktan sonra): https://tecviddedektif.github.io/Ahi_Evran_Haftalik_Dersler/

## Sitede neler var

- **Sohbet:** konular hikâye gibi adım adım açılır. Çocuk "Sen ne dersin?" sorusuna cevap seçer, sonra ters köşe gelir.
- **İşaret kalemi:** konu sayfalarında sağ alttaki "Stift · Kalem" düğmesi. Dört renk ve silgi var. Kelimeye dokununca ya da parmak cümlenin üstünden yana kaydırılınca işaretlenir.
- **Zor yarış ve puan tablosu:** 40 zor sorudan her oyunda 20'si (her konudan 5), soru başına 30 saniye. Doğru cevap gösterilmez; sonda bilinemeyen sorular, cevabın bulunacağı konuya bağlantıyla listelenir. Hocanın açtığı hesapla giriş yapılır, günde bir hak vardır, haftanın en iyi puanı ortak tabloya yazılır.
- **Sınıf yarışı:** haftanın sorularıyla isimli yarış. Tek telefonda ya da büyük ekranda sırayla oynanır, tek başına da olur. Herkese 5 soru, soru başına 20 saniye; doğru cevap 100 puan, hızlı cevap 50 puana kadar ek puan.
- **Oyunlar ve yıldızlar:** dönen kartlar, mini quiz, "hangi med" oyunu, âyet sıralama.

## Gizlilik

Yıldızlar, kalem işaretleri ve sınıf yarışında yazılan isimler sadece o cihazın tarayıcısında durur. Yarış sayfasındaki "İsimleri ve sıralamayı sil" düğmesi isimleri o cihazdan siler.

Zor yarış için hesapları hoca açar (velilerden izin alındı). Sunucuda tutulanlar: kullanıcı adı ve şifre (Firebase Authentication), tabloda görünen ön ad (`ogrenciler`), haftanın en iyi puanı, doğru sayısı ve deneme bilgisi. Oturum bilgisi çocuğun cihazında durur, "Çıkış" ile silinir. Tablo okunurken hiçbir şey gönderilmez; ana sayfa ve konu sayfaları sunucuya hiç bağlanmaz.

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
js/tablo.js           ortak puan tablosu (Firebase)
firestore.rules       puan tablosunun güvenlik kuralları
ikon.svg              sekme simgesi
```

Kurulum ya da derleme yok. `index.html` dosyasını tarayıcıda açmak yeter.

## Yeni hafta eklemek

1. `haftalar/hafta-10.js` dosyasını kopyala, adını `hafta-11.js` yap.
2. İçinde `id: 'hafta-11'` ve `no: 11` yaz, konuları değiştir.
3. `haftalar/liste.js` içindeki listeye `'hafta-11'` ekle.

En son eklenen hafta ana sayfada en üstte ve "Bu hafta" etiketiyle görünür.

## Bir haftanın yapısı

Her haftada `konular` listesi, her konuda `bloklar` listesi vardır. Her metin `{ nl: '...', tr: '...' }` biçimindedir.

Konu renkleri (`renk`): `ibadet` yeşil, `siyer` turuncu, `kuran` mavi, `ezber` mor.

| Blok (`tur`) | Ne yapar | Alanlar |
| --- | --- | --- |
| `sohbet` | Adım adım açılan hikâye: soru, cevap, ters köşe | `simge`, `baslik`, `adimlar`, isteğe bağlı `anlam` |
| `ozet` | Simgeli kısa maddeler | `baslik`, `maddeler` (`simge`, `nl`, `tr`, isteğe bağlı `kaynak`) |
| `hikaye` | Hepsi birden görünen adım adım anlatım | `baslik`, `adimlar`, `anlam` (`baslik`, `eslesmeler`) |
| `kartlar` | Dokununca dönen soru-cevap kartları | `kartlar` (`on`, `arka`) |
| `quiz` | Çoktan seçmeli sorular, yıldız verir | `sorular` (`soru`, `secenekler`, `dogru`, isteğe bağlı `aciklama`) |
| `ezber` | Âyetler ve "doğru sıraya diz" oyunu, yıldız verir | `ayetler` (`ar`, `okunus`, `nl`, `tr`) |
| `medd` | "Hangi med?" oyunu, yıldız verir | `secenekler`, `kelimeler` (`tur`, `yazi`, `okunus`, `nl`, `tr`, `kaynak`) |
| `baglanti` | Başka bir sayfaya düğme | `metin`, `dugme`, `adres` |

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

Med türleri (`tur`): `tabii` 2 hareke, `muttasil` 4, `munfasil` 4, `lazim` 6.

Arapça metni elle yazma; mushaftan ya da güvenilir bir Kur'an sitesinden kopyala.

## Bağlantılı site

Tecvid oyunu ayrı bir sitededir: https://tecviddedektif.github.io/tecvid-dedektif/
