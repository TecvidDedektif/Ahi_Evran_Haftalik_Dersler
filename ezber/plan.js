/* ============================================================
   EZBER PLANI: yıllık Kur'an-ı Kerim planındaki ezberler (13–15 yaş)
   Ezber karnesi (#/ezber), hoca onayı, tekrar ve belge bu listeyi kullanır.

     id      kısa ad; hoca onayları bu adla saklanır, sonradan değiştirme
     hafta   plandaki hafta. O hafta sitede varsa metin ve ses haftanın ezber bölümünden gelir.
     tur     dua · sure · ayet
     ayetler haftası sitede olmayan (site başlamadan önce ezberlenmiş) sûrelerin metni ve sesi:
             ses: '1-1' -> ses/ayet/1-1.mp3 (Hüsarî)

   hedef: sınıfın ortak hedefi (bütün çocukların hoca onaylı ezberlerinin toplamı)
   Arapça metinler doğrulanmış mushaf metninden (build/make_ezber_plan.py).
   ============================================================ */

DERS.ezberPlani({
  hedef: 100,

  liste: [
    { id: 'subhaneke', hafta: 1, tur: 'dua', ad: { nl: 'Eûzü-Besmele en Sübhaneke', tr: 'Eûzü-Besmele ve Sübhaneke' } },
    { id: 'tahiyyat', hafta: 2, tur: 'dua', ad: { nl: 'Tahiyyât', tr: 'Tahiyyât' } },
    { id: 'salli-barik', hafta: 3, tur: 'dua', ad: { nl: 'Salli en Bârik', tr: 'Salli ve Bârik' } },
    { id: 'rabbena', hafta: 4, tur: 'dua', ad: { nl: 'Rabbenâ-smeekbeden', tr: 'Rabbenâ duaları' } },
    { id: 'kunut-1', hafta: 5, tur: 'dua', ad: { nl: 'Kunut-smeekbede 1', tr: 'Kunut duası 1' } },
    { id: 'kunut-2', hafta: 6, tur: 'dua', ad: { nl: 'Kunut-smeekbede 2', tr: 'Kunut duası 2' } },
    { id: 'fatiha', hafta: 7, tur: 'sure', ad: { nl: 'Fâtiha', tr: 'Fâtiha' },
      ayetler: [
        { ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ses: '1-1', nl: 'In de naam van Allah, de Barmhartige, de Genadevolle.', tr: 'Rahmân ve Rahîm olan Allah’ın adıyla.' },
        { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَٰلَمِينَ', ses: '1-2', nl: 'Alle lof is voor Allah, de Heer van de werelden,', tr: 'Hamd, âlemlerin Rabbi Allah’a mahsustur.' },
        { ar: 'الرَّحْمَٰنِ الرَّحِيمِ', ses: '1-3', nl: 'de Barmhartige, de Genadevolle,', tr: 'O, Rahmân’dır, Rahîm’dir.' },
        { ar: 'مَٰلِكِ يَوْمِ الدِّينِ', ses: '1-4', nl: 'de Koning van de Dag van het Oordeel.', tr: 'Din gününün sahibidir.' },
        { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', ses: '1-5', nl: 'U alleen aanbidden wij en U alleen vragen wij om hulp.', tr: 'Yalnız sana ibadet eder, yalnız senden yardım dileriz.' },
        { ar: 'اهْدِنَا الصِّرَٰطَ الْمُسْتَقِيمَ', ses: '1-6', nl: 'Leid ons op de rechte weg,', tr: 'Bizi doğru yola ilet;' },
        { ar: 'صِرَٰطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّآلِّينَ', ses: '1-7', nl: 'de weg van hen aan wie U gunsten hebt geschonken, niet van hen op wie toorn rust en niet van hen die dwalen.', tr: 'nimet verdiklerinin yoluna; gazaba uğrayanlarınkine ve yolunu şaşıranlarınkine değil.' },
      ] },
    { id: 'nas', hafta: 8, tur: 'sure', ad: { nl: 'Nâs', tr: 'Nâs' },
      ayetler: [
        { ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', ses: '114-1', nl: 'Zeg: ik zoek bescherming bij de Heer van de mensen,', tr: 'De ki: İnsanların Rabbine sığınırım,' },
        { ar: 'مَلِكِ النَّاسِ', ses: '114-2', nl: 'de Koning van de mensen,', tr: 'insanların Melikine (hükümdarına),' },
        { ar: 'إِلَٰهِ النَّاسِ', ses: '114-3', nl: 'de God van de mensen,', tr: 'insanların İlâhına,' },
        { ar: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', ses: '114-4', nl: 'tegen het kwaad van de sluwe influisteraar,', tr: 'o sinsi vesvesecinin şerrinden;' },
        { ar: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', ses: '114-5', nl: 'die influistert in de harten van de mensen,', tr: 'o ki insanların gönüllerine vesvese verir,' },
        { ar: 'مِنَ الْجِنَّةِ وَالنَّاسِ', ses: '114-6', nl: 'van onder de djinn en de mensen.', tr: 'gerek cinlerden, gerek insanlardan.' },
      ] },
    { id: 'felak', hafta: 9, tur: 'sure', ad: { nl: 'Felak', tr: 'Felak' },
      ayetler: [
        { ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', ses: '113-1', nl: 'Zeg: ik zoek bescherming bij de Heer van de dageraad,', tr: 'De ki: Sabahın Rabbine sığınırım,' },
        { ar: 'مِن شَرِّ مَا خَلَقَ', ses: '113-2', nl: 'tegen het kwaad van wat Hij geschapen heeft,', tr: 'yarattığı şeylerin şerrinden,' },
        { ar: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', ses: '113-3', nl: 'tegen het kwaad van de duisternis als die invalt,', tr: 'karanlığı çöktüğü zaman gecenin şerrinden,' },
        { ar: 'وَمِن شَرِّ النَّفَّـٰثَٰتِ فِي الْعُقَدِ', ses: '113-4', nl: 'tegen het kwaad van hen die op knopen blazen,', tr: 'düğümlere üfleyenlerin şerrinden,' },
        { ar: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', ses: '113-5', nl: 'en tegen het kwaad van een jaloers iemand als hij jaloers is.', tr: 've haset ettiği zaman hasetçinin şerrinden.' },
      ] },
    { id: 'ihlas', hafta: 10, tur: 'sure', ad: { nl: 'İhlâs', tr: 'İhlâs' } },
    { id: 'tebbet', hafta: 11, tur: 'sure', ad: { nl: 'Tebbet', tr: 'Tebbet' } },
    { id: 'nasr', hafta: 12, tur: 'sure', ad: { nl: 'Nasr', tr: 'Nasr' } },
    { id: 'kafirun', hafta: 13, tur: 'sure', ad: { nl: 'Kâfirûn', tr: 'Kâfirûn' } },
    { id: 'kevser', hafta: 14, tur: 'sure', ad: { nl: 'Kevser', tr: 'Kevser' } },
    { id: 'maun', hafta: 15, tur: 'sure', ad: { nl: 'Mâûn', tr: 'Mâûn' } },
    { id: 'kureys', hafta: 16, tur: 'sure', ad: { nl: 'Kureyş', tr: 'Kureyş' } },
    { id: 'fil', hafta: 17, tur: 'sure', ad: { nl: 'Fîl', tr: 'Fîl' } },
    { id: 'asr', hafta: 18, tur: 'sure', ad: { nl: 'Asr', tr: 'Asr' } },
    { id: 'tekasur', hafta: 19, tur: 'sure', ad: { nl: 'Tekâsür', tr: 'Tekâsür' } },
    { id: 'karia', hafta: 20, tur: 'sure', ad: { nl: 'Kâria', tr: 'Kâria' } },
    { id: 'adiyat', hafta: 22, tur: 'sure', ad: { nl: 'Âdiyât', tr: 'Âdiyât' } },
    { id: 'zilzal', hafta: 23, tur: 'sure', ad: { nl: 'Zilzâl', tr: 'Zilzâl' } },
    { id: 'ayetel-kursi', hafta: 24, tur: 'ayet', ad: { nl: 'Âyete’l-Kürsî', tr: 'Âyete’l-Kürsî' } },
    { id: 'hasr', hafta: 26, tur: 'ayet', ad: { nl: 'Haşr 22–24 (Hüvallâhüllezî)', tr: 'Haşr 22–24 (Hüvallâhüllezî)' } },
    { id: 'amenerrasulu', hafta: 27, tur: 'ayet', ad: { nl: 'Âmenerrasûlü (Bakara 285–286)', tr: 'Âmenerrasûlü (Bakara 285–286)' } },
    { id: 'bakara-1-5', hafta: 29, tur: 'ayet', ad: { nl: 'Bakara 1–5', tr: 'Bakara 1–5' } },
    { id: 'beyyine', hafta: 30, tur: 'sure', ad: { nl: 'Beyyine', tr: 'Beyyine' } },
  ],
});
