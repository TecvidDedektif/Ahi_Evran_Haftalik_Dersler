# Ortak ses ölçümü: 25 ms pencere, 10 ms adım; enerji (dB) ve spektral değişim
import numpy as np
def ozellik(x):
    w, h = 400, 160                                    # 25 ms pencere, 10 ms adım
    n = 1 + (len(x) - w) // h
    fr = np.stack([x[i * h:i * h + w] * np.hanning(w) for i in range(n)])
    S = np.abs(np.fft.rfft(fr, axis=1)) + 1e-6
    E = 20 * np.log10(np.sqrt((fr ** 2).mean(axis=1)) + 1e-6)
    L = np.log(S[:, 5:160])                            # ~200-6400 Hz
    L = L - L.mean(axis=1, keepdims=True)
    F = np.r_[0, np.sqrt(((L[1:] - L[:-1]) ** 2).mean(axis=1))]
    return E, F
