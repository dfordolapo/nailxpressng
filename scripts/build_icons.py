from PIL import Image

logo = Image.open("public/images/splash-logo.png")

def make_transparent_icon(sz):
    # Completely transparent background as provided by user
    canvas = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    
    lw = int(sz * 0.88)
    lh = int(lw * logo.height / logo.width)
    if lh > sz * 0.88:
        lh = int(sz * 0.88)
        lw = int(lh * logo.width / logo.height)
        
    resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    pos_x = (sz - lw) // 2
    pos_y = (sz - lh) // 2
    canvas.paste(resized, (pos_x, pos_y), resized)
    return canvas

icon512 = make_transparent_icon(512)
icon512.save("public/icons/icon-512x512.png", "PNG")

icon192 = make_transparent_icon(192)
icon192.save("public/icons/icon-192x192.png", "PNG")

icon180 = make_transparent_icon(180)
icon180.save("public/splash/apple-icon-180.png", "PNG")

print("Generated transparent PWA icons successfully!")
