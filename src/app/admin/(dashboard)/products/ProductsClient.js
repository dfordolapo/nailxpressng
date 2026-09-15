"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Upload, 
  Download, 
  X, 
  Check, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Package, 
  AlertCircle 
} from "lucide-react";
import styles from "@/styles/admin.module.css";
import { formatPrice } from "@/lib/utils";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

function ProductsContent({ initialProducts = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const activeTab = collectionParam === "handmade" ? "Handmade" : collectionParam === "factory" ? "Factory Made" : "All";
  
  const [productsList, setProductsList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  // Continuous scrolling state
  const [displayCount, setDisplayCount] = useState(25);
  const observerTarget = useRef(null);

  // Excel-like Header Filtering and Sorting State
  const [activePopover, setActivePopover] = useState(null); // 'name' | 'category' | 'price' | 'stock' | 'availability' | 'featured'
  const [columnFilters, setColumnFilters] = useState({
    name: [],
    category: [],
    price: [],
    stock: [],
    availability: [],
    featured: [],
  });
  const [columnSearch, setColumnSearch] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // { key: 'price', direction: 'asc'|'desc' }

  // Bulk Upload Modal State
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState("gallery"); // "gallery" | "spreadsheet"
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  
  // Gallery multi-image state
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState("Handmade");
  const [defaultPrice, setDefaultPrice] = useState("12000");
  const [defaultStock, setDefaultStock] = useState("10");
  const [defaultShape, setDefaultShape] = useState("Square");
  const [defaultLength, setDefaultLength] = useState("Medium");

  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkError, setBulkError] = useState(null);
  const [bulkSuccess, setBulkSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Handle Multiple Gallery Images Selection
  const handleGallerySelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedGalleryFiles(files);
    setBulkError(null);
    setBulkSuccess(null);

    const previews = files.map(file => {
      const rawName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]+/g, " ")
        .trim();
      const title = rawName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        name: title || "New Nail Set",
      };
    });

    setGalleryPreviews(previews);
  };

  const removeGalleryImage = (index) => {
    setSelectedGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateGalleryItemName = (index, newName) => {
    setGalleryPreviews(prev => prev.map((item, i) => i === index ? { ...item, name: newName } : item));
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.kebabMenu}`) && !e.target.closest(`.${styles.excelPopover}`) && !e.target.closest(`.${styles.excelFilterBtn}`)) {
        setOpenMenuId(null);
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Continuous scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + 25);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, []);

  const handleMenuClick = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/products/${productToDelete}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete product");
        }
        setProductsList(prev => prev.filter(p => p.id !== productToDelete));
        setProductToDelete(null);
      } catch (err) {
        console.error(err);
        alert(`Error deleting product: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDuplicate = (id) => {
    const product = productsList.find(p => p.id === id);
    if (product) {
      const newProduct = { ...product, id: `temp-${Date.now()}`, name: product.name + " (Copy)" };
      setProductsList(prev => [newProduct, ...prev]);
    }
    setOpenMenuId(null);
  };

  const handleToggleFeature = async (id) => {
    const product = productsList.find(p => p.id === id);
    if (!product) return;
    const nextVal = !product.bestseller;

    setProductsList(prev => prev.map(p => p.id === id ? { ...p, bestseller: nextVal, featured: nextVal } : p));
    setOpenMenuId(null);

    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bestseller: nextVal })
      });
    } catch (e) {
      console.error('Failed to update featured state', e);
    }
  };

  // Toggle In Stock / Out of Stock
  const handleToggleStock = async (id) => {
    const product = productsList.find(p => p.id === id);
    if (!product) return;

    const currentlyInStock = product.stockCount > 0 && product.inStock;
    const newStockCount = currentlyInStock ? 0 : 10;
    const newInStock = newStockCount > 0;

    // Optimistic UI update
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, stockCount: newStockCount, inStock: newInStock } : p));
    setOpenMenuId(null);
    setUpdatingStockId(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_count: newStockCount })
      });
      if (!res.ok) throw new Error("Failed to update stock");
    } catch (err) {
      console.error(err);
      alert("Error updating stock status: " + err.message);
      // Revert if failed
      setProductsList(prev => prev.map(p => p.id === id ? product : p));
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/products/new?edit=${id}`);
    setOpenMenuId(null);
  };

  const handleTabClick = (tab, query) => {
    router.push(`/admin/products${query ? `?collection=${query}` : ''}`);
  };

  // Extract distinct values for Excel filter dropdowns
  const distinctValues = useMemo(() => {
    const categories = Array.from(new Set(productsList.map(p => p.categoryName || "Uncategorized"))).filter(Boolean);
    const availabilities = ["In Stock", "Out of Stock"];
    const featuredOpts = ["Featured", "Standard"];
    return {
      category: categories,
      availability: availabilities,
      featured: featuredOpts,
    };
  }, [productsList]);

  // Handle Excel Column Filter Checkbox Toggles
  const toggleColumnFilterValue = (column, value) => {
    setColumnFilters(prev => {
      const current = prev[column] || [];
      const exists = current.includes(value);
      const updated = exists ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [column]: updated };
    });
  };

  const clearColumnFilter = (column) => {
    setColumnFilters(prev => ({ ...prev, [column]: [] }));
    setColumnSearch(prev => ({ ...prev, [column]: "" }));
    setActivePopover(null);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setColumnFilters({
      name: [],
      category: [],
      price: [],
      stock: [],
      availability: [],
      featured: [],
    });
    setSortConfig({ key: null, direction: null });
  };

  // Sort & Filter Processing
  const filteredAndSortedProducts = useMemo(() => {
    return productsList.filter(product => {
      // Tab Filter
      if (activeTab !== "All" && product.categoryName !== activeTab) return false;
      
      // Global Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(query);
        const matchCat = product.categoryName?.toLowerCase().includes(query);
        const matchPrice = String(product.price).includes(query);
        if (!matchName && !matchCat && !matchPrice) return false;
      }

      // Column Category Filter
      if (columnFilters.category.length > 0) {
        const cat = product.categoryName || "Uncategorized";
        if (!columnFilters.category.includes(cat)) return false;
      }

      // Column Availability Filter
      if (columnFilters.availability.length > 0) {
        const status = product.inStock && product.stockCount > 0 ? "In Stock" : "Out of Stock";
        if (!columnFilters.availability.includes(status)) return false;
      }

      // Column Featured Filter
      if (columnFilters.featured.length > 0) {
        const isFeat = product.bestseller ? "Featured" : "Standard";
        if (!columnFilters.featured.includes(isFeat)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (!sortConfig.key || !sortConfig.direction) return 0;
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'name') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      } else if (sortConfig.key === 'price' || sortConfig.key === 'stockCount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [productsList, activeTab, searchQuery, columnFilters, sortConfig]);

  // Sliced items for continuous scrolling
  const visibleProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, displayCount);
  }, [filteredAndSortedProducts, displayCount]);

  const hasActiveFilters = searchQuery || Object.values(columnFilters).some(arr => arr.length > 0) || sortConfig.key;

  // Handle Sort Click
  const handleSort = (key, direction) => {
    if (sortConfig.key === key && sortConfig.direction === direction) {
      setSortConfig({ key: null, direction: null });
    } else {
      setSortConfig({ key, direction });
    }
  };

  // Excel & CSV Bulk Upload Parsing
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setBulkError(null);
    setBulkSuccess(null);

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    const reader = new FileReader();

    if (isExcel) {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          processTableRows(rawRows);
        } catch (err) {
          console.error(err);
          setBulkError("Failed to parse Excel file: " + err.message);
          setBulkPreview([]);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const workbook = XLSX.read(text, { type: 'string' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          processTableRows(rawRows);
        } catch (err) {
          console.error(err);
          setBulkError("Failed to parse CSV file: " + err.message);
          setBulkPreview([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const processTableRows = (rows) => {
    try {
      if (!Array.isArray(rows) || rows.length < 2) {
        throw new Error("File must contain a header row and at least 1 product row.");
      }

      const headers = rows[0].map(h => String(h || '').trim().toLowerCase().replace(/^["']|["']$/g, ''));
      const parsed = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0 || row.every(val => val === '' || val == null)) continue;

        const item = {};
        headers.forEach((h, index) => {
          const rawVal = row[index] != null ? String(row[index]).trim() : '';
          // Strip currency symbols (₦, $, £, €) and formatting commas for price
          const cleanNumStr = rawVal.replace(/[₦$£€,\s]/g, '');

          if (h.includes('name') || h === 'title') {
            item.name = rawVal;
          } else if (h.includes('price') && !h.includes('compare')) {
            const parsedNum = parseFloat(cleanNumStr);
            item.price = isNaN(parsedNum) ? 0 : parsedNum;
          } else if (h.includes('compare') || h.includes('original')) {
            const parsedNum = parseFloat(cleanNumStr);
            item.compareAtPrice = isNaN(parsedNum) ? null : parsedNum;
          } else if (h.includes('cat') || h.includes('collection')) {
            item.category = rawVal;
          } else if (h.includes('stock') || h.includes('qty') || h.includes('quantity')) {
            const parsedStock = parseInt(cleanNumStr, 10);
            item.stockCount = isNaN(parsedStock) ? 10 : parsedStock;
          } else if (h.includes('desc')) {
            item.description = rawVal;
          } else if (h.includes('image') || h.includes('photo')) {
            item.images = rawVal;
          } else if (h.includes('shape')) {
            item.nailShape = rawVal;
          } else if (h.includes('color')) {
            item.color = rawVal;
          } else if (h.includes('tag') || h.includes('style')) {
            item.tags = rawVal;
          } else if (h.includes('feat') || h.includes('bestseller')) {
            item.featured = rawVal.toLowerCase() === 'true' || rawVal === '1';
          }
        });

        if (item.name && (item.price || item.price === 0)) {
          parsed.push(item);
        }
      }

      if (parsed.length === 0) {
        throw new Error("No valid products found. Ensure 'Name' and 'Price' columns exist and are populated.");
      }

      setBulkPreview(parsed);
    } catch (err) {
      console.error(err);
      setBulkError(err.message || "Failed to process rows.");
      setBulkPreview([]);
    }
  };

  const handleDownloadSample = () => {
    const data = [
      ["Name", "Category", "Price", "CompareAtPrice", "StockCount", "Description", "Images", "NailShape", "Color", "Tags", "Featured"],
      ["Ruby Velvet Elegance", "Handmade", 15000, 18000, 10, "Handmade luxury press-on nail set with velvet finish.", "https://images.unsplash.com/photo-1604654894610-df63bc536371", "Almond", "Deep Red", "Solid, Velvet", true],
      ["French Vanilla Glaze", "Factory Made", 6500, "", 25, "Classic neutral french tips with salon-grade finish.", "https://images.unsplash.com/photo-1632345031435-8727f6897d53", "Square", "Nude", "French, Minimalist", false],
      ["Emerald Dream Ombre", "Handmade", 16000, 20000, 8, "Rich jewel toned ombre with gold foil accents.", "https://images.unsplash.com/photo-1519014816548-bf5fe059798b", "Coffin", "Green", "Ombre, Art", true]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products Template");
    XLSX.writeFile(workbook, "nailexpress_bulk_products_template.xlsx");
  };

  const handleExecuteBulkUpload = async () => {
    setIsUploadingBulk(true);
    setBulkError(null);
    setBulkSuccess(null);

    try {
      if (bulkMode === "gallery") {
        if (selectedGalleryFiles.length === 0) {
          throw new Error("Please select at least one image from your gallery.");
        }

        // Upload images individually via server endpoint (/api/admin/products/upload-image)
        // 1. Avoids Vercel 4.5MB total request body limit by uploading 1 photo per request
        // 2. Avoids Supabase Storage RLS (Row-Level Security) by using the Service Role on the server
        const timestamp = Date.now();
        const uploadedProducts = [];

        // Upload photos concurrently in chunks of 4
        for (let i = 0; i < selectedGalleryFiles.length; i += 4) {
          const batch = selectedGalleryFiles.slice(i, i + 4);
          const batchResults = await Promise.all(
            batch.map(async (file, batchIndex) => {
              const globalIndex = i + batchIndex;
              const previewItem = galleryPreviews[globalIndex];
              const productName = previewItem?.name?.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || `Nail Set ${globalIndex + 1}`;
              const slugBase = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `nail-set-${globalIndex}`;
              const fileExt = file.name.split('.').pop() || 'jpg';
              const fileName = `bulk-${slugBase}-${timestamp}-${globalIndex}.${fileExt}`;

              const imgFormData = new FormData();
              imgFormData.append('file', file);
              imgFormData.append('fileName', fileName);

              const uploadRes = await fetch('/api/admin/products/upload-image', {
                method: 'POST',
                body: imgFormData
              });

              const uploadData = await uploadRes.json();
              if (!uploadRes.ok || !uploadData.success) {
                throw new Error(`Failed to upload photo "${file.name}": ${uploadData.error || 'Upload failed'}`);
              }

              return {
                name: productName,
                category: defaultCategory,
                price: parseFloat(defaultPrice) || 12000,
                stock: parseInt(defaultStock, 10) || 10,
                nailShape: defaultShape,
                length: defaultLength,
                images: [uploadData.url],
                description: `Handcrafted ${productName} luxury press-on nail set. Ready to wear.`,
              };
            })
          );
          uploadedProducts.push(...batchResults);
        }

        // Send created product records to backend in JSON mode (lightweight JSON payload)
        const formData = new FormData();
        formData.append('mode', 'json');
        formData.append('products', JSON.stringify(uploadedProducts));

        const res = await fetch('/api/admin/products/bulk', {
          method: 'POST',
          body: formData
        });

        let data;
        const resText = await res.text();
        try {
          data = JSON.parse(resText);
        } catch {
          throw new Error(res.status === 413 ? "File batch exceeds server payload limit." : `Server returned: ${resText.slice(0, 120)}`);
        }

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create products");
        }

        setBulkSuccess(`Successfully created ${data.count || uploadedProducts.length} products!`);
        if (data.products && Array.isArray(data.products)) {
          const mapped = data.products.map(p => {
            const rawP = Number(p.price);
            const catSlug = (p.categories?.slug || defaultCategory || '').toLowerCase();
            const catName = (p.categories?.name || defaultCategory || '').toLowerCase();
            const isFactory = catSlug.includes('factory') || catName.includes('factory');

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              price: rawP,
              compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
              category: isFactory ? 'factory' : 'handmade',
              categoryName: isFactory ? 'Factory Made' : 'Handmade',
              nailShape: p.nail_shape,
              style: p.style,
              lengths: p.lengths || [],
              sizes: isFactory ? [] : ["S", "M", "L"],
              images: p.images || [],
              image: p.images?.[0] || null,
              bestseller: p.bestseller,
              inStock: p.stock_count > 0,
              stockCount: p.stock_count,
            };
          });
          setProductsList(prev => [...mapped, ...prev]);
        }

        setTimeout(() => {
          setIsBulkOpen(false);
          setSelectedGalleryFiles([]);
          setGalleryPreviews([]);
        }, 1500);

      } else {
        // Spreadsheet mode
        if (bulkPreview.length === 0) {
          throw new Error("Please select a valid Excel or CSV spreadsheet.");
        }

        const formData = new FormData();
        formData.append('mode', 'json');
        formData.append('products', JSON.stringify(bulkPreview));

        const res = await fetch('/api/admin/products/bulk', {
          method: 'POST',
          body: formData
        });

        let data;
        const resText = await res.text();
        try {
          data = JSON.parse(resText);
        } catch {
          throw new Error(res.status === 413 ? "File batch exceeds server payload limit." : `Server returned: ${resText.slice(0, 120)}`);
        }

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to upload products");
        }

        setBulkSuccess(`Successfully added ${data.count || bulkPreview.length} products!`);
        if (data.products && Array.isArray(data.products)) {
          const mapped = data.products.map(p => {
            const rawP = Number(p.price);
            const catSlug = (p.categories?.slug || '').toLowerCase();
            const catName = (p.categories?.name || '').toLowerCase();
            const isFactory = catSlug.includes('factory') || catName.includes('factory');

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              price: rawP,
              compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
              category: isFactory ? 'factory' : 'handmade',
              categoryName: isFactory ? 'Factory Made' : 'Handmade',
              nailShape: p.nail_shape,
              style: p.style,
              lengths: p.lengths || [],
              sizes: isFactory ? [] : ["S", "M", "L"],
              images: p.images || [],
              image: p.images?.[0] || null,
              bestseller: p.bestseller,
              inStock: p.stock_count > 0,
              stockCount: p.stock_count,
            };
          });
          setProductsList(prev => [...mapped, ...prev]);
        }
        setTimeout(() => {
          setIsBulkOpen(false);
          setBulkPreview([]);
          setBulkFile(null);
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      setBulkError(err.message || "Bulk upload failed.");
    } finally {
      setIsUploadingBulk(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSubtitle}>Manage all your products, stock, and pricing in real time.</p>
        </div>
        <div className={styles.pageHeaderActions}>
          <button 
            type="button" 
            className={styles.btnSecondary} 
            onClick={() => setIsBulkOpen(true)}
            style={{
              background: "#ffffff",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontFamily: "'Cormorant Upright', Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Upload size={16} />
            Bulk Upload
          </button>
          <Link 
            href="/admin/products/new" 
            className={styles.btnPrimary} 
            style={{ 
              padding: "8px 16px", 
              gap: "6px",
              fontFamily: "'Cormorant Upright', Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Plus size={16} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Performance banner */}
      <div style={{
        background: "rgba(var(--color-primary-rgb), 0.1)",
        border: "1px solid var(--color-primary)",
        color: "var(--color-primary-700)",
        padding: "12px 16px",
        borderRadius: "var(--radius-md)",
        marginBottom: "24px",
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span><strong>Performance Caching Enabled:</strong> Any changes made to products or prices may take up to 5 minutes to appear on the live storefront.</span>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "All" ? styles.active : ""}`}
            onClick={() => handleTabClick("All", null)}
          >
            All ({productsList.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "Handmade" ? styles.active : ""}`}
            onClick={() => handleTabClick("Handmade", "handmade")}
          >
            Handmade ({productsList.filter(p => p.categoryName === "Handmade").length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "Factory Made" ? styles.active : ""}`}
            onClick={() => handleTabClick("Factory Made", "factory")}
          >
            Factory Made ({productsList.filter(p => p.categoryName === "Factory Made").length})
          </button>
        </div>
        
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} color="#888" />
            <input 
              type="text" 
              placeholder="Search by name, category, price..." 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button 
              className={styles.excelClearBtn} 
              onClick={clearAllFilters}
              style={{ padding: "6px 12px", border: "1px solid var(--color-border)", borderRadius: "8px", background: "white" }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableContainer} style={{ position: "relative" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Product Column Header with Excel filter */}
              <th style={{ minWidth: "260px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'name' ? null : 'name')}>
                  <span>Product</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button 
                      className={`${styles.excelFilterBtn} ${sortConfig.key === 'name' ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <Filter size={13} />
                    </button>
                  </div>
                </div>

                {/* Name Filter Popover */}
                {activePopover === 'name' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort & Filter Product</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('name', 'asc')}
                      >
                        <ArrowUp size={13} /> Sort A to Z
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('name', 'desc')}
                      >
                        <ArrowDown size={13} /> Sort Z to A
                      </button>
                    </div>
                  </div>
                )}
              </th>

              {/* Collection Column Header */}
              <th style={{ minWidth: "150px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'category' ? null : 'category')}>
                  <span>Collection</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <button 
                      className={`${styles.excelFilterBtn} ${columnFilters.category.length > 0 ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <Filter size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'category' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Filter Collection</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelValuesList}>
                      {distinctValues.category.map(cat => (
                        <label key={cat} className={styles.excelValueItem}>
                          <input 
                            type="checkbox" 
                            checked={columnFilters.category.includes(cat)} 
                            onChange={() => toggleColumnFilterValue('category', cat)} 
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.excelPopoverFooter}>
                      <button className={styles.excelClearBtn} onClick={() => clearColumnFilter('category')}>Clear</button>
                      <button className={styles.excelApplyBtn} onClick={() => setActivePopover(null)}>Done</button>
                    </div>
                  </div>
                )}
              </th>

              {/* Price Column Header */}
              <th style={{ minWidth: "120px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'price' ? null : 'price')}>
                  <span>Price</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button 
                      className={`${styles.excelFilterBtn} ${sortConfig.key === 'price' ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <ArrowUpDown size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'price' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort Price</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'price' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('price', 'asc')}
                      >
                        <ArrowUp size={13} /> Lowest to Highest
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'price' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('price', 'desc')}
                      >
                        <ArrowDown size={13} /> Highest to Lowest
                      </button>
                    </div>
                  </div>
                )}
              </th>

              {/* Stock Column Header */}
              <th style={{ minWidth: "100px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'stock' ? null : 'stock')}>
                  <span>Stock</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {sortConfig.key === 'stockCount' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} color="var(--color-primary)" /> : <ArrowDown size={14} color="var(--color-primary)" />
                    )}
                    <button 
                      className={`${styles.excelFilterBtn} ${sortConfig.key === 'stockCount' ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <ArrowUpDown size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'stock' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Sort Stock</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelSortOptions}>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'stockCount' && sortConfig.direction === 'asc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('stockCount', 'asc')}
                      >
                        <ArrowUp size={13} /> Low to High
                      </button>
                      <button 
                        className={`${styles.excelSortBtn} ${sortConfig.key === 'stockCount' && sortConfig.direction === 'desc' ? styles.activeSort : ''}`}
                        onClick={() => handleSort('stockCount', 'desc')}
                      >
                        <ArrowDown size={13} /> High to Low
                      </button>
                    </div>
                  </div>
                )}
              </th>

              {/* Availability Column Header */}
              <th style={{ minWidth: "140px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'availability' ? null : 'availability')}>
                  <span>Availability</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <button 
                      className={`${styles.excelFilterBtn} ${columnFilters.availability.length > 0 ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <Filter size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'availability' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Filter Availability</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelValuesList}>
                      {distinctValues.availability.map(avail => (
                        <label key={avail} className={styles.excelValueItem}>
                          <input 
                            type="checkbox" 
                            checked={columnFilters.availability.includes(avail)} 
                            onChange={() => toggleColumnFilterValue('availability', avail)} 
                          />
                          <span>{avail}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.excelPopoverFooter}>
                      <button className={styles.excelClearBtn} onClick={() => clearColumnFilter('availability')}>Clear</button>
                      <button className={styles.excelApplyBtn} onClick={() => setActivePopover(null)}>Done</button>
                    </div>
                  </div>
                )}
              </th>

              {/* Featured Column Header */}
              <th style={{ minWidth: "110px", position: "relative" }}>
                <div className={styles.filterHeaderCell} onClick={() => setActivePopover(activePopover === 'featured' ? null : 'featured')}>
                  <span>Featured</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <button 
                      className={`${styles.excelFilterBtn} ${columnFilters.featured.length > 0 ? styles.activeFilter : ''}`}
                      type="button"
                    >
                      <Filter size={13} />
                    </button>
                  </div>
                </div>

                {activePopover === 'featured' && (
                  <div className={styles.excelPopover} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.excelPopoverHeader}>
                      <span>Filter Featured</span>
                      <X size={14} style={{ cursor: "pointer" }} onClick={() => setActivePopover(null)} />
                    </div>
                    <div className={styles.excelValuesList}>
                      {distinctValues.featured.map(feat => (
                        <label key={feat} className={styles.excelValueItem}>
                          <input 
                            type="checkbox" 
                            checked={columnFilters.featured.includes(feat)} 
                            onChange={() => toggleColumnFilterValue('featured', feat)} 
                          />
                          <span>{feat}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.excelPopoverFooter}>
                      <button className={styles.excelClearBtn} onClick={() => clearColumnFilter('featured')}>Clear</button>
                      <button className={styles.excelApplyBtn} onClick={() => setActivePopover(null)}>Done</button>
                    </div>
                  </div>
                )}
              </th>

              {/* Actions Column Header */}
              <th style={{ minWidth: "50px", width: "50px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product, index) => {
              const isCurrentlyInStock = product.stockCount > 0 && product.inStock;
              return (
                <tr key={product.id}>
                  {/* Product Cell */}
                  <td>
                    <div className={styles.productCell} style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                      <Image 
                        src={product.images?.[0] || '/images/hero.png'} 
                        alt={product.name} 
                        className={styles.productImg} 
                        width={44} 
                        height={44} 
                        style={{ objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} 
                      />
                      <span className={styles.productName} style={{ wordBreak: "break-word" }}>{product.name}</span>
                    </div>
                  </td>

                  {/* Collection */}
                  <td style={{ color: "#555" }}>{product.categoryName || "Standard"}</td>

                  {/* Price */}
                  <td style={{ fontWeight: 500 }}>
                    {formatPrice(product.price)}
                    {product.compareAtPrice && (
                      <span style={{ textDecoration: "line-through", color: "#999", fontSize: "0.75rem", display: "block" }}>
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </td>

                  {/* Stock Count */}
                  <td style={{ color: product.stockCount > 0 ? "#444" : "#DC2626", fontWeight: product.stockCount === 0 ? 600 : 400 }}>
                    {updatingStockId === product.id ? "Updating..." : product.stockCount}
                  </td>

                  {/* Availability Badge */}
                  <td>
                    <span 
                      className={`${styles.badge} ${isCurrentlyInStock ? styles.inStock : styles.outOfStock}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleStock(product.id)}
                      title="Click to toggle stock status"
                    >
                      {isCurrentlyInStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  {/* Featured */}
                  <td>
                    <button 
                      onClick={() => handleToggleFeature(product.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                      title={product.bestseller ? "Featured (Click to unfeature)" : "Standard (Click to feature)"}
                    >
                      <Star 
                        size={18} 
                        color={product.bestseller ? "#F59E0B" : "#D1D5DB"} 
                        fill={product.bestseller ? "#F59E0B" : "none"} 
                      />
                    </button>
                  </td>

                  {/* Actions Column */}
                  <td style={{ textAlign: "right", position: "relative" }}>
                    <button 
                      onClick={(e) => handleMenuClick(product.id, e)}
                      title="Product Actions"
                      style={{ 
                        background: openMenuId === product.id ? "rgba(0,0,0,0.06)" : "none", 
                        border: "1px solid var(--color-border-light)", 
                        borderRadius: "6px",
                        cursor: "pointer", 
                        color: "#666", 
                        padding: "4px 6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === product.id && (
                      <div 
                        className={styles.kebabMenu}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: index >= visibleProducts.length - 2 ? "auto" : "calc(100% + 4px)",
                          bottom: index >= visibleProducts.length - 2 ? "calc(100% + 4px)" : "auto",
                          zIndex: 1000,
                          minWidth: "165px",
                          background: "#ffffff",
                          borderRadius: "8px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                          border: "1px solid var(--color-border)"
                        }}
                      >
                        {/* In Stock / Out of Stock Instant Toggle */}
                        <button 
                          className={styles.kebabItem} 
                          onClick={() => handleToggleStock(product.id)}
                          style={{ 
                            fontWeight: 600,
                            color: isCurrentlyInStock ? "#DC2626" : "#16A34A",
                            borderBottom: "1px solid var(--color-border-light)"
                          }}
                        >
                          {isCurrentlyInStock ? "Mark Out of Stock" : "Mark In Stock"}
                        </button>
                        <button className={styles.kebabItem} onClick={() => handleEdit(product.id)}>Edit Details</button>
                        <button className={styles.kebabItem} onClick={() => handleDuplicate(product.id)}>Duplicate</button>
                        <button className={styles.kebabItem} onClick={() => handleToggleFeature(product.id)}>
                          {product.bestseller ? "Unmark Featured" : "Mark Featured"}
                        </button>
                        <button className={`${styles.kebabItem} ${styles.kebabDelete}`} onClick={() => handleDeleteClick(product.id)}>Delete Product</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredAndSortedProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-4)" }}>🔍</div>
                  <h3 style={{ fontSize: "1.125rem", color: "var(--color-primary-800)", marginBottom: "var(--space-2)" }}>No products found</h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "var(--space-6)" }}>
                    No products matched your search or filters.
                  </p>
                  <button 
                    onClick={clearAllFilters} 
                    className={styles.btnPrimary} 
                    style={{ display: "inline-flex", margin: "0 auto" }}
                  >
                    Clear Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Continuous scrolling sentinel & indicator */}
      <div 
        ref={observerTarget} 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          padding: "24px 0", 
          color: "#888", 
          fontSize: "0.85rem" 
        }}
      >
        {visibleProducts.length < filteredAndSortedProducts.length ? (
          <span>Loading more products continuously... ({visibleProducts.length} of {filteredAndSortedProducts.length} shown)</span>
        ) : filteredAndSortedProducts.length > 0 ? (
          <span>Showing all {filteredAndSortedProducts.length} products</span>
        ) : null}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className={styles.modalOverlay} onClick={() => setProductToDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Product</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this product? Any associated review or cart references will be cleaned up safely.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={() => setProductToDelete(null)} disabled={isDeleting}>Cancel</button>
              <button className={styles.modalBtnDelete} onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkOpen && (
        <div className={styles.bulkUploadModal} onClick={() => setIsBulkOpen(false)}>
          <div className={styles.bulkUploadBox} style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bulkUploadHeader}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Bulk Upload Products</h3>
                <p style={{ fontSize: "0.8rem", color: "#666", margin: "4px 0 0" }}>
                  Add multiple products in seconds via gallery photos or an Excel spreadsheet.
                </p>
              </div>
              <button 
                onClick={() => setIsBulkOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-light)", background: "#fcfcfc" }}>
              <button
                type="button"
                onClick={() => setBulkMode("gallery")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: bulkMode === "gallery" ? "white" : "transparent",
                  border: "none",
                  borderBottom: bulkMode === "gallery" ? "2px solid var(--color-primary)" : "none",
                  fontWeight: bulkMode === "gallery" ? 600 : 400,
                  color: bulkMode === "gallery" ? "var(--color-primary)" : "#666",
                  cursor: "pointer",
                  fontSize: "0.88rem"
                }}
              >
                📸 Select Photos from Gallery
              </button>
              <button
                type="button"
                onClick={() => setBulkMode("spreadsheet")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: bulkMode === "spreadsheet" ? "white" : "transparent",
                  border: "none",
                  borderBottom: bulkMode === "spreadsheet" ? "2px solid var(--color-primary)" : "none",
                  fontWeight: bulkMode === "spreadsheet" ? 600 : 400,
                  color: bulkMode === "spreadsheet" ? "var(--color-primary)" : "#666",
                  cursor: "pointer",
                  fontSize: "0.88rem"
                }}
              >
                📊 Upload Spreadsheet (Excel / CSV)
              </button>
            </div>

            <div className={styles.bulkUploadBody}>
              {bulkMode === "gallery" ? (
                <>
                  {/* Default Attributes Bar */}
                  <div className={styles.bulkUploadGrid}>
                    <div className={styles.bulkGridItem}>
                      <label className={styles.bulkGridLabel}>Collection</label>
                      <select 
                        value={defaultCategory} 
                        onChange={(e) => setDefaultCategory(e.target.value)}
                        className={styles.bulkGridSelect}
                      >
                        <option value="Handmade">Handmade</option>
                        <option value="Factory Made">Factory</option>
                      </select>
                    </div>

                    <div className={styles.bulkGridItem}>
                      <label className={styles.bulkGridLabel}>Shape</label>
                      <select 
                        value={defaultShape} 
                        onChange={(e) => setDefaultShape(e.target.value)}
                        className={styles.bulkGridSelect}
                      >
                        <option value="Almond">Almond</option>
                        <option value="Square">Square</option>
                        <option value="Coffin">Coffin</option>
                        <option value="Stiletto">Stiletto</option>
                        <option value="Oval">Oval</option>
                      </select>
                    </div>

                    <div className={styles.bulkGridItem}>
                      <label className={styles.bulkGridLabel}>Length</label>
                      <select 
                        value={defaultLength} 
                        onChange={(e) => setDefaultLength(e.target.value)}
                        className={styles.bulkGridSelect}
                      >
                        <option value="Medium">Medium</option>
                        <option value="Short">Short</option>
                        <option value="Long">Long</option>
                        <option value="Extra Long">XL</option>
                      </select>
                    </div>

                    <div className={styles.bulkGridItem}>
                      <label className={styles.bulkGridLabel}>Price (₦)</label>
                      <input 
                        type="number" 
                        value={defaultPrice} 
                        onChange={(e) => setDefaultPrice(e.target.value)}
                        className={styles.bulkGridInput}
                      />
                    </div>

                    <div className={styles.bulkGridItem}>
                      <label className={styles.bulkGridLabel}>Stock</label>
                      <input 
                        type="number" 
                        value={defaultStock} 
                        onChange={(e) => setDefaultStock(e.target.value)}
                        className={styles.bulkGridInput}
                      />
                    </div>
                  </div>

                  {/* Multi-Photo File Input */}
                  <input 
                    type="file" 
                    ref={galleryInputRef} 
                    accept="image/*" 
                    multiple 
                    onChange={handleGallerySelection} 
                    style={{ display: "none" }} 
                  />
                  <div 
                    className={styles.bulkDropZone} 
                    onClick={() => galleryInputRef.current?.click()}
                    style={{ padding: "24px 16px" }}
                  >
                    <Upload size={32} color="var(--color-primary)" style={{ marginBottom: "6px" }} />
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>
                      Tap here to select multiple photos from your Gallery / Computer
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#888" }}>
                      Hold Shift/Ctrl or multi-tap in your photo gallery to select all photos at once
                    </div>
                  </div>

                  {/* Photo Previews Grid */}
                  {galleryPreviews.length > 0 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                          {galleryPreviews.length} photos selected (each will create a product)
                        </span>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedGalleryFiles([]); setGalleryPreviews([]); }} 
                          style={{ background: "none", border: "none", color: "#dc2626", fontSize: "0.78rem", cursor: "pointer" }}
                        >
                          Clear all
                        </button>
                      </div>

                      <div style={{ maxHeight: "240px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", padding: "4px" }}>
                        {galleryPreviews.map((item, idx) => (
                          <div key={idx} style={{ border: "1px solid var(--color-border-light)", borderRadius: "8px", overflow: "hidden", background: "white", position: "relative" }}>
                            <div style={{ position: "relative", width: "100%", height: "100px" }}>
                              <Image src={item.previewUrl} alt={item.name} fill sizes="130px" style={{ objectFit: "cover" }} />
                              <button 
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div style={{ padding: "6px" }}>
                              <input 
                                type="text" 
                                value={item.name} 
                                onChange={(e) => updateGalleryItemName(idx, e.target.value)} 
                                style={{ width: "100%", padding: "4px", fontSize: "0.72rem", border: "1px solid var(--color-border)", borderRadius: "4px" }}
                                title="Click to rename product"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Spreadsheet Mode */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--color-border-light)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Need the Excel template?</div>
                      <div style={{ fontSize: "0.78rem", color: "#666" }}>Download a pre-formatted Excel spreadsheet (.xlsx) with all supported product columns.</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleDownloadSample}
                      style={{
                        background: "white",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer"
                      }}
                    >
                      <Download size={14} /> Download Excel Template
                    </button>
                  </div>

                  {/* File Dropzone */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".xlsx,.xls,.csv" 
                    onChange={handleFileUpload} 
                    style={{ display: "none" }} 
                  />
                  <div 
                    className={styles.bulkDropZone} 
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Upload size={32} color="var(--color-primary)" style={{ marginBottom: "8px" }} />
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>
                      {bulkFile ? bulkFile.name : "Click to select Excel (.xlsx) or CSV file"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#888" }}>
                      {bulkFile ? `${(bulkFile.size / 1024).toFixed(1)} KB` : "Supports Excel (.xlsx, .xls) and CSV (.csv) spreadsheets"}
                    </div>
                  </div>

                  {/* Parsed Preview Table */}
                  {bulkPreview.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "6px" }}>
                        Preview Ready ({bulkPreview.length} items to be created)
                      </div>
                      <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--color-border-light)", borderRadius: "8px" }}>
                        <table className={styles.bulkPreviewTable}>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Nail Shape</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkPreview.map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 500 }}>{item.name}</td>
                                <td>{item.category || "Handmade"}</td>
                                <td>{formatPrice(item.price)}</td>
                                <td>{item.stockCount ?? 10}</td>
                                <td>{item.nailShape || "Square"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {bulkError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={16} />
                  <span>{bulkError}</span>
                </div>
              )}

              {bulkSuccess && (
                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#059669", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Check size={16} />
                  <span>{bulkSuccess}</span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button 
                  className={styles.modalBtnCancel} 
                  onClick={() => { setIsBulkOpen(false); setBulkPreview([]); setBulkFile(null); setSelectedGalleryFiles([]); setGalleryPreviews([]); }}
                  disabled={isUploadingBulk}
                >
                  Cancel
                </button>
                <button 
                  className={styles.btnPrimary} 
                  onClick={handleExecuteBulkUpload} 
                  disabled={
                    isUploadingBulk || 
                    (bulkMode === "gallery" && selectedGalleryFiles.length === 0) ||
                    (bulkMode === "spreadsheet" && bulkPreview.length === 0)
                  }
                  style={{ 
                    opacity: isUploadingBulk || (bulkMode === "gallery" ? selectedGalleryFiles.length === 0 : bulkPreview.length === 0) ? 0.6 : 1 
                  }}
                >
                  {isUploadingBulk ? "Uploading Products..." : 
                    bulkMode === "gallery" 
                      ? `Create ${selectedGalleryFiles.length} Products from Photos`
                      : `Upload & Create ${bulkPreview.length} Products`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductsClient({ initialProducts }) {
  return (
    <Suspense fallback={<div className={styles.tableContainer} style={{ padding: "40px", textAlign: "center" }}>Loading products...</div>}>
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
