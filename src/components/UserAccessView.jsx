import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Lock,
  Mail,
  Check,
  X,
  Edit3,
  Trash2,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  KeyRound,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  RotateCcw,
  AlertTriangle,
  FolderPlus,
  CheckSquare,
  Square,
  Tv,
  Tag,
} from 'lucide-react';
import { api, STORE_URL } from '../services/api';
import { theme } from '../theme';

// ─── All Sidebar Navigation Modules (Configurable via Checkboxes) ────────────
export const SIDEBAR_MODULES = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard, desc: 'Analytics, revenue & overview metrics' },
  { id: 'products',    label: 'Products',    icon: ShoppingBag,     desc: 'Saree catalog & inventory management' },
  { id: 'low-stock',   label: 'Low Stock',   icon: AlertTriangle,   desc: 'Depletion alerts & stock replenishment' },
  { id: 'orders',      label: 'Orders',      icon: PackageCheck,    desc: 'Customer orders tracking & fulfillment' },
  { id: 'returns',     label: 'Exchange',    icon: RotateCcw,       desc: 'Customer replacement & exchange requests' },
  { id: 'hero-banner', label: 'Hero Banner', icon: Tv,              desc: 'Homepage hero slider & advertisements' },
  { id: 'offers',      label: 'Offers',      icon: Tag,             desc: 'Storefront promotional deals & coupons' },
  { id: 'user-access', label: 'User Access', icon: ShieldCheck,     desc: 'User management, roles & permissions' },
];

const ALL_MODULE_IDS = SIDEBAR_MODULES.map((m) => m.id);

// Base standard role options
const INITIAL_ROLES = ['Store Admin', 'Store Manager', 'Catalog Editor', 'Support Staff', 'Authorized Customer'];

