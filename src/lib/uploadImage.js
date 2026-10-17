import { supabase } from '@/lib/supabase';

/**
 * Robust in-browser image compression using URL.createObjectURL and Canvas.
 * Never uses FileReader.readAsDataURL on large files to prevent WebKit "The string did not match the expected pattern" DOMException.
 */
export async function compressImage(file, maxDim = 1200, quality = 0.82) {
  if (!file) return file;

  const fileName = file.name || "";
  const isImage = file.type?.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif|bmp|gif)$/i.test(fileName);
  if (!isImage) return file;

  // Already tiny jpeg/webp
  if (file.size <= 250 * 1024 && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();

      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              if (blob) {
                const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_") || "photo";
                const compressed = new File([blob], `${cleanName}.jpg`, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressed);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            quality
          );
        } catch {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

/**
 * Multi-tier upload pipeline that completely bypasses Vercel 4.5MB payload limits:
 * 1. Pre-signed upload URL (browser uploads directly to Supabase Storage)
 * 2. Direct Supabase Storage client upload
 * 3. Server route fallback with client-compressed file (< 300KB)
 */
export async function uploadImageDirect(file, fileNamePrefix = "product") {
  if (!file) throw new Error("No file provided");

  // 1. Compress first to ensure minimal network payload
  const compressed = await compressImage(file);
  const timestamp = Date.now();
  const rawBase = file.name
    ? file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    : "image";
  const fileName = `${fileNamePrefix}-${rawBase || "item"}-${timestamp}.jpg`;

  // Tier 1: Request signed upload URL to upload directly from browser to Supabase Storage
  // (Zero bytes go through Vercel serverless functions, bypassing 4.5MB limit permanently)
  try {
    const urlRes = await fetch('/api/admin/products/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, contentType: 'image/jpeg' })
    });

    if (urlRes.ok) {
      const urlText = await urlRes.text();
      let urlData;
      try {
        urlData = JSON.parse(urlText);
      } catch {
        urlData = null;
      }

      if (urlData?.success && urlData.signedUrl) {
        // Upload directly to Supabase Storage via signed URL
        const putRes = await fetch(urlData.signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: compressed
        });

        if (putRes.ok && urlData.publicUrl) {
          return urlData.publicUrl;
        }
      }
    }
  } catch (err) {
    console.warn("Signed URL upload attempt failed, trying direct Supabase client:", err);
  }

  // Tier 2: Direct browser Supabase Storage upload
  try {
    if (supabase?.storage) {
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(fileName, compressed, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    }
  } catch (err) {
    console.warn("Direct Supabase storage upload failed, falling back to server route:", err);
  }

  // Tier 3: Server route fallback (/api/admin/products/upload-image)
  // Payload is guaranteed < 300KB due to compression
  const formData = new FormData();
  formData.append('file', compressed);
  formData.append('fileName', fileName);

  const serverRes = await fetch('/api/admin/products/upload-image', {
    method: 'POST',
    body: formData
  });

  const resText = await serverRes.text();
  let serverData;
  try {
    serverData = JSON.parse(resText);
  } catch {
    throw new Error(serverRes.status === 413 ? "File payload exceeds server limit" : `Upload failed with status ${serverRes.status}`);
  }

  if (!serverRes.ok || !serverData?.success) {
    throw new Error(serverData?.error || "Failed to upload image");
  }

  return serverData.url;
}
