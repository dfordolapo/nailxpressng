from PIL import Image

logo = Image.open("public/images/splash-logo.png")

def make_transparent_sq(sz):
    canvas = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    lw = int(sz * 0.92)
    lh = int(lw * logo.height / logo.width)
    if lh > sz * 0.92:
        lh = int(sz * 0.92)
        lw = int(lh * logo.width / logo.height)
    resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    pos_x = (sz - lw) // 2
    pos_y = (sz - lh) // 2
    canvas.paste(resized, (pos_x, pos_y), resized)
    return canvas

# Save app/icon.png (Next.js App Router icon convention)
icon_png = make_transparent_sq(512)
icon_png.save("src/app/icon.png", "PNG")

# Save app/favicon.ico (Multi-size ICO format)
ico_32 = make_transparent_sq(32)
ico_32.save("src/app/favicon.ico", format="ICO", sizes=[(16,16), (32,32), (48,48), (64,64)])

print("Successfully updated src/app/icon.png and src/app/favicon.ico with transparent logo!")