export function UserAccessView() {
  // ── 1. Users state: Loaded from localStorage or API (NO hardcoded fake users) ──
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_user_access_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── 2. Roles state: Dynamic with user generation ──
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_user_roles');
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Inline role generator state inside modal
  const [isGeneratingRole, setIsGeneratingRole] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');

  // Save users to state and localStorage
  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('cf_user_access_list', JSON.stringify(newUsers));

    // Save allowed emails list for storefront validation
    const allowedEmails = newUsers
      .filter((u) => u.status === 'Active' && u.canAccessWebsite !== false)
      .map((u) => u.email.toLowerCase().trim());
    localStorage.setItem('cf_allowed_emails', JSON.stringify(allowedEmails));
    window.dispatchEvent(new Event('cf_user_access_updated'));
  };

  // Save roles
  const saveRoles = (newRoles) => {
    setRoles(newRoles);
    localStorage.setItem('cf_user_roles', JSON.stringify(newRoles));
  };

  // Sync users from backend API if online
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.getAuthorizedUsers();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          saveUsers(res.data);
        }
      } catch {
        // Backend offline or local mode
      }
    }
    fetchUsers();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Store Manager',
    allowedPages: ALL_MODULE_IDS,
    canAccessWebsite: true,
    status: 'Active',
  });

  const openAddModal = (user = null) => {
    setIsGeneratingRole(false);
    setNewRoleInput('');

    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || roles[0] || 'Store Manager',
        allowedPages: Array.isArray(user.allowedPages) && user.allowedPages.length > 0
          ? user.allowedPages
          : ALL_MODULE_IDS,
        canAccessWebsite: user.canAccessWebsite !== false,
        status: user.status || 'Active',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: roles[0] || 'Store Manager',
        allowedPages: ALL_MODULE_IDS,
        canAccessWebsite: true,
        status: 'Active',
      });
    }
    setIsAddModalOpen(true);
  };

  // Handle generating a new role on the fly
  const handleGenerateRole = (e) => {
    e.preventDefault();
    const cleanRole = newRoleInput.trim();
    if (!cleanRole) return;

    if (!roles.some((r) => r.toLowerCase() === cleanRole.toLowerCase())) {
      const updatedRoles = [...roles, cleanRole];
      saveRoles(updatedRoles);
    }

    // Automatically select the new role in the dropdown
    setFormData((p) => ({ ...p, role: cleanRole }));
    setNewRoleInput('');
    setIsGeneratingRole(false);
  };

  // Toggle single sidebar page checkbox
  const handleTogglePageCheckbox = (pageId) => {
    setFormData((prev) => {
      const exists = prev.allowedPages.includes(pageId);
      const updated = exists
        ? prev.allowedPages.filter((id) => id !== pageId)
        : [...prev.allowedPages, pageId];
      return { ...prev, allowedPages: updated };
    });
  };

  // Select all or clear all sidebar checkboxes
  const handleSelectAllPages = () => {
    setFormData((p) => ({ ...p, allowedPages: ALL_MODULE_IDS }));
  };

  const handleClearAllPages = () => {
    setFormData((p) => ({ ...p, allowedPages: [] }));
  };

  // Handle Save User
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanName = formData.name.trim();

    if (!cleanName || !cleanEmail) {
      alert('Please provide both Full Name and Email Address.');
      return;
    }

    if (editingUser) {
      const updated = users.map((u) =>
        (u.id === editingUser.id || u.email.toLowerCase() === editingUser.email.toLowerCase())
          ? {
              ...u,
              name: cleanName,
              email: cleanEmail,
              phone: formData.phone.trim(),
              role: formData.role,
              allowedPages: formData.allowedPages,
              status: formData.status,
              canAccessWebsite: formData.canAccessWebsite,
            }
          : u
      );
      saveUsers(updated);

      if (editingUser.id && !editingUser.id.startsWith('auth-')) {
        api.updateUserAccess(editingUser.id, {
          name: cleanName,
          phone: formData.phone.trim(),
          role: formData.role,
          allowedPages: formData.allowedPages,
          status: formData.status,
          canAccessWebsite: formData.canAccessWebsite,
        }).catch(() => {});
      }
    } else {
      const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (alreadyExists) {
        alert(`A user with email "${cleanEmail}" is already registered.`);
        return;
      }

      const newUser = {
        id: `auth-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: formData.phone.trim(),
        role: formData.role,
        allowedPages: formData.allowedPages,
        status: formData.status,
        canAccessWebsite: formData.canAccessWebsite,
        joinedDate: new Date().toISOString().substring(0, 10),
      };

      saveUsers([newUser, ...users]);
      api.createAuthorizedUser(newUser).catch(() => {});
    }

    setIsAddModalOpen(false);
  };

  // Toggle user status (Active / Suspended)
  const handleToggleAccess = (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const newCanAccess = newStatus === 'Active';

    const updated = users.map((u) => {
      if (u.id === user.id || u.email === user.email) {
        return {
          ...u,
          status: newStatus,
          canAccessWebsite: newCanAccess,
        };
      }
      return u;
    });

    saveUsers(updated);

    if (user.id && !user.id.startsWith('auth-')) {
      api.updateUserAccess(user.id, {
        status: newStatus,
        canAccessWebsite: newCanAccess,
      }).catch(() => {});
    }
  };

  // Delete user
  const handleDeleteUser = (user) => {
    if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      const updated = users.filter((u) => u.id !== user.id && u.email !== user.email);
      saveUsers(updated);

      if (user.id && !user.id.startsWith('auth-')) {
        api.deleteAuthorizedUser(user.id).catch(() => {});
      }
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q));

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && u.status === 'Active') ||
        (statusFilter === 'Suspended' && u.status === 'Suspended');

      const matchesRole = roleFilter === 'All' || u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === 'Active').length;

  return (
    <div className="space-y-6">

      {/* ── Top Header Banner ── */}
      <div className={`${theme.cards.padded} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0C0A07] flex items-center justify-center text-[#F5B815] shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className={`${theme.typography.h1Page} !text-2xl`}>
              User Access &amp; Role Permissions
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
              {activeCount} Active Users
            </span>
          </div>
          <p className={`${theme.typography.bodyMuted} mt-1.5 max-w-2xl`}>
            Create users, generate custom roles, and configure exactly which sidebar pages and modules each user is allowed to access.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className={`${theme.buttons.primary} flex items-center gap-2 !px-5 !py-2.5 shrink-0`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Authorized User</span>
        </button>
      </div>

      {/* ── User Directory Table ── */}
      <div className={`${theme.cards.base} overflow-hidden p-5 space-y-4`}>
        
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className={`${theme.forms.input} pl-9 !py-2 text-xs`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${theme.forms.select} !py-2 !text-xs`}
            >
              <option value="All">All Access Status</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended Only</option>
            </select>

            {/* Role Filter (Dynamically populated from generated roles) */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`${theme.forms.select} !py-2 !text-xs`}
            >
              <option value="All">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className={theme.table.container}>
          <table className={theme.table.table}>
            <thead>
              <tr>
                <th className={theme.table.th}>User Details</th>
                <th className={theme.table.th}>Phone</th>
                <th className={theme.table.th}>Assigned Role</th>
                <th className={theme.table.th}>Allowed Sidebar Pages</th>
                <th className={theme.table.th}>Status</th>
                <th className={theme.table.th}>Created Date</th>
                <th className={`${theme.table.th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-muted-foreground text-sm">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#B87802]" />
                    <p className="font-semibold text-foreground text-base mb-1">No Users Configured Yet</p>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
                      Click the button below to add your first user, generate a role, and select which sidebar pages they can access.
                    </p>
                    <button
                      onClick={() => openAddModal()}
                      className={`${theme.buttons.primary} !py-2 !px-4 text-xs`}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Add First User
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isActive = u.status === 'Active';
                  const userPages = u.allowedPages || [];
                  const isAllPages = userPages.length === SIDEBAR_MODULES.length;

                  return (
                    <tr key={u.id || u.email} className={theme.table.trHover}>
                      {/* User Info */}
                      <td className={theme.table.td}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0C0A07] text-[#F5B815] font-bold flex items-center justify-center text-xs shrink-0 border border-[#F5B815]/30">
                            {u.name?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-display font-medium text-sm text-foreground">{u.name}</p>
                            <p className="text-xs text-[#B87802] font-semibold flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-[#B87802]" />
                              <span>{u.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className={`${theme.table.td} text-muted-foreground font-mono text-xs whitespace-nowrap`}>
                        {u.phone || '—'}
                      </td>

                      {/* Role Badge */}
                      <td className={theme.table.td}>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[11px] font-semibold bg-[#FAF8F2] border border-border text-foreground whitespace-nowrap">
                          {u.role || 'Staff'}
                        </span>
                      </td>

                      {/* Allowed Sidebar Pages Checkbox tags */}
                      <td className={theme.table.td}>
                        <div className="flex flex-wrap items-center gap-1 max-w-xs">
                          {isAllPages ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              <Check className="w-3 h-3 stroke-[3]" />
                              All Sidebar Pages (6)
                            </span>
                          ) : userPages.length === 0 ? (
                            <span className="px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600 text-[10px]">
                              No Pages Assigned
                            </span>
                          ) : (
                            userPages.map((pageId) => {
                              const module = SIDEBAR_MODULES.find((m) => m.id === pageId);
                              return (
                                <span
                                  key={pageId}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-[#FAF8F2] text-[#B87802] border border-[#E8D8B5] text-[10px] font-medium whitespace-nowrap"
                                >
                                  {module?.label || pageId}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className={theme.table.td}>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Date Created */}
                      <td className={`${theme.table.td} text-xs text-muted-foreground whitespace-nowrap`}>
                        {u.joinedDate || '—'}
                      </td>

                      {/* Actions */}
                      <td className={`${theme.table.td} text-right`}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Allow / Block Toggle */}
                          <button
                            onClick={() => handleToggleAccess(u)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                              isActive
                                ? 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                                : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Suspend User Access' : 'Activate User Access'}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => openAddModal(u)}
                            className="p-1.5 rounded-md border border-border hover:border-[#B87802] text-[#B87802] transition-colors cursor-pointer"
                            title="Edit User & Permissions"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-md border border-border hover:border-rose-400 hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <p>Showing {filteredUsers.length} of {totalCount} users</p>
            <p>
              <span className="text-emerald-700 font-semibold">{activeCount} active users</span>
            </p>
          </div>
        )}
      </div>

      {/* ── Create / Edit Authorized User Modal ── */}
      {isAddModalOpen && (
        <>
          <div className={theme.modal.backdrop} onClick={() => setIsAddModalOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-border flex items-center justify-center text-[#B87802]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={theme.modal.title}>
                    {editingUser ? 'Edit User Access & Permissions' : 'Create New Authorized User'}
                  </h3>
                  <p className={theme.modal.description}>
                    Generate a role and check which sidebar pages this user can access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-body overflow-y-auto pr-1 flex-1">
              
              {/* User Basic Info: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={theme.forms.label}>Full Name <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ramesh Kumar"
                    className={theme.forms.input}
                    required
                  />
                </div>
                <div>
                  <label className={theme.forms.label}>Email Address <span className="text-rose-600">*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. ramesh@example.com"
                    className={theme.forms.input}
                    required
                  />
                </div>
              </div>

              {/* Phone & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={theme.forms.label}>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98401 ..."
                    className={theme.forms.input}
                  />
                </div>
                <div>
                  <label className={theme.forms.label}>Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                    className={theme.forms.select}
                  >
                    <option value="Active">Active (Granted Access)</option>
                    <option value="Suspended">Suspended (Access Blocked)</option>
                  </select>
                </div>
              </div>

              {/* ── Role Generator & Dropdown ── */}
              <div className="p-3.5 rounded-lg border border-border bg-[#FAF8F2] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground font-display flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B87802]" />
                    <span>Select or Generate User Role</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsGeneratingRole(!isGeneratingRole)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B87802] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isGeneratingRole ? 'Cancel' : '+ Generate New Role'}</span>
                  </button>
                </div>

                {/* Inline Role Generator Input */}
                {isGeneratingRole && (
                  <div className="p-2.5 rounded-md border border-[#B87802]/40 bg-white space-y-2 animate-in fade-in">
                    <p className="text-[11px] font-semibold text-[#B87802]">
                      Create a new role title (it will be added to the dropdown immediately):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                        placeholder="e.g. Inventory Manager, Sales Lead..."
                        className="flex-1 px-3 py-1.5 rounded-md border border-border text-xs outline-none focus:border-[#B87802]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleGenerateRole}
                        disabled={!newRoleInput.trim()}
                        className="px-3 py-1.5 rounded-md bg-[#B87802] text-white text-xs font-semibold hover:bg-[#996300] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Generate Role
                      </button>
                    </div>
                  </div>
                )}

                {/* Role Select Dropdown */}
                <div>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                    className="w-full rounded-lg border border-[#E8D8B5] bg-white py-2 px-3 text-xs text-[#12100D] font-body outline-none focus:border-[#B87802] cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Select a role from the list or generate a new custom role above.
                  </p>
                </div>
              </div>

              {/* ── Sidebar Pages Allowed Access (Checkboxes) ── */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label className={theme.forms.label}>
                      Sidebar Page Access Permissions <span className="text-rose-600">*</span>
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      Check which sidebar modules this user is permitted to view and navigate:
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPages}
                      className="text-[11px] text-[#B87802] font-semibold hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-border">·</span>
                    <button
                      type="button"
                      onClick={handleClearAllPages}
                      className="text-[11px] text-muted-foreground hover:text-rose-600 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Checkboxes Grid matching Sidebar Pages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {SIDEBAR_MODULES.map((module) => {
                    const Icon = module.icon;
                    const isChecked = formData.allowedPages.includes(module.id);

                    return (
                      <div
                        key={module.id}
                        onClick={() => handleTogglePageCheckbox(module.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-[#FAF8F2] border-[#B87802] ring-1 ring-[#B87802]/30'
                            : 'bg-card border-border hover:border-[#B87802]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="accent-[#B87802] w-4 h-4 rounded cursor-pointer mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isChecked ? 'text-[#B87802]' : 'text-muted-foreground'
                              }`}
                            />
                            <p
                              className={`text-xs font-semibold ${
                                isChecked ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {module.label}
                            </p>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                            {module.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Website Entrance Toggle */}
              <div className="p-3 rounded-lg border border-border bg-[#FAF8F2] flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-foreground">Grant Storefront Website Access</p>
                  <p className="text-[10px] text-muted-foreground">
                    Allow this user email to enter the storefront
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.canAccessWebsite}
                  onChange={(e) => setFormData((p) => ({ ...p, canAccessWebsite: e.target.checked }))}
                  className="accent-[#B87802] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={theme.buttons.secondarySm}
                >
                  Cancel
                </button>
                <button type="submit" className={theme.buttons.primary}>
                  {editingUser ? 'Save Changes' : 'Create User & Assign Access'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

export default UserAccessView;
