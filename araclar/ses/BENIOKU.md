# Tecvid kelimelerinin sesini kesmek

Sitedeki tecvid kelimelerinin sesi iki yerden gelir:

- **Tek kelimeler:** Quran.com'un kelime kelime kayıtları. Her kelime ayrı okunmuş, başı ve sonu temiz.
- **İki kelimelik örnekler** (munfasıl gibi, kural ancak iki kelime bağlanınca duyulur) ve kelime kaydının
  sonu kesik olup Hüsarî'de temiz bir duraklama bulunan birkaç kelime: Mahmud Halil el-Husarî'nin muallim
  (öğretici) kıraatinden kesilir (QuranicAudio / Quran.com).

Hüsarî âyeti kesintisiz okuduğu için tek bir kelimeyi o akıştan kesmek başını ve sonunu kopuk bırakıyordu;
bu yüzden 2026-11'de tek kelimeler Quran.com kayıtlarına geçti. Bu klasördeki araçlar bunun için. Siteye bir şey eklemezler;
sadece `ses/kelime/*.mp3` dosyalarını ve `tecvid/sesler.js` listesini üretmeye yardım ederler.

Gerekenler: Python 3 + numpy, ffmpeg, curl, ve üç alan adına erişim:
`api.qurancdn.com` (kelime zamanları), `download.quranicaudio.com` (sûre sesleri) ve
`audio.qurancdn.com` (kelime kelime kayıtlar).

## Sıra

1. `kelimeler.json`: haftalardaki ve tecvid bölümündeki `medd` / `ornekler` kelimeleri
   (yazi, tur, kaynak "Yâsîn 56" biçiminde, okunus).
2. Sûre seslerini indir: `mp3/<sûre no>.mp3`
   (`https://download.quranicaudio.com/qdc/khalil_al_husary/muallim/<no>.mp3`),
   kelime zamanlarını indir: `zaman_<no>.json`
   (`https://api.qurancdn.com/api/qdc/audio/reciters/12/audio_files?chapter=<no>&segments=true`).
3. `python3 eslestir.py`: her kelimeyi âyetteki yerine eşler (yazım farklarına toleranslı),
   zamanları bulur → `eslesme.json`. Sûre adı → numara listesi dosyanın başında (`SURE`); yeni sûre gelirse ekle.
4. `python3 hizala.py`: kendi kaba hizalamamız (âyeti duraklardan parçalara böler, kelimeleri
   hareke sayısına göre ses değişimlerine oturtur). Sadece Quran.com zamanları bir kelimeyi
   çok kısa aldığında (beklenenin yarısından az) kullanılır.
5. `python3 kes.py`: Hüsarî'de kelimenin sınırları (`kesim`).
6. `python3 wbw_indir.py`: tek kelimelerin Quran.com kaydı → `wbw/`. Dosya adı kelimenin âyetteki gerçek sırası;
   API'nin `audio_url` alanı durak işaretli âyetlerde bir kayıyor, ona güvenme.
7. `python3 kes2.py`: son dosyalar → `k2/*.mp3` (mono, 64 kbps, aynı gürlük, tepe -1 dB). Her kelime için kaynağı
   seçer (tek kelime → Quran.com; iki kelime ya da kaydın sonu kesikse → Hüsarî), Hüsarî sınırlarını en sessiz
   ana kaydırır, öndeki/sondaki sessizliği atar, uç ne kadar sesliyse açılışı/kapanışı o kadar uzun tutar
   (15–80 ms / 30–150 ms). `python3 kenar.py` iki kaynağın uçlarını tablo olarak gösterir.

`k2/` içindekileri `ses/kelime/` klasörüne kopyala. Dosya adları değişmez (`<sûre>-<âyet>-<kelime>.mp3`),
`tecvid/sesler.js` aynı kalır.

Kesimlerden emin olunmayanlar spektrogramla tek tek kontrol edildi (2026-11: 110:1 câe, 79:34 câet,
1:7 ed-dâllîn düzeltildi). Yeni kelimelerde de şüpheli olanlara bakmak iyi olur.

## Ezber sûrelerinin âyet sesi

Ezber bloğundaki her âyetin altındaki "Dinle" düğmesi `ses/ayet/<sûre>-<âyet>.mp3` dosyasını çalar (Hüsarî, muallim).
Muallim kıraatinde her âyetten sonra uzun bir durak olduğu için kesim temizdir.

1. Sûrenin sesini ve âyet zamanlarını indir (yukarıdaki 2. adım: `mp3/<no>.mp3`, `zaman_<no>.json`).
2. `python3 ayet_kes.py 112 111` → `ayet/*.mp3`. Bunları `ses/ayet/` klasörüne kopyala.
3. Hafta dosyasında ezber âyetine `ses: '112-1'` ekle.

Âyetin ortasında bir durak varsa (Hüsarî durup nefes alır) `ayet_kes.py` sadece ilk parçayı alır. Böyle âyetlerde
iki parça ayrı kesilip araya 0,7 sn sessizlik konarak birleştirildi (2026-11: 110:3, "vestağfirh"ten sonra; 1:7, "aleyhim"den sonra). 114:6'da Hüsarî son âyeti tekrar ediyor; sadece ilk okuyuş alındı.
