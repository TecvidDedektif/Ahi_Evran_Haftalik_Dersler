# Son kesim kararı ve ses dosyaları: sessizlikle ayrılan tek parça > QDC (makulse) > bizim hizalama
import json, subprocess, os, numpy as np
from parca import oku, parcalar
from hizala import ozellik
l = json.load(open('eslesme.json'))
os.makedirs('k', exist_ok=True)
def en_sessiz(sure, t, aralik=0.06):
    sig = oku(sure, max(0, t - aralik), t + aralik)
    E, _ = ozellik(sig) if len(sig) > 800 else (np.array([0]), None)
    return max(0, t - aralik) + int(np.argmin(E)) * 0.01 if len(E) > 1 else t
for x in l:
    h = x.get('hiza') or {}
    q0, q1 = x['bas'] / 1000, x['son'] / 1000
    if x['ayet'] in ('69:1',):                                   # tek kelimelik âyet: âyetin sesi, sessizlik kırpılır
        a, b = x['ayetBas'] / 1000, x['ayetSon'] / 1000
        P = parcalar(ozellik(oku(x['sure'], a, b))[0])
        bas, son, yol = a + P[0][0], a + P[-1][1], 'ayet'
    elif x['oranQ'] < 0.45 or (x['ayet'], x['kelime']) == ('1:7', [9]):
        # QDC kelimeyi çok kısa almış (ör. 110:1 câe 0,3 sn) ya da öncekinin sonunu katmış: bizim hizalama (spektrogramla kontrol edildi)
        bas, son, yol = h['bas'], h['son'], 'bizim'
    else:
        bas, son, yol = q0, q1 + 0.05, 'qdc'
    if x['ayetSonu'] and h and yol != 'ayet':                    # âyet sonu: parçanın sonundaki sessizliğe kadar
        son = max(son, h['parca'][1])
    if yol in ('qdc', 'bizim'):
        bas = en_sessiz(x['sure'], bas); son = en_sessiz(x['sure'], son) if not x['ayetSonu'] else son
    x['kesim'] = {'bas': round(bas, 3), 'son': round(son, 3), 'yol': yol}
    ad = '%d-%s-%s.mp3' % (x['sure'], x['ayet'].split(':')[1], '-'.join(map(str, x['kelime'])))
    x['dosya'] = ad
    a, b = max(0, bas - 0.06), son + 0.12
    # önce tepe seviyesini ölç, sonra -2 dB'ye getir
    v = subprocess.run(['ffmpeg', '-hide_banner', '-ss', '%.3f' % a, '-t', '%.3f' % (b - a), '-i', 'mp3/%d.mp3' % x['sure'], '-ac', '1', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    tepe = float([s for s in v.splitlines() if 'max_volume' in s][0].split(':')[1].split()[0])
    kazanc = -2.0 - tepe
    sure = b - a
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '%.3f' % a, '-t', '%.3f' % sure, '-i', 'mp3/%d.mp3' % x['sure'], '-ac', '1', '-ar', '44100',
                    '-af', 'volume=%.2fdB,afade=t=in:d=0.03,afade=t=out:st=%.3f:d=0.08' % (kazanc, max(0, sure - 0.08)),
                    '-codec:a', 'libmp3lame', '-b:a', '64k', '-map_metadata', '-1', '-id3v2_version', '0', 'k/' + ad], check=True)
    print(yol.ljust(6), x['ayet'].ljust(7), '%.2f s' % sure, ad.ljust(16), x['yazi'])
json.dump(l, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
print(sum(os.path.getsize('k/' + f) for f in os.listdir('k')) // 1024, 'KB toplam,', len(os.listdir('k')), 'dosya')
