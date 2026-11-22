/* ============================================================
   Tecvid kelimelerinin sesi

   Okuyan: Mahmud Halil el-Husarî, muallim (öğretici) kıraat, Hafs.
   Kaynak: QuranicAudio / Quran.com (download.quranicaudio.com, kelime zamanları api.qurancdn.com).
   Her kelime âyetteki yerinden kesildi: ses/kelime/<sûre>-<âyet>-<kelime sırası>.mp3
   Munfasıl örneklerinde iki kelime birlikte (birbirine bağlanarak) okunur.
   Kesim araçları ve nasıl yeni kelime ekleneceği: araclar/ses/BENIOKU.md

   Anahtar, kelimenin sitedeki yazısıdır (yazi); aynı yazı haftalarda ve tecvid bölümünde
   geçtiği her yerde aynı sesi çalar.
   ============================================================ */
window.KELIME_SES = {
  "إِيَّ(ا)كَ": "1-5-1",   // 1:5 elif iyyâke
  "الَّذِ(ي)نَ": "1-7-2",   // 1:7 ye ellezîne
  "الْمَغْضُ(و)بِ": "1-7-6",   // 1:7 vav el-mağdûbi
  "الضَّ(آ){لِّ}ينَ": "1-7-9",   // 1:7 lazim ed-dâllîn
  "رَ(يْ){بَ}": "2-2-4",   // 2:2 lin rayb
  "يَ(آ) [أَ]يُّهَا": "2-21-1",   // 2:21 munfasil yâ eyyühâ
  "مَ(آ)[ءً]": "2-22-11",   // 2:22 muttasil mâen
  "سُ(وٓ)[ءَ]": "2-49-7",   // 2:49 muttasil sûe
  "شُهَدَ(آ)[ءَ]": "4-135-7",   // 4:135 muttasil şühedâe
  "دَ(آ){بَّ}ةٍ": "11-6-3",   // 11:6 lazim dâbbetin
  "شَ(آ)[ءَ]": "18-39-7",   // 18:39 muttasil şâe
  "سَوَ(آ)[ءٌ]": "36-10-1",   // 36:10 muttasil sevâün
  "فَقَالُ(وٓ)ا [إِ]نَّا": "36-14-8-9",   // 36:14 munfasil fe kâlû innâ
  "إِنَّ(آ) [إِ]لَيْكُمْ": "36-14-9-10",   // 36:14 munfasil innâ ileyküm
  "مَ(آ) [أَ]نتُمْ": "36-15-2-3",   // 36:15 munfasil mâ entüm
  "إِنِّ(يٓ) [إِ]ذًا": "36-24-1-2",   // 36:24 munfasil innî izen
  "وَمَ(آ) [أَ]نزَلْنَا": "36-28-1-2",   // 36:28 munfasil ve mâ enzelnâ
  "السَّمَ(آ)[ءِ]": "36-28-10",   // 36:28 muttasil es-semâi
  "وَإِذَ(ا)": "36-45-1",   // 36:45 tabii ve izâ
  "قِ(ي)لَ": "36-45-2",   // 36:45 ye kîle
  "كَ(ا)نُ(و)ا": "36-46-9",   // 36:46 tabii kânû
  "آمَنُ(وٓ)ا [أَ]نُطْعِمُ": "36-47-12-13",   // 36:47 munfasil âmenû e nut‘imu
  "يَشَ(آ)[ءُ]": "36-47-16",   // 36:47 muttasil yeşâü
  "يَسْتَطِ(ي)عُ(و)نَ": "36-50-2",   // 36:50 tabii yestatî‘ûne
  "وَ(لَآ) [إِ]لَىٰ": "36-50-4-5",   // 36:50 munfasil ve lâ ilâ
  "إِلَ(ىٰٓ) [أَ]هْلِهِمْ": "36-50-5-6",   // 36:50 munfasil ilâ ehlihim
  "قَ(ا)لُ(و)ا": "36-52-1",   // 36:52 tabii kâlû
  "مَ(ا) وَعَدَ": "36-52-8-9",   // 36:52 tabii mâ ve‘ade
  "الْأَرَ(آ)[ئِ]كِ": "36-56-6",   // 36:56 muttasil el-erâiki
  "يَٰبَنِ(ىٓ) [ءَ]ادَمَ": "36-60-4-5",   // 36:60 munfasil yâ benî âdeme
  "كَثِ(ي)رًا": "36-62-5",   // 36:62 tabii kesîran
  "بِمَ(ا)": "36-64-3",   // 36:64 tabii bimâ
  "عَلَ(ىٰٓ) [أَ]فْوَٰهِهِمْ": "36-65-3-4",   // 36:65 munfasil alâ efvâhihim
  "وَتُكَلِّمُنَ(آ) [أَ]يْدِيهِمْ": "36-65-5-6",   // 36:65 munfasil ve tükellimünâ eydîhim
  "نَشَ(آ)[ءُ]": "36-66-2",   // 36:66 muttasil neşâü
  "لَطَمَسْنَ(ا)": "36-66-3",   // 36:66 tabii letamesnâ
  "عَلَ(ىٰٓ) [أَ]عْيُنِهِمْ": "36-66-4-5",   // 36:66 munfasil alâ a’yünihim
  "مَكَ(ا)نَتِهِمْ": "36-67-5",   // 36:67 tabii mekânetihim
  "أَيْدِينَ(آ) [أَ]نْعَٰمًا": "36-71-8-9",   // 36:71 munfasil eydînâ en’âmen
  "يَأْكُلُ(و){نَ}": "36-72-6",   // 36:72 ariz ye’külûn
  "مَشَ(ا)رِبُ": "36-73-4",   // 36:73 tabii meşâribu
  "يَشْكُرُ(و){نَ}": "36-73-6",   // 36:73 ariz yeşkurûn
  "يُنصَرُ(و){نَ}": "36-74-7",   // 36:74 ariz yunsarûn
  "يُحْيِ(ي)هَا": "36-79-2",   // 36:79 tabii yuhyîhâ
  "أَنشَأَهَ(آ) [أَ]وَّلَ": "36-79-4-5",   // 36:79 munfasil enşeehâ evvele
  "عَلِ(ي){مٌ}": "36-79-10",   // 36:79 ariz alîm
  "نَ(ا)رًا": "36-80-7",   // 36:80 tabii nâran
  "إِذَ(آ) [أَ]رَادَ": "36-82-3-4",   // 36:82 munfasil izâ erâde
  "تُرْجَعُ(و){نَ}": "36-83-8",   // 36:83 ariz turce’ûn
  "إِنَّ(ا) فَتَحْنَا لَكَ": "48-1-1-2-3",   // 48:1 tabii innâ fetahnâ leke
  "هُوَ الَّذِ(يٓ) [أَ]نزَلَ": "48-4-1-2-3",   // 48:4 munfasil hüvellezî enzele
  "السَّكِ(ي)نَةَ": "48-4-4",   // 48:4 tabii es-sekîne
  "لِيَزْدَادُ(وٓ)اْ [إِ]يمَٰنًا": "48-4-8-9",   // 48:4 munfasil liyezdâdû îmânen
  "جُنُ(و)دُ": "48-4-13",   // 48:4 tabii cünûdu
  "تَجْرِ(ي)": "48-5-5",   // 48:5 tabii tecrî
  "فِ(ي)هَ(ا)": "48-5-10",   // 48:5 tabii fîhâ
  "الظَّ(آ){نِّ}ينَ": "48-6-6",   // 48:6 lazim ez-zânnîne
  "دَ(آ)[ئِ]رَةُ": "48-6-11",   // 48:6 muttasil dâiretu
  "السَّ(وْ){ءِ}": "48-6-12",   // 48:6 lin es-sev’
  "وَسَ(آ)[ءَ]تْ": "48-6-20",   // 48:6 muttasil ve sâet
  "إِنَّ(آ) [أَ]رْسَلْنَٰكَ": "48-8-1-2",   // 48:8 munfasil innâ erselnâke
  "فِ(يٓ) [أَ]نفُسِكُمْ": "51-21-1-2",   // 51:21 munfasil fî enfüsiküm
  "الْحَ(آ){قَّ}ةُ": "69-1-1",   // 69:1 lazim el-hâkka
  "وَمَ(آ) [أَ]دْرَىٰكَ": "69-3-1-2",   // 69:3 munfasil ve mâ edrâke
  "جَ(آ)[ءَ]تِ": "79-34-2",   // 79:34 muttasil câet
  "الطَّ(آ){مَّ}ةُ": "79-34-3",   // 79:34 lazim et-tâmme
  "الصَّ(آ){خَّ}ةُ": "80-33-3",   // 80:33 lazim es-sâhha
  "قُرَ(يْ){شٍ}": "106-1-2",   // 106:1 lin kureyş
  "وَالصَّ(يْ){فِ}": "106-2-4",   // 106:2 lin ves-sayf
  "الْبَ(يْ){تِ}": "106-3-4",   // 106:3 lin el-beyt
  "خَ(وْ){فِۭ}": "106-4-7",   // 106:4 lin havf
  "إِنَّ(آ) [أَ]عْطَيْنَاكَ": "108-1-1-2",   // 108:1 munfasil innâ a‘taynâke
  "جَ(آ)[ءَ]": "110-1-2",   // 110:1 muttasil câe
  "يَدَ(آ) [أَ]بِي": "111-1-2-3",   // 111:1 munfasil yedâ ebî
  "يُ(و)لَدْ": "112-3-4",   // 112:3 vav yûled
  "مَ(ا)": "113-2-3",   // 113:2 elif mâ
  "غَ(ا)سِقٍ": "113-3-3",   // 113:3 elif ğâsikın
  "حَ(ا)سِدٍ": "113-5-3",   // 113:5 elif hâsidin
  "أَعُ(و)ذُ": "114-1-2",   // 114:1 vav eûzü
  "فِ(ى)": "114-5-3",   // 114:5 ye fî
  "صُدُ(و)رِ": "114-5-4",   // 114:5 vav sudûri
};
