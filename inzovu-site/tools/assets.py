"""Asset pipeline: dusk grade, hero sky cut-out, WebP conversion, film frame sequences."""
import os, subprocess, shutil
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

SRC = r"C:\Users\owner\Documents\INZOVU\site-capture"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets")
IMG = os.path.join(OUT, "img"); FR = os.path.join(OUT, "frames"); VID = os.path.join(OUT, "video"); FONT = os.path.join(OUT, "fonts")
for d in (IMG, FR, VID, FONT): os.makedirs(d, exist_ok=True)

# ---------- dusk grade ----------
def dusk(im: Image.Image, strength=1.0) -> Image.Image:
    """Golden-hour grade: warm highlights, cool lifted shadows, gentle vignette, slight contrast."""
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255.0
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    lum = lum[..., None]
    warm = np.array([1.10, 0.96, 0.80], dtype=np.float32)   # highlight tint (amber)
    cool = np.array([0.86, 0.92, 1.10], dtype=np.float32)   # shadow tint (blue)
    tint = cool + (warm - cool) * np.clip(lum, 0, 1)
    g = a * (1 + (tint - 1) * strength)
    # s-curve contrast
    g = np.clip(g, 0, 1)
    g = g * g * (3 - 2 * g) * 0.35 + g * 0.65
    # darken overall a touch (evening)
    g = g ** (1.0 + 0.12 * strength)
    # vignette
    h, w = g.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    v = 1 - np.clip((r - 0.55) / 0.9, 0, 1) ** 2 * 0.35 * strength
    g = g * v[..., None]
    out = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8))
    out = ImageEnhance.Color(out).enhance(1.0 + 0.1 * strength)
    return out

def save_webp(im, name, w=None, q=82):
    if w and im.width > w:
        im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(IMG, name), "WEBP", quality=q, method=6)

