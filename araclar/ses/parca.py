# Âyet sesini sessizliklere göre parçalara ayırır; QDC kelime zamanlarının hangi parçaya düştüğüne bakar.
import json, subprocess, numpy as np
SR = 16000
def oku(sure, bas, son):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', '%.3f' % bas, '-i', 'mp3/%d.mp3' % sure, '-t', '%.3f' % (son - bas), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.int16).astype(np.float32) / 32768
def enerji(x, h=160, w=400):
    n = 1 + (len(x) - w) // h
    return np.array([20 * np.log10(np.sqrt((x[i * h:i * h + w] ** 2).mean()) + 1e-6) for i in range(n)])
def parcalar(E, esik_db=-38, en_az_sessiz=0.18):
    ses = E > E.max() + esik_db * 0 + (esik_db - (E.max() - E.max()))   # mutlak eşik aşağıda
    ses = E > max(E.max() - 35, -50)
    l, i, n = [], 0, len(E)
    while i < n:
        if ses[i]:
            j = i
            while j < n:
                if not ses[j]:
                    k = j
                    while k < n and not ses[k]: k += 1
                    if (k - j) * 0.01 >= en_az_sessiz or k >= n: break
                    j = k
                else: j += 1
            l.append((i * 0.01, j * 0.01)); i = j
        else: i += 1
    return [p for p in l if p[1] - p[0] > 0.15]
if __name__ == '__main__':
    l = json.load(open('eslesme.json'))
    for x in l[:12]:
        a, b = x['ayetBas'] / 1000, x['ayetSon'] / 1000
        E = enerji(oku(x['sure'], a, b))
        P = [(round(p[0] + a, 2), round(p[1] + a, 2)) for p in parcalar(E)]
        print(x['ayet'], x['yazi'], 'kesim %.2f-%.2f' % (x['bas'] / 1000, x['son'] / 1000), 'parçalar:', P)
