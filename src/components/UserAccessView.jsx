import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Lock, 
  Key, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Sparkles,
  Search,
  CheckCircle2,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_STAFF_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Super Administrator',
    email: 'admin@cfhandlooms.com',
    phone: '+91 98401 23456',
    role: 'Super Admin',
    status: 'Active',
    permissions: ['all', 'create_products', 'edit_prices', 'manage_access', 'view_revenue'],
    joinedDate: '2026-10-01',
  },
  {
    id: 'usr-manager-1',
    name: 'Rajesh Handlooms Lead',
    email: 'rajesh.weaver@cfhandlooms.com',
    phone: '+91 94441 78901',
    role: 'Store Manager',
    status: 'Active',
    permissions: ['create_products', 'edit_prices', 'manage_stock', 'view_orders'],
    joinedDate: '2026-10-10',
  },
  {
    id: 'usr-editor-1',
    name: 'Pooja Designer',
    email: 'pooja.catalog@cfhandlooms.com',
    phone: '+91 98840 55443',
    role: 'Catalog Editor',
    status: 'Active',
    permissions: ['create_products', 'edit_details', 'upload_images'],
    joinedDate: '2026-10-15',
  },
];

const AVAILABLE_PERMISSIONS = [
  { id: 'create_products', label: 'Create & Publish Products (Sync to localhost:3000)' },
  { id: 'edit_prices', label: 'Edit Saree Selling Prices, MRP & Discounts' },
  { id: 'manage_stock', label: 'Manage Inventory & In/Out of Stock Flags' },
  { id: 'manage_access', label: 'Configure User Access & Grant Admin Roles' },
  { id: 'view_revenue', label: 'View Financial Analytics & Sales Trajectory' },
];

