# Metne dayalı kelime hizalama: âyet sesini sessizliklerden parçalara böl, parçadaki kelimeleri
# beklenen uzunluklarına (hareke sayısı) göre ses değişim noktalarına oturt.
import json, subprocess, unicodedata, numpy as np
from parca import oku, parcalar, SR
FATHA, DAMMA, KASRA, SUKUN, SEDDE = 'َ', 'ُ', 'ِ', 'ْ', 'ّ'
TENVIN = 'ًࣰٌࣱٍࣲ'
def birim(kelime, sonda=False, basta=False):
    harfler, i = [], 0
    s = unicodedata.normalize('NFC', kelime)
    while i < len(s):
        ch = s[i]
        if unicodedata.category(ch) == 'Lo':
            j = i + 1
            while j < len(s) and unicodedata.category(s[j]) == 'Mn': j += 1
            harfler.append((ch, s[i + 1:j])); i = j
        else: i += 1
    u, onceki = 0.0, ''
    for k, (h, m) in enumerate(harfler):
        if '۟' in m or '۠' in m: continue                # okunmayan harf
        if h == 'ٱ': u += 1 if (basta and k == 0) else 0; continue
        if any(c in m for c in (FATHA, DAMMA, KASRA)): u += 1
        elif any(c in m for c in TENVIN): u += 1.3
        elif SUKUN in m or 'ۡ' in m: u += 0.4
        elif h in 'اويىآ': u += 1                                   # med harfi: ikinci hareke
        else: u += 0.5
        if SEDDE in m: u += 0.5
        if 'ٰ' in m: u += 1                                    # üstün elif
        if 'ٓ' in m: u += 3                                    # med işareti: 4-6 hareke
        if h == 'آ': u += 3
    if sonda: u = max(1, u - 0.6)                                  # durakta son hareke okunmaz
    return max(u, 1)
def ozellik(x):
    w, h = 400, 160
    n = 1 + (len(x) - w) // h
    fr = np.stack([x[i * h:i * h + w] * np.hanning(w) for i in range(n)])
    S = np.abs(np.fft.rfft(fr, axis=1)) + 1e-6
    E = 20 * np.log10(np.sqrt((fr ** 2).mean(axis=1)) + 1e-6)
    L = np.log(S[:, 5:160]); L = L - L.mean(axis=1, keepdims=True)
    F = np.r_[0, np.sqrt(((L[1:] - L[:-1]) ** 2).mean(axis=1))]
    return E, F
def adaylar(E, F):
    z = lambda v: (v - v.mean()) / (v.std() + 1e-6)
    sk = np.convolve(z(F) - z(E), np.ones(5) / 5, mode='same')
    c = [i for i in range(2, len(sk) - 2) if sk[i] == sk[i - 2:i + 3].max()]
    c = [i for i in c if sk[i] > -0.5]
    g = (sk - sk.min()) / (sk.max() - sk.min() + 1e-6)
    return c, g
def bol(E, F, beklenen, b0, b1):
    # b0..b1 çerçeveleri arasını len(beklenen) kelimeye böl
    c, g = adaylar(E[b0:b1], F[b0:b1])
    c = [0] + [x for x in c if 5 < x < (b1 - b0) - 5] + [b1 - b0]
    n, M = len(beklenen), len(c)
    if n == 1: return [b0, b1]
    oran = (b1 - b0) / sum(beklenen)
    INF = 1e18
    D = np.full((n + 1, M), INF); P = np.zeros((n + 1, M), dtype=int); D[0, 0] = 0
    for k in range(1, n + 1):
        for j in range(1, M):
            if k < n and j == M - 1: continue
            if k == n and j != M - 1: continue
            best, bi = INF, -1
            for i in range(0, j):
                if D[k - 1, i] >= INF: continue
                d = c[j] - c[i]
                if d < 8: continue
                cost = D[k - 1, i] + np.log(d / (beklenen[k - 1] * oran)) ** 2 + (0.35 * (1 - g[min(c[j], len(g) - 1)]) if j < M - 1 else 0)
                if cost < best: best, bi = cost, i
            D[k, j], P[k, j] = best, bi
    yol, j = [M - 1], M - 1
    for k in range(n, 0, -1): j = P[k, j]; yol.append(j)
    return [b0 + c[j] for j in reversed(yol)]
def hizala(x, ayetler, zaman_tum):
    a, b = x['ayetBas'] / 1000, x['ayetSon'] / 1000
    sig = oku(x['sure'], a, b)
    E, F = ozellik(sig)
    P = parcalar(E)
    segs = [s for s in zaman_tum[x['ayet']]['segments'] if len(s) >= 3]
    hedefOrta = ((x['bas'] + x['son']) / 2000) - a
    parca = [p for p in P if p[0] - 0.3 <= hedefOrta <= p[1] + 0.3]
    if not parca: return None
    p0, p1 = parca[0]
    # parçadaki kelimeler: QDC kelimelerinden ortası parçaya düşenler, sırasıyla
    ic = [s for s in segs if p0 - 0.15 <= ((s[1] + s[2]) / 2000 - a) <= p1 + 0.15]
    # tekrar okumalarda hedefin geçtiği bitişik diziyi al
    sira = [s[0] for s in ic]
    k = x['kelime']
    yer = [j for j in range(len(sira) - len(k) + 1) if sira[j:j + len(k)] == k]
    if not yer: return None
    metin = dict(ayetler)
    bek = [birim(metin[s[0]], sonda=(j == len(ic) - 1), basta=(j == 0)) for j, s in enumerate(ic)]
    sinirlar = bol(E, F, bek, int(p0 / 0.01), int(p1 / 0.01))
    j0 = yer[0]
    bas = a + sinirlar[j0] * 0.01; son = a + sinirlar[j0 + len(k)] * 0.01
    return {'bas': round(bas, 3), 'son': round(son, 3), 'parca': [round(a + p0, 2), round(a + p1, 2)], 'kelimeler': sira,
            'sinirlar': [round(a + s * 0.01, 2) for s in sinirlar], 'qdc': [round(s[1] / 1000, 2) for s in ic] + [round(ic[-1][2] / 1000, 2)]}
if __name__ == '__main__':
    l = json.load(open('eslesme.json'))
    zt = {}
    for c in set(x['sure'] for x in l):
        af = json.load(open('zaman_%d.json' % c))['audio_files'][0]; zt[c] = {t['verse_key']: t for t in af['verse_timings']}
    for x in l:
        aw = json.load(open('ayet_%s.json' % x['ayet'].replace(':', '_')))['verse']['words']
        ay = [(w['position'], w['text_uthmani']) for w in aw if w.get('char_type_name') == 'word']
        h = hizala(x, ay, zt[x['sure']])
        x['hiza'] = h
        if h: print(x['ayet'].ljust(7), x['tur'].ljust(8), 'QDC %.2f-%.2f  bizim %.2f-%.2f  fark %+.2f %+.2f' % (x['bas'] / 1000, x['son'] / 1000, h['bas'], h['son'], h['bas'] - x['bas'] / 1000, h['son'] - x['son'] / 1000), x['yazi'])
        else: print(x['ayet'], 'HİZALANAMADI', x['yazi'])
    json.dump(l, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
