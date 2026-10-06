"""Gera as variantes responsivas a partir dos originais em .impeccable/img-src/.
Cada foto vira <nome>.webp (maior tamanho necessário) + <nome>-<w>.webp (menores);
as fotos de tratamento também ganham <nome>-thumb.webp recortado em 4:5 para a lista no celular.
Rodar de novo sempre que um original mudar:  python .impeccable/build-images.py"""
import json, os, shutil
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '.impeccable', 'img-src')
OUT = os.path.join(ROOT, 'assets', 'img')
Q = 72

# nome: (larguras menores, largura máxima)
PLAN = {
    'hero': ([640, 960], 1400),
    'clinic-reception': ([640, 1000], 1500),
    'tech-scanner': ([480], 900),
    'ba-1': ([700], 1400), 'ba-2': ([700], 1400), 'ba-3': ([700], 1400),
    'team-helena': ([480], 900), 'team-rafael': ([480], 900), 'team-camila': ([480], 900),
    'clinic-corridor': ([800, 1100], 1400), 'clinic-lounge': ([800, 1100], 1500),
    'clinic-room': ([480], 900), 'clinic-chair': ([480], 900),
    'clinic-detail': ([360], 700), 'clinic-light': ([360], 700),
    'consult': ([560], 1100),
    **{f'tr-{n}': ([480], 900) for n in ['implantes', 'lentes', 'alinhadores', 'clareamento', 'reabilitacao', 'preventiva']},
}

def save(im, path, w):
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=Q, method=6)
    return im.size

def sidecar(path, src_name, note):
    base = json.load(open(os.path.join(SRC, src_name + '.webp.json'), encoding='utf-8'))
    base['prompt'] = f"{note} of {src_name}.webp. " + base['prompt']
    json.dump(base, open(path + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

os.makedirs(SRC, exist_ok=True)
for name, (smaller, wmax) in PLAN.items():
    src = os.path.join(SRC, name + '.webp')
    if not os.path.exists(src):  # first run: keep the original as the source of truth
        shutil.copy2(os.path.join(OUT, name + '.webp'), src)
        shutil.copy2(os.path.join(OUT, name + '.webp.json'), src + '.json')
    im = Image.open(src).convert('RGB')
    size = save(im, os.path.join(OUT, name + '.webp'), wmax)
    sidecar(os.path.join(OUT, name + '.webp'), name, f'Resized and re-encoded (WebP q{Q}, {size[0]}w) variant')
    for w in smaller:
        p = os.path.join(OUT, f'{name}-{w}.webp')
        save(im, p, w)
        sidecar(p, name, f'Resized (WebP q{Q}, {w}w) variant')
    if name.startswith('tr-'):
        p = os.path.join(OUT, f'{name}-thumb.webp')
        ImageOps.fit(im, (264, 330), Image.LANCZOS).save(p, 'WEBP', quality=Q, method=6)
        sidecar(p, name, 'Center-cropped 264x330 thumbnail')
    print(f'{name:22} {size}')