# ---------- hero sky cut-out ----------
def sky_cutout(path):
    """Return (background, foreground RGBA) for a render shot against blue sky."""
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # sky: blue dominant, bright-ish; the building is white/grey (r≈g≈b), greenery is green
    blue = (b - np.maximum(r, g))
    bright = (r + g + b) / 3
    sky = (blue > 18) & (bright > 90)
    # soften mask edges
    m = Image.fromarray((sky * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    m = np.asarray(m).astype(np.float32) / 255
    # foreground alpha = 1 - sky
    fg = np.dstack([a, (1 - m) * 255]).astype(np.uint8)
    return im, Image.fromarray(fg, "RGBA")

def sky_cutout_flood(path, tol=5):
    """Sky cut-out for pale/gradient skies.
    1. Rough sky seed: flood-fill from the top edge on a smoothed copy.
    2. Fit a 2-D quadratic colour model of the sky to the seed (the sky is a smooth gradient).
    3. Classify every pixel by distance to the model -> keeps palm fronds and Ferris-wheel spokes intact.
    4. Keep only sky connected to the top edge, so balconies that happen to match stay opaque.
    5. Feather."""
    import cv2
    im = Image.open(path).convert("RGB")
    a = np.asarray(im)
    h, w = a.shape[:2]
    sm = cv2.bilateralFilter(a, 7, 30, 7)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY
    for x in range(0, w, 8):
        if mask[1, x + 1] == 0:
            cv2.floodFill(sm.copy(), mask, (x, 0), 0, (tol,) * 3, (tol,) * 3, flags)
    seed = mask[1:-1, 1:-1] > 0
    seed = cv2.erode(seed.astype(np.uint8), np.ones((15, 15), np.uint8)) > 0   # trust only the deep sky
    ys, xs = np.nonzero(seed)
    X = np.stack([np.ones_like(xs), xs / w, ys / h, (xs / w) ** 2, (ys / h) ** 2, (xs / w) * (ys / h)], 1).astype(np.float64)
    coef, *_ = np.linalg.lstsq(X, a[ys, xs].astype(np.float64), rcond=None)
    gy, gx = np.mgrid[0:h, 0:w]
    Xa = np.stack([np.ones(h * w), gx.ravel() / w, gy.ravel() / h, (gx.ravel() / w) ** 2, (gy.ravel() / h) ** 2, (gx.ravel() / w) * (gy.ravel() / h)], 1)
    model = (Xa @ coef).reshape(h, w, 3)
    dist = np.abs(a.astype(np.float64) - model).max(2)
    thr = 14 + 26 * (gy / h) ** 2          # clouds gather at the horizon: be more forgiving lower down
    sky = (dist < thr).astype(np.uint8)
    # only sky that touches the top edge
    n, lab = cv2.connectedComponents(sky)
    keep = set(np.unique(lab[0:3, :])) - {0}
    m = np.isin(lab, list(keep)).astype(np.float32)
    # stray specks (cloud fragments) that float free of the ground become sky
    fgm = (1 - m).astype(np.uint8)
    n2, lab2, stats, _ = cv2.connectedComponentsWithStats(fgm)
    for i in range(1, n2):
        x, y, cw, ch, area = stats[i]
        if area < 600 and y + ch < h - 2: m[lab2 == i] = 1
    # close hairline cracks inside the sky (jpeg noise), then feather
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 0.8)
    fg = np.dstack([a, ((1 - m) * 255).astype(np.uint8)])
    return im, Image.fromarray(fg, "RGBA")

def run_images():
    # hero cut-outs: projet10 (wide, signage, low angle) and p3 (hotel tower, tall crop)
    for src, name in {"projet10": "hero", "p3": "hero-tall", "projet4": "hero-alt"}.items():
        fn = sky_cutout_flood if src == "projet4" else sky_cutout
        bg, fg = fn(os.path.join(SRC, "images", src + ".jpg"))
        dusk(bg, 1.0).save(os.path.join(IMG, f"{name}-bg.webp"), "WEBP", quality=86)
        fgd = dusk(fg.convert("RGB"), 1.0)
        Image.merge("RGBA", (*fgd.split(), fg.split()[3])).save(os.path.join(IMG, f"{name}-fg.webp"), "WEBP", quality=86)
    # already-dusk renders: light touch only
    for src, name in {"projet6": "rooftop-night", "projet9": "pool-sunset", "projet5": "terrace-dome", "projet7": "terrace-hills"}.items():
        save_webp(dusk(Image.open(os.path.join(SRC, "images", src + ".jpg")), 0.3), f"{name}.webp", w=1600, q=86)
    # floor plans: keep clean, no grade
    for i, name in zip(range(9, 14), ["plan-ground", "plan-first", "plan-second", "plan-hotel", "plan-office"]):
        save_webp(Image.open(os.path.join(SRC, "images", f"p{i}.jpg")), f"{name}.webp", w=1600, q=88)

    graded = {
        "projet1": "aerial", "projet2": "aerial-2", "p1": "plaza", "p2": "plaza-2", "p3": "plaza-3",
        "commerces1": "shops-1", "commerces2": "shops-2", "commerces3": "shops-3",
        "affaires1": "business-1", "affaires2": "business-2", "affaires3": "business-3",
        "restauration1": "dining-1", "restauration2": "dining-2", "restauration3": "dining-3",
        "hotal1": "hotel-room", "hotel2": "hotel-room-2", "header-tourisme": "hotel-wide",
        "header-loisirs": "leisure-wide", "header-affaires": "business-wide", "header-commerces": "shops-wide",
        "header-restauration": "dining-wide", "header-projet": "project-wide", "header-acces": "access-wide",
        "p4": "plaza-4", "p5": "plaza-5", "p6": "plaza-6", "p7": "plaza-7", "p8": "plaza-8", "p9": "plaza-9",
        "p10": "plaza-10", "p11": "plaza-11", "p12": "plaza-12", "p13": "plaza-13",
        "projet3": "project-3", "projet4": "project-4", "projet5": "project-5", "projet6": "project-6",
        "projet7": "project-7", "projet8": "project-8", "projet9": "project-9", "projet10": "project-10",
        "affaires4": "business-4", "affaires5": "business-5", "affaires6": "business-6",
        "pro2": "tall-2", "pro3": "tall-3", "pro4": "tall-4", "pro5": "tall-5", "pro6": "tall-6",
    }
    for src, name in graded.items():
        p = os.path.join(SRC, "images", src + ".jpg")
        if not os.path.exists(p): continue
        im = Image.open(p)
        save_webp(dusk(im, 0.9), f"{name}.webp", w=1600)
    # construction photos: keep natural but slightly graded (earth should stay red)
    for i in range(1, 5):
        im = Image.open(os.path.join(SRC, "images", f"chantier{i}.jpg"))
        save_webp(dusk(im, 0.4), f"site-{i}.webp", w=1600)
    # black textures, access map
    for src, name in {"bgblack1": "tex-dark-1", "bgblack2": "tex-dark-2", "access": "access-map"}.items():
        save_webp(Image.open(os.path.join(SRC, "images", src + ".jpg")), f"{name}.webp", w=2000, q=80)
    # sister projects thumbs
    for src in ["sama", "riviera", "sadi", "lome", "saintpaul", "invozu"]:
        save_webp(dusk(Image.open(os.path.join(SRC, "images", src + ".jpg")), 0.6), f"proj-{src}.webp", q=85)
    # partner logos -> keep as is
    for f in os.listdir(os.path.join(SRC, "brand", "partner-logos")):
        save_webp(Image.open(os.path.join(SRC, "brand", "partner-logos", f)), "partner-" + os.path.splitext(f)[0].replace("logo-", "") + ".webp", q=90)
    # brand logos / tenant strip (01..08 are tenant logos)
    shutil.copy(os.path.join(SRC, "brand", "logos", "Logo-Inzovu.svg"), os.path.join(IMG, "logo.svg"))
    shutil.copy(os.path.join(SRC, "brand", "logos", "fav.png"), os.path.join(OUT, "..", "favicon.png"))
    for i in range(1, 9):
        save_webp(Image.open(os.path.join(SRC, "images", f"0{i}.jpg")), f"tenant-{i}.webp", q=90)

def run_fonts():
    for f in ["GeneralSans-Regular.ttf", "GeneralSans-Medium.ttf", "GeneralSans-Semibold.ttf"]:
        shutil.copy(os.path.join(SRC, "fonts", f), os.path.join(FONT, f))

# ---------- frames ----------
def run_frames():
    film = os.path.join(SRC, "video", "Inzovu-Mall_Animation.mp4")
    # Approach sequence 6s -> 18s, 16 fps => 192 frames, 1280 wide, graded via ffmpeg curves
    seq = os.path.join(FR, "approach"); os.makedirs(seq, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "6", "-t", "12", "-i", film,
                    "-vf", "fps=16,scale=1280:-2,colorbalance=rs=.06:gs=0:bs=-.08:rh=.08:gh=.02:bh=-.1,eq=contrast=1.06:saturation=1.05:gamma=0.96,vignette=PI/5",
                    "-c:v", "libwebp", "-quality", "64", os.path.join(seq, "f_%03d.webp")], check=True)

