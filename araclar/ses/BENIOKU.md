# Tecvid kelimelerinin sesini kesmek

Sitedeki her tecvid kelimesinin sesi, Mahmud Halil el-Husarî'nin muallim (öğretici) kıraatinden
kesilir (QuranicAudio / Quran.com). Bu klasördeki araçlar bunun için. Siteye bir şey eklemezler;
sadece `ses/kelime/*.mp3` dosyalarını ve `tecvid/sesler.js` listesini üretmeye yardım ederler.

Gerekenler: Python 3 + numpy, ffmpeg, curl, ve iki alan adına erişim:
`api.qurancdn.com` (kelime zamanları) ve `download.quranicaudio.com` (sûre sesleri).

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
5. `python3 kes.py`: son kesim; `k/*.mp3` (mono, 64 kbps, ses seviyesi eşitlenmiş, yumuşak giriş/çıkış).

Kesimlerden emin olunmayanlar spektrogramla tek tek kontrol edildi (2026-11: 110:1 câe, 79:34 câet,
1:7 ed-dâllîn düzeltildi). Yeni kelimelerde de şüpheli olanlara bakmak iyi olur.
