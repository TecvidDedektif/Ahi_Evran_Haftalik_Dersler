# Her tecvid kelimesini âyetteki kelime sırasıyla eşleştirir; Hüsarî (muallim) zamanlarını bulur.
import json, re, unicodedata, urllib.request, os, sys, time
SURE = {'Fâtiha': 1, 'Bakara': 2, 'Nisâ': 4, 'Hûd': 11, 'Kehf': 18, 'Yâsîn': 36, 'Fetih': 48, 'Zâriyât': 51, 'Hâkka': 69, 'Nâziât': 79, 'Abese': 80,
        'Kureyş': 106, 'Kevser': 108, 'Nasr': 110, 'Tebbet': 111, 'İhlâs': 112, 'Felak': 113, 'Nâs': 114}
def iskelet(s):
    s = unicodedata.normalize('NFD', re.sub(r'[()\[\]{}\u200d]', '', s))
    s = ''.join(ch for ch in s if unicodedata.category(ch) == 'Lo')
    for x, y in (('ٱ', 'ا'), ('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ى', 'ي'), ('ئ', 'ي'), ('ؤ', 'و'), ('ة', 'ه')):
        s = s.replace(x, y)
    return s.replace('ا', '').replace('ء', '')
def bul(parca, sk):
    n = len(parca); adaylar = []
    for i in range(len(sk) - n + 1):
        p = sk[i:i + n]
        if n == 1: tamam = parca[0] in p[0]
        else: tamam = p[0].endswith(parca[0]) and p[-1].startswith(parca[-1]) and p[1:-1] == parca[1:-1]
        if tamam: adaylar.append((i, n, all(x == y for x, y in zip(p, parca))))
    if not adaylar and n > 1:                       # iki parça Mushaf'ta tek kelime (yâ eyyühâ)
        bit = ''.join(parca)
        adaylar = [(i, 1, sk[i] == bit) for i in range(len(sk)) if bit in sk[i]]
    tam = [a for a in adaylar if a[2]]
    if len(tam) == 1: return tam[0][:2]
    return adaylar[0][:2] if len(adaylar) == 1 else None
def ayet_kelimeleri(k):
    yol = 'ayet_%s.json' % k.replace(':', '_')
    if not os.path.exists(yol):
        u = 'https://api.qurancdn.com/api/qdc/verses/by_key/%s?words=true&word_fields=text_uthmani' % k
        import subprocess; subprocess.run(['curl', '-s', '-m', '30', '-o', yol, u], check=True)
    v = json.load(open(yol))['verse']
    return [(w['position'], w['text_uthmani']) for w in v['words'] if w.get('char_type_name') == 'word']
kel = json.load(open('kelimeler.json'))
zaman = {}
for c in set(SURE.values()):
    a = json.load(open('zaman_%d.json' % c))['audio_files'][0]
    zaman[c] = {t['verse_key']: t for t in a['verse_timings']}
sonuc, sorun = [], []
for w in kel:
    ad, no = w['kaynak'].rsplit(' ', 1)
    c = SURE[ad]; k = '%d:%s' % (c, no)
    aw = ayet_kelimeleri(k)
    parca = [iskelet(x) for x in w['yazi'].split(' ') if x.strip()]
    sk = [iskelet(t) for _, t in aw]
    bulunan = bul(parca, sk)
    if not bulunan:
        sorun.append((w['yazi'], k, parca, sk)); continue
    i, n = bulunan; konumlar = [aw[j][0] for j in range(i, i + n)]
    seg = {s[0]: s for s in zaman[c][k]['segments'] if len(s) >= 3}
    if not all(p in seg for p in konumlar):
        sorun.append((w['yazi'], k, 'segment yok', konumlar, list(seg)[:20])); continue
    bas, son = seg[konumlar[0]][1], seg[konumlar[-1]][2]
    sonuc.append({'yazi': w['yazi'], 'tur': w['tur'], 'kaynak': w['kaynak'], 'ayet': k, 'kelime': konumlar, 'sure': c, 'bas': bas, 'son': son,
                  'ayetSonu': konumlar[-1] == aw[-1][0], 'quran': ' '.join(aw[j][1] for j in range(i, i + n))})
json.dump(sonuc, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
print('eşleşen', len(sonuc), 'sorun', len(sorun))
for s in sorun: print('SORUN', s)
