import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { theme } from '../theme';

export const ProductsPage = ({ products, onProductUpdated, onNotify }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const categories = ['All', 'Silk', 'Cotton', 'Designer', 'Wedding', 'Party Wear'];

  const filteredProducts = (products || []).filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = async (product) => {
    try {
      await api.updateProduct(product._id, { inStock: !product.inStock });
      onProductUpdated();
      onNotify(`${product.name} marked as ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
    } catch (err) {
      onNotify(err.message || 'Error updating stock', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      setDeleteId(null);
      onProductUpdated();
      onNotify('Product removed successfully');
    } catch (err) {
      onNotify(err.message || 'Error deleting product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-display text-foreground">Saree Collection</h2>
          <div className={theme.dividers.goldLeft} />
          <p className={`${theme.typography.bodyMuted} mt-2`}>
            Manage handloom listings, pricing, fabric details, and real-time inventory
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={theme.buttons.primary}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Add New Saree</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`${theme.cards.base} p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs`}>
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                selectedCategory === cat
                  ? theme.badges.filterChipActive
                  : theme.badges.filterChipInactive
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saree, SKU, fabric..."
            className={`${theme.forms.input} pl-9`}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p._id || p.sku}
            className={theme.cards.interactive}
          >
            {/* Image Preview */}
            <div className="relative h-60 bg-secondary/40 overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                <span className={theme.badges.discount}>
                  {p.category}
                </span>
                {p.isBestSeller && (
                  <span className={theme.badges.newArrival}>
                    Bestseller
                  </span>
                )}
              </div>
              <div className="absolute top-2.5 right-2.5 z-10">
                <button
                  onClick={() => handleToggleStock(p)}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-bold shadow-sm transition-colors border cursor-pointer ${
                    p.inStock
                      ? theme.colors.status.success
                      : theme.colors.status.error
                  }`}
                >
                  {p.inStock ? '● In Stock' : '○ Out of Stock'}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className={theme.typography.metaSku}>{p.sku}</p>
                <h3 className="text-sm font-semibold text-foreground line-clamp-1 mt-1 mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#B87802]">
                      ₹{p.price?.toLocaleString('en-IN')}
                    </span>
                    {p.mrp > p.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{p.mrp?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <p className={theme.typography.metaFabric}>{p.fabric || 'Pure Silk'}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingProduct(p)}
                    className={theme.buttons.secondarySm}
                    title="Edit Saree"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#B87802]" />
                  </button>
                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="rounded-md border border-border bg-card p-2 text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                    title="Delete Saree"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal (Add or Edit) */}
      {(isAddModalOpen || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (formData) => {
            try {
              if (editingProduct) {
                await api.updateProduct(editingProduct._id, formData);
                onNotify('Saree details updated successfully');
              } else {
                await api.createProduct(formData);
                onNotify('New saree added to catalog');
              }
              onProductUpdated();
              setIsAddModalOpen(false);
              setEditingProduct(null);
            } catch (err) {
              onNotify(err.message || 'Operation failed', 'error');
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className={theme.modal.backdrop} onClick={() => setDeleteId(null)}>
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={theme.modal.title}>Remove Saree?</h3>
            <p className={theme.modal.description}>
              Are you sure you want to delete this saree from the active catalog? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className={theme.buttons.secondarySm}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-md bg-destructive text-white px-4 py-2 text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Delete Saree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Add / Edit Product Modal
const ProductFormModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || 'Silk',
    fabric: product?.fabric || 'Pure Mulberry Silk',
    color: product?.color || 'Maroon',
    occasion: product?.occasion || 'Wedding',
    price: product?.price || '',
    mrp: product?.mrp || '',
    stockCount: product?.stockCount || 15,
    image: product?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    description: product?.description || '',
    washCare: product?.washCare || 'Dry clean only',
    inStock: product?.inStock !== undefined ? product.inStock : true,
    isBestSeller: Boolean(product?.isBestSeller),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={theme.modal.backdrop} onClick={onClose}>
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className={theme.modal.title}>
              {product ? 'Edit Saree Listing' : 'Add New Saree to Catalog'}
            </h3>
            <div className={theme.dividers.goldLeft} />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={theme.forms.label}>Saree Name *</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Kanchipuram Pure Silk Saree"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
            <div>
              <label className={theme.forms.label}>SKU Code *</label>
              <input
                type="text"
                name="sku"
                required
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. CF-SIL-009"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={theme.forms.label}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`mt-1.5 w-full ${theme.forms.select}`}
              >
                <option value="Silk">Silk Sarees</option>
                <option value="Cotton">Cotton Sarees</option>
                <option value="Designer">Designer Sarees</option>
                <option value="Wedding">Wedding Sarees</option>
                <option value="Party Wear">Party Wear</option>
              </select>
            </div>
            <div>
              <label className={theme.forms.label}>Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                value={form.price}
                onChange={handleChange}
                placeholder="14999"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
            <div>
              <label className={theme.forms.label}>MRP Price (₹)</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="19999"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={theme.forms.label}>Fabric</label>
              <input
                type="text"
                name="fabric"
                value={form.fabric}
                onChange={handleChange}
                placeholder="Pure Mulberry Silk"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
            <div>
              <label className={theme.forms.label}>Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Maroon & Gold"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
            <div>
              <label className={theme.forms.label}>Stock Quantity</label>
              <input
                type="number"
                name="stockCount"
                value={form.stockCount}
                onChange={handleChange}
                placeholder="15"
                className={`mt-1.5 ${theme.forms.input}`}
              />
            </div>
          </div>

          <div>
            <label className={theme.forms.label}>Image URL *</label>
            <input
              type="url"
              name="image"
              required
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>

          <div>
            <label className={theme.forms.label}>Description</label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="A timeless silk saree woven with intricate gold zari brocade..."
              className={`mt-1.5 ${theme.forms.textarea}`}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-foreground font-medium">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className={theme.forms.checkbox}
              />
              <span>In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-foreground font-medium">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={handleChange}
                className={theme.forms.checkbox}
              />
              <span>Mark as Bestseller</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className={theme.buttons.secondarySm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={theme.buttons.primary}
            >
              {product ? 'Save Changes' : 'Create Saree'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