def run_video():
    inv = os.path.join(SRC, "video", "Invozu.mp4")
    # satellite zoom 2.0s -> 8.0s as a small muted mp4 + webm
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "2.2", "-t", "5.6", "-i", inv, "-an",
                    "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                    os.path.join(VID, "satellite.mp4")], check=True)
    # ferris wheel loop 24s -> 29s
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "24", "-t", "5.5", "-i", inv, "-an",
                    "-vf", "scale=1280:-2,colorbalance=rs=.06:bs=-.08:rh=.08:bh=-.1,eq=contrast=1.05:gamma=0.95", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                    os.path.join(VID, "ferris.mp4")], check=True)
    film = os.path.join(SRC, "video", "Inzovu-Mall_Animation.mp4")
    # plaza life loop 42s -> 54s
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "42", "-t", "12", "-i", film, "-an",
                    "-vf", "scale=1280:-2,colorbalance=rs=.06:bs=-.08:rh=.08:bh=-.1,eq=contrast=1.05:gamma=0.95", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                    os.path.join(VID, "plaza.mp4")], check=True)
    # rooftop pool 36s -> 42s
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "36", "-t", "6", "-i", film, "-an",
                    "-vf", "scale=1280:-2,colorbalance=rs=.08:bs=-.1:rh=.1:bh=-.12,eq=contrast=1.08:gamma=0.9", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                    os.path.join(VID, "pool.mp4")], check=True)

if __name__ == "__main__":
    import sys
    what = sys.argv[1:] or ["images", "fonts", "frames", "video"]
    if "images" in what: run_images(); print("images ok")
    if "fonts" in what: run_fonts(); print("fonts ok")
    if "frames" in what: run_frames(); print("frames ok")
    if "video" in what: run_video(); print("video ok")
