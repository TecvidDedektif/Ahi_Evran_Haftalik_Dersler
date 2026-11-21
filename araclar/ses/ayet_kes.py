# Ezber sûrelerinin âyet âyet sesi (Hüsarî, muallim). Muallim kıraatinde her âyetten sonra uzun bir durak var;
# âyet, Quran.com âyet zamanlarının içindeki tek ses parçasıdır, öndeki ve sondaki sessizlik atılır.
import json, os, subprocess, sys, numpy as np
from parca import oku, enerji, parcalar
from analiz_ortak import ozellik
def yaz(kaynak, a, sure, cikis, fi=0.02, fo=0.08):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', '%.3f' % a, '-t', '%.3f' % sure, '-i', kaynak, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True)
    s = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768
    E, _ = ozellik(s); tepe = 20 * np.log10(np.abs(s).max() + 1e-9)
    kazanc = min(-15.0 - E[E > E.max() - 20].mean(), -1.0 - tepe)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '%.3f' % a, '-t', '%.3f' % sure, '-i', kaynak, '-ac', '1', '-ar', '44100',
                    '-af', 'volume=%.2fdB,afade=t=in:d=%.3f:curve=qsin,afade=t=out:st=%.3f:d=%.3f:curve=qsin' % (kazanc, fi, max(0, sure - fo), fo),
                    '-codec:a', 'libmp3lame', '-b:a', '64k', '-map_metadata', '-1', '-id3v2_version', '0', cikis], check=True)
os.makedirs('ayet', exist_ok=True)
for n in map(int, sys.argv[1:]):
    d = json.load(open('zaman_%d.json' % n))['audio_files'][0]
    for v in d['verse_timings']:
        a, b = v['timestamp_from'] / 1000, v['timestamp_to'] / 1000
        o = max(0, a - 0.3)
        P = parcalar(enerji(oku(n, o, b + 0.5)), en_az_sessiz=0.25)
        bas, son = o + P[0][0] - 0.05, o + P[0][1] + 0.15
        ad = 'ayet/%d-%s.mp3' % (n, v['verse_key'].split(':')[1])
        yaz('mp3/%d.mp3' % n, bas, son - bas, ad)
        print(ad, '%.2f s' % (son - bas))
