import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Eye,
  AlertCircle,
  Star
} from 'lucide-react';
import { api, STORE_URL } from '../services/api';

const SAMPLE_IMAGES = [
  {
    title: 'Kanchipuram Maroon Zari',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    color: 'Maroon',
    category: 'Silk',
  },
  {
    title: 'Rose Gold Soft Silk',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    color: 'Pink',
    category: 'Silk',
  },
  {
    title: 'Ivory Handloom Cotton',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    color: 'Ivory',
    category: 'Cotton',
  },
  {
    title: 'Mustard Temple Festive',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    color: 'Mustard',
    category: 'Festive',
  },
  {
    title: 'Royal Red Bridal Zari',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80',
    color: 'Red',
    category: 'Wedding',
  },
  {
    title: 'Midnight Sequin Party',
    url: 'https://images.unsplash.com/photo-1610030469668-9655ecdd4e35?auto=format&fit=crop&w=1200&q=80',
    color: 'Navy',
    category: 'Party Wear',
  },
];

const PRESET_COLORS = [
  { name: 'Maroon', bg: '#800000', text: '#FFFFFF' },
  { name: 'Red', bg: '#DC2626', text: '#FFFFFF' },
  { name: 'Mustard', bg: '#D97706', text: '#FFFFFF' },
  { name: 'Gold', bg: '#F5B815', text: '#0C0A07' },
  { name: 'Pink', bg: '#EC4899', text: '#FFFFFF' },
  { name: 'Green', bg: '#059669', text: '#FFFFFF' },
  { name: 'Navy', bg: '#1E3A8A', text: '#FFFFFF' },
  { name: 'Ivory', bg: '#FAF8F2', text: '#12100D', border: true },
  { name: 'Beige', bg: '#D4C5A9', text: '#12100D' },
  { name: 'Teal', bg: '#0D9488', text: '#FFFFFF' },
  { name: 'Purple', bg: '#7E22CE', text: '#FFFFFF' },
  { name: 'Black', bg: '#111827', text: '#FFFFFF' },
];

const CATEGORIES = [
  'Silk',
  'Cotton',
  'Designer',
  'Wedding',
  'Party Wear',
  'Bridal',
  'Festive',
  'Other',
];

const OCCASIONS = ['Festive', 'Wedding', 'Bridal', 'Party', 'Daily Wear', 'Casual'];

const FABRICS = [
  'Pure Mulberry Silk',
  'Soft Silk',
  'Banarasi Silk',
  'Art Silk',
  'Pure Linen',
  'Handloom Cotton',
  'Organza',
  'Chiffon',
  'Georgette with Sequins',
  'Pure Silk with Zari',
];

