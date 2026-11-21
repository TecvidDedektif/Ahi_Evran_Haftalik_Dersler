# Her örnek için iki aday: Quran.com kelime kaydı (tek kelimelerde) ve Hüsarî kesimi (sınır en sessiz yere kaydırılmış).
# Uçların ne kadar "kopuk" olduğunu ölçer: kesim noktasındaki gürlük (tepeye göre dB). -25 dB ve altı doğal duyulur.
import json, subprocess, numpy as np
from analiz_ortak import ozellik
SR = 16000
def sig(y, bas=None, sure=None):
    a = ['ffmpeg', '-loglevel', 'error'] + (['-ss', '%.3f' % bas] if bas is not None else []) + ['-i', y] + (['-t', '%.3f' % sure] if sure else [])
    p = subprocess.run(a + ['-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768
def yumusak(E, n=3):
    return np.convolve(E, np.ones(n) / n, mode='same')
def wbw_olc(y):
    E, _ = ozellik(sig(y)); t = E.max()
    return float(E[3:8].mean() - t), float(E[-8:-3].mean() - t)     # baştan 30-80 ms, sondan 80-30 ms
def husari(x, geri=0.15, ileri=0.05):
    k = x['kesim']; a = max(0, k['bas'] - 0.5); b = k['son'] + 0.5
    E, _ = ozellik(sig('mp3/%d.mp3' % x['sure'], a, b - a)); Es = yumusak(E); t = E.max()
    zt = lambda s: min(len(E) - 1, max(0, int(round((s - a) / 0.01))))
    i0, i1 = zt(k['bas'] - geri), zt(k['bas'] + ileri)
    bi = i0 + int(np.argmin(Es[i0:max(i1, i0 + 1)]))
    if x['ayetSonu']:
        si = zt(k['son'])
        # âyet sonu: sesin bittiği yer (tepenin 40 dB altı) — sessizliğe kadar
        j = zt(k['son'] - 0.3)
        while j < len(E) - 1 and E[j] > t - 40: j += 1
        si = j
    else:
        j0, j1 = zt(k['son'] - ileri), zt(k['son'] + geri)
        si = j0 + int(np.argmin(Es[j0:max(j1, j0 + 1)]))
    return dict(bas=round(a + bi * 0.01, 3), son=round(a + si * 0.01, 3), basE=round(float(Es[bi] - t), 1), sonE=round(float(Es[si] - t), 1),
                eskiBasE=round(float(Es[zt(k['bas'])] - t), 1), eskiSonE=round(float(Es[min(zt(k['son']), len(Es) - 1)] - t), 1))
if __name__ == '__main__':
    l = json.load(open('eslesme.json'))
    for x in l:
        h = husari(x); x['husariYeni'] = h
        w = None
        if 'wbw' in x:
            wb, ws = wbw_olc(x['wbw']); x['wbwKenar'] = {'bas': round(wb, 1), 'son': round(ws, 1)}; w = (wb, ws)
        print(x['tur'][:5].ljust(5), x['ayet'].ljust(7), ('wbw bas%6.1f son%6.1f' % w) if w else ' ' * 22,
              '| Hüsarî eski %6.1f %6.1f -> yeni %6.1f %6.1f' % (h['eskiBasE'], h['eskiSonE'], h['basE'], h['sonE']), x['okunus'])
    json.dump(l, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
