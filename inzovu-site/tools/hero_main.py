"""Hero cut-out for hero-main.jpg (blue sky + white clouds + white building).
GrabCut seeded with: blue pixels = sure sky, dark non-blue pixels = sure building/ground.
Then: keep only foreground connected to the ground, fill sky holes not connected to the top edge, feather."""
import os, cv2, numpy as np
from PIL import Image
import assets

SRC = os.path.join(assets.SRC, "images", "hero-main.jpg")
im = cv2.imread(SRC); h, w = im.shape[:2]
b, g, r = [im[..., i].astype(int) for i in range(3)]
lum = (r * 299 + g * 587 + b * 114) // 1000
blue = (b - np.maximum(r, g) > 14)                 # any blue-dominant pixel is sky, however dark
dark = (lum < 110) & ~blue

mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
mask[int(h * 0.55):, :] = cv2.GC_PR_FGD
mask[blue] = cv2.GC_BGD
sure = cv2.dilate(dark.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
mask[sure & ~blue] = cv2.GC_FGD
bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(im, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
fg = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype(np.uint8)
fg[blue] = 0

# foreground must touch the ground — or be the palm frond hanging in from the right edge
n, lab, stats, _ = cv2.connectedComponentsWithStats(fg)
keep = set(np.unique(lab[-3:, :])) - {0}
for i in range(1, n):
    x, y, cw, ch, area = stats[i]
    if x + cw >= w - 2 and y < h * 0.4 and area > 4000: keep.add(i)
fg = np.isin(lab, list(keep)).astype(np.uint8)
# sky must touch the top edge (fills window specks inside the towers)
n2, lab2 = cv2.connectedComponents(1 - fg)
keep2 = set(np.unique(lab2[0:3, :])) - {0}
sky = np.isin(lab2, list(keep2)).astype(np.float32)
sky = cv2.GaussianBlur(sky, (0, 0), 0.8)

rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
bg_img = Image.fromarray(rgb)
fg_img = Image.fromarray(np.dstack([rgb, ((1 - sky) * 255).astype(np.uint8)]), "RGBA")

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "img")
# no grade: the hero keeps the render's own daylight
bg_img.save(os.path.join(OUT, "hero-main-bg.webp"), "WEBP", quality=88)
fg_img.save(os.path.join(OUT, "hero-main-fg.webp"), "WEBP", quality=90)

S = r"C:/Users/owner/AppData/Local/Temp/claude/C--Users-owner-Documents-INZOVU/4654cc07-c97f-4a79-b374-6db3bb2852d0/scratchpad"
chk = im.copy(); chk[sky > 0.5] = (255, 0, 255)
cv2.imwrite(os.path.join(S, "gc_check.jpg"), chk)
print("hero-main written")
