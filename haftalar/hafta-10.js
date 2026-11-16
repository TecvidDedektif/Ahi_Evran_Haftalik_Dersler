/* ============================================================
   10. HAFTA
   Namazın faydaları · Sabır · Yâsîn 5. sayfa ve medler · İhlâs

   Bu dosya haftanın bütün içeriğidir. Kod js/ klasöründedir.
   Metinlerde nl: Hollandaca, tr: Türkçe.

   Arapça kelimede işaretler:
     ( )  med harfi  mavi      [ ]  hemze  kırmızı      { }  sükûn, şedde  mor
   ============================================================ */

DERS.haftaEkle({
  id: 'hafta-10',                      // dosya adıyla aynı olmalı
  no: 10,

  konular: [
    // =======================================================
    // 1. NAMAZ
    // =======================================================
    {
      id: 'namaz',
      renk: 'ibadet',
      kisa: { nl: 'Gebed', tr: 'Namaz' },
      ad: { nl: 'Het gebed: goed voor jou én voor ons allemaal', tr: 'Namaz: bana ve hepimize faydaları' },
      bloklar: [
        {
          tur: 'ozet',
          baslik: { nl: 'Wat doet het gebed voor jou?', tr: 'Namaz sana ne kazandırır?' },
          maddeler: [
            { simge: '🤲', nl: 'Je staat vijf keer per dag voor Allah. Het is alsof je met Hem praat: je bedankt Hem en vraagt om hulp.', tr: 'Günde beş kez Allah’ın huzuruna durursun. O’nunla konuşmak gibidir: teşekkür eder, yardım istersin.' },
            { simge: '💧', nl: 'Het gebed maakt je hart schoon, zoals een rivier voor je deur waarin je je vijf keer per dag wast.', tr: 'Namaz kalbini temizler; kapının önünden akan ve günde beş kez yıkandığın bir ırmak gibi.', kaynak: 'Hadis, Buhârî' },
            { simge: '🛡️', nl: 'Het gebed houdt je weg van slechte dingen. Wie weet dat hij straks weer voor Allah staat, let op wat hij doet.', tr: 'Namaz kötülüklerden korur. Biraz sonra yine Allah’ın huzuruna duracağını bilen, yaptığına dikkat eder.', kaynak: 'Ankebût 45' },
            { simge: '💪', nl: 'Als het moeilijk is, geeft het gebed kracht en geduld.', tr: 'Zor anlarda namaz güç ve sabır verir.', kaynak: 'Bakara 45: “Sabır ve namazla yardım isteyin.”' },
            { simge: '⏰', nl: 'Vijf vaste tijden brengen orde in je dag.', tr: 'Beş vakit, gününe düzen getirir.' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'En voor ons samen?', tr: 'Peki hepimize?' },
          maddeler: [
            { simge: '🕌', nl: 'Samen bidden is 27 keer waardevoller dan alleen bidden.', tr: 'Cemaatle kılınan namaz, tek başına kılınandan 27 derece üstündür.', kaynak: 'Hadis, Buhârî ve Müslim' },
            { simge: '🤝', nl: 'In de rij staat iedereen schouder aan schouder: jong en oud, arm en rijk. Dat maakt ons broeders en zusters.', tr: 'Safta herkes omuz omuzadır: genç yaşlı, zengin fakir. Bu bizi kardeş yapar.' },
            { simge: '👀', nl: 'In de moskee zie je elkaar. Je merkt wie ziek is of hulp nodig heeft.', tr: 'Camide birbirimizi görürüz; kimin hasta olduğunu, kimin yardıma ihtiyacı olduğunu fark ederiz.' },
            { simge: '🌍', nl: 'In ons gebed vragen we het goede voor alle moslims. Zo leren we aan anderen denken.', tr: 'Namazda bütün Müslümanlar için iyilik dileriz; böylece başkalarını düşünmeyi öğreniriz.' },
          ],
        },
        {
          tur: 'hikaye',
          baslik: { nl: 'Het verhaal van de 24 gouden munten', tr: '24 altın misali' },
          adimlar: [
            { nl: 'Een koning geeft twee dienaren elk 24 gouden munten. Hij stuurt hen naar een prachtige boerderij, twee maanden reizen ver.', tr: 'Bir hükümdar iki hizmetçisine yirmi dörder altın verir. Onları iki ay uzaklıktaki çok güzel bir çiftliğe gönderir.' },
            { nl: 'Na één dag reizen komt er een station. Wie daar een kaartje koopt, reist verder met de trein, het schip of het vliegtuig.', tr: 'Bir günlük yoldan sonra bir istasyon vardır. Orada bilet alan, yolun kalanını tren, gemi ya da uçakla gider.' },
            { nl: 'De eerste dienaar is verstandig. Hij geeft onderweg weinig uit, doet goede zaken en koopt zijn kaartje.', tr: 'Birinci hizmetçi akıllıdır. Yolda az harcar, güzel bir ticaret yapar ve biletini alır.' },
            { nl: 'De tweede geeft 23 munten uit aan spelletjes en plezier. Hij heeft er nog maar één over.', tr: 'İkincisi yirmi üç altını oyuna ve eğlenceye harcar. Elinde tek bir altın kalır.' },
            { nl: 'Zijn vriend zegt: “Koop met die laatste munt een kaartje! Anders moet je twee maanden te voet door de woestijn, hongerig en alleen.”', tr: 'Arkadaşı der ki: “Şu son altınla bir bilet al! Yoksa iki ay çölde aç, yaya ve yalnız gitmek zorunda kalırsın.”' },
          ],
          anlam: {
            baslik: { nl: 'Wat betekent dit?', tr: 'Bu ne demek?' },
            eslesmeler: [
              [{ nl: '24 munten', tr: '24 altın' }, { nl: 'de 24 uur van je dag', tr: 'günün 24 saati' }],
              [{ nl: 'het kaartje', tr: 'bilet' }, { nl: 'het gebed', tr: 'namaz' }],
              [{ nl: 'het station', tr: 'istasyon' }, { nl: 'het graf', tr: 'kabir' }],
              [{ nl: 'de boerderij', tr: 'çiftlik' }, { nl: 'het Paradijs', tr: 'cennet' }],
            ],
            soru: { nl: 'Vijf gebeden duren samen, met wudu erbij, ongeveer één uur. 23 uur voor al het andere, 1 uur voor het gebed: is dat veel gevraagd?', tr: 'Beş vakit namaz, abdestiyle birlikte yaklaşık bir saat sürer. 23 saat diğer her şeye, 1 saat namaza: çok mu?' },
          },
        },
        {
          tur: 'kartlar',
          kartlar: [
            { on: { nl: 'Wat is de “pilaar van de religie”?', tr: '“Dinin direği” nedir?' }, arka: { nl: 'Het gebed. Zoals een tent op zijn paal staat, staat ons geloofsleven op het gebed.', tr: 'Namaz. Çadır direğiyle ayakta durduğu gibi, din hayatımız da namazla ayakta durur.' } },
            { on: { nl: 'Wanneer ben je het dichtst bij Allah?', tr: 'Allah’a en yakın olduğun an hangisi?' }, arka: { nl: 'In de sadjda, met je voorhoofd op de grond.', tr: 'Secdede, alnın yerdeyken.' } },
            { on: { nl: 'Hoeveel keer waardevoller is samen bidden?', tr: 'Cemaatle namaz kaç derece üstündür?' }, arka: { nl: '27 keer.', tr: '27 derece.' } },
            { on: { nl: 'Wat betekent şükür?', tr: 'Şükür ne demek?' }, arka: { nl: 'Dankbaar zijn: weten dat alles van Allah komt en dat laten zien met je woorden en daden.', tr: 'Nimetin Allah’tan geldiğini bilmek ve bunu söz ve davranışla göstermek.' } },
            { on: { nl: 'Waarmee vergelijkt de Profeet (s.a.s.) de vijf gebeden?', tr: 'Peygamberimiz (s.a.s.) beş vakit namazı neye benzetir?' }, arka: { nl: 'Met een rivier die je vijf keer per dag schoonwast.', tr: 'İnsanı günde beş kez yıkayıp temizleyen bir ırmağa.' } },
            { on: { nl: 'Vanaf welke leeftijd wennen kinderen aan het gebed?', tr: 'Çocuklar namaza kaç yaşında alıştırılır?' }, arka: { nl: 'Vanaf zeven jaar, met liefde en zonder dwang.', tr: 'Yedi yaşından itibaren, severek ve zorlamadan.' } },
          ],
        },
        {
          tur: 'quiz',
          sorular: [
            { soru: { nl: 'Wat zegt de Koran in Ankebût 45 over het gebed?', tr: 'Ankebût 45’te namaz için ne buyruluyor?' },
              secenekler: [{ nl: 'Het houdt je weg van slechte daden', tr: 'Kötülüklerden alıkoyar' }, { nl: 'Het maakt je rijk', tr: 'İnsanı zengin eder' }, { nl: 'Het is alleen voor ouderen', tr: 'Sadece yaşlılar içindir' }],
              dogru: 0, aciklama: { nl: '“Het gebed weerhoudt van schaamteloosheid en van het slechte.”', tr: '“Namaz, hayâsızlıktan ve kötülükten alıkoyar.”' } },
            { soru: { nl: 'In het verhaal van de 24 munten: wat is het kaartje?', tr: '24 altın misalinde bilet nedir?' },
              secenekler: [{ nl: 'Het gebed', tr: 'Namaz' }, { nl: 'Het geld', tr: 'Para' }, { nl: 'De boerderij', tr: 'Çiftlik' }],
              dogru: 0, aciklama: { nl: 'De 24 munten zijn de 24 uur van je dag. Met één uur koop je het kaartje.', tr: '24 altın, günün 24 saatidir. Bir saatle bileti alırsın.' } },
            { soru: { nl: 'Hoeveel tijd kosten de vijf gebeden samen ongeveer?', tr: 'Beş vakit namaz toplam ne kadar sürer?' },
              secenekler: [{ nl: 'Ongeveer één uur', tr: 'Yaklaşık bir saat' }, { nl: 'Een halve dag', tr: 'Yarım gün' }, { nl: 'Vijf uur', tr: 'Beş saat' }],
              dogru: 0 },
            { soru: { nl: 'Wat is een voordeel van het gebed voor ons allemaal samen?', tr: 'Namazın hepimize olan faydalarından biri hangisidir?' },
              secenekler: [{ nl: 'We staan naast elkaar en worden broeders en zusters', tr: 'Yan yana durur, kardeş oluruz' }, { nl: 'Je hoeft niemand meer te helpen', tr: 'Artık kimseye yardım etmen gerekmez' }, { nl: 'Je bent eerder thuis', tr: 'Eve daha erken gidersin' }],
              dogru: 0 },
            { soru: { nl: 'Waarmee moeten we volgens Bakara 45 hulp zoeken?', tr: 'Bakara 45’e göre neyle yardım istemeliyiz?' },
              secenekler: [{ nl: 'Met geduld en gebed', tr: 'Sabır ve namazla' }, { nl: 'Met geld en macht', tr: 'Para ve güçle' }, { nl: 'Met slapen en eten', tr: 'Uyku ve yemekle' }],
              dogru: 0, aciklama: { nl: 'Zo hoort het onderwerp van vandaag bij het volgende: geduld.', tr: 'Bugünkü konu böylece sıradakine bağlanıyor: sabır.' } },
          ],
        },
      ],
    },

    // =======================================================
    // 2. SABIR
    // =======================================================
    {
      id: 'sabir',
      renk: 'siyer',
      kisa: { nl: 'Geduld', tr: 'Sabır' },
      ad: { nl: 'Geduld: leren van onze Profeet (s.a.s.)', tr: 'Sabır: Peygamberimizden (s.a.s.) öğreniyoruz' },
      bloklar: [
        {
          tur: 'ozet',
          baslik: { nl: 'Wat is sabır?', tr: 'Sabır nedir?' },
          maddeler: [
            { simge: '🌱', nl: 'Sabır is volhouden als iets moeilijk is, zonder op te geven en zonder boos te worden op Allah.', tr: 'Sabır; zorluk karşısında dayanmak, vazgeçmemek ve Allah’a isyan etmemektir.' },
            { simge: '⚠️', nl: 'Sabır is niet: niets doen. Je doet wat je kunt en vertrouwt daarna op Allah.', tr: 'Sabır hiçbir şey yapmamak değildir. Elinden geleni yapar, sonra Allah’a güvenirsin.' },
            { simge: '📖', nl: '“O jullie die geloven! Zoek hulp met geduld en gebed. Allah is met de geduldigen.”', tr: '“Ey iman edenler! Sabır ve namazla yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.”', kaynak: 'Bakara 153' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Drie soorten geduld', tr: 'Üç çeşit sabır' },
          maddeler: [
            { simge: '🕌', nl: 'Geduld bij ibadet: op tijd opstaan voor het gebed, vasten ook als je trek hebt.', tr: 'İbadette sabır: namaza vaktinde kalkmak, acıksan da orucunu tutmak.' },
            { simge: '🚫', nl: 'Geduld tegenover het verkeerde: nee zeggen tegen wat haram is, ook als iedereen het doet.', tr: 'Günaha karşı sabır: herkes yapsa bile harama hayır demek.' },
            { simge: '🌧️', nl: 'Geduld bij tegenslag: ziekte, verdriet of verlies dragen zonder de hoop te verliezen.', tr: 'Musibette sabır: hastalık, üzüntü ya da kayıp karşısında ümidini kaybetmemek.' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Drie momenten uit het leven van de Profeet (s.a.s.)', tr: 'Peygamberimizin (s.a.s.) hayatından üç an' },
          maddeler: [
            { simge: '🪨', nl: 'In Tâif werd hij uitgescholden en met stenen bekogeld tot hij bloedde. Een engel bood aan de stad te straffen. Hij zei nee: “Ik hoop dat uit hun nageslacht mensen komen die alleen Allah aanbidden.”', tr: 'Tâif’te hakarete uğradı, ayakları kanayana kadar taşlandı. Bir melek şehri cezalandırmayı teklif etti. Kabul etmedi: “Umarım onların soyundan yalnız Allah’a kulluk edenler çıkar.”', kaynak: 'Buhârî, Müslim' },
            { simge: '🏚️', nl: 'In Mekka mocht drie jaar lang niemand iets aan de moslims verkopen. Er was honger. Hij gaf zijn boodschap niet op.', tr: 'Mekke’de üç yıl boyunca Müslümanlarla alışveriş kesildi. Açlık çekildi. O, davasından vazgeçmedi.' },
            { simge: '💧', nl: 'Toen zijn zoontje İbrahim stierf, huilde hij en zei: “Het oog traant, het hart is bedroefd, maar wij zeggen alleen wat onze Heer tevreden stelt.”', tr: 'Oğlu İbrahim vefat edince ağladı ve şöyle dedi: “Göz yaşarır, kalp üzülür; ama biz ancak Rabbimizin razı olacağı sözü söyleriz.”', kaynak: 'Buhârî' },
          ],
        },
        {
          tur: 'kartlar',
          baslik: { nl: 'Wat is hier sabır? Draai om', tr: 'Burada sabır ne? Çevir' },
          kartlar: [
            { on: { nl: 'Je hebt hard geleerd, maar toch een slecht cijfer.', tr: 'Çok çalıştın ama notun kötü geldi.' }, arka: { nl: 'Niet opgeven. Kijk wat er fout ging, leer opnieuw en vraag Allah om hulp.', tr: 'Vazgeçmemek. Neyin yanlış gittiğine bak, yeniden çalış ve Allah’tan yardım iste.' } },
            { on: { nl: 'Iemand scheldt je uit op het schoolplein.', tr: 'Okul bahçesinde biri sana hakaret ediyor.' }, arka: { nl: 'Niet terugschelden. Denk aan Tâif: de Profeet wenste het goede voor wie hem pijn deed.', tr: 'Karşılık vermemek. Tâif’i hatırla: Peygamberimiz kendisine eziyet edenler için iyilik diledi.' } },
            { on: { nl: 'De wekker gaat voor het ochtendgebed en het is koud.', tr: 'Sabah namazı için saat çalıyor ve hava soğuk.' }, arka: { nl: 'Toch opstaan. Dat is geduld bij ibadet.', tr: 'Yine de kalkmak. Bu, ibadette sabırdır.' } },
            { on: { nl: 'Mag je huilen als je verdrietig bent?', tr: 'Üzülünce ağlamak sabra aykırı mı?' }, arka: { nl: 'Ja, dat mag. De Profeet huilde ook. Sabır zit in wat je zegt en doet.', tr: 'Hayır, ağlayabilirsin. Peygamberimiz de ağladı. Sabır, söylediğin ve yaptığın şeydedir.' } },
          ],
        },
        {
          tur: 'quiz',
          sorular: [
            { soru: { nl: 'Wat wilde de Profeet (s.a.s.) voor de mensen van Tâif?', tr: 'Peygamberimiz (s.a.s.) Tâifliler için ne istedi?' },
              secenekler: [{ nl: 'Dat hun kinderen gelovig zouden worden', tr: 'Soylarından iman edenlerin çıkmasını' }, { nl: 'Dat de stad gestraft werd', tr: 'Şehrin cezalandırılmasını' }, { nl: 'Dat hij nooit meer hoefde te preken', tr: 'Bir daha tebliğ yapmamayı' }],
              dogru: 0 },
            { soru: { nl: 'Welke is géén soort sabır?', tr: 'Hangisi sabır çeşidi değildir?' },
              secenekler: [{ nl: 'Niets doen en afwachten', tr: 'Hiçbir şey yapmadan beklemek' }, { nl: 'Geduld bij ibadet', tr: 'İbadette sabır' }, { nl: 'Geduld bij tegenslag', tr: 'Musibette sabır' }],
              dogru: 0, aciklama: { nl: 'Sabır is doen wat je kunt en daarna op Allah vertrouwen.', tr: 'Sabır, elinden geleni yapıp sonra Allah’a güvenmektir.' } },
            { soru: { nl: 'Wat zegt Bakara 153?', tr: 'Bakara 153 ne der?' },
              secenekler: [{ nl: 'Allah is met de geduldigen', tr: 'Allah sabredenlerle beraberdir' }, { nl: 'Geduld is alleen voor profeten', tr: 'Sabır sadece peygamberler içindir' }, { nl: 'Geduld is niet nodig', tr: 'Sabra gerek yoktur' }],
              dogru: 0 },
            { soru: { nl: 'Hoe lang duurde de boycot in Mekka?', tr: 'Mekke’deki boykot ne kadar sürdü?' },
              secenekler: [{ nl: 'Ongeveer drie jaar', tr: 'Yaklaşık üç yıl' }, { nl: 'Drie dagen', tr: 'Üç gün' }, { nl: 'Dertig jaar', tr: 'Otuz yıl' }],
              dogru: 0 },
            { soru: { nl: 'Een vriend lacht je uit omdat je gaat bidden. Wat is sabır?', tr: 'Bir arkadaşın namaza gittiğin için seninle alay ediyor. Sabır hangisidir?' },
              secenekler: [{ nl: 'Rustig blijven en toch gaan bidden', tr: 'Sakin kalıp yine namaza gitmek' }, { nl: 'Boos worden en vechten', tr: 'Öfkelenip kavga etmek' }, { nl: 'Niet meer bidden', tr: 'Namazı bırakmak' }],
              dogru: 0 },
          ],
        },
      ],
    },

    // =======================================================
    // 3. KUR'AN: Yâsîn 5. sayfa ve medler
    // =======================================================
    {
      id: 'kuran',
      renk: 'kuran',
      kisa: { nl: 'Koran', tr: 'Kur’an' },
      ad: { nl: 'Yâsîn, pagina 5 en de medd’s', tr: 'Yâsîn 5. sayfa ve medler' },
      bloklar: [
        {
          tur: 'ozet',
          baslik: { nl: 'Waar gaat deze pagina over? (âyet 55–70)', tr: 'Bu sayfa ne anlatıyor? (55–70. âyetler)' },
          maddeler: [
            { simge: '🌿', nl: 'De mensen van het Paradijs zijn blij en rusten uit. Hun Heer groet hen: “Selâm!”', tr: 'Cennet ehli sevinç içinde dinlenir. Rableri onlara “Selâm” der.', kaynak: 'Âyet 55–58' },
            { simge: '☝️', nl: 'Allah herinnert ons: “Dien de şeytan niet, hij is jullie vijand. Dien Mij: dit is het rechte pad.”', tr: 'Allah hatırlatır: “Şeytana kulluk etmeyin, o sizin düşmanınızdır. Bana kulluk edin; dosdoğru yol budur.”', kaynak: 'Âyet 60–61' },
            { simge: '✋', nl: 'Op die Dag zwijgen de monden. De handen spreken en de voeten getuigen over wat iemand deed.', tr: 'O gün ağızlar mühürlenir; eller konuşur, ayaklar yapılanlara şahitlik eder.', kaynak: 'Âyet 65' },
            { simge: '📖', nl: 'De Koran is geen gedicht. Het is een herinnering en een duidelijke Koran.', tr: 'Kur’an şiir değildir; bir öğüt ve apaçık bir Kur’an’dır.', kaynak: 'Âyet 69' },
          ],
        },
        {
          tur: 'medd',
          baslik: { nl: 'Welke medd zie je? Woorden van deze pagina', tr: 'Hangi med? Bu sayfanın kelimeleri' },
          secenekler: ['tabii', 'muttasil', 'munfasil'],
          kelimeler: [
            { tur: 'muttasil', yazi: 'الْأَرَ(آ)[ئِ]كِ', okunus: 'el-erâiki', nl: 'de rustbanken', tr: 'koltuklar', kaynak: 'Yâsîn 56' },
            { tur: 'muttasil', yazi: 'نَشَ(آ)[ءُ]', okunus: 'neşâü', nl: 'Wij willen', tr: 'dileriz', kaynak: 'Yâsîn 66' },
            { tur: 'munfasil', yazi: 'يَٰبَنِ(ىٓ) [ءَ]ادَمَ', okunus: 'yâ benî âdeme', nl: 'o kinderen van Adam', tr: 'ey Âdemoğulları', kaynak: 'Yâsîn 60' },
            { tur: 'munfasil', yazi: 'عَلَ(ىٰٓ) [أَ]فْوَٰهِهِمْ', okunus: 'alâ efvâhihim', nl: 'op hun monden', tr: 'ağızlarına', kaynak: 'Yâsîn 65' },
            { tur: 'munfasil', yazi: 'وَتُكَلِّمُنَ(آ) [أَ]يْدِيهِمْ', okunus: 've tükellimünâ eydîhim', nl: 'hun handen spreken tot Ons', tr: 'elleri bize konuşur', kaynak: 'Yâsîn 65' },
            { tur: 'munfasil', yazi: 'عَلَ(ىٰٓ) [أَ]عْيُنِهِمْ', okunus: 'alâ a’yünihim', nl: 'op hun ogen', tr: 'gözlerine', kaynak: 'Yâsîn 66' },
            { tur: 'tabii', yazi: 'كَثِ(ي)رًا', okunus: 'kesîran', nl: 'veel', tr: 'çok', kaynak: 'Yâsîn 62' },
            { tur: 'tabii', yazi: 'بِمَ(ا)', okunus: 'bimâ', nl: 'door wat', tr: 'sebebiyle', kaynak: 'Yâsîn 64' },
            { tur: 'tabii', yazi: 'لَطَمَسْنَ(ا)', okunus: 'letamesnâ', nl: 'Wij zouden uitwissen', tr: 'silerdik', kaynak: 'Yâsîn 66' },
            { tur: 'tabii', yazi: 'مَكَ(ا)نَتِهِمْ', okunus: 'mekânetihim', nl: 'hun plaats', tr: 'bulundukları yer', kaynak: 'Yâsîn 67' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Herhaling: Medd-i Lâzım', tr: 'Tekrar: Medd-i Lâzım' },
          maddeler: [
            { simge: '🔁', nl: 'Lâzım: na de med-letter komt een letter met şedde of sukûn. Je rekt altijd 6 tellen.', tr: 'Lâzım: med harfinden sonra şeddeli ya da sükûnlu harf gelir. Her zaman 6 hareke uzatılır.' },
            { simge: '🔎', nl: 'Op deze pagina staat geen Medd-i Lâzım. Wel aan het begin van de sûre: Yâ-Sîîîn.', tr: 'Bu sayfada medd-i lâzım yok. Ama sûrenin başında var: Yâ-Sîîîn.' },
          ],
        },
        {
          tur: 'baglanti',
          metin: { nl: 'Oefen Medd-i Lâzım met het spel in Tecvid Dedektif.', tr: 'Medd-i Lâzım’ı Tecvid Dedektif’teki oyunla tekrar et.' },
          dugme: { nl: 'Naar Tecvid Dedektif', tr: 'Tecvid Dedektif’e git' },
          adres: 'https://tecviddedektif.github.io/tecvid-dedektif/#/medd-lazim',
        },
      ],
    },

    // =======================================================
    // 4. EZBER: İhlâs Sûresi
    // =======================================================
    {
      id: 'ezber',
      renk: 'ezber',
      kisa: { nl: 'İhlâs', tr: 'Ezber' },
      ad: { nl: 'Uit het hoofd: sûre İhlâs en de betekenis', tr: 'Ezber: İhlâs Sûresi ve anlamı' },
      bloklar: [
        {
          tur: 'ezber',
          baslik: { nl: 'Lees hardop en herhaal', tr: 'Sesli oku ve tekrar et' },
          ayetler: [
            { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', okunus: 'Kul hüvallâhü ehad', nl: 'Zeg: Hij is Allah, de Ene.', tr: 'De ki: O, Allah’tır, birdir.' },
            { ar: 'اللَّهُ الصَّمَدُ', okunus: 'Allâhüssamed', nl: 'Allah is Samed: alles heeft Hem nodig, Hij heeft niets nodig.', tr: 'Allah Samed’dir: her şey O’na muhtaçtır, O hiçbir şeye muhtaç değildir.' },
            { ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', okunus: 'Lem yelid ve lem yûled', nl: 'Hij heeft niet verwekt en is niet verwekt.', tr: 'O doğurmamış ve doğmamıştır.' },
            { ar: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', okunus: 'Ve lem yekün lehû küfüven ehad', nl: 'En niemand is aan Hem gelijk.', tr: 'Hiçbir şey O’na denk değildir.' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Waarom is deze sûre zo bijzonder?', tr: 'Bu sûre neden bu kadar önemli?' },
          maddeler: [
            { simge: '☝️', nl: 'İhlâs vertelt in vier korte âyets wie Allah is: Eén, niemand nodig, niet geboren, zonder gelijke.', tr: 'İhlâs dört kısa âyette Allah’ı tanıtır: Birdir, hiçbir şeye muhtaç değildir, doğmamıştır, dengi yoktur.' },
            { simge: '⭐', nl: 'De Profeet (s.a.s.) zei dat deze sûre gelijk is aan een derde van de Koran.', tr: 'Peygamberimiz (s.a.s.) bu sûrenin Kur’an’ın üçte birine denk olduğunu söylemiştir.', kaynak: 'Hadis, Buhârî' },
          ],
        },
        {
          tur: 'quiz',
          baslik: { nl: 'Ken je de betekenis?', tr: 'Anlamını biliyor musun?' },
          sorular: [
            { soru: { nl: 'Wat betekent “Kul hüvallâhü ehad”?', tr: '“Kul hüvallâhü ehad” ne demek?' },
              secenekler: [{ nl: 'Zeg: Hij is Allah, de Ene', tr: 'De ki: O, Allah’tır, birdir' }, { nl: 'Niemand is aan Hem gelijk', tr: 'Hiçbir şey O’na denk değildir' }, { nl: 'Hij is niet verwekt', tr: 'O doğmamıştır' }],
              dogru: 0 },
            { soru: { nl: 'Wat betekent “Samed”?', tr: '“Samed” ne demek?' },
              secenekler: [{ nl: 'Alles heeft Hem nodig, Hij heeft niets nodig', tr: 'Her şey O’na muhtaç, O hiçbir şeye muhtaç değil' }, { nl: 'De Barmhartige', tr: 'Çok merhametli' }, { nl: 'De Schepper', tr: 'Yaratan' }],
              dogru: 0 },
            { soru: { nl: 'Wat betekent “Lem yelid ve lem yûled”?', tr: '“Lem yelid ve lem yûled” ne demek?' },
              secenekler: [{ nl: 'Hij heeft niet verwekt en is niet verwekt', tr: 'O doğurmamış ve doğmamıştır' }, { nl: 'Zeg: Hij is Allah, de Ene', tr: 'De ki: O, Allah’tır, birdir' }, { nl: 'Allah is Samed', tr: 'Allah Samed’dir' }],
              dogru: 0 },
            { soru: { nl: 'Hoeveel âyets heeft sûre İhlâs?', tr: 'İhlâs Sûresi kaç âyettir?' },
              secenekler: [{ nl: 'Vier', tr: 'Dört' }, { nl: 'Drie', tr: 'Üç' }, { nl: 'Zeven', tr: 'Yedi' }],
              dogru: 0 },
          ],
        },
      ],
    },
  ],
});
