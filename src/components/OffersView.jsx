import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  X,
  Upload,
  Percent,
  Clock,
  ArrowLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Gift,
  ShoppingBag,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  FolderPlus,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { api, STORE_URL } from '../services/api';
import { theme } from '../theme';

const DEFAULT_CATEGORIES = [
  'All',
  'Silk',
  'Cotton',
  'Designer',
  'Wedding',
  'Party Wear',
  'Bridal',
  'Festive',
  'Other',
];

export function OffersView({ onNotify }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  const [editingOffer, setEditingOffer] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Dynamic Categories State & Add Category Modal
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);

  // Available Store Products State for "Without Coupon" Product Selector
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    offerType: 'with_coupon', // 'with_coupon' | 'without_coupon'
    hasCoupon: true,
    code: '',
    discountType: 'percentage', // 'percentage' | 'flat'
    discountValue: 20,
    minOrderValue: 2999,
    badge: 'LIMITED TIME',
    image: '',
    validTill: 'Valid until 31 Dec 2026',
    terms: 'Valid on select authentic handwoven sarees. Cannot be clubbed with other promotional codes.',
    category: 'All',
    selectedProducts: [],
    applyToAllInCategory: false,
    order: 1,
    isActive: true,
  });

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await api.getOffers({ all: true });
      if (res && res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      if (onNotify) onNotify(err.message || 'Failed to fetch offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const fetched = await api.getCategories();
      if (Array.isArray(fetched) && fetched.length > 0) {
        const unique = Array.from(new Set(['All', ...fetched]));
        setCategories(unique);
      }
    } catch (err) {
      console.warn('Using default categories:', err);
    }
  };

  const loadProducts = async () => {
    if (allProducts.length > 0) return;
    setProductsLoading(true);
    try {
      const res = await api.getProducts();
      const list = Array.isArray(res) ? res : res?.data || [];
      setAllProducts(list);
    } catch (err) {
      console.error('Error loading products for offer selector:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    loadCategories();
    loadProducts();
  }, []);

  const openCreateForm = () => {
    setEditingOffer(null);
    setFileName('');
    setProductSearch('');
    setFormData({
      title: '',
      subtitle: '',
      offerType: 'with_coupon',
      hasCoupon: true,
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 2499,
      badge: 'FESTIVE SALE',
      image: '',
      validTill: 'Limited Period Offer',
      terms: 'Applicable on authentic handwoven sarees above minimum purchase.',
      category: 'All',
      selectedProducts: [],
      applyToAllInCategory: false,
      order: (offers.length || 0) + 1,
      isActive: true,
    });
    setViewMode('form');
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditForm = (offer) => {
    setEditingOffer(offer);
    setFileName('');
    setProductSearch('');
    const isWithCoupon = offer.offerType !== 'without_coupon' && offer.hasCoupon !== false;
    setFormData({
      title: offer.title || '',
      subtitle: offer.subtitle || '',
      offerType: isWithCoupon ? 'with_coupon' : 'without_coupon',
      hasCoupon: isWithCoupon,
      code: offer.code || '',
      discountType: offer.discountType || 'percentage',
      discountValue: offer.discountValue !== undefined ? offer.discountValue : 15,
      minOrderValue: offer.minOrderValue !== undefined ? offer.minOrderValue : 0,
      badge: offer.badge || 'LIMITED TIME',
      image: offer.image || '',
      validTill: offer.validTill || 'Limited Period Offer',
      terms: offer.terms || '',
      category: offer.category || 'All',
      selectedProducts: Array.isArray(offer.selectedProducts) ? offer.selectedProducts : [],
      applyToAllInCategory: Boolean(offer.applyToAllInCategory),
      order: offer.order !== undefined ? offer.order : 1,
      isActive: offer.isActive !== false,
    });
    setViewMode('form');
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.) from your computer');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleAddNewCategory = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      alert('Please enter a valid category name');
      return;
    }

    setCategorySaving(true);
    try {
      await api.createCategory({ name: trimmed });
      setCategories((prev) => {
        const next = Array.from(new Set([...prev, trimmed]));
        return next;
      });
      setFormData((prev) => ({ ...prev, category: trimmed }));
      setNewCategoryName('');
      setShowCategoryModal(false);
      if (onNotify) onNotify(`Category "${trimmed}" added successfully!`, 'success');
    } catch (err) {
      console.error('Failed to create category:', err);
      // Fallback: still add locally so the admin can proceed without interruption
      setCategories((prev) => Array.from(new Set([...prev, trimmed])));
      setFormData((prev) => ({ ...prev, category: trimmed }));
      setNewCategoryName('');
      setShowCategoryModal(false);
      if (onNotify) onNotify(`Category "${trimmed}" set for this offer`, 'info');
    } finally {
      setCategorySaving(false);
    }
  };

  // Toggle individual product selection
  const handleToggleProduct = (productId) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(productId);
      const updated = exists
        ? prev.selectedProducts.filter((id) => id !== productId)
        : [...prev.selectedProducts, productId];
      return { ...prev, selectedProducts: updated };
    });
  };

  // Select/Deselect all filtered products
  const handleSelectAllFiltered = (filteredList) => {
    const allFilteredIds = filteredList.map((p) => p.id || p._id || p.sku);
    const allSelected = allFilteredIds.every((id) => formData.selectedProducts.includes(id));

    setFormData((prev) => {
      if (allSelected) {
        // Deselect filtered
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter((id) => !allFilteredIds.includes(id)),
        };
      } else {
        // Select all filtered
        return {
          ...prev,
          selectedProducts: Array.from(new Set([...prev.selectedProducts, ...allFilteredIds])),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an offer title');
      return;
    }

    const isWithCoupon = formData.offerType === 'with_coupon';

    if (isWithCoupon && !formData.code.trim()) {
      alert('Please enter a coupon code for coupon offer');
      return;
    }

    if (!isWithCoupon && !formData.applyToAllInCategory && formData.selectedProducts.length === 0) {
      alert('Please select at least one product for this direct offer or enable "Apply to all products in category".');
      return;
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      alert('Please enter a valid discount value');
      return;
    }
    if (!formData.image || !formData.image.trim()) {
      alert('Please upload a banner photo from your desktop');
      return;
    }

    setSaving(true);
    try {
      const cleanCode = isWithCoupon
        ? formData.code.trim().toUpperCase()
        : (editingOffer?.code || 'DIRECT-' + Date.now().toString().slice(-6));

      const payload = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        offerType: formData.offerType,
        hasCoupon: isWithCoupon,
        code: cleanCode,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        badge: formData.badge.trim() || (isWithCoupon ? 'COUPON DEAL' : 'DIRECT SALE'),
        image: formData.image.trim(),
        validTill: formData.validTill.trim() || 'Limited Period Offer',
        terms: formData.terms.trim(),
        category: formData.category.trim() || 'All',
        selectedProducts: isWithCoupon ? [] : formData.selectedProducts,
        applyToAllInCategory: isWithCoupon ? false : Boolean(formData.applyToAllInCategory),
        order: Number(formData.order) || 1,
        isActive: Boolean(formData.isActive),
      };

      if (editingOffer) {
        await api.updateOffer(editingOffer._id || editingOffer.id, payload);
        if (onNotify) onNotify(`Offer "${payload.title}" updated successfully!`, 'success', `${STORE_URL}/offers`);
      } else {
        await api.createOffer(payload);
        if (onNotify) onNotify(`Offer "${payload.title}" published to storefront!`, 'success', `${STORE_URL}/offers`);
      }

      setViewMode('list');
      await loadOffers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Failed to save offer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offer) => {
    if (!confirm(`Are you sure you want to remove offer "${offer.title}"?`)) return;
    try {
      await api.deleteOffer(offer._id || offer.id);
      if (onNotify) onNotify(`Offer "${offer.title}" removed`, 'info');
      await loadOffers();
    } catch (err) {
      alert(err.message || 'Failed to delete offer');
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      const newStatus = !offer.isActive;
      await api.updateOffer(offer._id || offer.id, { isActive: newStatus });
      setOffers((prev) =>
        prev.map((o) => ((o._id || o.id) === (offer._id || offer.id) ? { ...o, isActive: newStatus } : o))
      );
      if (onNotify) onNotify(`Offer "${offer.title}" is now ${newStatus ? 'active' : 'hidden'} on storefront`, 'info');
    } catch (err) {
      alert(err.message || 'Failed to toggle offer status');
    }
  };

  const activeCount = offers.filter((o) => o.isActive).length;

  // Filter products for the "Without Coupon" selector
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory =
        formData.category === 'All' ||
        (p.category || '').toLowerCase() === formData.category.toLowerCase();

      const searchLower = productSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        (p.name || '').toLowerCase().includes(searchLower) ||
        (p.sku || '').toLowerCase().includes(searchLower);

      return matchesSearch && (formData.category === 'All' ? true : matchesCategory);
    });
  }, [allProducts, productSearch, formData.category]);

  // ═══════════════════════════════════════════════════════════════════════════
  // VIEW 1: ONE-PAGE SETUP FORM (ADD / EDIT OFFER)
  // ═══════════════════════════════════════════════════════════════════════════
  if (viewMode === 'form') {
    const isWithCoupon = formData.offerType === 'with_coupon';
    const previewDiscountText =
      formData.discountType === 'flat'
        ? `FLAT ₹${Number(formData.discountValue || 0).toLocaleString()} OFF`
        : `${formData.discountValue || 0}% OFF`;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#8C7E6A] mb-2 uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-[#B87802] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Offers & Deals</span>
              </button>
              <ChevronRight className="w-3 h-3 text-[#B87802]" />
              <span className="text-[#12100D] font-bold">
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </span>
            </nav>
            <h1 className={`${theme.fonts.display} text-2xl font-semibold text-[#12100D] tracking-tight`}>
              {editingOffer ? `Edit "${editingOffer.title}"` : 'Create Storefront Offer & Promotion'}
            </h1>
            <p className="text-xs text-[#736858] mt-0.5">
              Choose between Coupon Code setup or Direct Product Offer (Without Coupon).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2.5 rounded-md border border-[#E8D8B5] bg-white hover:bg-[#FAF8F2] text-xs font-semibold text-[#4A4235] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] hover:from-[#C98704] hover:to-[#A86E02] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingOffer ? 'Save Changes' : 'Publish Offer'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main One-Page Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#E8D8B5] p-6 space-y-6 shadow-sm">
          {/* SECTION A: OFFER TYPE SELECTOR (WITH COUPON vs WITHOUT COUPON) */}
          <div className="space-y-3 pb-2 border-b border-[#E8D8B5]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B87802]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                Choose Offer Mode
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: With Coupon */}
              <div
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    offerType: 'with_coupon',
                    hasCoupon: true,
                    badge: prev.badge === 'DIRECT SALE' ? 'FESTIVE SALE' : prev.badge,
                  }))
                }
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                  isWithCoupon
                    ? 'border-[#B87802] bg-[#FAF4E6]/50 shadow-sm'
                    : 'border-[#E8D8B5] bg-white hover:border-[#B87802]/50 hover:bg-[#FAF8F2]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                    isWithCoupon
                      ? 'bg-[#B87802] text-white shadow-sm'
                      : 'bg-[#FAF8F2] text-[#8C7E6A] border border-[#E8D8B5]'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#12100D]">With Coupon (Coupon Code Setup)</span>
                    {isWithCoupon && <CheckCircle2 className="w-4 h-4 text-[#B87802]" />}
                  </div>
                  <p className="text-xs text-[#736858] mt-1 leading-relaxed">
                    Customer enters a coupon code (e.g. <strong>FESTIVE25</strong>) at checkout to claim the discount.
                  </p>
                </div>
              </div>

              {/* Option 2: Without Coupon */}
              <div
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    offerType: 'without_coupon',
                    hasCoupon: false,
                    badge: prev.badge === 'FESTIVE SALE' ? 'DIRECT SALE' : prev.badge,
                  }))
                }
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                  !isWithCoupon
                    ? 'border-[#B87802] bg-[#FAF4E6]/50 shadow-sm'
                    : 'border-[#E8D8B5] bg-white hover:border-[#B87802]/50 hover:bg-[#FAF8F2]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                    !isWithCoupon
                      ? 'bg-[#B87802] text-white shadow-sm'
                      : 'bg-[#FAF8F2] text-[#8C7E6A] border border-[#E8D8B5]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#12100D]">Without Coupon (Direct Product Offer)</span>
                    {!isWithCoupon && <CheckCircle2 className="w-4 h-4 text-[#B87802]" />}
                  </div>
                  <p className="text-xs text-[#736858] mt-1 leading-relaxed">
                    Direct promotional offer applied to products. Admin can select products or apply to an entire category.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Offer Details & Category Setup */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B5]">
              <Sparkles className="w-4 h-4 text-[#B87802]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                1. Offer Header & Category Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Offer Title <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder={
                    isWithCoupon ? 'e.g. Festive Grand Celebration' : 'e.g. Pure Silk Heirloom Direct Sale'
                  }
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#B87802]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Promotional Badge Label
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="e.g. FESTIVE SALE, BRIDAL EXCLUSIVE, DIRECT DEAL"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
                />
              </div>
            </div>

            {/* Category Selector with "+ Add Category" button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#12100D] uppercase tracking-wider">
                    Target Category / Weave
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B87802] hover:text-[#996300] bg-[#FAF4E6] px-2.5 py-1 rounded border border-[#E8D8B5] hover:border-[#B87802] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>Add Category</span>
                  </button>
                </div>

                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] bg-white focus:outline-none focus:border-[#B87802]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Weaves / All Categories' : `${cat} Sarees`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Validity Text
                </label>
                <input
                  type="text"
                  value={formData.validTill}
                  onChange={(e) => setFormData((p) => ({ ...p, validTill: e.target.value }))}
                  placeholder="e.g. Valid until 31 Dec 2026"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                Offer Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="e.g. Flat 25% off on our exquisite Banarasi & Kanchipuram pure silk sarees collection."
                className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
              />
            </div>
          </div>

          {/* Section 2: Discount & Pricing Configuration */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B5]">
              <Percent className="w-4 h-4 text-[#B87802]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                2. Discount Rules {isWithCoupon && '& Coupon Setup'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* If With Coupon: Show Coupon Code Input */}
              {isWithCoupon ? (
                <div>
                  <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                    Coupon Code <span className="text-[#B87802]">*</span>
                  </label>
                  <input
                    type="text"
                    required={isWithCoupon}
                    value={formData.code}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. FESTIVE25"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm font-mono font-bold text-[#996300] tracking-widest focus:outline-none focus:border-[#B87802]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                    Offer Type
                  </label>
                  <div className="px-3.5 py-2.5 rounded-md bg-[#FAF4E6] border border-[#E8D8B5] text-xs font-semibold text-[#996300] flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Direct Product Offer</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData((p) => ({ ...p, discountType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] bg-white focus:outline-none focus:border-[#B87802]"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Discount Value <span className="text-[#B87802]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData((p) => ({ ...p, discountValue: e.target.value }))}
                  placeholder={formData.discountType === 'percentage' ? '25' : '2000'}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Min. Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData((p) => ({ ...p, minOrderValue: e.target.value }))}
                  placeholder="e.g. 4999"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCT SELECTOR (ONLY SHOWN FOR "WITHOUT COUPON" DIRECT OFFERS) */}
          {!isWithCoupon && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8D8B5] flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#B87802]" />
                  <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                    3. Select Products for this Direct Offer
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF4E6] text-[#B87802] font-bold border border-[#E8D8B5]">
                    {formData.applyToAllInCategory
                      ? `All products in "${formData.category}" selected`
                      : `${formData.selectedProducts.length} product(s) selected`}
                  </span>
                </div>
              </div>

              {/* Option A: Apply to all in Category */}
              <div className="p-3.5 rounded-lg border border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.applyToAllInCategory}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, applyToAllInCategory: e.target.checked }))
                    }
                    className="w-4 h-4 text-[#B87802] rounded border-gray-300 focus:ring-[#B87802]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#12100D] block">
                      Apply automatically to ALL products in "{formData.category}"
                    </span>
                    <span className="text-[11px] text-[#736858]">
                      Any current and future products under this category will automatically get this offer.
                    </span>
                  </div>
                </label>
              </div>

              {/* Option B: Specific Product Selection */}
              {!formData.applyToAllInCategory && (
                <div className="space-y-3 p-4 rounded-lg border border-[#E8D8B5] bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-[#8C7E6A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by title or SKU to add to offer..."
                        className="w-full pl-9 pr-3 py-2 rounded-md border border-[#E8D8B5] text-xs text-[#12100D] focus:outline-none focus:border-[#B87802]"
                      />
                    </div>

                    {/* Select All Filtered */}
                    {filteredProducts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSelectAllFiltered(filteredProducts)}
                        className="text-xs font-semibold px-3 py-2 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] hover:bg-white text-[#4A4235] hover:text-[#B87802] transition-colors cursor-pointer shrink-0"
                      >
                        {filteredProducts.every((p) =>
                          formData.selectedProducts.includes(p.id || p._id || p.sku)
                        )
                          ? 'Deselect All Filtered'
                          : 'Select All Filtered'}
                      </button>
                    )}
                  </div>

                  {/* Products Grid / List */}
                  {productsLoading ? (
                    <div className="py-8 text-center text-xs text-[#736858] flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B87802]" />
                      <span>Loading products...</span>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#736858]">
                      No products found matching your search.
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto divide-y divide-[#E8D8B5]/50 border border-[#E8D8B5] rounded-md">
                      {filteredProducts.map((p) => {
                        const pId = p.id || p._id || p.sku;
                        const isSelected = formData.selectedProducts.includes(pId);
                        const displayImg =
                          p.image ||
                          (Array.isArray(p.gallery) && p.gallery[0]) ||
                          (Array.isArray(p.images) && p.images[0]) ||
                          '';

                        return (
                          <div
                            key={pId}
                            onClick={() => handleToggleProduct(pId)}
                            className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#FAF4E6]/60' : 'hover:bg-[#FAF8F2]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                  isSelected
                                    ? 'bg-[#B87802] border-[#B87802] text-white'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>

                              <div className="w-10 h-10 rounded overflow-hidden border border-[#E8D8B5] bg-neutral-900 shrink-0">
                                {displayImg ? (
                                  <img
                                    src={displayImg}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#FAF4E6]" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#12100D] truncate">
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-[#8C7E6A]">
                                  <span>SKU: {p.sku || pId}</span>
                                  <span>•</span>
                                  <span>Category: {p.category || 'General'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-[#12100D]">
                                ₹{Number(p.price || 0).toLocaleString()}
                              </span>
                              {p.mrp && Number(p.mrp) > Number(p.price) && (
                                <span className="text-[10px] text-[#8C7E6A] line-through block">
                                  ₹{Number(p.mrp).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Section 4: Banner Photo (Desktop Upload) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B5]">
              <Upload className="w-4 h-4 text-[#B87802]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                {isWithCoupon ? '3' : '4'}. Offer Banner Photo (Upload from Desktop)
              </h2>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={handleImageUpload}
                className="hidden"
                id="offer-desktop-image-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } };
                    handleImageUpload(fakeEvent);
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                  formData.image
                    ? 'border-[#B87802]/60 bg-[#FAF8F2] hover:border-[#B87802]'
                    : 'border-[#E8D8B5] bg-[#FAF8F2]/60 hover:bg-[#FAF8F2] hover:border-[#B87802]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF4E6] border border-[#E8D8B5] flex items-center justify-center text-[#B87802] shadow-sm">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#12100D]">
                    {formData.image ? 'Change Photo from Desktop' : 'Choose Photo from Desktop'}
                  </p>
                  <p className="text-xs text-[#736858] mt-0.5">
                    Click to browse files or drag & drop image from your desktop (PNG, JPG, WEBP, AVIF)
                  </p>
                  {fileName && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#B87802] bg-[#FAF4E6] px-2.5 py-0.5 rounded-full border border-[#E8D8B5]">
                      Selected file: {fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Preview Card */}
              {formData.image && (
                <div className="relative h-44 sm:h-52 rounded-lg overflow-hidden border border-[#E8D8B5] bg-neutral-900 mt-3 shadow-inner">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                    <span className="text-[10px] font-bold tracking-widest text-[#F5B815] uppercase mb-1">
                      {formData.badge || (isWithCoupon ? 'COUPON DEAL' : 'DIRECT SALE')}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {formData.title || 'Offer Title Preview'}
                    </span>
                    <span className="text-lg font-extrabold text-[#FEE63E] mt-0.5">
                      {previewDiscountText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Terms & Display Status */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B5]">
              <Clock className="w-4 h-4 text-[#B87802]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#12100D]`}>
                {isWithCoupon ? '4' : '5'}. Terms & Visibility
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                Terms & Conditions Summary
              </label>
              <textarea
                rows={2}
                value={formData.terms}
                onChange={(e) => setFormData((p) => ({ ...p, terms: e.target.value }))}
                placeholder="Applicable on select authentic handwoven sarees. Cannot be combined with other offers."
                className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                  Display Sequence (Order #)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802]"
                />
              </div>

              <div className="pt-2 sm:pt-6">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[#E8D8B5] bg-[#FAF8F2] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 text-[#B87802] rounded border-gray-300 focus:ring-[#B87802]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#12100D] uppercase tracking-wider block">
                      Active on Storefront
                    </span>
                    <span className="text-[11px] text-[#736858]">
                      Offer will be publicly visible on the Offers page
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Bottom Action Bar */}
          <div className="pt-4 border-t border-[#E8D8B5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-5 py-2.5 rounded-md border border-[#E8D8B5] text-xs font-semibold text-[#4A4235] hover:bg-[#FAF8F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] hover:from-[#C98704] hover:to-[#A86E02] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingOffer ? 'Save Changes' : 'Publish Offer'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── MODAL: ADD NEW CATEGORY ── */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg border border-[#E8D8B5] w-full max-w-md p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B5]">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-[#B87802]" />
                  <h3 className={`${theme.fonts.display} text-base font-bold text-[#12100D]`}>
                    Add New Category
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="text-[#8C7E6A] hover:text-[#12100D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#12100D] mb-1.5 uppercase tracking-wider">
                    Category Name <span className="text-[#B87802]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Banarasi Georgette, Organza Silk, Pattu"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E8D8B5] text-sm text-[#12100D] focus:outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#B87802]"
                  />
                  <p className="text-[11px] text-[#736858] mt-1">
                    This new category will immediately be available across the store and selected for this offer.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 rounded-md border border-[#E8D8B5] text-xs font-semibold text-[#4A4235] hover:bg-[#FAF8F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={categorySaving}
                    className="px-5 py-2 rounded-md bg-[#B87802] hover:bg-[#996300] text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {categorySaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIEW 2: MAIN OFFERS CATALOG & LIST
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Offers Catalog Card */}
      <div className="bg-white rounded-lg border border-[#E8D8B5] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E8D8B5] flex items-center justify-between bg-[#FAF8F2] flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-md bg-[#FAF4E6] text-[#B87802] border border-[#E8D8B5]">
              <Tag className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`${theme.fonts.display} font-semibold text-base text-[#12100D]`}>
                  Offers & Promotional Deals
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF4E6] text-[#B87802] font-semibold border border-[#E8D8B5]">
                  {activeCount} Active / {offers.length} Total
                </span>
              </div>
              <span className="text-[11px] text-[#736858] font-medium">
                Manage promotional discount codes and direct product offers displayed on the storefront Offers page
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] hover:from-[#C98704] hover:to-[#A86E02] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Offer</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#736858] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#B87802]" />
            <p className="text-xs font-medium">Loading offers catalog...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center text-[#736858] space-y-3">
            <Tag className="w-10 h-10 text-[#B87802]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#12100D]">No offers created yet</p>
            <p className="text-xs text-[#736858] max-w-sm mx-auto">
              Create your first promotional discount offer to attract shoppers on the storefront Offers page.
            </p>
            <button
              onClick={openCreateForm}
              className="mt-2 px-4 py-2 rounded-md bg-[#B87802] text-white text-xs font-semibold"
            >
              Add First Offer
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E8D8B5]/60">
            {offers.map((offer, idx) => {
              const isWithCoupon = offer.offerType !== 'without_coupon' && offer.hasCoupon !== false;
              const discountText =
                offer.discountType === 'flat'
                  ? `Flat ₹${Number(offer.discountValue).toLocaleString()} OFF`
                  : `${offer.discountValue}% OFF`;

              return (
                <div
                  key={offer._id || offer.code || idx}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F2] transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden border border-[#E8D8B5] bg-neutral-900 shrink-0 relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {isWithCoupon ? (
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FAF4E6] text-[#996300] border border-[#E8D8B5] inline-flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {offer.code}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            DIRECT SALE (
                            {offer.applyToAllInCategory
                              ? `All ${offer.category || 'Category'}`
                              : `${offer.selectedProducts?.length || 0} Products`}
                            )
                          </span>
                        )}

                        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1A1610] text-[#F5B815] border border-[#F5B815]/30">
                          {discountText}
                        </span>

                        {offer.badge && (
                          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#736858] border border-[#E8D8B5]">
                            {offer.badge}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            offer.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          }`}
                        >
                          {offer.isActive ? 'Active on Store' : 'Hidden'}
                        </span>
                      </div>

                      <h3 className={`${theme.fonts.display} font-semibold text-sm text-[#12100D] truncate`}>
                        {offer.title}
                      </h3>

                      {offer.subtitle && (
                        <p className="text-xs text-[#736858] line-clamp-1 mt-0.5">
                          {offer.subtitle}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-[#8C7E6A] mt-1.5 font-medium flex-wrap">
                        <span>
                          Category: <strong className="text-[#4A4235]">{offer.category || 'All'}</strong>
                        </span>
                        {offer.minOrderValue > 0 && (
                          <span>
                            | Min Order: <strong className="text-[#4A4235]">₹{offer.minOrderValue.toLocaleString()}</strong>
                          </span>
                        )}
                        {offer.validTill && (
                          <span>
                            | Validity: <strong className="text-[#4A4235]">{offer.validTill}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[#E8D8B5]/50">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(offer)}
                      className={`p-2 rounded-md border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        offer.isActive
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      title={offer.isActive ? 'Hide offer from store' : 'Publish offer on store'}
                    >
                      {offer.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-neutral-400" />}
                      <span className="hidden sm:inline">{offer.isActive ? 'Enabled' : 'Disabled'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(offer)}
                      className="p-2 rounded-md border border-[#E8D8B5] hover:border-[#B87802] text-[#4A4235] hover:text-[#B87802] hover:bg-[#FAF8F2] transition-colors cursor-pointer"
                      title="Edit offer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(offer)}
                      className="p-2 rounded-md border border-[#E8D8B5] hover:border-rose-400 text-[#4A4235] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OffersView;