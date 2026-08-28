"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import styles from "./inspirations.module.css";
import btnStyles from "@/styles/components/buttons.module.css";

export default function InspirationsClient() {
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchInspirations();
  }, []);

  const fetchInspirations = async () => {
    try {
      const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInspirations(data || []);
    } catch (error) {
      console.error("Error fetching inspirations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('custom-nails-inspo')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('custom-nails-inspo')
        .getPublicUrl(filePath);

      // 3. Insert into database
      const { error: dbError } = await supabase
        .from('inspirations')
        .insert([{ image_url: publicUrl }]);

      if (dbError) throw dbError;

      // Refresh list
      fetchInspirations();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload inspiration image.");
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this inspiration?")) return;

    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // 2. Extract filename and delete from storage
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('custom-nails-inspo')
        .remove([fileName]);

      // Refresh list
      setInspirations(inspirations.filter(insp => insp.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete inspiration.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Inspirations</h1>
          <p className={styles.subtitle}>Upload gallery images for buyers to select during Custom Orders.</p>
        </div>
        <div>
          <input 
            type="file" 
            id="upload-inspiration" 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label htmlFor="upload-inspiration" className={`${btnStyles.btn} ${btnStyles.primary}`}>
            {uploading ? "Uploading..." : <><Plus size={18} /> Upload Image</>}
          </label>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading inspirations...</div>
      ) : inspirations.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={48} color="var(--color-text-tertiary)" style={{ marginBottom: "16px" }} />
          <h3>No inspirations yet</h3>
          <p>Upload some gorgeous nail designs to inspire your customers!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {inspirations.map((insp) => (
            <div key={insp.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={insp.image_url} alt="Nail Inspiration" fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.image} style={{ objectFit: 'cover' }} />
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(insp.id, insp.image_url)}
                  title="Delete inspiration"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
