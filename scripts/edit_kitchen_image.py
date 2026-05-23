#!/usr/bin/env python3
"""Selective kitchen project image edit: white matte ceiling, weathered brick backsplash."""

import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

INPUT_PATH = "/Users/ricardodebiase/Documents/pixel-renovations/site/public/projects/project-kitchen-transformations.jpg"
OUTPUT_PATH = INPUT_PATH


def build_masks(img_bgr):
    """Create ceiling and backsplash masks via color + geometry."""
    h, w = img_bgr.shape[:2]
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    L, A, B = cv2.split(lab)
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    r, g, b_ch = cv2.split(img_rgb)

    bright = L > 215
    sat = hsv[:, :, 1]
    hue = hsv[:, :, 0]

    # Charcoal cabinets: neutral grey-brown, low saturation
    neutral = (
        (np.abs(r.astype(np.int16) - g.astype(np.int16)) < 14)
        & (np.abs(g.astype(np.int16) - b_ch.astype(np.int16)) < 14)
        & (np.abs(r.astype(np.int16) - b_ch.astype(np.int16)) < 18)
    )
    cabinet = neutral & (sat < 45) & (L > 32) & (L < 120)

    # Green marble / sage wall — high saturation separates from charcoal cabinets
    green_wall = (
        (hue >= 26)
        & (hue <= 95)
        & (sat > 35)
        & (g.astype(np.int16) > b_ch.astype(np.int16) - 4)
        & (L > 18)
        & (L < 178)
    )

    ceiling_geo = np.zeros((h, w), dtype=bool)
    ceiling_geo[:158, :] = True
    ceiling_surface = ceiling_geo & ~bright & ~cabinet & (L > 40) & (L < 210)

    backsplash_geo = np.zeros((h, w), dtype=bool)
    backsplash_geo[158:700, :] = True
    backsplash = green_wall & backsplash_geo & ~bright & ~cabinet

    window_geo = np.zeros((h, w), dtype=bool)
    window_geo[240:560, 420:820] = True
    window = window_geo & (b_ch.astype(np.int16) > r.astype(np.int16) + 5) & (sat < 90)
    backsplash[window] = False

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    erode_k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))

    def feather(mask_bool, erode=False):
        m = mask_bool.astype(np.uint8) * 255
        if erode:
            m = cv2.erode(m, erode_k, iterations=1)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, kernel)
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, kernel)
        m = cv2.GaussianBlur(m, (7, 7), 0)
        return m.astype(np.float32) / 255.0

    ceiling_m = feather(ceiling_surface)
    backsplash_m = feather(backsplash, erode=True)
    backsplash_m[cabinet] = 0.0
    ceiling_m[cabinet] = 0.0

    return ceiling_m, backsplash_m, L.astype(np.float32)


