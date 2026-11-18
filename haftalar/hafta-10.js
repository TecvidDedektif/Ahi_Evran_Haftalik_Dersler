/* ============================================================
   10. HAFTA
   Namazın faydaları · Sabır · Yâsîn 5. sayfa ve medler · İhlâs

   Bu dosya haftanın bütün içeriğidir. Kod js/ klasöründedir.
   Metinlerde nl: Hollandaca, tr: Türkçe.

   Sohbet bloğu (tur: 'sohbet'): adımlar sırayla baloncuk olarak açılır.
     cevaplar: [...]   çocuk bir cevap seçer, "tepki" o cevaba verilen karşılıktır
     ters: true        ters köşe baloncuğu
     ders: true        hikâyeden çıkan sonuç

   Zor yarış: dosyanın sonundaki zor: [...] listesi (40 soru, her oyunda 20'si). Doğru seçenek her zaman ilk yazılır.

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
          tur: 'sohbet',
          simge: '🔋',
          baslik: { nl: 'Wat doet het gebed voor jou?', tr: 'Namaz sana ne kazandırır?' },
          adimlar: [
            { nl: 'Even een vraag. Je telefoon staat op 3 procent. Wat doe je?', tr: 'Bir soru: telefonunun şarjı yüzde 3. Ne yaparsın?',
              cevaplar: [
                { nl: 'Meteen aan de oplader!', tr: 'Hemen şarja takarım!', tepki: { nl: 'Logisch. Zonder stroom is het gewoon een stuk glas.', tr: 'Mantıklı. Şarjsız telefon sadece bir cam parçası.' } },
                { nl: 'Laat maar leeglopen.', tr: 'Boş ver, kapansın.', tepki: { nl: 'Stoer. Maar over een uur zoek je toch die oplader.', tr: 'Cesursun. Ama bir saat sonra yine şarj aletini ararsın.' } },
              ] },
            { nl: 'Nu de echte vraag: voor wie laad je hem op? Voor het stopcontact?', tr: 'Şimdi asıl soru: kimin için şarj ediyorsun? Priz için mi?' },
            { nl: 'Natuurlijk niet. Het stopcontact heeft jouw telefoon niet nodig. Jij hebt de stroom nodig.', tr: 'Tabii ki hayır. Prizin senin telefonuna ihtiyacı yok. Elektriğe ihtiyacı olan sensin.' },
            { nl: 'Bij het gebed denken we soms: “Ik bid, dus ik geef iets aan Allah.”', tr: 'Namazda bazen şöyle düşünürüz: “Namaz kılıyorum, yani Allah’a bir şey veriyorum.”' },
            { ters: true, nl: 'Maar Allah heeft niets nodig: Hij is Samed. Jij hebt het gebed nodig. Het gebed is jouw oplader: vijf keer per dag laad je je hart op.', tr: 'Ama Allah’ın hiçbir şeye ihtiyacı yok: O Samed’dir. Namaza ihtiyacı olan sensin. Namaz senin şarjın: günde beş kez kalbini şarj edersin.', kaynak: 'Ankebût 6, İhlâs 2' },
            { nl: 'Wat laad je op? Rust in je hoofd, een schoon hart en kracht voor als het moeilijk wordt.', tr: 'Neyi şarj edersin? Kafanda huzur, temiz bir kalp ve zor zamanlar için güç.' },
            { ders: true, nl: 'We bidden omdat Allah het van ons vraagt. En Hij vraagt het omdat het goed is voor ons. Hoor je de ezan? Tijd om op te laden.', tr: 'Namazı Allah emrettiği için kılarız. O da bizim iyiliğimiz için emreder. Ezanı duydun mu? Şarj vakti.' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Kort: dit geeft het gebed jou', tr: 'Kısaca: namaz sana bunları verir' },
          maddeler: [
            { simge: '🤲', nl: 'Je staat vijf keer per dag voor Allah. Het is alsof je met Hem praat: je bedankt Hem en vraagt om hulp.', tr: 'Günde beş kez Allah’ın huzuruna durursun. O’nunla konuşmak gibidir: teşekkür eder, yardım istersin.' },
            { simge: '💧', nl: 'Het gebed maakt je hart schoon, zoals een rivier voor je deur waarin je je vijf keer per dag wast.', tr: 'Namaz kalbini temizler; kapının önünden akan ve günde beş kez yıkandığın bir ırmak gibi.', kaynak: 'Hadis, Buhârî' },
            { simge: '🛡️', nl: 'Het gebed houdt je weg van slechte dingen. Wie weet dat hij straks weer voor Allah staat, let op wat hij doet.', tr: 'Namaz kötülüklerden korur. Biraz sonra yine Allah’ın huzuruna duracağını bilen, yaptığına dikkat eder.', kaynak: 'Ankebût 45' },
            { simge: '💪', nl: 'Als het moeilijk is, geeft het gebed kracht en geduld.', tr: 'Zor anlarda namaz güç ve sabır verir.', kaynak: 'Bakara 45: “Sabır ve namazla yardım isteyin.”' },
            { simge: '⏰', nl: 'Vijf vaste tijden brengen orde in je dag.', tr: 'Beş vakit, gününe düzen getirir.' },
          ],
        },
        {
          tur: 'sohbet',
          simge: '🕌',
          baslik: { nl: 'En voor ons samen?', tr: 'Peki hepimize?' },
          adimlar: [
            { nl: 'Vrijdag in de moskee. Een directeur en een schoonmaker komen tegelijk binnen. Wie krijgt de beste plek?', tr: 'Cuma günü camideyiz. Bir müdür ile bir temizlik görevlisi aynı anda içeri giriyor. En iyi yer kimin?',
              cevaplar: [
                { nl: 'De directeur', tr: 'Müdürün', tepki: { nl: 'Buiten misschien wel. Hier niet.', tr: 'Dışarıda belki öyle. Burada değil.' } },
                { nl: 'Niemand, er zijn geen vaste plekken', tr: 'Kimsenin, ayrılmış yer yok', tepki: { nl: 'Precies!', tr: 'Aynen öyle!' } },
              ] },
            { ters: true, nl: 'In de rij is iedereen gelijk. Arm en rijk, jong en oud, baas en werknemer staan schouder aan schouder. Allah kijkt niet naar je uiterlijk of je geld, maar naar je hart en je daden.', tr: 'Safta herkes eşittir. Zengin fakir, genç yaşlı, patron işçi omuz omuza durur. Allah dış görünüşünüze ve mallarınıza değil, kalplerinize ve amellerinize bakar.', kaynak: 'Hadis, Müslim' },
            { nl: 'En samen bidden is 27 keer waardevoller dan alleen bidden.', tr: 'Cemaatle kılınan namaz da tek başına kılınandan 27 derece üstündür.', kaynak: 'Hadis, Buhârî ve Müslim' },
            { nl: 'In de moskee zie je elkaar ook. Je merkt wie ziek is, wie verdrietig is en wie hulp nodig heeft.', tr: 'Camide birbirimizi de görürüz. Kimin hasta, kimin üzgün, kimin yardıma muhtaç olduğunu fark ederiz.' },
            { nl: 'Let eens op de Fâtiha. Je zegt niet “leid mij”, maar “leid ons op het rechte pad”. Ook als je alleen bidt, vraag je het voor iedereen.', tr: 'Fâtiha’ya dikkat et. “Beni” değil, “bizi doğru yola ilet” dersin. Tek başına kılsan bile herkes için istersin.', kaynak: 'Fâtiha 6' },
            { ders: true, nl: 'Alleen bidden laadt jou op. Samen bidden maakt van losse mensen één groep: broeders en zusters.', tr: 'Tek başına namaz seni şarj eder. Cemaatle namaz ise ayrı ayrı insanları tek bir topluluk yapar: kardeş oluruz.' },
          ],
        },
        {
          tur: 'sohbet',
          simge: '🪙',
          baslik: { nl: 'Het verhaal van de 24 gouden munten', tr: '24 altın misali' },
          adimlar: [
            { nl: 'Een koning geeft twee dienaren elk 24 gouden munten. Hij stuurt hen naar een prachtige boerderij, twee maanden reizen ver.', tr: 'Bir hükümdar iki hizmetçisine yirmi dörder altın verir. Onları iki ay uzaklıktaki çok güzel bir çiftliğe gönderir.' },
            { nl: 'Na één dag reizen komt er een station. Wie daar een kaartje koopt, reist verder met de trein, het schip of het vliegtuig.', tr: 'Bir günlük yoldan sonra bir istasyon vardır. Orada bilet alan, yolun kalanını tren, gemi ya da uçakla gider.' },
            { nl: 'De eerste dienaar is verstandig. Hij geeft onderweg weinig uit, doet goede zaken en koopt zijn kaartje.', tr: 'Birinci hizmetçi akıllıdır. Yolda az harcar, güzel bir ticaret yapar ve biletini alır.' },
            { nl: 'De tweede geeft 23 munten uit aan spelletjes en plezier. Hij heeft er nog maar één over. Wat zou jij doen met die laatste munt?', tr: 'İkincisi yirmi üç altını oyuna ve eğlenceye harcar. Elinde tek bir altın kalır. Sen olsan o son altınla ne yapardın?',
              cevaplar: [
                { nl: 'Een kaartje kopen', tr: 'Bilet alırdım', tepki: { nl: 'Dat zegt zijn vriend ook: “Koop met die laatste munt een kaartje! Anders moet je twee maanden te voet door de woestijn, hongerig en alleen.”', tr: 'Arkadaşı da öyle der: “Şu son altınla bir bilet al! Yoksa iki ay çölde aç, yaya ve yalnız gitmek zorunda kalırsın.”' } },
                { nl: 'Die ook uitgeven', tr: 'Onu da harcardım', tepki: { nl: 'Zijn vriend schrikt: “Koop met die laatste munt een kaartje! Anders moet je twee maanden te voet door de woestijn, hongerig en alleen.”', tr: 'Arkadaşı telaşlanır: “Şu son altınla bir bilet al! Yoksa iki ay çölde aç, yaya ve yalnız gitmek zorunda kalırsın.”' } },
              ] },
            { ters: true, nl: 'Dit verhaal gaat over jou. De 24 munten zijn de 24 uur van vandaag. En het kaartje is het gebed.', tr: 'Bu hikâye seni anlatıyor. 24 altın, bugünün 24 saati. Bilet ise namaz.' },
            { ders: true, nl: 'Vijf gebeden duren samen, met wudu erbij, ongeveer één uur. 23 uur voor al het andere, 1 uur voor het gebed: is dat veel gevraagd?', tr: 'Beş vakit namaz, abdestiyle birlikte yaklaşık bir saat sürer. 23 saat diğer her şeye, 1 saat namaza: çok mu?' },
          ],
          anlam: {
            baslik: { nl: 'Wat betekent dit?', tr: 'Bu ne demek?' },
            eslesmeler: [
              [{ nl: '24 munten', tr: '24 altın' }, { nl: 'de 24 uur van je dag', tr: 'günün 24 saati' }],
              [{ nl: 'het kaartje', tr: 'bilet' }, { nl: 'het gebed', tr: 'namaz' }],
              [{ nl: 'het station', tr: 'istasyon' }, { nl: 'het graf', tr: 'kabir' }],
              [{ nl: 'de boerderij', tr: 'çiftlik' }, { nl: 'het Paradijs', tr: 'cennet' }],
            ],
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
          tur: 'sohbet',
          simge: '🌱',
          baslik: { nl: 'Wat is sabır?', tr: 'Sabır nedir?' },
          adimlar: [
            { nl: 'Stel: morgen heb je een toets. Je zegt: “Ik heb sabır, ik wacht rustig af.” En je gaat gamen. Is dat sabır?', tr: 'Düşün: yarın sınavın var. “Sabrediyorum, bekleyip göreceğim” diyorsun ve oyun oynamaya gidiyorsun. Bu sabır mı?',
              cevaplar: [
                { nl: 'Ja, je blijft rustig', tr: 'Evet, sakinim', tepki: { nl: 'Rustig ben je wel. Maar lees wat er nu komt.', tr: 'Sakinsin, doğru. Ama şimdi geleni oku.' } },
                { nl: 'Nee, dat is lui', tr: 'Hayır, bu tembellik', tepki: { nl: 'Goed gezien.', tr: 'İyi gördün.' } },
              ] },
            { ters: true, nl: 'Sabır is niet stilzitten en wachten. Sabır is doorgaan: leren terwijl je liever gamet, en daarna op Allah vertrouwen.', tr: 'Sabır oturup beklemek değildir. Sabır devam etmektir: canın oyun isterken çalışmak, sonra Allah’a güvenmek.' },
            { nl: 'Sabır is dus volhouden als iets moeilijk is, zonder op te geven en zonder boos te worden op Allah.', tr: 'Yani sabır; zorluk karşısında dayanmak, vazgeçmemek ve Allah’a isyan etmemektir.' },
            { ders: true, nl: '“O jullie die geloven! Zoek hulp met geduld en gebed. Allah is met de geduldigen.”', tr: '“Ey iman edenler! Sabır ve namazla yardım dileyin. Şüphesiz Allah sabredenlerle beraberdir.”', kaynak: 'Bakara 153' },
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
          tur: 'sohbet',
          simge: '🪨',
          baslik: { nl: 'De zwaarste dag: Tâif', tr: 'En zor gün: Tâif' },
          adimlar: [
            { nl: 'De Profeet (s.a.s.) gaat naar de stad Tâif. Hij hoopt dat de mensen daar wél willen luisteren.', tr: 'Peygamberimiz (s.a.s.) Tâif şehrine gider. Oradaki insanların kendisini dinleyeceğini umar.' },
            { nl: 'Maar ze lachen hem uit en jagen hem weg. Ze laten stenen naar hem gooien, tot zijn voeten bloeden.', tr: 'Ama onunla alay eder, onu şehirden kovarlar. Üzerine taş attırırlar; ayakları kanar.' },
            { nl: 'Dan komt er een engel: “Als je wilt, laat ik deze twee bergen op hen neerkomen.” De engel wacht op het antwoord. Wat zou jij zeggen?', tr: 'Sonra bir melek gelir: “İstersen şu iki dağı onların üzerine kapatayım.” Melek cevap bekliyor. Sen olsan ne derdin?',
              cevaplar: [
                { nl: 'Ja, ze verdienen het', tr: 'Evet, hak ettiler', tepki: { nl: 'Dat zouden de meeste mensen zeggen.', tr: 'Çoğu insan öyle derdi.' } },
                { nl: 'Nee, laat ze', tr: 'Hayır, bırak', tepki: { nl: 'Dan denk je zoals hij.', tr: 'O zaman onun gibi düşünüyorsun.' } },
              ] },
            { ters: true, nl: 'Hij zegt: “Nee. Ik hoop dat Allah uit hun nageslacht mensen laat komen die alleen Hem aanbidden.”', tr: 'Der ki: “Hayır. Umarım Allah onların soyundan yalnız O’na kulluk eden insanlar çıkarır.”', kaynak: 'Buhârî, Müslim' },
            { nl: 'En jaren later? De mensen van Tâif komen zelf naar Medina en worden moslim.', tr: 'Peki yıllar sonra? Tâifliler kendileri Medine’ye gelir ve Müslüman olurlar.' },
            { ders: true, nl: 'Sabır is geen zwakte. Hij kon hen laten straffen en koos voor geduld. Zo win je harten.', tr: 'Sabır zayıflık değildir. Onları cezalandırabilirdi, sabrı seçti. Gönüller böyle kazanılır.' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Nog twee momenten uit zijn leven', tr: 'Hayatından iki an daha' },
          maddeler: [
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
          tur: 'sohbet',
          simge: '✋',
          baslik: { nl: 'Deze pagina heeft een verrassing', tr: 'Bu sayfada bir sürpriz var' },
          adimlar: [
            { nl: 'Iemand heeft iets fout gedaan en wordt erop aangesproken. Wat doet hij meestal als eerste?', tr: 'Biri yanlış bir şey yapmış ve ona soruluyor. Çoğu zaman ilk ne yapar?',
              cevaplar: [
                { nl: 'Hij geeft het toe', tr: 'Kabul eder', tepki: { nl: 'Dat is het eerlijkst. Maar veel mensen doen iets anders.', tr: 'En dürüstü bu. Ama çoğu insan başka bir şey yapar.' } },
                { nl: 'Hij verzint een smoes', tr: 'Bahane uydurur', tepki: { nl: 'Precies. Daar is de mond heel goed in.', tr: 'Aynen. Ağız bu işte çok ustadır.' } },
              ] },
            { nl: 'Deze pagina gaat over de Dag des Oordeels. Mensen die Allah niet wilden geloven, staan daar. Smoesjes werken er niet meer.', tr: 'Bu sayfa hesap gününü anlatıyor. Allah’a inanmak istemeyenler oradadır. Artık bahaneler işe yaramaz.' },
            { ters: true, nl: '“Op die Dag verzegelen Wij hun monden. Hun handen spreken tot Ons en hun voeten getuigen over wat zij deden.”', tr: '“O gün ağızlarını mühürleriz. Yaptıklarını Bize elleri anlatır, ayakları da şahitlik eder.”', kaynak: 'Yâsîn 65' },
            { nl: 'Een mond kan iets mooier maken dan het was. Handen niet. Die vertellen gewoon wat ze gedaan hebben.', tr: 'Ağız, olanı olduğundan güzel anlatabilir. Eller anlatamaz; ne yaptılarsa onu söylerler.' },
            { ders: true, nl: 'Ook onze handen en voeten zijn getuigen, van het slechte én van het goede. Denk daaraan als je iets typt of doorstuurt. En ook als je iemand helpt.', tr: 'Bizim ellerimiz ve ayaklarımız da şahittir; kötüye de iyiye de. Bir şey yazarken ya da gönderirken bunu hatırla. Birine yardım ederken de.', kaynak: 'Nûr 24' },
          ],
        },
        {
          tur: 'ozet',
          baslik: { nl: 'Kort: waar gaat deze pagina over? (âyet 55–70)', tr: 'Kısaca: bu sayfa ne anlatıyor? (55–70. âyetler)' },
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
          metin: { nl: 'Herhaal Medd-i Lâzım en alle andere regels in het tecvid-deel.', tr: 'Medd-i Lâzım’ı ve diğer bütün kuralları tecvid bölümünde tekrar et.' },
          dugme: { nl: 'Naar Medd-i Lâzım', tr: 'Medd-i Lâzım’a git' },
          adres: '#/tecvid/lazim',
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
          tur: 'sohbet',
          simge: '⭐',
          baslik: { nl: 'Waarom is deze sûre zo bijzonder?', tr: 'Bu sûre neden bu kadar önemli?' },
          adimlar: [
            { nl: 'In Mekka zeggen mensen die afgoden aanbidden tegen de Profeet (s.a.s.): “Vertel ons de afkomst van jouw Heer.”', tr: 'Mekke’de putlara tapanlar Peygamberimize (s.a.s.) der ki: “Bize Rabbinin soyunu söyle.”', kaynak: 'Tirmizî' },
            { nl: 'Zo’n grote vraag: wie is Allah? Hoe lang denk je dat het antwoord is?', tr: 'Ne büyük bir soru: Allah kimdir? Sence cevap ne kadar uzun?',
              cevaplar: [
                { nl: 'Een heel boek', tr: 'Koca bir kitap', tepki: { nl: 'Dat zou je verwachten.', tr: 'İnsan öyle bekler.' } },
                { nl: 'Een paar zinnen', tr: 'Birkaç cümle', tepki: { nl: 'Dichtbij!', tr: 'Yaklaştın!' } },
              ] },
            { ters: true, nl: 'Het antwoord is vier korte âyets. Je zegt ze in tien seconden. Hij is Eén. Alles heeft Hem nodig. Hij heeft niet verwekt en is niet verwekt. Niemand is aan Hem gelijk.', tr: 'Cevap dört kısa âyet. On saniyede okursun. O birdir. Her şey O’na muhtaçtır. Doğurmamış ve doğmamıştır. Hiçbir şey O’na denk değildir.' },
            { nl: 'En toch zei de Profeet (s.a.s.) dat deze korte sûre gelijk is aan een derde van de Koran.', tr: 'Buna rağmen Peygamberimiz (s.a.s.) bu kısa sûrenin Kur’an’ın üçte birine denk olduğunu söylemiştir.', kaynak: 'Hadis, Buhârî' },
            { ders: true, nl: 'Kort om te leren, groot in betekenis. Wie İhlâs begrijpt, weet wie Allah is.', tr: 'Ezberlemesi kısa, anlamı büyük. İhlâs’ı anlayan, Allah’ı tanır.' },
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

  // =========================================================
  // ZOR YARIŞ: 40 zor soru (her konudan 10). Her oyunda her konudan 5 tane, toplam 20 soru rastgele seçilir.
  // Doğru seçenek her zaman ilk sıraya yazılır, ekranda karıştırılır.
  // Seçenek düz metin olabilir ('Muttasıl') ya da { nl, tr } olabilir.
  // =========================================================
  zor: [
    // ---------- Namaz ----------
    { konu: 'namaz',
      soru: { nl: 'In Fâtiha 6 zeg je “leid ons op het rechte pad” en niet “leid mij”. Wat leren we hiervan?', tr: 'Fâtiha 6’da “beni” değil “bizi doğru yola ilet” deriz. Bundan ne öğreniriz?' },
      secenekler: [
        { nl: 'Ook als je alleen bidt, vraag je het voor iedereen', tr: 'Tek başına kılsan da herkes için istersin' },
        { nl: 'Je mag Fâtiha alleen in de moskee lezen', tr: 'Fâtiha’yı sadece camide okuyabilirsin' },
        { nl: 'De imam bidt in jouw plaats', tr: 'Senin yerine imam dua eder' },
        { nl: 'Het Arabisch heeft geen woord voor “ik”', tr: 'Arapçada “ben” kelimesi yoktur' },
      ],
      dogru: 0, aciklama: { nl: 'Het gebed maakt ons één groep: wat je voor jezelf wilt, vraag je ook voor de anderen.', tr: 'Namaz bizi bir topluluk yapar: kendin için istediğini başkaları için de istersin.' } },
    { konu: 'namaz',
      soru: { nl: 'In het verhaal van de 24 munten komt na één dag reizen een station. Wat is dat station?', tr: '24 altın misalinde bir günlük yoldan sonra gelen istasyon nedir?' },
      secenekler: [
        { nl: 'Het graf', tr: 'Kabir' },
        { nl: 'De moskee', tr: 'Cami' },
        { nl: 'Het einde van de dag', tr: 'Günün sonu' },
        { nl: 'De geboorte', tr: 'Doğum' },
      ],
      dogru: 0, aciklama: { nl: 'Wie daar een kaartje (het gebed) heeft, reist door naar de boerderij: het Paradijs.', tr: 'Orada bileti (namazı) olan, çiftliğe, yani cennete yoluna devam eder.' } },
    { konu: 'namaz',
      soru: { nl: 'Welke zin klopt NIET met wat we over het gebed hebben geleerd?', tr: 'Hangisi namaz hakkında öğrendiklerimize UYMAZ?' },
      secenekler: [
        { nl: 'Allah heeft ons gebed nodig om sterker te worden', tr: 'Allah güçlenmek için namazımıza muhtaçtır' },
        { nl: 'Het gebed is als een oplader voor je hart', tr: 'Namaz kalbin için bir şarj gibidir' },
        { nl: 'Het gebed houdt je weg van slechte daden', tr: 'Namaz seni kötülüklerden uzak tutar' },
        { nl: 'Samen bidden maakt ons broeders en zusters', tr: 'Cemaatle namaz bizi kardeş yapar' },
      ],
      dogru: 0, aciklama: { nl: 'Allah is Samed: Hij heeft niets nodig. Wij hebben het gebed nodig.', tr: 'Allah Samed’dir: O’nun hiçbir şeye ihtiyacı yok. Namaza ihtiyacı olan biziz.' } },
    { konu: 'namaz',
      soru: { nl: 'De vijf gebeden duren samen ongeveer één uur. Welk deel van je dag is dat?', tr: 'Beş vakit namaz toplam yaklaşık bir saat sürer. Günün kaçta kaçıdır?' },
      secenekler: [
        { nl: '1/24, één van de 24 munten', tr: '1/24, yani 24 altından biri' },
        { nl: '1/12', tr: '1/12' },
        { nl: '1/6', tr: '1/6' },
        { nl: '1/4', tr: '1/4' },
      ],
      dogru: 0, aciklama: { nl: 'Eén uur van 24: één munt voor het kaartje, 23 voor al het andere.', tr: '24 saatin 1’i: bilet için bir altın, kalan 23’ü diğer işler için.' } },
    { konu: 'namaz',
      soru: { nl: 'De directeur en de schoonmaker staan schouder aan schouder in de rij. Waar kijkt Allah volgens de hadis naar?', tr: 'Müdür ile temizlikçi safta omuz omuza duruyor. Hadise göre Allah neye bakar?' },
      secenekler: [
        { nl: 'Naar ons hart en onze daden', tr: 'Kalplerimize ve amellerimize' },
        { nl: 'Naar ons uiterlijk en ons geld', tr: 'Görünüşümüze ve malımıza' },
        { nl: 'Naar onze functie', tr: 'Makamımıza' },
        { nl: 'Naar hoe vooraan we staan', tr: 'Safın ne kadar önünde durduğumuza' },
      ],
      dogru: 0, aciklama: { nl: 'In de rij is iedereen gelijk.', tr: 'Safta herkes eşittir.' } },

    { konu: 'namaz',
      soru: { nl: 'In welke houding van het gebed ben je het dichtst bij Allah?', tr: 'Namazın hangi hâlinde Allah’a en yakınsın?' },
      secenekler: [
        { nl: 'In de sadjda, met je voorhoofd op de grond', tr: 'Secdede, alnın yerdeyken' },
        { nl: 'In de rukû', tr: 'Rükûda' },
        { nl: 'Als je rechtop staat', tr: 'Ayakta dururken (kıyam)' },
        { nl: 'Bij de selam aan het eind', tr: 'Sondaki selamda' },
      ],
      dogru: 0, aciklama: { nl: 'De Profeet (s.a.s.) zei: een dienaar is het dichtst bij zijn Heer in de sadjda.', tr: 'Peygamberimiz (s.a.s.): Kulun Rabbine en yakın olduğu an secde hâlidir.' } },
    { konu: 'namaz',
      soru: { nl: 'De Profeet (s.a.s.) vergelijkt de vijf gebeden met een rivier voor je deur. Wat bedoelt hij?', tr: 'Peygamberimiz (s.a.s.) beş vakti kapının önündeki bir ırmağa benzetir. Ne demek ister?' },
      secenekler: [
        { nl: 'Zoals water vuil wegwast, wast het gebed je fouten weg', tr: 'Su kiri temizlediği gibi namaz da hataları temizler' },
        { nl: 'Je moet bij een rivier wonen om te bidden', tr: 'Namaz için ırmak kenarında oturmalısın' },
        { nl: 'Je moet vijf keer per dag douchen', tr: 'Günde beş kez duş almalısın' },
        { nl: 'Je mag alleen bidden als het regent', tr: 'Sadece yağmur yağınca namaz kılınır' },
      ],
      dogru: 0 },
    { konu: 'namaz',
      soru: { nl: 'Wat betekent “het gebed is de pilaar van de religie”?', tr: '“Namaz dinin direğidir” ne demek?' },
      secenekler: [
        { nl: 'Zoals een tent op zijn paal staat, staat ons geloofsleven op het gebed', tr: 'Çadır direğiyle durduğu gibi, din hayatımız da namazla ayakta durur' },
        { nl: 'Elke moskee moet pilaren hebben', tr: 'Her caminin sütunu olmalı' },
        { nl: 'Het gebed is alleen voor de imam', tr: 'Namaz sadece imam içindir' },
        { nl: 'Je mag het gebed overslaan als je het druk hebt', tr: 'Meşgulsen namazı atlayabilirsin' },
      ],
      dogru: 0 },
    { konu: 'namaz',
      soru: { nl: 'Wat betekent şükür?', tr: 'Şükür ne demektir?' },
      secenekler: [
        { nl: 'Weten dat alles van Allah komt en dat laten zien met woorden en daden', tr: 'Nimetin Allah’tan geldiğini bilmek ve bunu söz ve davranışla göstermek' },
        { nl: 'Alleen “dank je” zeggen tegen mensen', tr: 'Sadece insanlara “teşekkürler” demek' },
        { nl: 'Veel dingen bezitten', tr: 'Çok şeye sahip olmak' },
        { nl: 'Nooit iets aan Allah vragen', tr: 'Allah’tan hiçbir şey istememek' },
      ],
      dogru: 0 },
    { konu: 'namaz',
      soru: { nl: 'In het verhaal van de 24 munten: waar staat de prachtige boerderij voor?', tr: '24 altın misalinde o güzel çiftlik neyi anlatır?' },
      secenekler: [
        { nl: 'Het Paradijs', tr: 'Cenneti' },
        { nl: 'Je werk', tr: 'İşini' },
        { nl: 'De moskee', tr: 'Camiyi' },
        { nl: 'Deze wereld', tr: 'Bu dünyayı' },
      ],
      dogru: 0, aciklama: { nl: 'Het station is het graf, het kaartje is het gebed en de boerderij is het Paradijs.', tr: 'İstasyon kabir, bilet namaz, çiftlik cennettir.' } },

    // ---------- Sabır ----------
    { konu: 'sabir',
      soru: { nl: 'Iedereen in je klas kijkt naar een haram filmpje en jij zegt nee. Welk soort sabır is dit?', tr: 'Sınıfta herkes haram bir video izliyor, sen hayır diyorsun. Bu hangi sabır?' },
      secenekler: [
        { nl: 'Geduld tegenover het verkeerde', tr: 'Günaha karşı sabır' },
        { nl: 'Geduld bij ibadet', tr: 'İbadette sabır' },
        { nl: 'Geduld bij tegenslag', tr: 'Musibette sabır' },
        { nl: 'Dit is geen sabır, het is gewoon saai', tr: 'Bu sabır değil, sadece sıkıcı' },
      ],
      dogru: 0, aciklama: { nl: 'Nee zeggen tegen wat haram is, ook als iedereen het doet.', tr: 'Herkes yapsa bile harama hayır demek.' } },
    { konu: 'sabir',
      soru: { nl: 'Waarom was het antwoord van de Profeet (s.a.s.) in Tâif geen zwakte?', tr: 'Peygamberimizin (s.a.s.) Tâif’teki cevabı neden zayıflık değildi?' },
      secenekler: [
        { nl: 'Hij kon hen laten straffen, maar koos voor geduld en hoop', tr: 'Onları cezalandırabilirdi ama sabrı ve ümidi seçti' },
        { nl: 'Hij was bang voor de engel', tr: 'Melekten korktu' },
        { nl: 'Hij had geen kracht om terug te slaan', tr: 'Karşılık verecek gücü yoktu' },
        { nl: 'Hij wilde zo snel mogelijk naar huis', tr: 'Bir an önce eve dönmek istedi' },
      ],
      dogru: 0, aciklama: { nl: 'De engel bood twee bergen aan. Sabır is kracht die je goed gebruikt.', tr: 'Melek iki dağı teklif etti. Sabır, gücü iyi kullanmaktır.' } },
    { konu: 'sabir',
      soru: { nl: 'Toen zijn zoontje İbrahim stierf, huilde de Profeet (s.a.s.). Wat leren we hiervan over sabır?', tr: 'Oğlu İbrahim vefat edince Peygamberimiz (s.a.s.) ağladı. Bundan sabır hakkında ne öğreniriz?' },
      secenekler: [
        { nl: 'Huilen mag; sabır zit in wat je zegt en doet', tr: 'Ağlamak olur; sabır, söylediğin ve yaptığındadır' },
        { nl: 'Een geduldig mens huilt nooit', tr: 'Sabırlı insan hiç ağlamaz' },
        { nl: 'Je moet doen alsof er niets gebeurd is', tr: 'Hiçbir şey olmamış gibi davranmalısın' },
        { nl: 'Verdriet voelen is een zonde', tr: 'Üzülmek günahtır' },
      ],
      dogru: 0, aciklama: { nl: '“Het oog traant, het hart is bedroefd, maar wij zeggen alleen wat onze Heer tevreden stelt.”', tr: '“Göz yaşarır, kalp üzülür; ama biz ancak Rabbimizin razı olacağı sözü söyleriz.”' } },
    { konu: 'sabir',
      soru: { nl: 'Een leerling zegt: “Ik heb sabır” en doet niets voor de toets. Wat klopt volgens de les?', tr: 'Bir öğrenci “sabrediyorum” deyip sınav için hiçbir şey yapmıyor. Derse göre doğru olan hangisi?' },
      secenekler: [
        { nl: 'Sabır is doen wat je kunt en daarna op Allah vertrouwen', tr: 'Sabır, elinden geleni yapıp sonra Allah’a güvenmektir' },
        { nl: 'Sabır is stil wachten tot het vanzelf goed komt', tr: 'Sabır, kendiliğinden düzelmesini sessizce beklemektir' },
        { nl: 'Sabır betekent nooit iets proberen', tr: 'Sabır hiçbir şeyi denememektir' },
        { nl: 'Sabır is alleen voor ziekte', tr: 'Sabır sadece hastalık içindir' },
      ],
      dogru: 0 },
    { konu: 'sabir',
      soru: { nl: 'In Mekka werd drie jaar lang niets aan de moslims verkocht. Hoe reageerde de Profeet (s.a.s.) volgens de les?', tr: 'Mekke’de üç yıl boyunca Müslümanlara hiçbir şey satılmadı. Derse göre Peygamberimiz (s.a.s.) nasıl davrandı?' },
      secenekler: [
        { nl: 'Hij gaf zijn boodschap niet op', tr: 'Davasından vazgeçmedi' },
        { nl: 'Hij verliet Mekka meteen', tr: 'Hemen Mekke’den ayrıldı' },
        { nl: 'Hij boycotte de mensen van Mekka ook', tr: 'O da Mekkelileri boykot etti' },
        { nl: 'Hij vroeg een engel om de stad te straffen', tr: 'Bir melekten şehri cezalandırmasını istedi' },
      ],
      dogru: 0, aciklama: { nl: 'Er was honger, maar hij hield vol.', tr: 'Açlık vardı ama o dayandı.' } },

    { konu: 'sabir',
      soru: { nl: 'Welke twee dingen noemt de Koran in Bakara 45 én Bakara 153 samen als hulp?', tr: 'Kur’an hem Bakara 45’te hem Bakara 153’te hangi ikisini birlikte yardım olarak sayar?' },
      secenekler: [
        { nl: 'Geduld en gebed', tr: 'Sabır ve namaz' },
        { nl: 'Geduld en vasten', tr: 'Sabır ve oruç' },
        { nl: 'Gebed en zakat', tr: 'Namaz ve zekât' },
        { nl: 'Dua en hadj', tr: 'Dua ve hac' },
      ],
      dogru: 0 },
    { konu: 'sabir',
      soru: { nl: 'Wat gebeurde er jaren na Tâif met de mensen van die stad?', tr: 'Tâif’ten yıllar sonra o şehrin insanlarına ne oldu?' },
      secenekler: [
        { nl: 'Ze kwamen naar Medina en werden moslim', tr: 'Medine’ye gelip Müslüman oldular' },
        { nl: 'De bergen vielen op hun stad', tr: 'Dağlar şehirlerinin üzerine kapandı' },
        { nl: 'Ze verhuisden allemaal naar Mekka', tr: 'Hepsi Mekke’ye taşındı' },
        { nl: 'Niemand van hen werd ooit moslim', tr: 'Hiçbiri Müslüman olmadı' },
      ],
      dogru: 0, aciklama: { nl: 'Zijn dua werd verhoord. Geduld bracht hen later bij het geloof.', tr: 'Duası kabul oldu. Sabır, onları sonra imana getirdi.' } },
    { konu: 'sabir',
      soru: { nl: 'De wekker gaat voor het ochtendgebed en het is koud. Je staat toch op. Welk soort sabır is dit?', tr: 'Sabah namazı için saat çalıyor, hava soğuk. Yine de kalkıyorsun. Bu hangi sabır?' },
      secenekler: [
        { nl: 'Geduld bij ibadet', tr: 'İbadette sabır' },
        { nl: 'Geduld tegenover het verkeerde', tr: 'Günaha karşı sabır' },
        { nl: 'Geduld bij tegenslag', tr: 'Musibette sabır' },
        { nl: 'Dit is geen sabır', tr: 'Bu sabır değildir' },
      ],
      dogru: 0 },
    { konu: 'sabir',
      soru: { nl: 'Je hebt hard geleerd, maar je krijgt toch een slecht cijfer. Wat is hier sabır?', tr: 'Çok çalıştın ama yine de notun kötü geldi. Burada sabır nedir?' },
      secenekler: [
        { nl: 'Niet opgeven: kijken wat fout ging, opnieuw leren en Allah om hulp vragen', tr: 'Vazgeçmemek: neyin yanlış gittiğine bakmak, yeniden çalışmak ve Allah’tan yardım istemek' },
        { nl: 'Stoppen met leren, het helpt toch niet', tr: 'Çalışmayı bırakmak, nasılsa işe yaramıyor' },
        { nl: 'Boos worden op de leraar', tr: 'Öğretmene kızmak' },
        { nl: 'Niets doen en afwachten', tr: 'Hiçbir şey yapmadan beklemek' },
      ],
      dogru: 0 },
    { konu: 'sabir',
      soru: { nl: 'Iemand scheldt je uit op het schoolplein. Wat past bij het voorbeeld van Tâif?', tr: 'Okul bahçesinde biri sana hakaret ediyor. Tâif örneğine uyan hangisi?' },
      secenekler: [
        { nl: 'Niet terugschelden en het goede voor hem wensen', tr: 'Karşılık vermemek ve onun için iyilik dilemek' },
        { nl: 'Harder terugschelden', tr: 'Daha sert karşılık vermek' },
        { nl: 'Het hem later betaald zetten', tr: 'Sonra ona ödetmek' },
        { nl: 'Nooit meer naar school gaan', tr: 'Bir daha okula gitmemek' },
      ],
      dogru: 0 },

    // ---------- Kur'an: Yâsîn 55-70 ve medler ----------
    { konu: 'kuran',
      soru: { nl: 'Welke medd zit er in “neşâü” (“Wij willen”, âyet 66)?', tr: '“Neşâü” (“dileriz”, 66. âyet) kelimesinde hangi med var?' },
      secenekler: ['Muttasıl', 'Tabiî', 'Munfasıl', 'Lâzım'],
      dogru: 0, aciklama: { nl: 'De medd-letter (â) en de hemze (ü) staan in hetzelfde woord: Muttasıl, 4 tellen.', tr: 'Med harfi (â) ile hemze (ü) aynı kelimede: Muttasıl, 4 hareke.' } },
    { konu: 'kuran',
      soru: { nl: 'Wat is het verschil tussen Muttasıl en Munfasıl?', tr: 'Muttasıl ile Munfasıl arasındaki fark nedir?' },
      secenekler: [
        { nl: 'Muttasıl: medd-letter en hemze in één woord. Munfasıl: in twee woorden', tr: 'Muttasıl: med harfi ve hemze tek kelimede. Munfasıl: iki ayrı kelimede' },
        { nl: 'Muttasıl is 2 tellen, Munfasıl is 4 tellen', tr: 'Muttasıl 2, Munfasıl 4 hareke' },
        { nl: 'Muttasıl heeft een şedde, Munfasıl niet', tr: 'Muttasılda şedde var, Munfasılda yok' },
        { nl: 'Muttasıl is voor lange woorden, Munfasıl voor korte', tr: 'Muttasıl uzun, Munfasıl kısa kelimeler içindir' },
      ],
      dogru: 0 },
    { konu: 'kuran',
      soru: { nl: 'Welke twee medd’s rek je even lang?', tr: 'Hangi iki medd aynı uzunlukta okunur?' },
      secenekler: [
        { nl: 'Muttasıl en Munfasıl (beide 4 tellen)', tr: 'Muttasıl ve Munfasıl (ikisi de 4 hareke)' },
        { nl: 'Tabiî en Muttasıl', tr: 'Tabiî ve Muttasıl' },
        { nl: 'Munfasıl en Lâzım', tr: 'Munfasıl ve Lâzım' },
        { nl: 'Tabiî en Lâzım', tr: 'Tabiî ve Lâzım' },
      ],
      dogru: 0, aciklama: { nl: 'Tabiî 2, Muttasıl 4, Munfasıl 4, Lâzım 6 tellen.', tr: 'Tabiî 2, Muttasıl 4, Munfasıl 4, Lâzım 6 hareke.' } },
    { konu: 'kuran',
      soru: { nl: 'Welke twee lichaamsdelen spreken en getuigen volgens Yâsîn 65?', tr: 'Yâsîn 65’e göre hangi iki uzuv konuşur ve şahitlik eder?' },
      secenekler: [
        { nl: 'De handen en de voeten', tr: 'Eller ve ayaklar' },
        { nl: 'De ogen en de oren', tr: 'Gözler ve kulaklar' },
        { nl: 'De mond en de tong', tr: 'Ağız ve dil' },
        { nl: 'Het hoofd en het hart', tr: 'Baş ve kalp' },
      ],
      dogru: 0, aciklama: { nl: 'De monden worden verzegeld. De handen spreken en de voeten getuigen.', tr: 'Ağızlar mühürlenir. Eller konuşur, ayaklar şahitlik eder.' } },
    { konu: 'kuran',
      soru: { nl: 'Wat zegt âyet 69 over de Koran?', tr: '69. âyet Kur’an hakkında ne der?' },
      secenekler: [
        { nl: 'Het is geen gedicht, maar een herinnering en een duidelijke Koran', tr: 'Şiir değildir; bir öğüt ve apaçık bir Kur’an’dır' },
        { nl: 'Het is een gewoon gedicht', tr: 'Sıradan bir şiirdir' },
        { nl: 'Het is alleen voor geleerden', tr: 'Sadece âlimler içindir' },
        { nl: 'Het is een geschiedenisboek', tr: 'Bir tarih kitabıdır' },
      ],
      dogru: 0 },

    { konu: 'kuran',
      soru: { nl: 'Welke medd zit er in “yâ benî âdeme” (âyet 60)?', tr: '“Yâ benî âdeme” (60. âyet) ifadesinde hangi med var?' },
      secenekler: [
        'Munfasıl',
        'Muttasıl',
        'Tabiî',
        'Lâzım',
      ],
      dogru: 0, aciklama: { nl: 'De medd-letter staat aan het eind van “benî”, de hemze aan het begin van “âdeme”: twee woorden, dus Munfasıl.', tr: 'Med harfi “benî”nin sonunda, hemze “âdeme”nin başında: iki kelime, yani Munfasıl.' } },
    { konu: 'kuran',
      soru: { nl: 'Welke medd zit er in “kesîran” (“veel”, âyet 62)?', tr: '“Kesîran” (“çok”, 62. âyet) kelimesinde hangi med var?' },
      secenekler: [
        'Tabiî',
        'Muttasıl',
        'Munfasıl',
        'Lâzım',
      ],
      dogru: 0, aciklama: { nl: 'Na de medd-letter (î) komt geen hemze en geen sukûn: Tabiî, 2 tellen.', tr: 'Med harfinden (î) sonra hemze de sükûn da yok: Tabiî, 2 hareke.' } },
    { konu: 'kuran',
      soru: { nl: 'Welke medd rek je 6 tellen, en waar staat hij in sûre Yâsîn?', tr: 'Hangi med 6 hareke uzatılır ve Yâsîn Sûresi’nde nerede geçer?' },
      secenekler: [
        { nl: 'Lâzım, aan het begin: Yâ-Sîn', tr: 'Lâzım, sûrenin başında: Yâ-Sîn' },
        { nl: 'Muttasıl, in âyet 66', tr: 'Muttasıl, 66. âyette' },
        { nl: 'Munfasıl, in âyet 60', tr: 'Munfasıl, 60. âyette' },
        { nl: 'Tabiî, in âyet 62', tr: 'Tabiî, 62. âyette' },
      ],
      dogru: 0 },
    { konu: 'kuran',
      soru: { nl: 'Wat zegt Allah in âyet 60 tegen de kinderen van Adam?', tr: 'Allah 60. âyette Âdemoğullarına ne der?' },
      secenekler: [
        { nl: 'Dien de şeytan niet, hij is jullie duidelijke vijand', tr: 'Şeytana kulluk etmeyin, o sizin apaçık düşmanınızdır' },
        { nl: 'Vertrouw alleen op je eigen kracht', tr: 'Sadece kendi gücünüze güvenin' },
        { nl: 'Wees bang voor de engelen', tr: 'Meleklerden korkun' },
        { nl: 'Vergeet deze wereld helemaal', tr: 'Bu dünyayı tamamen unutun' },
      ],
      dogru: 0 },
    { konu: 'kuran',
      soru: { nl: 'Hoe worden de mensen van het Paradijs in âyet 58 begroet?', tr: '58. âyette cennet ehli nasıl karşılanır?' },
      secenekler: [
        { nl: 'Met “Selâm”, een woord van een barmhartige Heer', tr: 'Çok merhametli Rab’den bir söz olarak “Selâm” ile' },
        { nl: 'Met een gouden kroon', tr: 'Altın bir taçla' },
        { nl: 'Met hun naam op een lijst', tr: 'İsimlerinin bir listede okunmasıyla' },
        { nl: 'Met muziek', tr: 'Müzikle' },
      ],
      dogru: 0 },

    // ---------- İhlâs ----------
    { konu: 'ezber',
      soru: { nl: 'Een vriend zegt: “Allah heeft ons gebed nodig.” Welk woord uit sûre İhlâs laat zien dat dat niet klopt?', tr: 'Bir arkadaşın “Allah’ın namazımıza ihtiyacı var” diyor. İhlâs Sûresi’ndeki hangi kelime bunun doğru olmadığını gösterir?' },
      secenekler: ['Samed', 'Ehad', 'Yûled', 'Küfüven'],
      dogru: 0, aciklama: { nl: 'Samed: alles heeft Hem nodig, Hij heeft niets nodig.', tr: 'Samed: her şey O’na muhtaç, O hiçbir şeye muhtaç değil.' } },
    { konu: 'ezber',
      soru: { nl: 'Wat vroegen de afgodendienaars in Mekka aan de Profeet (s.a.s.) voordat sûre İhlâs kwam?', tr: 'İhlâs Sûresi gelmeden önce Mekkeli putperestler Peygamberimize (s.a.s.) ne sordu?' },
      secenekler: [
        { nl: 'Vertel ons de afkomst van jouw Heer', tr: 'Bize Rabbinin soyunu anlat' },
        { nl: 'Hoeveel gebeden moeten wij doen?', tr: 'Bizim kaç vakit namaz kılmamız gerekir?' },
        { nl: 'Waar is jouw Heer?', tr: 'Rabbin nerede?' },
        { nl: 'Wie heeft de Koran geschreven?', tr: 'Kur’an’ı kim yazdı?' },
      ],
      dogru: 0, aciklama: { nl: 'Het antwoord was sûre İhlâs: vier korte âyets.', tr: 'Cevap İhlâs Sûresi oldu: dört kısa âyet.' } },
    { konu: 'ezber',
      soru: { nl: 'Met hoeveel van de Koran vergeleek de Profeet (s.a.s.) sûre İhlâs?', tr: 'Peygamberimiz (s.a.s.) İhlâs Sûresi’ni Kur’an’ın kaçta kaçına denk saydı?' },
      secenekler: [
        { nl: 'Een derde', tr: 'Üçte biri' },
        { nl: 'De helft', tr: 'Yarısı' },
        { nl: 'Een kwart', tr: 'Dörtte biri' },
        { nl: 'Een tiende', tr: 'Onda biri' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'In welke âyet staat “Lem yelid ve lem yûled”?', tr: '“Lem yelid ve lem yûled” hangi âyettedir?' },
      secenekler: [
        { nl: 'De derde âyet', tr: '3. âyet' },
        { nl: 'De eerste âyet', tr: '1. âyet' },
        { nl: 'De tweede âyet', tr: '2. âyet' },
        { nl: 'De vierde âyet', tr: '4. âyet' },
      ],
      dogru: 0, aciklama: { nl: 'Hij heeft niet verwekt en is niet verwekt. De vierde âyet zegt: niemand is aan Hem gelijk.', tr: 'O doğurmamış ve doğmamıştır. 4. âyet: hiçbir şey O’na denk değildir.' } },
    { konu: 'ezber',
      soru: { nl: 'Met welk woord begint sûre İhlâs en wat betekent het?', tr: 'İhlâs Sûresi hangi kelimeyle başlar ve ne demektir?' },
      secenekler: [
        { nl: 'Kul: zeg', tr: 'Kul: de ki' },
        { nl: 'Hüve: Hij', tr: 'Hüve: O' },
        { nl: 'Ehad: één', tr: 'Ehad: bir' },
        { nl: 'Lem: niet', tr: 'Lem: değil' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'Wat betekent “Ve lem yekün lehû küfüven ehad”?', tr: '“Ve lem yekün lehû küfüven ehad” ne demek?' },
      secenekler: [
        { nl: 'En niemand is aan Hem gelijk', tr: 'Hiçbir şey O’na denk değildir' },
        { nl: 'Hij heeft niet verwekt en is niet verwekt', tr: 'O doğurmamış ve doğmamıştır' },
        { nl: 'Alles heeft Hem nodig', tr: 'Her şey O’na muhtaçtır' },
        { nl: 'Zeg: Hij is Allah, de Ene', tr: 'De ki: O, Allah’tır, birdir' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'Welke âyet zegt dat alles Allah nodig heeft en Hij niets nodig heeft?', tr: 'Her şeyin Allah’a muhtaç olduğunu, O’nun hiçbir şeye muhtaç olmadığını hangi âyet söyler?' },
      secenekler: [
        { nl: 'De tweede: Allâhüssamed', tr: '2. âyet: Allâhüssamed' },
        { nl: 'De eerste: Kul hüvallâhü ehad', tr: '1. âyet: Kul hüvallâhü ehad' },
        { nl: 'De derde: Lem yelid ve lem yûled', tr: '3. âyet: Lem yelid ve lem yûled' },
        { nl: 'De vierde: Ve lem yekün lehû küfüven ehad', tr: '4. âyet: Ve lem yekün lehû küfüven ehad' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'Wat betekent “ehad” in de eerste âyet?', tr: 'Birinci âyetteki “ehad” ne demek?' },
      secenekler: [
        { nl: 'Eén: er is niemand zoals Hij', tr: 'Bir: O’nun gibisi yok' },
        { nl: 'Groot', tr: 'Büyük' },
        { nl: 'Eeuwig', tr: 'Ebedî' },
        { nl: 'Barmhartig', tr: 'Merhametli' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'Waarom is “Lem yelid ve lem yûled” een antwoord op de vraag van de afgodendienaars?', tr: '“Lem yelid ve lem yûled” putperestlerin sorusuna neden bir cevaptır?' },
      secenekler: [
        { nl: 'Ze vroegen naar de afkomst van Allah, en Hij heeft geen ouders en geen kinderen', tr: 'Allah’ın soyunu sordular; O’nun ne anne babası ne çocuğu vardır' },
        { nl: 'Ze vroegen hoeveel gebeden er zijn', tr: 'Kaç vakit namaz olduğunu sordular' },
        { nl: 'Ze vroegen waar de Kaaba staat', tr: 'Kâbe’nin nerede olduğunu sordular' },
        { nl: 'Ze vroegen wie de laatste profeet is', tr: 'Son peygamberin kim olduğunu sordular' },
      ],
      dogru: 0 },
    { konu: 'ezber',
      soru: { nl: 'Wat betekent het woord “İhlâs”?', tr: '“İhlâs” kelimesi ne demektir?' },
      secenekler: [
        { nl: 'Oprechtheid: zuiver alleen voor Allah', tr: 'Samimiyet: sadece Allah için, halis olmak' },
        { nl: 'Bescherming', tr: 'Korunma' },
        { nl: 'Dankbaarheid', tr: 'Şükür' },
        { nl: 'Geduld', tr: 'Sabır' },
      ],
      dogru: 0, aciklama: { nl: 'De sûre gaat alleen over wie Allah is: een zuiver geloof in de Ene.', tr: 'Sûre sadece Allah’ın kim olduğunu anlatır: Bir olan Allah’a halis iman.' } },
  ],
});
