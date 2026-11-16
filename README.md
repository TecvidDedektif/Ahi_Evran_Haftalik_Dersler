# Haftalık Dersler

Hafta sonu derslerinde işlenen konuların çocuklar için hazırlanmış tekrar sitesi. Her hafta dört konu: temel dinî bilgiler, Peygamberimizin hayatı, Kur'an ve tecvid, ezber. Metinler önce Hollandaca, altında Türkçe.

Adres (Pages açıldıktan sonra): https://tecviddedektif.github.io/Ahi_Evran_Haftalik_Dersler/

Site isim, üyelik ya da başka bir veri istemez. Yıldızlar sadece çocuğun kendi telefonunda durur.

## Dosyalar

```
index.html            sayfanın iskeleti
css/stil.css          görünüm
js/dersler.js         uygulama (sayfalar, oyunlar, yıldızlar)
haftalar/liste.js     hangi haftalar var, hangi sırayla
haftalar/hafta-10.js  10. haftanın bütün içeriği
fonts/                yazı tipleri (lisansları yanında)
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
| `ozet` | Simgeli kısa maddeler | `baslik`, `maddeler` (`simge`, `nl`, `tr`, isteğe bağlı `kaynak`) |
| `hikaye` | Adım adım anlatım ve sonunda anlamı | `baslik`, `adimlar`, `anlam` (`eslesmeler`, `sonuc`) |
| `kartlar` | Dokununca dönen soru-cevap kartları | `kartlar` (`on`, `arka`) |
| `quiz` | Çoktan seçmeli sorular, yıldız verir | `sorular` (`soru`, `secenekler`, `dogru`, isteğe bağlı `aciklama`) |
| `ezber` | Âyetler ve "doğru sıraya diz" oyunu, yıldız verir | `ayetler` (`ar`, `okunus`, `nl`, `tr`) |
| `medd` | "Hangi med?" oyunu, yıldız verir | `secenekler`, `kelimeler` (`tur`, `yazi`, `okunus`, `nl`, `tr`, `kaynak`) |
| `baglanti` | Başka bir sayfaya düğme | `metin`, `dugme`, `adres` |

`quiz` içinde `dogru`, doğru seçeneğin sırasıdır ve 0'dan başlar. Seçenekler ekranda karıştırılır.

Yıldızlar: hepsi doğruysa 3, en az yüzde 70 doğruysa 2, en az yüzde 40 doğruysa 1.

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
