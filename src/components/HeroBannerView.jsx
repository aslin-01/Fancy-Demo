import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  Eye,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Tv,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { api, STORE_URL } from '../services/api';
import { theme } from '../theme';

const PRESET_IMAGES = [
  {
    name: 'Antique Kemp Bridal Set',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: '1-Gram Gold Kasu Malai',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Peacock Kemp Choker',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'South Indian Jimikki Kammal',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Bridal Waist Belt (Oddiyanam)',
    url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1920&q=80',
  },
];

export function HeroBannerView({ onNotify }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Form State (Target URL inputs removed as requested)
  const [formData, setFormData] = useState({
    title: '',
    cursive: '',
    tag: '',
    description: '',
    image: '',
    alt: '',
    primaryCtaLabel: 'Shop Now',
    secondaryCtaLabel: 'Explore Silks',
    order: 1,
    isActive: true,
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await api.getBanners({ all: true });
      if (res && res.data) {
        setBanners(res.data);
        if (res.data.length > 0 && !previewBanner) {
          setPreviewBanner(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      if (onNotify) onNotify(err.message || 'Failed to fetch banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreateForm = () => {
    setEditingBanner(null);
    setFileName('');
    setFormData({
      title: '',
      cursive: '1-Gram Gold Covering',
      tag: 'TEMPLE KEMP & BRIDAL',
      description: 'Discover authentic 1-Gram gold covering jewellery, temple kemp sets, Kasu Malais, and antique bridal collections handcrafted with timeless elegance.',
      image: '',
      alt: 'Madha Fancy 1-Gram Gold Covering Collection',
      primaryCtaLabel: 'Shop Jewellery',
      secondaryCtaLabel: 'Explore Bridal Sets',
      order: (banners.length || 0) + 1,
      isActive: true,
    });
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner);
    setFileName('');
    setFormData({
      title: banner.title || '',
      cursive: banner.cursive || '',
      tag: banner.tag || '',
      description: banner.description || '',
      image: banner.image || '',
      alt: banner.alt || '',
      primaryCtaLabel: banner.primaryCta?.label || 'Shop Now',
      secondaryCtaLabel: banner.secondaryCta?.label || 'Explore Silks',
      order: banner.order !== undefined ? banner.order : 1,
      isActive: banner.isActive !== false,
    });
    setViewMode('form');
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a banner headline/title');
      return;
    }
    if (!formData.image || !formData.image.trim()) {
      alert('Please choose or upload a banner background photo from your desktop');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        cursive: formData.cursive.trim(),
        tag: formData.tag.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        alt: formData.alt.trim() || formData.title.trim(),
        primaryCta: {
          label: formData.primaryCtaLabel.trim() || 'Shop Now',
          to: editingBanner?.primaryCta?.to || '/shop',
        },
        secondaryCta: {
          label: formData.secondaryCtaLabel.trim() || 'Explore Silks',
          to: editingBanner?.secondaryCta?.to || '/shop?category=Silk',
        },
        order: Number(formData.order) || 1,
        isActive: Boolean(formData.isActive),
      };

      if (editingBanner) {
        await api.updateBanner(editingBanner._id || editingBanner.id, payload);
        if (onNotify) onNotify(`Banner "${payload.title}" updated successfully!`, 'success', STORE_URL);
      } else {
        await api.createBanner(payload);
        if (onNotify) onNotify(`Banner "${payload.title}" published live to storefront!`, 'success', STORE_URL);
      }

      setViewMode('list');
      await loadBanners();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Failed to save hero banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!confirm(`Are you sure you want to remove banner slide "${banner.title}"?`)) return;
    try {
      await api.deleteBanner(banner._id || banner.id);
      if (onNotify) onNotify(`Banner "${banner.title}" removed`, 'info');
      await loadBanners();
    } catch (err) {
      alert(err.message || 'Failed to delete banner');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const newStatus = !banner.isActive;
      await api.updateBanner(banner._id || banner.id, { isActive: newStatus });
      setBanners((prev) =>
        prev.map((b) => ((b._id || b.id) === (banner._id || banner.id) ? { ...b, isActive: newStatus } : b))
      );
      if (onNotify) onNotify(`Banner "${banner.title}" is now ${newStatus ? 'active' : 'hidden'} on storefront`, 'info');
    } catch (err) {
      alert(err.message || 'Failed to toggle banner status');
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset hero banners to default Madha Fancy collection slides? Custom slides will be replaced.')) return;
    setLoading(true);
    try {
      await api.resetBanners();
      if (onNotify) onNotify('Hero banners reset to default heritage slides', 'success', STORE_URL);
      await loadBanners();
    } catch (err) {
      alert(err.message || 'Failed to reset banners');
      setLoading(false);
    }
  };

  const handleMoveOrder = async (banner, direction) => {
    const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((b) => (b._id || b.id) === (banner._id || banner.id));
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const currentBanner = sorted[idx];
    const targetBanner = sorted[targetIdx];

    const tempOrder = currentBanner.order || idx + 1;
    currentBanner.order = targetBanner.order || targetIdx + 1;
    targetBanner.order = tempOrder;

    try {
      await Promise.all([
        api.updateBanner(currentBanner._id || currentBanner.id, { order: currentBanner.order }),
        api.updateBanner(targetBanner._id || targetBanner.id, { order: targetBanner.order }),
      ]);
      await loadBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  // ═══════════════════════════════════════════════════════════════════════════
  // VIEW 1: ONE-PAGE SETUP FORM (ADD / EDIT SLIDE)
  // ═══════════════════════════════════════════════════════════════════════════
  if (viewMode === 'form') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#7B4A5E] mb-2 uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-[#C2185B] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Hero Banners</span>
              </button>
              <ChevronRight className="w-3 h-3 text-[#C2185B]" />
              <span className="text-[#1A0510] font-bold">
                {editingBanner ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </span>
            </nav>
            <h1 className={`${theme.fonts.display} text-2xl font-semibold text-[#1A0510] tracking-tight`}>
              {editingBanner ? `Edit "${editingBanner.title}"` : 'Create Hero Advertisement Slide'}
            </h1>
            <p className="text-xs text-[#7B4A5E] mt-0.5">
              Configure the storefront hero headline, background image, tag, and call-to-action buttons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2.5 rounded-md border border-[#F8C4D8] bg-white hover:bg-[#FFF5F8] text-xs font-semibold text-[#4A1C30] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-[#C2185B] to-[#880E4F] hover:from-[#D81B60] hover:to-[#9C0F5F] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingBanner ? 'Save Changes' : 'Publish Slide'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main One Page Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#F8C4D8] p-6 space-y-6 shadow-sm">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F8C4D8]">
              <Sparkles className="w-4 h-4 text-[#C2185B]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#1A0510]`}>
                1. Slide Typography & Headlines
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Headline Title */}
              <div>
                <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                  Headline Title <span className="text-[#C2185B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Elegance Woven in Every Thread"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B]"
                />
              </div>

              {/* Cursive Eyebrow */}
              <div>
                <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                  Cursive Eyebrow Text
                </label>
                <input
                  type="text"
                  value={formData.cursive}
                  onChange={(e) => setFormData((p) => ({ ...p, cursive: e.target.value }))}
                  placeholder="e.g. Handwoven Heritage"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Badge Tag */}
              <div>
                <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                  Badge / Tag Label
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="e.g. HANDWOVEN HERITAGE or 50% OFF"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                  Image Alt Description
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData((p) => ({ ...p, alt: e.target.value }))}
                  placeholder="e.g. Woman draped in pure maroon Kanchipuram silk"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            </div>

            {/* Description / Subtitle */}
            <div>
              <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                Description / Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Discover authentic 1-Gram gold covering jewellery, temple kemp sets, Kasu Malais, and antique bridal collections..."
                className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B]"
              />
            </div>
          </div>

          {/* Section 2: Banner Background Photo */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F8C4D8]">
              <ImageIcon className="w-4 h-4 text-[#C2185B]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#1A0510]`}>
                2. Banner Background Photo (Select from Desktop)
              </h2>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={handleImageUpload}
                className="hidden"
                id="hero-desktop-image-input"
              />

              {/* Desktop File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } };
                    handleImageUpload(fakeEvent);
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                  formData.image
                    ? 'border-[#C2185B]/60 bg-[#FFF5F8] hover:border-[#C2185B]'
                    : 'border-[#F8C4D8] bg-[#FFF5F8]/60 hover:bg-[#FFF5F8] hover:border-[#C2185B]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#FFF0F5] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B] shadow-sm">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A0510]">
                    {formData.image ? 'Change Photo from Desktop' : 'Choose Photo from Desktop'}
                  </p>
                  <p className="text-xs text-[#7B4A5E] mt-0.5">
                    Click to browse files or drag & drop image from your desktop (PNG, JPG, WEBP, AVIF)
                  </p>
                  {fileName && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#C2185B] bg-[#FFF0F5] px-2.5 py-0.5 rounded-full border border-[#F8C4D8]">
                      Selected file: {fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Image Preview Banner */}
              {formData.image && (
                <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden border border-[#F8C4D8] bg-neutral-900 mt-3 shadow-inner">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent p-6 flex flex-col justify-end">
                    {formData.tag && (
                      <span className="text-[10px] font-bold tracking-widest text-[#E91E8C] uppercase mb-1">
                        {formData.tag}
                      </span>
                    )}
                    {formData.cursive && (
                      <p className="font-serif italic text-[#E91E8C] text-base mb-0.5">
                        {formData.cursive}
                      </p>
                    )}
                    <h3 className={`${theme.fonts.display} text-lg sm:text-xl font-bold text-white truncate`}>
                      {formData.title || 'Slide Title Preview'}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Call-to-Action Buttons (Target URL inputs removed!) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F8C4D8]">
              <Tv className="w-4 h-4 text-[#C2185B]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#1A0510]`}>
                3. Call-to-Action Buttons
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary CTA Button */}
              <div className="p-4 rounded-lg border border-[#F8C4D8] bg-[#FFF5F8] space-y-2">
                <span className="text-xs font-bold text-[#C2185B] uppercase tracking-wider block">
                  Primary Button (Gold Filled)
                </span>
                <label className="block text-[11px] text-[#7B4A5E] font-semibold uppercase">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaLabel}
                  onChange={(e) => setFormData((p) => ({ ...p, primaryCtaLabel: e.target.value }))}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3 py-2 rounded border border-[#F8C4D8] text-sm bg-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              {/* Secondary CTA Button */}
              <div className="p-4 rounded-lg border border-[#F8C4D8] bg-[#FFF5F8] space-y-2">
                <span className="text-xs font-bold text-[#4A1C30] uppercase tracking-wider block">
                  Secondary Button (Outlined)
                </span>
                <label className="block text-[11px] text-[#7B4A5E] font-semibold uppercase">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaLabel}
                  onChange={(e) => setFormData((p) => ({ ...p, secondaryCtaLabel: e.target.value }))}
                  placeholder="e.g. Explore Silks"
                  className="w-full px-3 py-2 rounded border border-[#F8C4D8] text-sm bg-white focus:outline-none focus:border-[#C2185B]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Display Order & Storefront Status */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F8C4D8]">
              <Tv className="w-4 h-4 text-[#C2185B]" />
              <h2 className={`${theme.fonts.display} text-sm font-bold uppercase tracking-wider text-[#1A0510]`}>
                4. Display Order & Status
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-[#1A0510] mb-1.5 uppercase tracking-wider">
                  Slide Sequence Number (Order #)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#F8C4D8] text-sm text-[#1A0510] focus:outline-none focus:border-[#C2185B]"
                />
              </div>

              <div className="pt-2 sm:pt-6">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-[#F8C4D8] bg-[#FFF5F8] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 text-[#C2185B] rounded border-gray-300 focus:ring-[#C2185B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1A0510] uppercase tracking-wider block">
                      Active on Storefront
                    </span>
                    <span className="text-[11px] text-[#7B4A5E]">
                      Slide will be displayed on the storefront homepage
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Bottom Action Bar */}
          <div className="pt-4 border-t border-[#F8C4D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-5 py-2.5 rounded-md border border-[#F8C4D8] text-xs font-semibold text-[#4A1C30] hover:bg-[#FFF5F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-md bg-gradient-to-r from-[#C2185B] to-[#880E4F] hover:from-[#D81B60] hover:to-[#9C0F5F] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingBanner ? 'Save Changes' : 'Publish Slide'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIEW 2: MAIN SLIDES CATALOG & PREVIEW LIST
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6">
      {/* Live Visual Preview Card */}
      {previewBanner && (
        <div className="bg-[#1A0510] rounded-xl border border-[#C2185B]/40 overflow-hidden shadow-xl text-white relative">
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#1A0510]/80 text-[#E91E8C] border border-[#E91E8C]/40 backdrop-blur-md">
              Live Preview
            </span>
            <button
              onClick={() => openEditForm(previewBanner)}
              className="p-1.5 rounded-md bg-white/10 hover:bg-[#C2185B] text-white transition-colors cursor-pointer"
              title="Edit this slide"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative h-72 sm:h-80 w-full overflow-hidden">
            <img
              src={previewBanner.image}
              alt={previewBanner.alt || previewBanner.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A0510]/90 via-[#1A0510]/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0510]/85 via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center p-6 sm:p-10">
              <div className="max-w-xl space-y-2">
                {previewBanner.tag && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E91E8C]/50 bg-[#1A0510]/70 px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#E91E8C] backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E91E8C] animate-pulse" />
                    <span>{previewBanner.tag}</span>
                  </div>
                )}
                {previewBanner.cursive && (
                  <p className="font-serif italic text-[#E91E8C] text-lg sm:text-xl">
                    {previewBanner.cursive}
                  </p>
                )}
                <h2 className={`${theme.fonts.display} text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight`}>
                  {previewBanner.title}
                </h2>
                {previewBanner.description && (
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                    {previewBanner.description}
                  </p>
                )}
                <div className="pt-2 flex items-center gap-3">
                  <span className="px-4 py-2 rounded-md bg-[#C2185B] text-white text-xs font-semibold uppercase tracking-wider">
                    {previewBanner.primaryCta?.label || 'Shop Now'}
                  </span>
                  {previewBanner.secondaryCta?.label && (
                    <span className="px-4 py-2 rounded-md border border-white/40 text-white text-xs font-semibold uppercase tracking-wider">
                      {previewBanner.secondaryCta.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Slides List Card */}
      <div className="bg-white rounded-lg border border-[#F8C4D8] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#F8C4D8] flex items-center justify-between bg-[#FFF5F8]">
          <div className="flex items-center gap-2">
            <h2 className={`${theme.fonts.display} font-semibold text-base text-[#1A0510]`}>
              Hero Slides Catalog
            </h2>
            <span className="text-[11px] text-[#7B4A5E] font-medium">
              (Order determines appearance on storefront slider)
            </span>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#C2185B] to-[#880E4F] hover:from-[#D81B60] hover:to-[#9C0F5F] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Slide</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#7B4A5E] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#C2185B]" />
            <p className="text-xs font-medium">Loading hero banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-[#7B4A5E] space-y-3">
            <Tv className="w-10 h-10 text-[#C2185B]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#1A0510]">No hero banners created yet</p>
            <p className="text-xs text-[#7B4A5E] max-w-sm mx-auto">
              Add your first advertisement slide or click "Reset Defaults" to load preset luxury slides.
            </p>
            <button
              onClick={handleResetDefaults}
              className="mt-2 px-4 py-2 rounded-md bg-[#C2185B] text-white text-xs font-semibold"
            >
              Load Default Slides
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F8C4D8]/60">
            {banners.map((b, idx) => {
              const isSelected = previewBanner && (previewBanner._id || previewBanner.id) === (b._id || b.id);
              return (
                <div
                  key={b._id || b.id || idx}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-[#FFF0F5]/50' : 'hover:bg-[#FFF5F8]'
                  }`}
                >
                  {/* Left info with thumbnail */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Order & Reorder arrows */}
                    <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(b, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-[#7B4A5E] hover:text-[#C2185B] disabled:opacity-20 cursor-pointer"
                        title="Move slide up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#C2185B] w-5 text-center">
                        #{b.order || idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(b, 'down')}
                        disabled={idx === banners.length - 1}
                        className="p-1 rounded text-[#7B4A5E] hover:text-[#C2185B] disabled:opacity-20 cursor-pointer"
                        title="Move slide down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewBanner(b)}
                      className="w-24 h-16 sm:w-28 sm:h-20 rounded-md overflow-hidden border border-[#F8C4D8] bg-neutral-900 shrink-0 cursor-pointer relative group"
                      title="Click to preview slide"
                    >
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {b.tag && (
                          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#C2185B] border border-[#F8C4D8]">
                            {b.tag}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            b.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          }`}
                        >
                          {b.isActive ? 'Active on Store' : 'Hidden'}
                        </span>
                      </div>

                      <h3 className={`${theme.fonts.display} font-semibold text-sm text-[#1A0510] truncate`}>
                        {b.title}
                      </h3>

                      {b.cursive && (
                        <p className="text-xs italic text-[#C2185B] truncate">
                          "{b.cursive}"
                        </p>
                      )}

                      <p className="text-xs text-[#7B4A5E] line-clamp-1 mt-0.5">
                        {b.description || 'No description provided'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#7B4A5E] mt-1.5 font-medium">
                        <span>Button 1: <strong className="text-[#4A1C30]">{b.primaryCta?.label || 'Shop Now'}</strong></span>
                        {b.secondaryCta?.label && (
                          <span>| Button 2: <strong className="text-[#4A1C30]">{b.secondaryCta.label}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[#F8C4D8]/50">
                    <button
                      type="button"
                      onClick={() => setPreviewBanner(b)}
                      className={`p-2 rounded-md border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#C2185B] text-white border-[#C2185B]'
                          : 'border-[#F8C4D8] text-[#4A1C30] hover:bg-[#FFF5F8] hover:text-[#C2185B]'
                      }`}
                      title="Preview this slide in card above"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(b)}
                      className={`p-2 rounded-md border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        b.isActive
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      title={b.isActive ? 'Hide slide from store' : 'Publish slide on store'}
                    >
                      {b.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-neutral-400" />}
                      <span className="hidden sm:inline">{b.isActive ? 'Enabled' : 'Disabled'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(b)}
                      className="p-2 rounded-md border border-[#F8C4D8] hover:border-[#C2185B] text-[#4A1C30] hover:text-[#C2185B] hover:bg-[#FFF5F8] transition-colors cursor-pointer"
                      title="Edit slide"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(b)}
                      className="p-2 rounded-md border border-[#F8C4D8] hover:border-rose-400 text-[#4A1C30] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete slide"
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

export default HeroBannerView;