export function AddProductModal({ isOpen, onClose, onSuccess, initialProduct = null }) {
  const isEdit = Boolean(initialProduct);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Silk',
    fabric: 'Pure Mulberry Silk',
    color: 'Maroon',
    occasion: 'Festive',
    price: '',
    mrp: '',
    stockCount: 25,
    inStock: true,
    image: '',
    gallery: '',
    description: '',
    length: '6.3 metres (with blouse piece)',
    blousePiece: 'Included — running blouse',
    washCare: 'Dry clean only',
    isBestSeller: false,
    isNewArrival: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Auto-generate unique SKU
  const generateSKU = (cat = formData.category) => {
    const prefix = cat ? cat.substring(0, 3).toUpperCase() : 'CF';
    const rand = Math.floor(100 + Math.random() * 900);
    return `CF-${prefix}-${rand}`;
  };

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        sku: initialProduct.sku || generateSKU(initialProduct.category),
        category: initialProduct.category || 'Silk',
        fabric: initialProduct.fabric || 'Pure Mulberry Silk',
        color: initialProduct.color || 'Maroon',
        occasion: initialProduct.occasion || 'Festive',
        price: initialProduct.price || '',
        mrp: initialProduct.mrp || '',
        stockCount: initialProduct.stockCount ?? 25,
        inStock: initialProduct.inStock ?? true,
        image: initialProduct.image || '',
        gallery: Array.isArray(initialProduct.gallery) ? initialProduct.gallery.join(', ') : '',
        description: initialProduct.description || '',
        length: initialProduct.length || '6.3 metres (with blouse piece)',
        blousePiece: initialProduct.blousePiece || 'Included — running blouse',
        washCare: initialProduct.washCare || 'Dry clean only',
        isBestSeller: initialProduct.isBestSeller ?? false,
        isNewArrival: initialProduct.isNewArrival ?? true,
      });
    } else {
      setFormData({
        name: '',
        sku: generateSKU('Silk'),
        category: 'Silk',
        fabric: 'Pure Mulberry Silk',
        color: 'Maroon',
        occasion: 'Festive',
        price: '',
        mrp: '',
        stockCount: 25,
        inStock: true,
        image: SAMPLE_IMAGES[0].url,
        gallery: '',
        description: 'Handcrafted pure silk saree woven with fine gold zari and classic motifs. Perfect drape for celebrations and special occasions.',
        length: '6.3 metres (with blouse piece)',
        blousePiece: 'Included — running blouse',
        washCare: 'Dry clean only',
        isBestSeller: false,
        isNewArrival: true,
      });
    }
    setError('');
    setSuccessInfo(null);
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  // Calculate live discount percent
  const numPrice = Number(formData.price) || 0;
  const numMrp = Number(formData.mrp) || 0;
  const discountPercent =
    numMrp > numPrice && numPrice > 0
      ? Math.round(((numMrp - numPrice) / numMrp) * 100)
      : 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) throw new Error('Please enter product name');
      if (!formData.sku.trim()) throw new Error('Please enter or generate a SKU');
      if (!formData.price || Number(formData.price) <= 0)
        throw new Error('Please enter a valid selling price');
      if (!formData.mrp || Number(formData.mrp) <= 0)
        throw new Error('Please enter a valid MRP price');
      if (Number(formData.price) > Number(formData.mrp)) {
        throw new Error('Selling price cannot be greater than MRP');
      }
      if (!formData.image.trim()) throw new Error('Please provide a product image URL');

      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        fabric: formData.fabric.trim() || 'Pure Silk',
        color: formData.color.trim() || 'Multicolor',
        occasion: formData.occasion,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stockCount: Number(formData.stockCount) || 0,
        inStock: Boolean(formData.inStock),
        image: formData.image.trim(),
        gallery: formData.gallery
          ? formData.gallery.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        description: formData.description.trim(),
        length: formData.length.trim(),
        blousePiece: formData.blousePiece.trim(),
        washCare: formData.washCare.trim(),
        isBestSeller: Boolean(formData.isBestSeller),
        isNewArrival: Boolean(formData.isNewArrival),
      };

      let result;
      if (isEdit && initialProduct._id) {
        result = await api.updateProduct(initialProduct._id, payload);
      } else {
        result = await api.createProduct(payload);
      }

      setSuccessInfo(result.data || payload);
      if (onSuccess) onSuccess(result.data || payload);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save product to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg border border-[#E8D8B5] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header matching http://localhost:3000/ */}
        <div className="px-6 py-4 border-b border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30 flex items-center justify-center shadow-md">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold font-display text-[#12100D] flex items-center gap-2">
                {isEdit ? 'Edit Product Details' : 'Add New Saree to Store'}
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-[#6B6457] font-body">
                Configured with category, colors, and prices. Automatically updates http://localhost:3000/.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-[#6B6457] hover:text-[#12100D] hover:bg-white border border-transparent hover:border-[#E8D8B5] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner if Product Just Saved */}
        {successInfo && (
          <div className="m-6 p-4 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm font-display">
                  {isEdit ? 'Product updated successfully!' : 'Product added successfully!'}
                </p>
                <p className="text-xs text-emerald-800 font-body">
                  "{successInfo.name}" is now live in the database and visible on http://localhost:3000/.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 text-xs font-medium uppercase tracking-wider shadow-sm hover:from-[#C98704] hover:to-[#A86E02]"
              >
                <span>Check Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-md border border-[#E8D8B5] bg-white text-[#12100D] hover:bg-[#FAF8F2] text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-body">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Core Fields */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Product Title / Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 font-body">
                  Product Name / Title <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kanchipuram Pure Silk Saree — Royal Peacock & Gold Zari"
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm text-[#12100D] placeholder-[#A89D8B] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815] font-medium"
                  required
                />
              </div>

              {/* SKU & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] font-body">
                      SKU Code <span className="text-[#B87802]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, sku: generateSKU(p.category) }))}
                      className="text-[11px] text-[#B87802] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto-gen
                    </button>
                  </div>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. CF-SIL-001"
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm text-[#12100D] font-mono uppercase outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 font-body">
                    Category <span className="text-[#B87802]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      handleChange(e);
                      const matching = SAMPLE_IMAGES.find(img => img.category === e.target.value);
                      if (matching && !formData.image) {
                        setFormData(p => ({ ...p, image: matching.url, color: matching.color }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm text-[#12100D] font-medium outline-none focus:border-[#B87802] cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Selection (Critical Requirement) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] flex items-center gap-1.5 font-body">
                    <Palette className="w-3.5 h-3.5 text-[#B87802]" />
                    Color Palette <span className="text-[#B87802]">*</span>
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#FAF8F2] border border-[#E8D8B5] text-[#B87802]">
                    Selected: {formData.color || 'None'}
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = formData.color.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => setFormData(p => ({ ...p, color: c.name }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'ring-2 ring-[#B87802] ring-offset-1 shadow-sm border-[#B87802]'
                            : 'border-[#E8D8B5] hover:border-[#B87802]'
                        }`}
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full border ${
                            c.border ? 'border-gray-400' : 'border-white/40'
                          }`}
                          style={{ backgroundColor: c.bg }}
                        />
                        <span>{c.name}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Or enter custom color (e.g. Royal Peacock Blue, Pastel Mint)"
                  className="w-full px-3.5 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs text-[#12100D] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                />
              </div>

              {/* Pricing Row: Price & MRP with live Discount Badge */}
              <div className="p-4 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] flex items-center gap-1.5 font-body">
                    <IndianRupee className="w-3.5 h-3.5 text-[#B87802]" />
                    Pricing & Discount
                  </span>
                  {discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
                      <Sparkles className="w-3 h-3 text-[#FEE63E]" />
                      {discountPercent}% OFF on Store
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selling Price */}
                  <div>
                    <label className="block text-xs font-semibold text-[#12100D] mb-1">
                      Selling Price (₹) <span className="text-[#B87802]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-semibold text-[#B87802]">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="e.g. 14999"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm font-bold text-[#B87802] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-xs font-semibold text-[#12100D] mb-1">
                      MRP / Original Price (₹) <span className="text-[#B87802]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-semibold text-[#6B6457]">₹</span>
                      <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleChange}
                        placeholder="e.g. 19999"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm font-semibold text-[#6B6457] line-through outline-none focus:border-[#B87802]"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fabric & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 font-body">
                    Fabric Weave
                  </label>
                  <input
                    list="fabric-options"
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleChange}
                    placeholder="e.g. Pure Mulberry Silk"
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm text-[#12100D] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                  />
                  <datalist id="fabric-options">
                    {FABRICS.map((f) => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 font-body">
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-sm text-[#12100D] font-medium outline-none focus:border-[#B87802] cursor-pointer"
                  >
                    {OCCASIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock & Availability */}
              <div className="p-4 rounded-lg bg-white border border-[#E8D8B5] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1 font-body">
                      Inventory Stock Count
                    </label>
                    <input
                      type="number"
                      name="stockCount"
                      value={formData.stockCount}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      min="0"
                      className="w-full px-3.5 py-2 rounded-sm border border-[#E8D8B5] bg-card text-sm font-semibold text-[#12100D] outline-none focus:border-[#B87802]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B87802]"></div>
                      <span className="ml-3 text-xs font-bold text-[#12100D]">
                        {formData.inStock ? 'In Stock (Buyable)' : 'Out of Stock'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Badges Toggle */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#E8D8B5]/60 text-xs font-semibold text-[#12100D]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-[#B87802] border-[#E8D8B5] focus:ring-[#F5B815]"
                    />
                    <span>Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-[#B87802] border-[#E8D8B5] focus:ring-[#F5B815]"
                    />
                    <span>New Arrival Badge</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 font-body">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the weave, pallu, border zari, and styling tips..."
                  className="w-full px-3.5 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs text-[#12100D] outline-none focus:border-[#B87802]"
                />
              </div>

              {/* Specifications: Length, Blouse, Wash Care */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#12100D] mb-1">Length</label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 rounded-sm border border-[#E8D8B5] bg-card"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12100D] mb-1">Blouse Piece</label>
                  <input
                    type="text"
                    name="blousePiece"
                    value={formData.blousePiece}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 rounded-sm border border-[#E8D8B5] bg-card"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12100D] mb-1">Wash Care</label>
                  <input
                    type="text"
                    name="washCare"
                    value={formData.washCare}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 rounded-sm border border-[#E8D8B5] bg-card"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Image URL & Live Store Card Preview */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5 flex items-center gap-1.5 font-body">
                  <ImageIcon className="w-3.5 h-3.5 text-[#B87802]" />
                  Product Image URL <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-sm border border-[#E8D8B5] bg-card text-xs text-[#12100D] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                  required
                />
              </div>

              {/* Sample Image Presets */}
              <div>
                <span className="block text-[11px] font-semibold text-[#6B6457] mb-2 uppercase tracking-[0.15em]">
                  Quick Select Sample Saree Image:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.title}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          image: img.url,
                          color: img.color,
                          category: img.category,
                        }))
                      }
                      className={`group relative rounded-sm overflow-hidden border aspect-[4/3] transition-all cursor-pointer ${
                        formData.image === img.url
                          ? 'border-[#B87802] ring-2 ring-[#B87802]'
                          : 'border-[#E8D8B5] hover:opacity-90'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-[#0C0A07]/80 text-[#FAF8F2] text-[9px] p-1 truncate text-center font-medium">
                        {img.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Card Preview (Matches localhost:3000 Store Card exactly) */}
              <div className="p-4 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#12100D] flex items-center gap-1.5 font-body">
                    <Eye className="w-3.5 h-3.5 text-[#B87802]" />
                    Live Store Card Preview (localhost:3000)
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
                    Exact Match
                  </span>
                </div>

                {/* Simulated Customer Product Card from http://localhost:3000/ */}
                <div className="bg-white rounded-lg border border-[#E8D8B5] overflow-hidden shadow-sm max-w-[280px] mx-auto transition-all">
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt={formData.name || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#A89D8B] p-4 text-center">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs">Image preview will show here</span>
                      </div>
                    )}

                    {/* Store Badges matching website theme */}
                    {discountPercent > 0 && (
                      <span className="absolute top-3 left-3 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30 px-2 py-1 text-[11px] font-semibold tracking-wide">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {formData.isNewArrival && (
                      <span className="absolute top-3 right-3 rounded-sm bg-[#F5B815] text-[#0C0A07] px-2 py-1 text-[11px] font-bold tracking-wide shadow-sm">
                        NEW
                      </span>
                    )}

                    {formData.isBestSeller && !formData.isNewArrival && (
                      <span className="absolute top-3 right-3 rounded-sm bg-[#B87802] text-white px-2 py-1 text-[11px] font-bold tracking-wide shadow-sm">
                        BEST SELLER
                      </span>
                    )}

                    {!formData.inStock && (
                      <span className="absolute inset-x-0 bottom-0 bg-[#0C0A07]/85 py-2 text-center text-xs tracking-widest text-[#FAF8F2] uppercase font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-[#6B6457]">
                      {formData.fabric || 'Pure Silk'}
                    </p>

                    <h4 className="font-display text-lg font-medium text-[#12100D] line-clamp-1 leading-snug">
                      {formData.name || 'Saree Title'}
                    </h4>

                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-[#F5B815] text-[#F5B815]" />
                      <span className="font-medium text-xs text-[#12100D]">4.8</span>
                      <span className="text-xs text-[#6B6457]">(42)</span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-[#E8D8B5]/50">
                      <span className="text-lg font-semibold text-[#B87802]">
                        ₹{Number(formData.price || 0).toLocaleString('en-IN')}
                      </span>
                      {Number(formData.mrp) > Number(formData.price) && (
                        <span className="text-sm text-[#6B6457] line-through">
                          ₹{Number(formData.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-center text-[#6B6457] mt-3 font-body">
                  Renders with this exact styling on <strong className="text-[#12100D]">localhost:3000</strong> once submitted!
                </p>
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8D8B5] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-md border border-[#E8D8B5] text-[#12100D] hover:bg-[#FAF8F2] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 font-medium text-xs tracking-wider uppercase shadow-md shadow-[#B87802]/30 hover:from-[#C98704] hover:to-[#A86E02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Backend...</span>
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
        </form>

      </div>
    </div>
  );
}
