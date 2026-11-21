# Quran.com'un kelime kelime kayıtlarını indirir (her kelime ayrı okunmuş; başı ve sonu temiz).
# Sadece tek kelimelik örnekler için; munfasıl gibi iki kelimenin bağlanmasıyla duyulan örnekler Hüsarî'den kalır.
# Dikkat: API'nin verdiği audio_url, âyette durak işareti (ۖ ۚ ۞) varsa sonraki kelimelerde bir kayıyor;
# dosyalar ise kelimenin gerçek sırasıyla adlanmış: wbw/SSS_AAA_KKK.mp3 (K = kelimenin âyetteki sırası).
import json, os, subprocess
l = json.load(open('eslesme.json'))
os.makedirs('wbw', exist_ok=True)
for x in l:
    if len(x['kelime']) != 1 or x['tur'] == 'munfasil':
        x.pop('wbw', None); continue
    s, a = x['ayet'].split(':')
    x['wbw'] = 'wbw/%03d_%03d_%03d.mp3' % (int(s), int(a), x['kelime'][0])
    if not os.path.exists(x['wbw']) or os.path.getsize(x['wbw']) < 2000:
        r = subprocess.run(['curl', '-s', '-o', x['wbw'], '-w', '%{http_code}', 'https://audio.qurancdn.com/' + x['wbw']], capture_output=True, text=True).stdout
        if r != '200': print('indirilemedi', x['ayet'], x['kelime'], r); x.pop('wbw')
json.dump(l, open('eslesme.json', 'w'), ensure_ascii=False, indent=1)
print(sum(1 for x in l if 'wbw' in x), 'kelime kaydı hazır')
