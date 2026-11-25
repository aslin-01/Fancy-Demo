import React, { useState, useMemo } from 'react';
import { 
  PackagePlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  LayoutGrid,
  List,
  Tag,
  Palette,
  IndianRupee,
  Layers,
  Sparkles,
  RefreshCw,
  Star
} from 'lucide-react';
import { STORE_URL, api } from '../services/api';

export function ProductsView({
  products = [],
  loading = false,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [togglingId, setTogglingId] = useState(null);

  // Toggle inStock directly
  const handleToggleStock = async (product) => {
    try {
      setTogglingId(product._id);
      await api.updateProduct(product._id, { inStock: !product.inStock });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  // Dynamic categories and colors list derived from actual database products
  const availableCategories = useMemo(() => {
    const list = ['All'];
    products.forEach((p) => {
      if (p.category && !list.some((c) => c.toLowerCase() === p.category.toLowerCase())) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  const availableColors = useMemo(() => {
    const list = ['All'];
    products.forEach((p) => {
      if (p.color && !list.some((c) => c.toLowerCase() === p.color.toLowerCase())) {
        list.push(p.color);
      }
    });
    return list;
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !searchTerm ||
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.fabric?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCat =
          selectedCategory === 'All' ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesColor =
          selectedColor === 'All' ||
          p.color?.toLowerCase() === selectedColor.toLowerCase();

        const matchesStock =
          stockFilter === 'All' ||
          (stockFilter === 'in' && p.inStock) ||
          (stockFilter === 'out' && !p.inStock) ||
          (stockFilter === 'low' && ((p.stockCount ?? 0) <= (p.lowStockAlert !== undefined && p.lowStockAlert !== null && p.lowStockAlert !== '' ? Number(p.lowStockAlert) : 10) || !p.inStock));

        return matchesSearch && matchesCat && matchesColor && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        // default newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, searchTerm, selectedCategory, selectedColor, stockFilter, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Search, Filters & Quick Actions - Single Unified Card */}
      <div className="bg-white rounded-lg border border-[#F8C4D8] p-5 space-y-4">
        {/* Top Action Row: Search Bar, View Mode Toggle & Add Product Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A89D8B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by jewellery name, SKU, or material..."
              className="w-full pl-10 pr-14 py-2.5 rounded-lg border border-[#F8C4D8] bg-card text-xs font-body text-[#1A0510] placeholder-[#A89D8B] outline-none focus:outline-none focus:border-[#C2185B]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-[#7B4A5E] hover:text-[#1A0510] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Actions: View Toggle + Add Product CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View toggle */}
            <div className="flex items-center rounded-md border border-[#F8C4D8] bg-[#FFF5F8] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#1A0510] border border-[#F8C4D8]'
                    : 'text-[#7B4A5E] hover:text-[#1A0510]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#1A0510] border border-[#F8C4D8]'
                    : 'text-[#7B4A5E] hover:text-[#1A0510]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Product CTA */}
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white border border-[#E91E8C]/40 font-medium text-xs tracking-wider uppercase hover:from-[#D81B60] hover:to-[#9C0F5F] active:scale-95 transition-all cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add Product</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF80AB]" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#F8C4D8]/60">
          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#F8C4D8] bg-card text-xs font-body text-[#1A0510] outline-none focus:border-[#C2185B] cursor-pointer"
            >
              <option value="All">All Categories</option>
              {availableCategories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Color Dropdown */}
          <div>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#F8C4D8] bg-card text-xs font-body text-[#1A0510] outline-none focus:border-[#C2185B] cursor-pointer"
            >
              <option value="All">All Colors</option>
              {availableColors.filter((c) => c !== 'All').map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#F8C4D8] bg-card text-xs font-body text-[#1A0510] outline-none focus:border-[#C2185B] cursor-pointer"
            >
              <option value="All">All Stock Status</option>
              <option value="in">In Stock Only</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock Alerts</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#F8C4D8] bg-card text-xs font-body text-[#1A0510] outline-none focus:border-[#C2185B] cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== 'All' || selectedColor !== 'All' || stockFilter !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#F8C4D8]/60 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#7B4A5E] text-[11px] font-medium">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F8] border border-[#F8C4D8] text-[#1A0510] text-[11px]">
                  Category: <strong className="text-[#C2185B]">{selectedCategory}</strong>
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-red-600 cursor-pointer ml-0.5">×</button>
                </span>
              )}
              {selectedColor !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F8] border border-[#F8C4D8] text-[#1A0510] text-[11px]">
                  Color: <strong className="text-[#C2185B]">{selectedColor}</strong>
                  <button onClick={() => setSelectedColor('All')} className="hover:text-red-600 cursor-pointer ml-0.5">×</button>
                </span>
              )}
              {stockFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F8] border border-[#F8C4D8] text-[#1A0510] text-[11px]">
                  Stock: <strong className="text-[#C2185B]">{stockFilter}</strong>
                  <button onClick={() => setStockFilter('All')} className="hover:text-red-600 cursor-pointer ml-0.5">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5F8] border border-[#F8C4D8] text-[#1A0510] text-[11px]">
                  Search: <strong className="text-[#C2185B]">"{searchTerm}"</strong>
                  <button onClick={() => setSearchTerm('')} className="hover:text-red-600 cursor-pointer ml-0.5">×</button>
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedColor('All');
                setStockFilter('All');
              }}
              className="text-[#C2185B] hover:underline text-[11px] font-semibold cursor-pointer shrink-0"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-[#F8C4D8] p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#C2185B] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#1A0510] font-display">
            Loading products from backend...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg border border-[#F8C4D8] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-lg bg-[#FFF5F8] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B] mx-auto">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#1A0510]">
              No Jewellery Found
            </h3>
            <p className="text-xs text-[#7B4A5E] max-w-sm mx-auto mt-1 font-body">
              Try resetting your category or filter search, or add a brand-new jewellery piece to your collection.
            </p>
          </div>
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white border border-[#E91E8C]/30 text-xs font-medium uppercase tracking-wider hover:from-[#D81B60] hover:to-[#9C0F5F] transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Jewellery Now</span>
          </button>
        </div>
      )}

      {/* Products Grid View — Styled identically to Storefront ProductCard */}
      {!loading && viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const discount =
              p.mrp > p.price
                ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
                : 0;

            return (
              <div
                key={p._id || p.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-[#F8C4D8] bg-white transition-all duration-200 hover:border-[#C2185B]"
              >
                {/* Image Section aspect-[4/5] */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.opacity = '0.3';
                    }}
                  />

                  {/* Badges matching website theme */}
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 rounded-sm bg-[#1A0510] text-[#E91E8C] border border-[#E91E8C]/30 px-2 py-1 text-[11px] font-semibold tracking-wide">
                      {discount}% OFF
                    </span>
                  )}

                  {p.isNewArrival && (
                    <span className="absolute top-3 right-3 rounded-sm bg-[#E91E8C] text-[#1A0510] px-2 py-1 text-[11px] font-bold tracking-wide">
                      NEW
                    </span>
                  )}

                  {p.isBestSeller && !p.isNewArrival && (
                    <span className="absolute top-3 right-3 rounded-sm bg-[#C2185B] text-white px-2 py-1 text-[11px] font-bold tracking-wide">
                      BEST SELLER
                    </span>
                  )}

                  {/* Out of Stock overlay if false */}
                  {!p.inStock && (
                    <span className="absolute inset-x-0 bottom-0 bg-[#1A0510]/85 py-2 text-center text-xs tracking-widest text-[#FFF5F8] uppercase font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                  <div>
                    {/* Fabric meta & Color pill */}
                    <div className="flex items-center justify-between text-[11px] text-[#7B4A5E] mb-1">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-[#7B4A5E]">
                        {p.fabric || p.category || ''}
                      </span>
                      {p.color && (
                        <span className="flex items-center gap-1 font-medium text-xs text-[#1A0510]">
                          <span className="w-2 h-2 rounded-full bg-[#C2185B]" />
                          {p.color}
                        </span>
                      )}
                    </div>

                    {/* Jewellery Name */}
                    <h4 className="font-display text-lg leading-snug font-medium text-[#1A0510] transition-colors hover:text-[#C2185B] line-clamp-2">
                      {p.name}
                    </h4>

                    {/* Rating & SKU */}
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      {p.rating ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 fill-[#E91E8C] text-[#E91E8C]" />
                          <span className="font-medium text-[#1A0510]">{p.rating}</span>
                          {p.reviews ? <span className="text-[#7B4A5E]">({p.reviews})</span> : null}
                        </div>
                      ) : (
                        <span />
                      )}
                      <span className="font-body font-semibold tracking-wider text-[10px] uppercase bg-[#FFF5F8] px-1.5 py-0.5 rounded-sm border border-[#F8C4D8] text-[#7B4A5E]">
                        {p.sku}
                      </span>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2 border-t border-[#F8C4D8]/50 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-[#C2185B]">
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-sm text-[#7B4A5E] line-through">
                          ₹{Number(p.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleStock(p)}
                      disabled={togglingId === p._id}
                      className="text-[11px] text-[#C2185B] hover:text-[#880E4F] underline font-semibold cursor-pointer"
                    >
                      {togglingId === p._id ? 'Updating...' : p.inStock ? 'Mark Out' : 'Mark In'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#F8C4D8]/50 flex items-center gap-2">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onDeleteProduct(p)}
                      className="p-2 rounded-md border border-[#F8C4D8] hover:border-rose-400 hover:bg-rose-50 text-[#7B4A5E] hover:text-rose-600 transition-all cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md border border-[#F8C4D8] hover:border-[#C2185B] hover:bg-[#FFF5F8] text-[#7B4A5E] hover:text-[#C2185B] transition-all"
                      title="View on Storefront"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products Table View */}
      {!loading && viewMode === 'table' && filteredProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-[#F8C4D8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFF5F8] border-b border-[#F8C4D8] text-[#7B4A5E] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Color</th>
                  <th className="py-3.5 px-4">Price / MRP</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8C4D8]/60 text-[#1A0510]">
                {filteredProducts.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-[#FFF5F8]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-sm object-cover border border-[#F8C4D8] shrink-0"
                          onError={(e) => {
                            e.target.style.opacity = '0.3';
                          }}
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-display font-medium text-base truncate">{p.name}</p>
                          <p className="text-[11px] text-[#7B4A5E] truncate">{p.fabric}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-body font-semibold tracking-wider text-xs">{p.sku}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-[#FFF5F8] border border-[#F8C4D8] text-[#C2185B]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.color ? (
                        <span className="font-medium flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C2185B]" />
                          {p.color}
                        </span>
                      ) : (
                        <span className="text-[#A89D8B]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-sm text-[#C2185B]">
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </div>
                      {p.mrp > p.price && (
                        <div className="text-[10px] text-[#7B4A5E] line-through">
                          ₹{Number(p.mrp).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold">{p.stockCount ?? 0}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 rounded-sm border border-[#F8C4D8] hover:border-[#C2185B] text-[#C2185B] transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p)}
                          className="p-1.5 rounded-sm border border-[#F8C4D8] hover:border-rose-400 hover:bg-rose-50 text-[#7B4A5E] hover:text-rose-600 transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={STORE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-sm border border-[#F8C4D8] hover:border-[#C2185B] text-[#7B4A5E] hover:text-[#C2185B] transition-all"
                          title="View on Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