def generate_weathered_brick(w, h, seed=42):
    """Procedural old red brick texture — strictly red/brown weathered palette."""
    rng = np.random.default_rng(seed)

    brick_colors = np.array(
        [
            [108, 38, 32],   # deep weathered red
            [128, 48, 38],   # dark red-brown
            [142, 58, 44],   # aged terracotta
            [92, 32, 28],    # burnt umber red
            [118, 44, 36],   # faded brick
            [135, 52, 40],   # sun-bleached
            [98, 36, 30],    # shadow face
            [115, 42, 34],   # mortar-stained
            [148, 62, 48],   # lighter weathered edge
            [88, 30, 26],    # deep shadow
        ],
        dtype=np.float32,
    )
    mortar_color = np.array([172, 162, 148], dtype=np.float32)

    brick_h, brick_w = 22, 50
    mortar = 3
    rows = h // (brick_h + mortar) + 4
    cols = w // (brick_w + mortar) + 4

    tex_h = rows * (brick_h + mortar)
    tex_w = cols * (brick_w + mortar)
    texture = np.zeros((tex_h, tex_w, 3), dtype=np.float32)
    texture[:] = mortar_color

    for row in range(rows):
        offset = (brick_w // 2 + 2) if row % 2 else 0
        for col in range(cols):
            x0 = col * (brick_w + mortar) + offset
            y0 = row * (brick_h + mortar)
            x1, y1 = x0 + brick_w, y0 + brick_h
            if x1 > tex_w or y1 > tex_h:
                continue

            base = brick_colors[rng.integers(0, len(brick_colors))]
            color = np.clip(base + rng.uniform(-14, 14, 3), 0, 255)
            patch = np.full((brick_h, brick_w, 3), color, dtype=np.float32)

            # Surface noise + weathering
            patch += rng.normal(0, 10, (brick_h, brick_w, 1))
            patch = np.clip(patch, 0, 255)

            # Edge shadow toward mortar
            for dy, dx, factor in [(0, slice(None), 0.84), (-1, slice(None), 0.90), (slice(None), 0, 0.86), (slice(None), -1, 0.92)]:
                patch[dy, dx] *= factor

            # Random chips / lime deposits
            if rng.random() < 0.28:
                cy, cx = rng.integers(3, brick_h - 4), rng.integers(3, brick_w - 4)
                patch[cy : cy + 3, cx : cx + 4] += rng.uniform(10, 25)
            if rng.random() < 0.15:
                cy, cx = rng.integers(3, brick_h - 4), rng.integers(3, brick_w - 4)
                patch[cy : cy + 2, cx : cx + 3] -= rng.uniform(8, 18)

            texture[y0:y1, x0:x1] = patch

    # Global aging
    fine = rng.normal(0, 5, texture.shape).astype(np.float32)
    coarse = cv2.GaussianBlur(rng.normal(0, 8, texture.shape).astype(np.float32), (0, 0), 6)
    texture = np.clip(texture + fine + coarse * 0.45, 0, 255)

    # Mortar grime lines
    for row in range(rows):
        y = row * (brick_h + mortar) + brick_h
        if y + mortar < tex_h:
            grime = rng.uniform(0.86, 0.95)
            texture[y : y + mortar + 1, :, :] *= grime

    texture = cv2.resize(texture[: h + 50, : w + 50], (w, h), interpolation=cv2.INTER_AREA)
    return np.clip(texture, 0, 255).astype(np.uint8)


def apply_white_matte_ceiling(img_rgb, mask, luminance):
    """White matte ceiling preserving lighting gradation and recessed-light halos."""
    result = img_rgb.astype(np.float32)
    h, w = img_rgb.shape[:2]

    white_cool = np.array([250, 248, 244], dtype=np.float32)
    white_warm = np.array([252, 250, 246], dtype=np.float32)

    ceil_mask = mask > 0.08
    if np.any(ceil_mask):
        L_ceil = luminance[ceil_mask]
        p5, p95 = np.percentile(L_ceil, [8, 92])
    else:
        p5, p95 = 50, 180
    span = max(p95 - p5, 1.0)

    L_norm = np.clip((luminance - p5) / span, 0, 1)
    # Matte rolloff — keep shadows, soften hot spots
    L_mapped = 0.72 + 0.28 * np.power(L_norm, 0.82)

    # Subtle matte micro-texture
    rng = np.random.default_rng(11)
    micro = cv2.GaussianBlur(rng.normal(0, 2.5, (h, w)).astype(np.float32), (3, 3), 0)
    L_mapped = np.clip(L_mapped + micro * 0.015, 0.55, 1.0)

    white = white_cool[None, None, :] * (1 - L_norm[:, :, None] * 0.15) + white_warm[None, None, :] * (
        L_norm[:, :, None] * 0.15
    )

    for c in range(3):
        matte = white[:, :, c] * L_mapped
        result[:, :, c] = result[:, :, c] * (1 - mask) + matte * mask

    # Recessed light halos
    glow = (luminance > 195).astype(np.float32)
    glow = cv2.GaussianBlur(glow, (21, 21), 0)
    glow *= mask
    for c in range(3):
        result[:, :, c] = np.clip(result[:, :, c] + glow * (255 - result[:, :, c]) * 0.12, 0, 255)

    return np.clip(result, 0, 255).astype(np.uint8)


def apply_brick_backsplash(img_rgb, mask, luminance, brick_tex):
    """LAB compositing: scene luminance + brick chrominance for lighting coherence."""
    orig_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB).astype(np.float32)
    brick_lab = cv2.cvtColor(brick_tex, cv2.COLOR_RGB2LAB).astype(np.float32)

    L_orig = orig_lab[:, :, 0]
    L_brick = brick_lab[:, :, 0]

    # Inject brick surface detail into luminance while preserving scene lighting envelope
    brick_detail = L_brick - cv2.GaussianBlur(L_brick, (0, 0), 12)
    L_out = L_orig + brick_detail * 0.38
    L_out = np.clip(L_out, 0, 255)

    # Use brick chrominance entirely (no green bleed)
    a_out = brick_lab[:, :, 1]
    b_out = brick_lab[:, :, 2]

    out_lab = orig_lab.copy()
    m = mask[:, :, None]
    out_lab[:, :, 0] = L_orig * (1 - mask) + L_out * mask
    out_lab[:, :, 1] = orig_lab[:, :, 1] * (1 - mask) + a_out * mask
    out_lab[:, :, 2] = orig_lab[:, :, 2] * (1 - mask) + b_out * mask

    result = cv2.cvtColor(np.clip(out_lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)

    # Under-cabinet lighting warmth preserved via luminance — slight warm tint in lit zones
    lit = (luminance > 100).astype(np.float32) * mask
    lit = cv2.GaussianBlur(lit, (9, 9), 0)
    warm = np.array([8, 4, -2], dtype=np.float32)
    for c in range(3):
        result[:, :, c] = np.clip(result[:, :, c].astype(np.float32) + lit * warm[c], 0, 255)

    return result.astype(np.uint8)


def enhance_realism(img_rgb, ceiling_mask, backsplash_mask):
    """Subtle global photo finishing."""
    pil = Image.fromarray(img_rgb)

    sharpened = pil.filter(ImageFilter.UnsharpMask(radius=1.1, percent=85, threshold=2))
    sharpened = ImageEnhance.Contrast(sharpened).enhance(1.035)
    sharpened = ImageEnhance.Color(sharpened).enhance(1.025)

    result = np.array(sharpened).astype(np.float32)
    orig = img_rgb.astype(np.float32)

    # Bilateral-style smoothing on flat cabinet faces (reduce AI plastic look)
    smooth = cv2.bilateralFilter(img_rgb, 5, 25, 25).astype(np.float32)
    flat = (ceiling_mask + backsplash_mask) < 0.05
    flat = flat.astype(np.float32)
    flat = cv2.GaussianBlur(flat, (7, 7), 0)

    for c in range(3):
        result[:, :, c] = result[:, :, c] * 0.82 + smooth[:, :, c] * flat * 0.08 + orig[:, :, c] * (1 - 0.82 - flat * 0.08)

    # Film grain on large edited surfaces
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 1.0, result.shape).astype(np.float32)
    surface = np.maximum(ceiling_mask, backsplash_mask)
    surface = cv2.GaussianBlur(surface, (5, 5), 0)
    result += grain * surface[:, :, None] * 0.2

    return np.clip(result, 0, 255).astype(np.uint8)


def main():
    img_bgr = cv2.imread(INPUT_PATH)
    if img_bgr is None:
        raise SystemExit(f"Cannot read {INPUT_PATH}")

    h, w = img_bgr.shape[:2]
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    ceiling_mask, backsplash_mask, luminance = build_masks(img_bgr)

    img_rgb = apply_white_matte_ceiling(img_rgb, ceiling_mask, luminance)

    brick_tex = generate_weathered_brick(w, h, seed=42)
    img_rgb = apply_brick_backsplash(img_rgb, backsplash_mask, luminance, brick_tex)

    img_rgb = enhance_realism(img_rgb, ceiling_mask, backsplash_mask)

    out_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(OUTPUT_PATH, out_bgr, [cv2.IMWRITE_JPEG_QUALITY, 93])

    print(f"Saved: {OUTPUT_PATH}")
    print(f"Ceiling mask coverage: {ceiling_mask.mean()*100:.1f}%")
    print(f"Backsplash mask coverage: {backsplash_mask.mean()*100:.1f}%")


if __name__ == "__main__":
    main()
