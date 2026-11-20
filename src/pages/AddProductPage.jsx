import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  PackagePlus,
  Check,
  Sparkles,
  Image as ImageIcon,
  IndianRupee,
  Tag,
  Palette,
  Layers,
  Info,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  FileText,
  RotateCcw,
  ShoppingBag,
  UploadCloud,
  Upload,
  X,
  Plus,
  Trash2,
  ChevronDown,
  Link as LinkIcon
} from 'lucide-react';
import { api, STORE_URL } from '../services/api';
import { theme } from '../theme';
import { CustomDropdown } from '../components/CustomDropdown';
import { SuggestionInput } from '../components/SuggestionInput';

export const WASH_CARE_SUGGESTIONS = [
  'Dry clean only',
  'Dry clean recommended',
  'Gentle hand wash',
  'Dry clean or gentle hand wash',
  'Hand wash with mild detergent',
  'Cold water gentle wash',
];

export const BLOUSE_PIECE_SUGGESTIONS = [
  'Attached (80 cm)',
  'Included — running blouse',
  'Included — unstitched blouse piece (80 cm)',
  'Attached blouse piece',
  'Without blouse piece',
  'Running blouse piece',
];

// Helper to convert desktop image file to an optimized, lightweight base64 Data URL
export const processImageFile = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from desktop.'));
    reader.onload = (e) => {
      const baseResult = e.target.result;
      try {
        const img = new Image();
        img.onerror = () => resolve({ dataUrl: baseResult, fileName: file.name });
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({ dataUrl, fileName: file.name });
          } catch {
            resolve({ dataUrl: baseResult, fileName: file.name });
          }
        };
        img.src = baseResult;
      } catch {
        resolve({ dataUrl: baseResult, fileName: file.name });
      }
    };
    reader.readAsDataURL(file);
  });
};

export const getMaterialShortForm = (material = '') => {
  const m = String(material || '').trim().toLowerCase();
  if (m.includes('silk')) return 'SIL';
  if (m.includes('cotton')) return 'COT';
  if (m.includes('linen')) return 'LIN';
  if (m.includes('organza')) return 'ORG';
  if (m.includes('chiffon')) return 'CHI';
  if (m.includes('georgette')) return 'GEO';
  if (m.includes('designer')) return 'DES';
  if (m.includes('wedding')) return 'WED';
  if (m.includes('party')) return 'PAR';
  if (m.includes('bridal')) return 'BRI';
  if (m.includes('festive')) return 'FES';

  const clean = m.replace(/[^a-z0-9]/gi, '');
  return (clean.substring(0, 3) || 'ITM').toUpperCase();
};

export const generateSKU = (material = '', existingProducts = []) => {
  const shortForm = getMaterialShortForm(material || 'ITM');

  let maxSeq = 0;
  if (Array.isArray(existingProducts) && existingProducts.length > 0) {
    const pattern = new RegExp(`^${shortForm}-(\\d+)`, 'i');
    existingProducts.forEach((p) => {
      if (p?.sku) {
        const match = String(p.sku).trim().match(pattern);
        if (match && match[1]) {
          const val = parseInt(match[1], 10);
          if (!isNaN(val) && val > maxSeq) {
            maxSeq = val;
          }
        }
      }
    });
  }

  const seq = maxSeq > 0 ? maxSeq + 1 : 1;
  const seqStr = String(seq).padStart(3, '0');
  return `${shortForm}-${seqStr}`;
};

export const POPULAR_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Ruby Red', hex: '#9B111E' },
  { name: 'Rani Pink', hex: '#E0115F' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Wine', hex: '#722F37' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Peacock Blue', hex: '#005F73' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Bottle Green', hex: '#004225' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Pista Green', hex: '#93C572' },
  { name: 'Mehendi Green', hex: '#8A9A5B' },
  { name: 'Olive Green', hex: '#808000' },
  { name: 'Mustard Yellow', hex: '#E1AD01' },
  { name: 'Lemon Yellow', hex: '#FFF44F' },
  { name: 'Turmeric', hex: '#F4C430' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Peach', hex: '#FFE5B4' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Violet', hex: '#EE82EE' },
  { name: 'Off White', hex: '#FAF9F6' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
];

const COLOR_MAP = POPULAR_COLORS.reduce((acc, c) => {
  acc[c.name.toLowerCase()] = c.hex;
  return acc;
}, {
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  navy: '#000080',
  mustard: '#E1AD01',
  white: '#FFFFFF',
  gray: '#808080',
  tan: '#D2B48C',
  khaki: '#F0E68C',
  indigo: '#4B0082',
  cyan: '#00FFFF',
  brown: '#A52A2A',
});

export const resolveColorToHex = (input) => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return '#' + trimmed.toUpperCase();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^[0-9A-Fa-f]{3}$/.test(trimmed)) {
    return ('#' + trimmed[0] + trimmed[0] + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2]).toUpperCase();
  }
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const raw = trimmed.slice(1);
    return ('#' + raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2]).toUpperCase();
  }

  const lower = trimmed.toLowerCase();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];

  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillStyle = lower;
    const computed = ctx.fillStyle;
    if (computed && computed.startsWith('#') && (lower === 'black' || computed !== '#000000')) {
      return computed.toUpperCase();
    }
  } catch {
    // ignore
  }

  return null;
};

