# İkinci kesim: tek kelimeler Quran.com'un ayrı okunmuş kelime kaydından; iki kelimelik örnekler (ve kelime kaydı
# sonu kesik olup Hüsarî'de temiz bir duraklama bulunanlar) Hüsarî'den, sınırlar en sessiz ana kaydırılmış.
# Uçlardaki gürlüğe göre açılış/kapanış süresi: sessiz uçta kısa, sesli uçta uzun (kopukluk duyulmasın).
import json, subprocess, os, numpy as np
from analiz_ortak import ozellik
from kenar import sig, husari, wbw_olc
l = json.load(open('eslesme.json'))
os.makedirs('k2', exist_ok=True)
def acilis(db):  return 0.015 if db <= -30 else 0.04 if db <= -18 else 0.08
def kapanis(db): return 0.03 if db <= -30 else 0.08 if db <= -18 else 0.15
def yaz(kaynak, a, sure, cikis, fi, fo):
    s = sig(kaynak, a, sure)
    E, _ = ozellik(s); tepe = 20 * np.log10(np.abs(s).max() + 1e-9)
    ortalama = E[E > E.max() - 20].mean()                    # sesli kısmın ortalama gürlüğü
    kazanc = min(-15.0 - ortalama, -1.0 - tepe)              # aynı gürlük, tepe -1 dB'yi geçmesin
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '%.3f' % a, '-t', '%.3f' % sure, '-i', kaynak, '-ac', '1', '-ar', '44100',
                    '-af', 'volume=%.2fdB,afade=t=in:d=%.3f:curve=qsin,afade=t=out:st=%.3f:d=%.3f:curve=qsin' % (kazanc, fi, max(0, sure - fo), fo),
                    '-codec:a', 'libmp3lame', '-b:a', '64k', '-map_metadata', '-1', '-id3v2_version', '0', cikis], check=True)
    return kazanc
ozet = []
for x in l:
    h = husari(x); x['husariYeni'] = h
    kaynak = 'husari'
    if 'wbw' in x:
        wb, ws = wbw_olc(x['wbw'])
        kaynak = 'wbw'
        if ws > -8 and max(h['basE'], h['sonE']) <= -12: kaynak = 'husari'   # kelime kaydının sonu kesik, Hüsarî'de temiz
    if kaynak == 'wbw':
        s = sig(x['wbw']); E, _ = ozellik(s); tepe = E.max()
        taban = np.percentile(E, 3); esik = min(tepe - 25, max(tepe - 40, taban + 8))
        ses = np.where(E > esik)[0]
        a = max(0, ses[0] * 0.01 - 0.03); b = min(len(E) * 0.01 + 0.015, (ses[-1] + 1) * 0.01 + 0.06)
        bE = float(E[ses[0]:ses[0] + 3].mean() - tepe) if ses[0] > 2 else float(E[:3].mean() - tepe)   # kesim anındaki gürlük
        sE = ws if (ses[-1] + 1) * 0.01 + 0.06 >= len(E) * 0.01 else -40.0
        fi, fo = acilis(min(bE, -30) if ses[0] > 2 else bE), kapanis(sE)
        g = yaz(x['wbw'], a, b - a, 'k2/' + x['dosya'], fi, fo)
        x['kesim2'] = {'kaynak': 'wbw', 'bas': round(a, 3), 'son': round(b, 3), 'acilis': fi, 'kapanis': fo}
    else:
        a = h['bas'] - 0.01; b = h['son'] + (0.05 if x['ayetSonu'] else 0.02)
        # âyet başı/sonu gibi yerlerde öndeki ve sondaki sessizliği at (30 ms pay bırak)
        s = sig('mp3/%d.mp3' % x['sure'], a, b - a); E, _ = ozellik(s); ses = np.where(E > E.max() - 40)[0]
        a, b = a + max(0, ses[0] * 0.01 - 0.03), min(b, a + (ses[-1] + 1) * 0.01 + 0.05)
        fi, fo = acilis(h['basE']), kapanis(h['sonE'])
        g = yaz('mp3/%d.mp3' % x['sure'], a, b - a, 'k2/' + x['dosya'], fi, fo)
        x['kesim2'] = {'kaynak': 'husari', 'bas': round(a, 3), 'son': round(b, 3), 'acilis': fi, 'kapanis': fo}
    k = x['kesim2']
    print(k['kaynak'].ljust(6), x['ayet'].ljust(7), '%.2f s  açılış %3d ms kapanış %3d ms  kazanç %5.1f' % (k['son'] - k['bas'], k['acilis'] * 1000, k['kapanis'] * 1000, g), x['dosya'].ljust(15), x['okunus'])
json.dump(l, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
print(sum(os.path.getsize('k2/' + f) for f in os.listdir('k2')) // 1024, 'KB,', len(os.listdir('k2')), 'dosya;',
      sum(1 for x in l if x['kesim2']['kaynak'] == 'wbw'), 'Quran.com,', sum(1 for x in l if x['kesim2']['kaynak'] == 'husari'), 'Hüsarî')