export function UserAccessView() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cf_user_access_list');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF_USERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Settings toggles
  const [accessSettings, setAccessSettings] = useState({
    autoApproveProducts: true,
    requireAdmin2FA: false,
    restrictPriceChanges: false,
    staffCanDeleteProducts: false,
  });

  // Sync customers from backend
  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await api.getCustomers();
        if (res.success && Array.isArray(res.data)) {
          setUsers((prev) => {
            const existingEmails = new Set(prev.map((u) => u.email.toLowerCase()));
            const customerUsers = res.data
              .filter((c) => !existingEmails.has(c.email?.toLowerCase()))
              .map((c) => ({
                id: c._id || `cust-${c.email}`,
                name: c.name || 'Store Customer',
                email: c.email || 'customer@example.com',
                phone: c.phone || 'N/A',
                role: 'Customer',
                status: 'Active',
                permissions: ['view_store'],
                joinedDate: c.createdAt ? c.createdAt.substring(0, 10) : '2026-10-21',
              }));

            const combined = [...prev, ...customerUsers];
            localStorage.setItem('cf_user_access_list', JSON.stringify(combined));
            return combined;
          });
        }
      } catch (err) {
        console.warn('Could not sync customer users:', err);
      }
    }
    loadCustomers();
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('cf_user_access_list', JSON.stringify(newUsers));
  };

  // Add / Edit User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Catalog Editor',
    permissions: ['create_products', 'edit_prices'],
    status: 'Active',
  });

  const openAddModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        permissions: user.permissions || [],
        status: user.status || 'Active',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Catalog Editor',
        permissions: ['create_products', 'edit_prices'],
        status: 'Active',
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please provide name and email');
      return;
    }

    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      saveUsers(updated);
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        ...formData,
        joinedDate: new Date().toISOString().substring(0, 10),
      };
      saveUsers([newUser, ...users]);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (userId) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'Active' ? 'Suspended' : 'Active',
        };
      }
      return u;
    });
    saveUsers(updated);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to revoke this user access?')) {
      const updated = users.filter((u) => u.id !== userId);
      saveUsers(updated);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-[#E8D8B5] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B87802]" />
            <h2 className="text-2xl font-semibold font-display text-[#12100D]">
              User Access & Permissions Setup
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
              {filteredUsers.length} Users Configured
            </span>
          </div>
          <p className="text-xs text-[#6B6457] font-body mt-1">
            Configure administrative permissions, manage role hierarchy, and set up who can publish products to http://localhost:3000/.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 font-medium text-xs tracking-wider uppercase shadow-md shadow-[#B87802]/30 hover:from-[#C98704] hover:to-[#A86E02] active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Grant New User Access</span>
        </button>
      </div>

      {/* Role Hierarchy & Policy Setup Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Super Admin */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-4 shadow-sm space-y-2 hover:border-[#B87802] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
              Level 1
            </span>
            <Lock className="w-4 h-4 text-[#B87802]" />
          </div>
          <h4 className="font-display text-lg font-semibold text-[#12100D]">Super Admin</h4>
          <p className="text-[11px] text-[#6B6457] font-body">
            Full unrestricted access to all products, prices, financial metrics, and user access policies.
          </p>
        </div>

        {/* Store Manager */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-4 shadow-sm space-y-2 hover:border-[#B87802] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#FAF8F2] text-[#B87802] border border-[#B87802]/40">
              Level 2
            </span>
            <ShieldCheck className="w-4 h-4 text-[#B87802]" />
          </div>
          <h4 className="font-display text-lg font-semibold text-[#12100D]">Store Manager</h4>
          <p className="text-[11px] text-[#6B6457] font-body">
            Can add new sarees, edit inventory stock levels, update pricing, and view customer orders.
          </p>
        </div>

        {/* Catalog Editor */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-4 shadow-sm space-y-2 hover:border-[#B87802] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#F5B815]/20 text-[#0C0A07] border border-[#F5B815]/40 font-semibold">
              Level 3
            </span>
            <Key className="w-4 h-4 text-[#B87802]" />
          </div>
          <h4 className="font-display text-lg font-semibold text-[#12100D]">Catalog Editor</h4>
          <p className="text-[11px] text-[#6B6457] font-body">
            Can add new products, adjust categories, saree colors, and fabric descriptions.
          </p>
        </div>

        {/* Customer / Viewer */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-4 shadow-sm space-y-2 hover:border-[#B87802] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 border border-gray-300">
              Customer
            </span>
            <Users className="w-4 h-4 text-[#6B6457]" />
          </div>
          <h4 className="font-display text-lg font-semibold text-[#12100D]">Store Customer</h4>
          <p className="text-[11px] text-[#6B6457] font-body">
            Registered store account from localhost:3000. Read-only permissions on products.
          </p>
        </div>
      </div>

      {/* Access Settings & Security Controls */}
      <div className="bg-white rounded-lg border border-[#E8D8B5] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-[#B87802]" />
          <h3 className="font-display text-base font-semibold text-[#12100D]">
            Access Governance & Security Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="p-3 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
            <div className="pr-2">
              <p className="text-xs font-bold text-[#12100D]">Auto-Publish Products</p>
              <p className="text-[10px] text-[#6B6457]">Live to localhost:3000 immediately</p>
            </div>
            <input
              type="checkbox"
              checked={accessSettings.autoApproveProducts}
              onChange={(e) => setAccessSettings(p => ({ ...p, autoApproveProducts: e.target.checked }))}
              className="accent-[#B87802] cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
            <div className="pr-2">
              <p className="text-xs font-bold text-[#12100D]">Require 2FA for Admin</p>
              <p className="text-[10px] text-[#6B6457]">Extra login passcode security</p>
            </div>
            <input
              type="checkbox"
              checked={accessSettings.requireAdmin2FA}
              onChange={(e) => setAccessSettings(p => ({ ...p, requireAdmin2FA: e.target.checked }))}
              className="accent-[#B87802] cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
            <div className="pr-2">
              <p className="text-xs font-bold text-[#12100D]">Lock Price Changes</p>
              <p className="text-[10px] text-[#6B6457]">Only Super Admin can edit price</p>
            </div>
            <input
              type="checkbox"
              checked={accessSettings.restrictPriceChanges}
              onChange={(e) => setAccessSettings(p => ({ ...p, restrictPriceChanges: e.target.checked }))}
              className="accent-[#B87802] cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-md border border-[#E8D8B5] bg-[#FAF8F2] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
            <div className="pr-2">
              <p className="text-xs font-bold text-[#12100D]">Staff Delete Permission</p>
              <p className="text-[10px] text-[#6B6457]">Allow staff to delete sarees</p>
            </div>
            <input
              type="checkbox"
              checked={accessSettings.staffCanDeleteProducts}
              onChange={(e) => setAccessSettings(p => ({ ...p, staffCanDeleteProducts: e.target.checked }))}
              className="accent-[#B87802] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-lg border border-[#E8D8B5] overflow-hidden shadow-sm space-y-4 p-5">
        
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#A89D8B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs font-body text-[#12100D] outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#6B6457] font-semibold">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-sm border border-[#E8D8B5] bg-card text-xs font-body text-[#12100D] outline-none focus:border-[#B87802]"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Catalog Editor">Catalog Editor</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#E8D8B5] text-[#6B6457] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Granted Permissions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8B5]/60 text-[#12100D]">
              {filteredUsers.map((u) => {
                const getRoleBadge = (role) => {
                  switch (role) {
                    case 'Super Admin':
                      return 'bg-[#0C0A07] text-[#F5B815] border-[#F5B815]/40';
                    case 'Store Manager':
                      return 'bg-[#FAF8F2] text-[#B87802] border-[#B87802]/40';
                    case 'Catalog Editor':
                      return 'bg-amber-50 text-amber-900 border-amber-300';
                    default:
                      return 'bg-gray-100 text-gray-700 border-gray-300';
                  }
                };

                return (
                  <tr key={u.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0C0A07] text-[#F5B815] font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-display font-medium text-sm">{u.name}</p>
                          <p className="text-[11px] text-[#6B6457]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6B6457]">{u.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.role === 'Super Admin' ? (
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                            Full Unrestricted Access
                          </span>
                        ) : (
                          u.permissions?.slice(0, 2).map((perm) => (
                            <span
                              key={perm}
                              className="px-1.5 py-0.5 rounded-sm bg-[#FAF8F2] text-[#6B6457] border border-[#E8D8B5] text-[10px]"
                            >
                              {perm.replace('_', ' ')}
                            </span>
                          ))
                        )}
                        {u.permissions?.length > 2 && (
                          <span className="text-[10px] text-[#A89D8B] font-semibold">
                            +{u.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-[#6B6457]">{u.joinedDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAddModal(u)}
                          className="p-1.5 rounded-sm border border-[#E8D8B5] hover:border-[#B87802] text-[#B87802] transition-colors cursor-pointer"
                          title="Edit Access Role"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'Super Admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-sm border border-[#E8D8B5] hover:border-rose-400 hover:bg-rose-50 text-[#6B6457] hover:text-rose-600 transition-colors cursor-pointer"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-[#E8D8B5] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8D8B5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center text-[#B87802]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#12100D]">
                    {editingUser ? 'Edit User Access' : 'Grant New User Access'}
                  </h3>
                  <p className="text-[11px] text-[#6B6457] font-body">
                    Assign roles and permissions for store management
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#6B6457] hover:text-[#12100D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs font-medium outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="ramesh@example.com"
                    className="w-full px-3 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs font-medium outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98401 ..."
                    className="w-full px-3 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs font-medium outline-none focus:border-[#B87802] focus:ring-1 focus:ring-[#F5B815]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-sm border border-[#E8D8B5] bg-card text-xs font-medium outline-none focus:border-[#B87802] cursor-pointer"
                >
                  <option value="Super Admin">Super Admin (All Privileges)</option>
                  <option value="Store Manager">Store Manager (Products, Stock & Orders)</option>
                  <option value="Catalog Editor">Catalog Editor (Add / Edit Products)</option>
                  <option value="Customer">Store Customer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-[0.15em] text-[#12100D] mb-1.5">
                  Granular Permissions:
                </label>
                <div className="space-y-1.5 p-3 rounded-md bg-[#FAF8F2] border border-[#E8D8B5]">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = formData.permissions.includes(perm.id) || formData.role === 'Super Admin';
                    return (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={formData.role === 'Super Admin'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(p => ({ ...p, permissions: [...p.permissions, perm.id] }));
                            } else {
                              setFormData(p => ({ ...p, permissions: p.permissions.filter(x => x !== perm.id) }));
                            }
                          }}
                          className="accent-[#B87802] cursor-pointer"
                        />
                        <span className="text-[11px] text-[#12100D] font-medium">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8D8B5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#E8D8B5] text-[#12100D] font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 font-medium text-xs tracking-wider uppercase shadow-md hover:from-[#C98704] hover:to-[#A86E02] transition-colors cursor-pointer"
                >
                  {editingUser ? 'Save Access Changes' : 'Grant Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