export function AddProductPage({ initialProduct = null, products = [], onBack, onSuccess, onAddAnother }) {
  const isEdit = Boolean(initialProduct);
  const [isSkuCustomized, setIsSkuCustomized] = useState(Boolean(initialProduct?.sku));

  // Database attributes state
  const [dbCategories, setDbCategories] = useState([]);
  const [dbFabrics, setDbFabrics] = useState([]);
  const [dbOccasions, setDbOccasions] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState(new Set());
  const [deletedFabrics, setDeletedFabrics] = useState(new Set());
  const [deletedOccasions, setDeletedOccasions] = useState(new Set());
  const [attrDeleting, setAttrDeleting] = useState(null);

  // Fetch from database on component mount
  useEffect(() => {
    let isMounted = true;
    const fetchAttributes = async () => {
      try {
        const [cats, fabs, occs] = await Promise.all([
          api.getCategories(),
          api.getFabrics(),
          api.getOccasions(),
        ]);
        if (isMounted) {
          if (Array.isArray(cats)) setDbCategories(cats);
          if (Array.isArray(fabs)) setDbFabrics(fabs);
          if (Array.isArray(occs)) setDbOccasions(occs);
        }
      } catch (err) {
        console.warn('Failed to load attributes from API', err);
      }
    };
    fetchAttributes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Small Modal State for Adding Category / Fabric / Occasion
  const [attributeModal, setAttributeModal] = useState(null); // { type: 'category' | 'fabric' | 'occasion' }
  const [attrForm, setAttrForm] = useState({ name: '' });
  const [attrLoading, setAttrLoading] = useState(false);
  const [attrError, setAttrError] = useState('');

  const openAttributeModal = (type) => {
    setAttributeModal({ type });
    setAttrForm({ name: '' });
    setAttrError('');
  };

  const closeAttributeModal = () => {
    setAttributeModal(null);
    setAttrForm({ name: '' });
    setAttrError('');
  };

  const handleSaveAttribute = async (e) => {
    if (e) e.preventDefault();
    if (!attrForm.name.trim()) {
      setAttrError('Please enter a name');
      return;
    }
    setAttrLoading(true);
    setAttrError('');

    const trimmedName = attrForm.name.trim();

    try {
      if (attributeModal.type === 'category') {
        await api.createCategory({ name: trimmedName });
        setDeletedCategories((prev) => {
          const next = new Set(prev);
          next.delete(trimmedName);
          return next;
        });
        setDbCategories((prev) => Array.from(new Set([trimmedName, ...prev])));
        setFormData((prev) => ({
          ...prev,
          category: trimmedName,
          sku: generateSKU(trimmedName, products),
        }));
      } else if (attributeModal.type === 'fabric') {
        await api.createFabric({ name: trimmedName });
        setDeletedFabrics((prev) => {
          const next = new Set(prev);
          next.delete(trimmedName);
          return next;
        });
        setDbFabrics((prev) => Array.from(new Set([trimmedName, ...prev])));
        setFormData((prev) => ({
          ...prev,
          fabric: trimmedName,
          sku: !prev.category ? generateSKU(trimmedName, products) : prev.sku,
        }));
      } else if (attributeModal.type === 'occasion') {
        await api.createOccasion({ name: trimmedName });
        setDeletedOccasions((prev) => {
          const next = new Set(prev);
          next.delete(trimmedName);
          return next;
        });
        setDbOccasions((prev) => Array.from(new Set([trimmedName, ...prev])));
        setFormData((prev) => ({
          ...prev,
          occasion: trimmedName,
        }));
      }
      closeAttributeModal();
    } catch (err) {
      console.error(err);
      setAttrError(err.message || 'Failed to save to database');
    } finally {
      setAttrLoading(false);
    }
  };

  const handleDeleteAttribute = async (itemName, type) => {
    if (!itemName) return;
    setAttrDeleting(itemName);
    try {
      if (type === 'category') {
        setDeletedCategories((prev) => new Set([...prev, itemName]));
        setDbCategories((prev) => prev.filter((c) => (typeof c === 'string' ? c : c?.name) !== itemName));
        if (formData.category === itemName) {
          setFormData((prev) => ({ ...prev, category: '' }));
        }
        await api.deleteCategory(itemName);
      } else if (type === 'fabric') {
        setDeletedFabrics((prev) => new Set([...prev, itemName]));
        setDbFabrics((prev) => prev.filter((f) => (typeof f === 'string' ? f : f?.name) !== itemName));
        if (formData.fabric === itemName) {
          setFormData((prev) => ({ ...prev, fabric: '' }));
        }
        await api.deleteFabric(itemName);
      } else if (type === 'occasion') {
        setDeletedOccasions((prev) => new Set([...prev, itemName]));
        setDbOccasions((prev) => prev.filter((o) => (typeof o === 'string' ? o : o?.name) !== itemName));
        if (formData.occasion === itemName) {
          setFormData((prev) => ({ ...prev, occasion: '' }));
        }
        await api.deleteOccasion(itemName);
      }
    } catch (err) {
      console.error(`Failed to delete ${type} from backend`, err);
    } finally {
      setAttrDeleting(null);
    }
  };

  // Dynamically derive distinct categories, fabrics, occasions from DB + products
  const availableCategories = useMemo(() => {
    const set = new Set();
    dbCategories.forEach((c) => {
      const val = typeof c === 'string' ? c : c?.name;
      if (val && String(val).trim() && !deletedCategories.has(String(val).trim())) {
        set.add(String(val).trim());
      }
    });
    (products || []).forEach((p) => {
      if (p?.category && String(p.category).trim() && !deletedCategories.has(String(p.category).trim())) {
        set.add(String(p.category).trim());
      }
    });
    return Array.from(set).filter(Boolean);
  }, [dbCategories, products, deletedCategories]);

  const availableFabrics = useMemo(() => {
    const set = new Set();
    dbFabrics.forEach((f) => {
      const val = typeof f === 'string' ? f : f?.name;
      if (val && String(val).trim() && !deletedFabrics.has(String(val).trim())) {
        set.add(String(val).trim());
      }
    });
    (products || []).forEach((p) => {
      if (p?.fabric && String(p.fabric).trim() && !deletedFabrics.has(String(p.fabric).trim())) {
        set.add(String(p.fabric).trim());
      }
    });
    return Array.from(set).filter(Boolean);
  }, [dbFabrics, products, deletedFabrics]);

  const availableOccasions = useMemo(() => {
    const set = new Set();
    dbOccasions.forEach((o) => {
      const val = typeof o === 'string' ? o : o?.name;
      if (val && String(val).trim() && !deletedOccasions.has(String(val).trim())) {
        set.add(String(val).trim());
      }
    });
    (products || []).forEach((p) => {
      if (p?.occasion && String(p.occasion).trim() && !deletedOccasions.has(String(p.occasion).trim())) {
        set.add(String(p.occasion).trim());
      }
    });
    return Array.from(set).filter(Boolean);
  }, [dbOccasions, products, deletedOccasions]);

  const availableColors = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      if (p?.color && String(p.color).trim()) {
        set.add(String(p.color).trim());
      }
    });
    return Array.from(set);
  }, [products]);

  const getDefaultFormData = () => ({
    name: '',
    sku: generateSKU('Silk', products),
    category: '',
    fabric: '',
    color: '',
    occasion: '',
    price: '',
    mrp: '',
    stockCount: 0,
    lowStockAlert: 10,
    inStock: true,
    image: '',
    gallery: [],
    description: '',
    length: '',
    blousePiece: '',
    washCare: '',
    isBestSeller: false,
    isNewArrival: false,
  });

  const [formData, setFormData] = useState(getDefaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Desktop image upload states & refs
  const [galleryMode, setGalleryMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const galleryFileInputRef = useRef(null);

  // Color variants state: array of { id, name, code, images: [] }
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [colorInput, setColorInput] = useState('');
  const [colorPickerHex, setColorPickerHex] = useState('#B87802');

  // Currently active selected color (for attaching images and live preview)
  const activeColor = useMemo(() => {
    if (!colors || colors.length === 0) return null;
    return colors.find((c) => c.id === selectedColorId) || colors[0];
  }, [colors, selectedColorId]);

  // Current photos to display: photos of activeColor if colors exist, or general gallery
  const currentPhotos = useMemo(() => {
    if (activeColor) {
      return Array.isArray(activeColor.images) ? activeColor.images : [];
    }
    if (Array.isArray(formData.gallery)) return formData.gallery;
    if (typeof formData.gallery === 'string' && formData.gallery.trim()) {
      if (formData.gallery.startsWith('data:')) return [formData.gallery];
      return formData.gallery.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [activeColor, formData.gallery]);

  // Get active styling matching the selected color without dark/black background
  const getActiveColorStyle = (colorCode, isActive) => {
    if (!isActive) return {};
    const hex = colorCode && colorCode.startsWith('#')
      ? (colorCode.length === 4
        ? '#' + colorCode[1] + colorCode[1] + colorCode[2] + colorCode[2] + colorCode[3] + colorCode[3]
        : colorCode)
      : null;

    if (hex) {
      return {
        backgroundColor: `${hex}18`,
        borderColor: hex,
        color: '#12100D',
      };
    }
    return {
      backgroundColor: '#FAF8F2',
      borderColor: '#B87802',
      color: '#12100D',
    };
  };

  // Add a new color by code or name
  const handleAddColor = (rawCodeOrName) => {
    const rawVal = (typeof rawCodeOrName === 'string' ? rawCodeOrName : colorInput).trim();
    if (!rawVal) return;

    // Check if entered value resolves to a known hex or color name
    const resolvedHex = resolveColorToHex(rawVal);
    let cleanCode = rawVal;
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(rawVal)) {
      cleanCode = '#' + rawVal;
    }
    const isHex = /^#[0-9A-Fa-f]{3,8}$/.test(cleanCode);
    const formattedCode = resolvedHex || (isHex ? cleanCode.toUpperCase() : colorPickerHex);
    const formattedName = isHex ? cleanCode.toUpperCase() : rawVal;

    // Check if color already exists
    const match = colors.find(
      (c) => c.name.toLowerCase() === formattedName.toLowerCase() || c.code.toLowerCase() === formattedCode.toLowerCase()
    );
    if (match) {
      setSelectedColorId(match.id);
      setColorInput('');
      return;
    }

    const newId = 'col_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    // If this is the very first color and we already had general photos in formData.gallery, transfer them
    const initialImages = colors.length === 0 && Array.isArray(formData.gallery) && formData.gallery.length > 0
      ? formData.gallery
      : [];

    const newColorItem = {
      id: newId,
      name: formattedName,
      code: formattedCode,
      images: initialImages,
    };

    if (formattedCode && formattedCode.startsWith('#')) {
      setColorPickerHex(formattedCode);
    }

    const updatedColors = [...colors, newColorItem];
    setColors(updatedColors);
    setSelectedColorId(newId);
    setColorInput('');
    setFormData((prev) => ({
      ...prev,
      color: updatedColors.map((c) => c.name).join(', '),
    }));
  };

  const handleRemoveColor = (idToRemove) => {
    const updated = colors.filter((c) => c.id !== idToRemove);
    setColors(updated);
    if (selectedColorId === idToRemove) {
      setSelectedColorId(updated[0]?.id || null);
    }
    setFormData((prev) => ({
      ...prev,
      color: updated.map((c) => c.name).join(', '),
    }));
  };

  const handleSelectColor = (id) => {
    setSelectedColorId(id);
    const col = colors.find((c) => c.id === id);
    if (col && col.images && col.images.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: col.images[0],
      }));
    }
  };

  // Handle multiple photo files from desktop (attached to activeColor or general gallery)
  const handleGalleryFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const processed = [];
      for (const file of Array.from(files)) {
        try {
          const res = await processImageFile(file);
          processed.push(res.dataUrl);
        } catch (e) {
          console.error('Error processing gallery image:', e);
        }
      }
      if (processed.length > 0) {
        if (activeColor) {
          const updatedColors = colors.map((c) => {
            if (c.id === activeColor.id) {
              return { ...c, images: [...(c.images || []), ...processed] };
            }
            return c;
          });
          setColors(updatedColors);
          const allImages = updatedColors.flatMap((c) => c.images || []);
          const activeFirstImg = (activeColor.images && activeColor.images[0]) || processed[0];
          setFormData((prev) => ({
            ...prev,
            image: activeFirstImg || prev.image,
            gallery: allImages,
          }));
        } else {
          setFormData((prev) => {
            const currentList = Array.isArray(prev.gallery) ? prev.gallery : [];
            const merged = [...currentList, ...processed];
            return {
              ...prev,
              image: prev.image || merged[0] || '',
              gallery: merged,
            };
          });
        }
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle removing a photo from activeColor or general gallery
  const handleRemoveGalleryImage = (indexToRemove) => {
    if (activeColor) {
      const updatedColors = colors.map((c) => {
        if (c.id === activeColor.id) {
          const filtered = (c.images || []).filter((_, idx) => idx !== indexToRemove);
          return { ...c, images: filtered };
        }
        return c;
      });
      setColors(updatedColors);
      const allImages = updatedColors.flatMap((c) => c.images || []);
      const currentActive = updatedColors.find((c) => c.id === activeColor.id);
      setFormData((prev) => ({
        ...prev,
        image: (currentActive?.images && currentActive.images[0]) || allImages[0] || '',
        gallery: allImages,
      }));
    } else {
      setFormData((prev) => {
        const currentList = Array.isArray(prev.gallery) ? prev.gallery : [];
        const updated = currentList.filter((_, idx) => idx !== indexToRemove);
        return {
          ...prev,
          image: updated[0] || '',
          gallery: updated,
        };
      });
    }
  };

  // Handle adding URL(s) to activeColor or general gallery
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const urls = urlInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (activeColor) {
      const updatedColors = colors.map((c) => {
        if (c.id === activeColor.id) {
          return { ...c, images: [...(c.images || []), ...urls] };
        }
        return c;
      });
      setColors(updatedColors);
      const allImages = updatedColors.flatMap((c) => c.images || []);
      const activeFirstImg = (activeColor.images && activeColor.images[0]) || urls[0];
      setFormData((prev) => ({
        ...prev,
        image: activeFirstImg || prev.image,
        gallery: allImages,
      }));
    } else {
      setFormData((prev) => {
        const currentList = Array.isArray(prev.gallery) ? prev.gallery : [];
        const merged = [...currentList, ...urls];
        return {
          ...prev,
          image: prev.image || merged[0] || '',
          gallery: merged,
        };
      });
    }
    setUrlInput('');
  };

  useEffect(() => {
    if (initialProduct) {
      let existingGallery = Array.isArray(initialProduct.gallery)
        ? [...initialProduct.gallery]
        : (typeof initialProduct.gallery === 'string' && initialProduct.gallery.trim()
          ? (initialProduct.gallery.startsWith('data:')
            ? [initialProduct.gallery]
            : initialProduct.gallery.split(',').map((s) => s.trim()).filter(Boolean))
          : []);

      if (initialProduct.image && !existingGallery.includes(initialProduct.image)) {
        existingGallery.unshift(initialProduct.image);
      }

      // Initialize colors array
      let initColors = [];
      if (Array.isArray(initialProduct.colors) && initialProduct.colors.length > 0) {
        initColors = initialProduct.colors.map((c, i) => ({
          id: c.id || 'col_' + i,
          name: c.name || c.code || `Color ${i + 1}`,
          code: c.code || c.name || '#B87802',
          images: Array.isArray(c.images) ? c.images : [],
        }));
      } else if (initialProduct.color && String(initialProduct.color).trim()) {
        const rawColors = String(initialProduct.color).split(',').map((s) => s.trim()).filter(Boolean);
        initColors = rawColors.map((cName, i) => ({
          id: 'col_' + i,
          name: cName,
          code: cName.startsWith('#') ? cName : '#B87802',
          images: i === 0 ? existingGallery : [],
        }));
      }
      setColors(initColors);
      setSelectedColorId(initColors[0]?.id || null);

      setFormData({
        name: initialProduct.name || '',
        sku: initialProduct.sku || generateSKU(initialProduct.category || initialProduct.fabric, products),
        category: initialProduct.category || '',
        fabric: initialProduct.fabric || '',
        color: initialProduct.color || '',
        occasion: initialProduct.occasion || '',
        price: initialProduct.price || '',
        mrp: initialProduct.mrp || '',
        stockCount: initialProduct.stockCount ?? 0,
        lowStockAlert: initialProduct.lowStockAlert ?? 10,
        inStock: initialProduct.inStock ?? true,
        image: initialProduct.image || existingGallery[0] || '',
        gallery: existingGallery,
        description: initialProduct.description || '',
        length: initialProduct.length || '',
        blousePiece: initialProduct.blousePiece || '',
        washCare: initialProduct.washCare || '',
        isBestSeller: initialProduct.isBestSeller ?? false,
        isNewArrival: initialProduct.isNewArrival ?? false,
      });
      setIsSkuCustomized(Boolean(initialProduct.sku));
    } else {
      setFormData({
        ...getDefaultFormData(),
        sku: generateSKU('Silk', products),
      });
      setColors([]);
      setSelectedColorId(null);
      setIsSkuCustomized(false);
    }
    setError('');
    setSuccessInfo(null);
  }, [initialProduct, products]);

  // Calculations for live discount preview
  const numPrice = Number(formData.price) || 0;
  const numMrp = Number(formData.mrp) || 0;
  const discountPercent =
    numMrp > numPrice && numPrice > 0
      ? Math.round(((numMrp - numPrice) / numMrp) * 100)
      : 0;
  const savingsAmount = numMrp > numPrice ? numMrp - numPrice : 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'stockCount') {
        updated.inStock = Number(value) > 0;
      }
      return updated;
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset this form?')) {
      if (initialProduct) {
        let existingGallery = Array.isArray(initialProduct.gallery)
          ? [...initialProduct.gallery]
          : (typeof initialProduct.gallery === 'string' && initialProduct.gallery.trim()
            ? (initialProduct.gallery.startsWith('data:')
              ? [initialProduct.gallery]
              : initialProduct.gallery.split(',').map((s) => s.trim()).filter(Boolean))
            : []);

        if (initialProduct.image && !existingGallery.includes(initialProduct.image)) {
          existingGallery.unshift(initialProduct.image);
        }

        let initColors = [];
        if (Array.isArray(initialProduct.colors) && initialProduct.colors.length > 0) {
          initColors = initialProduct.colors.map((c, i) => ({
            id: c.id || 'col_' + i,
            name: c.name || c.code || `Color ${i + 1}`,
            code: c.code || c.name || '#B87802',
            images: Array.isArray(c.images) ? c.images : [],
          }));
        } else if (initialProduct.color && String(initialProduct.color).trim()) {
          const rawColors = String(initialProduct.color).split(',').map((s) => s.trim()).filter(Boolean);
          initColors = rawColors.map((cName, i) => ({
            id: 'col_' + i,
            name: cName,
            code: cName.startsWith('#') ? cName : '#B87802',
            images: i === 0 ? existingGallery : [],
          }));
        }
        setColors(initColors);
        setSelectedColorId(initColors[0]?.id || null);

        setFormData({
          name: initialProduct.name || '',
          sku: initialProduct.sku || generateSKU(initialProduct.category || initialProduct.fabric, products),
          category: initialProduct.category || '',
          fabric: initialProduct.fabric || '',
          color: initialProduct.color || '',
          occasion: initialProduct.occasion || '',
          price: initialProduct.price || '',
          mrp: initialProduct.mrp || '',
          stockCount: initialProduct.stockCount ?? 0,
          lowStockAlert: initialProduct.lowStockAlert ?? 10,
          inStock: initialProduct.inStock ?? true,
          image: initialProduct.image || existingGallery[0] || '',
          gallery: existingGallery,
          description: initialProduct.description || '',
          length: initialProduct.length || '',
          blousePiece: initialProduct.blousePiece || '',
          washCare: initialProduct.washCare || '',
          isBestSeller: initialProduct.isBestSeller ?? false,
          isNewArrival: initialProduct.isNewArrival ?? false,
        });
        setIsSkuCustomized(Boolean(initialProduct.sku));
      } else {
        setFormData({
          ...getDefaultFormData(),
          sku: generateSKU('Silk', products),
        });
        setColors([]);
        setSelectedColorId(null);
        setIsSkuCustomized(false);
      }
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) throw new Error('Please enter product name / title');
      if (!formData.category.trim()) throw new Error('Please enter or select a category');

      const cleanSku = formData.sku.trim() || generateSKU(formData.category || formData.fabric, products);

      if (!formData.price || Number(formData.price) <= 0)
        throw new Error('Please enter a valid selling price');
      if (!formData.mrp || Number(formData.mrp) <= 0)
        throw new Error('Please enter a valid MRP price');
      if (Number(formData.price) > Number(formData.mrp)) {
        throw new Error('Selling price cannot be greater than MRP');
      }
      const allImages = colors.length > 0
        ? colors.flatMap((c) => c.images || [])
        : (Array.isArray(formData.gallery) ? formData.gallery : []);
      const primaryImage = (activeColor?.images && activeColor.images[0]) || allImages[0] || formData.image.trim() || '';
      if (!primaryImage) throw new Error('Please upload or provide at least one product photo');

      const colorNames = colors.length > 0
        ? colors.map((c) => c.name).join(', ')
        : (formData.color.trim() || 'Multicolor');

      const payload = {
        name: formData.name.trim(),
        sku: cleanSku.toUpperCase(),
        category: formData.category.trim(),
        fabric: formData.fabric.trim(),
        color: colorNames,
        colors: colors,
        occasion: formData.occasion.trim(),
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stockCount: Number(formData.stockCount) || 0,
        lowStockAlert: formData.lowStockAlert !== undefined && formData.lowStockAlert !== '' ? Number(formData.lowStockAlert) : 10,
        inStock: Boolean(formData.inStock),
        image: primaryImage,
        gallery: allImages,
        description: formData.description.trim(),
        length: formData.length.trim(),
        blousePiece: formData.blousePiece.trim(),
        washCare: formData.washCare.trim(),
        isBestSeller: Boolean(formData.isBestSeller),
        isNewArrival: Boolean(formData.isNewArrival),
      };

      let result;
      if (isEdit && (initialProduct._id || initialProduct.id)) {
        result = await api.updateProduct(initialProduct._id || initialProduct.id, payload);
      } else {
        result = await api.createProduct(payload);
      }

      const savedData = result.data || payload;
      setSuccessInfo(savedData);
      if (onSuccess) onSuccess(savedData);

      // Scroll to top to see success state
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save product to backend');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#8C7E6A] mb-2 uppercase tracking-wider">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#B87802] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Catalog</span>
            </button>
            <span>/</span>
            <span className="text-[#B87802]">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </span>
          </nav>

          <div>
            <h1 className={`text-2xl sm:text-3xl font-semibold ${theme.fonts.display} text-[#12100D]`}>
              {isEdit ? 'Edit Saree Listing' : 'Add New Saree to Store'}
            </h1>
            <p className="text-xs text-[#6B6457] font-body mt-0.5">
              {isEdit
                ? 'Update your saree details, pricing, stock levels, and media imagery.'
                : 'Configure details, high-res photography, colors, pricing, and live inventory for storefront customers.'}
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 sm:self-end">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-md border border-[#E8D8B5] bg-white text-[#12100D] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 font-medium text-xs tracking-wider uppercase hover:from-[#C98704] hover:to-[#A86E02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <PackagePlus className="w-4 h-4" />
                <span>{isEdit ? 'Save Changes' : 'Publish Saree'}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FEE63E]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successInfo && (
        <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-display text-emerald-900">
                {isEdit ? 'Saree Details Updated Successfully!' : 'Saree Published Successfully to Store!'}
              </h3>
              <p className="text-xs text-emerald-800 font-body mt-0.5">
                "{successInfo.name}" is now live in the inventory database and visible on the storefront.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 text-xs font-semibold uppercase tracking-wider hover:from-[#C98704] hover:to-[#A86E02] transition-all"
            >
              <span>View On Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {!isEdit && (
              <button
                type="button"
                onClick={() => {
                  setFormData(getDefaultFormData());
                  setSuccessInfo(null);
                  if (onAddAnother) onAddAnother();
                }}
                className="px-3.5 py-2 rounded-md border border-emerald-400 bg-white text-emerald-900 hover:bg-emerald-100 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                + Add Another
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-md border border-[#E8D8B5] bg-white text-[#12100D] hover:bg-[#FAF8F2] text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 font-body animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">Unable to Save Product</p>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Single Card Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-6 space-y-6">

          {/* SECTION 1: Basic Information */}
          <div className="space-y-5">
            {/* Row 1: Product Code (40%) and Product Name (60%) */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Product Code / SKU (40%) - Auto-generated and non-editable */}
              <div className="w-full sm:w-[40%]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${theme.forms.label} !mb-0`}>
                    Product Code (SKU) <span className="text-[#B87802]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        sku: generateSKU(p.category || p.fabric || 'Silk', products),
                      }))
                    }
                    className="text-[11px] text-[#B87802] hover:text-[#996300] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Regenerate sequential Product Code"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-gen</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku || generateSKU(formData.category || formData.fabric || 'Silk', products)}
                  readOnly
                  tabIndex={-1}
                  placeholder="e.g. SIL-001"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-[#F7F3EA] text-sm text-[#12100D] font-body font-semibold tracking-wider uppercase outline-none cursor-not-allowed select-none"
                  required
                />
              </div>

              {/* Product Name / Title (60%) */}
              <div className="w-full sm:w-[60%]">
                <label className={theme.forms.label}>
                  Product Name / Title <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kanchipuram Pure Silk Saree — Royal Peacock & Gold Zari"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm text-[#12100D] placeholder-[#A89D8B] outline-none focus:outline-none focus:border-[#B87802] font-medium"
                  required
                />
              </div>
            </div>

            {/* Row 2: Category, Fabric Weave & Occasion in One Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${theme.forms.label} !mb-0`}>
                    Category <span className="text-[#B87802]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => openAttributeModal('category')}
                    className="text-[11px] font-bold text-[#B87802] hover:text-[#996300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Add Category</span>
                  </button>
                </div>
                <CustomDropdown
                  name="category"
                  value={formData.category}
                  options={availableCategories}
                  onChange={(newCategory) => {
                    setFormData((p) => ({
                      ...p,
                      category: newCategory,
                      sku: newCategory.trim() ? generateSKU(newCategory, products) : p.sku,
                    }));
                  }}
                  placeholder="e.g. Silk, Banarasi, Designer..."
                  required
                />
              </div>

              {/* Fabric Weave */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${theme.forms.label} !mb-0`}>
                    Fabric Weave
                  </label>
                  <button
                    type="button"
                    onClick={() => openAttributeModal('fabric')}
                    className="text-[11px] font-bold text-[#B87802] hover:text-[#996300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Add Fabric</span>
                  </button>
                </div>
                <CustomDropdown
                  name="fabric"
                  value={formData.fabric}
                  options={availableFabrics}
                  onChange={(newFabric) => {
                    setFormData((p) => ({
                      ...p,
                      fabric: newFabric,
                      sku: !formData.category && newFabric.trim() ? generateSKU(newFabric, products) : p.sku,
                    }));
                  }}
                  placeholder="e.g. Pure Mulberry Silk, Organza..."
                />
              </div>

              {/* Occasion */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${theme.forms.label} !mb-0`}>
                    Occasion
                  </label>
                  <button
                    type="button"
                    onClick={() => openAttributeModal('occasion')}
                    className="text-[11px] font-bold text-[#B87802] hover:text-[#996300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Add Occasion</span>
                  </button>
                </div>
                <CustomDropdown
                  name="occasion"
                  value={formData.occasion}
                  options={availableOccasions}
                  onChange={(newOccasion) => {
                    setFormData((p) => ({
                      ...p,
                      occasion: newOccasion,
                    }));
                  }}
                  placeholder="e.g. Festive, Wedding, Bridal, Casual..."
                />
              </div>
            </div>


          </div>

          {/* SECTION 2: Pricing & Inventory Control */}
          <div className="space-y-4">
            {/* Price, MRP & Stock in One 3-Column Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Selling Price */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={theme.forms.label}>
                    Selling Price (₹) <span className="text-[#B87802]">*</span>
                  </label>
                  {discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#FAF8F2] text-[#B87802] border border-[#E8D8B5]">
                      <Sparkles className="w-2.5 h-2.5" />
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#B87802] pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 14999"
                    className="w-full h-11 pl-8 pr-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm font-bold text-[#B87802] outline-none focus:outline-none focus:border-[#B87802]"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* MRP */}
              <div>
                <label className={theme.forms.label}>
                  MRP / Original Price (₹) <span className="text-[#B87802]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6B6457] pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleChange}
                    placeholder="e.g. 19999"
                    className="w-full h-11 pl-8 pr-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm font-semibold text-[#6B6457] line-through outline-none focus:border-[#B87802]"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Inventory Stock Quantity */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={theme.forms.label}>
                    Inventory Stock Quantity <span className="text-[#B87802]">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none mb-1.5">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-8 h-4.5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#B87802]"></div>
                    <span className="text-[11px] font-bold">
                      {formData.inStock ? (
                        <span className="text-emerald-700">In Stock</span>
                      ) : (
                        <span className="text-amber-800">Out of Stock</span>
                      )}
                    </span>
                  </label>
                </div>
                <input
                  type="number"
                  name="stockCount"
                  value={formData.stockCount}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="0"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm font-semibold text-[#12100D] outline-none focus:border-[#B87802]"
                />
              </div>
            </div>

            {/* Row 2: Low Stock Alert, Blouse Piece & Wash Care in One Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Low Stock Alert */}
              <div>
                <div className="flex items-center justify-between">
                  <label className={theme.forms.label}>
                    Low Stock Alert <span className="text-[#B87802]">*</span>
                  </label>
                  <span className="text-[11px] text-[#8C7E6A] font-medium">Threshold</span>
                </div>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={formData.lowStockAlert ?? ''}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  min="0"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm font-semibold text-[#12100D] outline-none focus:border-[#B87802]"
                />
                <p className="text-[10px] text-[#8C7E6A] mt-1">
                  Product shows in Low Stock Alerts only when stock is ≤ this value
                </p>
              </div>

              {/* Blouse Piece */}
              <div>
                <label className={theme.forms.label}>Blouse Piece</label>
                <SuggestionInput
                  name="blousePiece"
                  value={formData.blousePiece}
                  onChange={handleChange}
                  placeholder="e.g. Attached (80 cm)"
                  suggestions={BLOUSE_PIECE_SUGGESTIONS}
                />
              </div>

              {/* Wash Care */}
              <div>
                <label className={theme.forms.label}>Wash Care</label>
                <SuggestionInput
                  name="washCare"
                  value={formData.washCare}
                  onChange={handleChange}
                  placeholder="e.g. Dry Clean Only"
                  suggestions={WASH_CARE_SUGGESTIONS}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Description */}
          <div className="space-y-4">

            {/* Description */}
            <div>
              <label className={theme.forms.label}>
                Detailed Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the weave, pallu, border zari, artisan story, and styling tips..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8D8B5] bg-card text-xs sm:text-sm text-[#12100D] outline-none focus:border-[#B87802] font-body"
              />
            </div>
          </div>

          {/* Product Badges & Highlights */}
          <div className="space-y-2">
            <label className={theme.forms.label}>
              Product Badges & Highlights
            </label>
            <div className="flex items-center gap-6 text-xs font-semibold text-[#12100D]">
              <label className={`flex items-center gap-2 cursor-pointer select-none ${theme.forms.labelInline}`}>
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#B87802] border-[#E8D8B5] focus:ring-[#F5B815]"
                />
                <span className="flex items-center gap-1">
                  <span>New Arrival</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#F5B815] text-[#0C0A07] font-bold">
                    NEW
                  </span>
                </span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer select-none ${theme.forms.labelInline}`}>
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#B87802] border-[#E8D8B5] focus:ring-[#F5B815]"
                />
                <span className="flex items-center gap-1">
                  <span>Best Seller</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#B87802] text-white font-bold">
                    BEST
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* SECTION 4: Color Palette */}
          <div className="space-y-4">
            <div>
              {/* TOP: Added Color Chips (displayed right above the input box) */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#12100D] flex items-center gap-1.5">
                    <span>Added Colors ({colors.length})</span>
                    {colors.length > 0 && (
                      <span className="text-[11px] font-normal text-[#8C7E6A]">
                        — Click to select & assign photos below
                      </span>
                    )}
                  </span>
                  {activeColor && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 border"
                      style={{
                        backgroundColor: activeColor.code && activeColor.code.startsWith('#') ? `${activeColor.code}15` : '#FAF8F2',
                        borderColor: activeColor.code && activeColor.code.startsWith('#') ? `${activeColor.code}60` : '#E8D8B5',
                        color: '#12100D',
                      }}
                    >
                      <span className="text-[#8C7E6A]">Active:</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: activeColor.code }}
                      />
                      <span>{activeColor.name}</span>
                    </span>
                  )}
                </div>

                {colors.length === 0 ? (
                  <div className="p-3 rounded-lg border border-dashed border-[#E8D8B5] bg-[#FAF8F2]/60 text-xs text-[#8C7E6A]">
                    Enter a color code or name below and click <strong>+ Add Color</strong> to add it here.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => {
                      const isActive = activeColor?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleSelectColor(c.id)}
                          style={getActiveColorStyle(c.code, isActive)}
                          className={`group flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${isActive
                            ? 'font-bold'
                            : 'bg-white text-[#12100D] border-[#E8D8B5] hover:border-[#B87802] hover:bg-[#FAF8F2]'
                            }`}
                        >
                          {/* Color preview circle */}
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: c.code }}
                          />
                          <span className={isActive ? 'text-[#12100D] font-bold' : 'text-[#12100D]'}>{c.name}</span>

                          {isActive && (
                            <Check
                              className="w-3.5 h-3.5 stroke-[3]"
                              style={{ color: c.code && c.code.startsWith('#') ? c.code : '#B87802' }}
                            />
                          )}

                          {/* Delete color button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveColor(c.id);
                            }}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-[#8C7E6A]"
                            title="Remove color"
                          >
                            <X className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {colors.length > 0 && activeColor && (
                  <div className="flex items-center justify-between text-xs pt-1 px-0.5">
                    <span className="text-[#6B6457] flex items-center gap-1.5 text-[11px]">
                      <span>Selected for photo assignment:</span>
                      <strong className="text-[#12100D] flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: activeColor.code }}
                        />
                        <span className="font-body font-semibold">{activeColor.name}</span>
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('product-photos-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] font-semibold text-[#B87802] hover:text-[#996300] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Manage photos for <span className="font-body font-semibold">{activeColor.name}</span> below ↓</span>
                    </button>
                  </div>
                )}
              </div>

              {/* INPUT: Add Color Code Box */}
              <div className="space-y-1.5">
                <label className={theme.forms.label}>
                  Add Color Code or Name <span className="text-[#B87802]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {/* Native Color Picker Swatch */}
                  <div className="relative w-11 h-11 rounded-lg border border-[#E8D8B5] overflow-hidden shrink-0 bg-white hover:border-[#B87802] cursor-pointer flex items-center justify-center">
                    <input
                      type="color"
                      value={colorPickerHex}
                      onChange={(e) => {
                        setColorPickerHex(e.target.value);
                        setColorInput(e.target.value);
                      }}
                      className="absolute -inset-2 w-16 h-16 cursor-pointer opacity-0"
                      title="Pick a color swatch"
                    />
                    <span
                      className="w-6 h-6 rounded-md border border-black/20 pointer-events-none"
                      style={{ backgroundColor: colorPickerHex }}
                    />
                  </div>

                  {/* Text Input for Color Name or Hex Code with Custom Floating Dropdown Menu */}
                  <CustomDropdown
                    name="colorInput"
                    value={colorInput}
                    options={POPULAR_COLORS.map((c) => ({ label: `${c.name} (${c.hex})`, value: c.name }))}
                    onChange={(val) => {
                      setColorInput(val);
                      const matchedHex = resolveColorToHex(val);
                      if (matchedHex) {
                        setColorPickerHex(matchedHex);
                      }
                    }}
                    placeholder="Enter color name (e.g. Peacock Blue, Maroon, Gold) or hex code (#C70039)"
                    className="flex-1"
                  />

                  {/* Add Color Button */}
                  <button
                    type="button"
                    onClick={() => handleAddColor(colorInput)}
                    className="h-11 px-4 rounded-lg bg-gradient-to-r from-[#B87802] to-[#996300] text-white text-xs font-semibold uppercase tracking-wider hover:from-[#C98704] hover:to-[#A86E02] transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Color</span>
                  </button>
                </div>
              </div>


            </div>
          </div>

          {/* SECTION 5: Product Photos */}
          <div id="product-photos-section" className="space-y-5 scroll-mt-6">


            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className={`${theme.forms.label} !mb-0 flex items-center gap-1.5`}>
                  <span>Photos {activeColor ? 'for ' : ''}</span>
                  {activeColor && (
                    <span className="font-body font-semibold tracking-normal text-[#12100D]">
                      {activeColor.name}
                    </span>
                  )}
                  <span className="text-[#B87802]">*</span>
                </label>
                <div className="inline-flex items-center p-0.5 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] text-xs">
                  <button
                    type="button"
                    onClick={() => setGalleryMode('upload')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm font-medium transition-all cursor-pointer ${galleryMode === 'upload'
                      ? 'bg-white text-[#12100D] border border-[#E8D8B5]'
                      : 'text-[#6B6457] hover:text-[#12100D]'
                      }`}
                  >
                    <Upload className="w-3 h-3 text-[#B87802]" />
                    <span>Upload from Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryMode('url')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm font-medium transition-all cursor-pointer ${galleryMode === 'url'
                      ? 'bg-white text-[#12100D] border border-[#E8D8B5]'
                      : 'text-[#6B6457] hover:text-[#12100D]'
                      }`}
                  >
                    <LinkIcon className="w-3 h-3 text-[#B87802]" />
                    <span>Enter URLs</span>
                  </button>
                </div>
              </div>

              {/* Hidden file input for desktop photo upload */}
              <input
                ref={galleryFileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleGalleryFiles(e.target.files);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />

              {galleryMode === 'upload' ? (
                <div className="space-y-3">
                  {currentPhotos.length === 0 && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingPhotos(true);
                      }}
                      onDragLeave={() => setIsDraggingPhotos(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingPhotos(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleGalleryFiles(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer ${isDraggingPhotos
                        ? 'border-[#B87802] bg-[#FAF8F2]'
                        : 'border-[#E8D8B5] hover:border-[#B87802] bg-[#FAF8F2]/40 hover:bg-[#FAF8F2]'
                        }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center mx-auto mb-3 text-[#B87802]">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-[#12100D] mb-1">
                        Click to choose photo(s) {activeColor ? `for ${activeColor.name}` : ''} from desktop, or drag & drop here
                      </p>
                      <p className="text-xs text-[#8C7E6A] mb-3">
                        JPG, PNG, WEBP, or AVIF (auto-optimized for fast storefront rendering)
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white text-xs font-semibold uppercase tracking-wider hover:from-[#C98704] hover:to-[#A86E02] transition-all cursor-pointer"
                      >
                        Browse Desktop Files
                      </button>
                    </div>
                  )}

                  {isProcessingImage && (
                    <div className="flex items-center gap-2 text-xs text-[#B87802] font-medium pt-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing photo(s)...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrl();
                        }
                      }}
                      placeholder={`Paste image URL for ${activeColor ? activeColor.name : 'product'} (e.g. https://...)`}
                      className="flex-1 h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm text-[#12100D] outline-none focus:outline-none focus:border-[#B87802]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="h-11 px-4 rounded-lg bg-gradient-to-r from-[#B87802] to-[#996300] text-white text-xs font-semibold uppercase tracking-wider hover:from-[#C98704] hover:to-[#A86E02] transition-all cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      + Add URL
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8C7E6A]">
                    Paste an image URL or multiple comma-separated URLs and click "+ Add URL".
                  </p>
                </div>
              )}

              {/* Photos Gallery Thumbnails Grid for active color */}
              {currentPhotos.length > 0 && (
                <div className="pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {currentPhotos.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-3/4 rounded-lg overflow-hidden border border-[#E8D8B5] bg-white"
                      >
                        <img
                          src={imgUrl}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="10">Invalid Img</text></svg>';
                          }}
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xs bg-[#0C0A07]/80 text-[#F5B815] text-[10px] font-bold">
                          {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ))}

                    {/* Add More Button / Tile in Upload Mode */}
                    {galleryMode === 'upload' && (
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="aspect-3/4 rounded-lg border-2 border-dashed border-[#E8D8B5] hover:border-[#B87802] bg-[#FAF8F2]/60 hover:bg-[#FAF8F2] flex flex-col items-center justify-center gap-1.5 p-2 transition-all cursor-pointer text-[#8C7E6A] hover:text-[#B87802]"
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                        <span className="text-xs font-semibold text-center">Add Photos</span>
                        <span className="text-[10px] text-center text-[#A89D8B]">
                          {activeColor ? `for ${activeColor.name}` : 'from Desktop'}
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8C7E6A] mt-2">
                    First photo is used as the cover photo for {activeColor ? activeColor.name : 'this product'}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Row Inside Single Card */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-[#E8D8B5] text-[#6B6457] hover:text-[#12100D] hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="px-5 py-2.5 rounded-md border border-[#E8D8B5] bg-white text-[#12100D] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 font-medium text-xs tracking-wider uppercase hover:from-[#C98704] hover:to-[#A86E02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Backend...</span>
                  </>
                ) : (
                  <>
                    <PackagePlus className="w-4 h-4" />
                    <span>{isEdit ? 'Save Changes' : 'Publish Saree to Store'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FEE63E]" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </form>

      {/* Small Modal for Adding Category / Fabric / Occasion */}
      {attributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E8D8B5] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B5]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] text-[#B87802] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#12100D]">
                    Add New {attributeModal.type === 'category' ? 'Category' : attributeModal.type === 'fabric' ? 'Fabric Weave' : 'Occasion'}
                  </h3>
                  <p className="text-[11px] text-[#6B6457]">
                    Saves to database and automatically adds to your dropdown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAttributeModal}
                disabled={attrLoading}
                className="w-7 h-7 rounded-md text-[#6B6457] hover:text-[#12100D] hover:bg-[#FAF8F2] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {attrError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{attrError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAttribute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1">
                  {attributeModal.type === 'category' ? 'Category Name' : attributeModal.type === 'fabric' ? 'Fabric Name' : 'Occasion Name'} <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={attrForm.name}
                  onChange={(e) => setAttrForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder={
                    attributeModal.type === 'category'
                      ? 'e.g. Kanchipuram Silk, Banarasi, Designer'
                      : attributeModal.type === 'fabric'
                        ? 'e.g. Pure Mulberry Silk, Organza, Tussar'
                        : 'e.g. Sangeet, Reception, Pooja'
                  }
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8D8B5] bg-card text-sm text-[#12100D] outline-none focus:outline-none focus:border-[#B87802]"
                />
              </div>

              {/* Added Attributes Chips List with Hover-to-Reveal Close Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#12100D]">
                    Added {attributeModal.type === 'category' ? 'Categories' : attributeModal.type === 'fabric' ? 'Fabrics' : 'Occasions'}
                  </label>
                  <span className="text-[11px] text-[#8C7E6A] font-medium">
                    Hover to delete
                  </span>
                </div>

                <div className="min-h-[68px] max-h-48 overflow-y-auto p-2.5 rounded-lg border border-[#E8D8B5] bg-[#FAF8F2]/60 flex flex-wrap gap-1.5 content-start">
                  {(() => {
                    const currentList =
                      attributeModal.type === 'category'
                        ? availableCategories
                        : attributeModal.type === 'fabric'
                          ? availableFabrics
                          : availableOccasions;

                    if (!currentList || currentList.length === 0) {
                      return (
                        <span className="text-xs text-[#A89D8B] italic p-1">
                          No {attributeModal.type === 'category' ? 'categories' : attributeModal.type === 'fabric' ? 'fabrics' : 'occasions'} added yet
                        </span>
                      );
                    }

                    return currentList.map((item) => (
                      <div
                        key={item}
                        className="group relative inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E8D8B5] text-[#12100D] hover:border-[#B87802] transition-all"
                      >
                        <span className="truncate max-w-[170px]">{item}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttribute(item, attributeModal.type);
                          }}
                          disabled={attrDeleting === item}
                          className="w-4 h-4 rounded-full bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                          title={`Remove "${item}"`}
                        >
                          {attrDeleting === item ? (
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <X className="w-2.5 h-2.5 stroke-[2.5]" />
                          )}
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeAttributeModal}
                  disabled={attrLoading}
                  className="px-4 py-2.5 rounded-lg border border-[#E8D8B5] bg-white text-[#12100D] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attrLoading || !attrForm.name.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#B87802] to-[#996300] text-white text-xs font-bold uppercase tracking-wider hover:from-[#C98704] hover:to-[#A86E02] transition-all cursor-pointer disabled:opacity-50"
                >
                  {attrLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save to DB & Select</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProductPage;
