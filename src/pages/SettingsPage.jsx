import React, { useState } from 'react';
import { Save, Database, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export const SettingsPage = ({ onNotify }) => {
  const { backendOnline } = useAuth();
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'CF Handlooms',
    tagline: 'Handwoven Heritage & Authentic Indian Elegance',
    supportEmail: 'care@cfhandlooms.com',
    supportPhone: '+91 98765 43210',
    freeShippingThreshold: 2999,
    standardShippingFee: 149,
    currencySymbol: '₹',
  });

  const handleSave = (e) => {
    e.preventDefault();
    onNotify('Store settings updated successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold font-display text-foreground">Store Settings</h2>
        <div className={theme.dividers.goldLeft} />
        <p className={`${theme.typography.bodyMuted} mt-2`}>
          Configure store branding, shipping policies, and backend connections
        </p>
      </div>

      {/* Backend Status Card */}
      <div className={`${theme.cards.base} p-6 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-secondary border border-border flex items-center justify-center text-[#B87802]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">REST API Backend Connection</h3>
            <p className="text-xs text-muted-foreground">Target: http://localhost:5000/api</p>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-sm text-xs font-bold border ${
            backendOnline
              ? theme.colors.status.success
              : theme.colors.status.warning
          }`}
        >
          {backendOnline ? '● MongoDB Connected' : '○ Local Demo Mode'}
        </span>
      </div>

      {/* Store Profile Form */}
      <form onSubmit={handleSave} className={`${theme.cards.padded} space-y-4 text-xs`}>
        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Store className="w-4 h-4 text-[#B87802]" />
          <span>General Store Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={theme.forms.label}>Store Name</label>
            <input
              type="text"
              value={storeSettings.storeName}
              onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
          <div>
            <label className={theme.forms.label}>Tagline</label>
            <input
              type="text"
              value={storeSettings.tagline}
              onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={theme.forms.label}>Support Email</label>
            <input
              type="email"
              value={storeSettings.supportEmail}
              onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
          <div>
            <label className={theme.forms.label}>Support Phone</label>
            <input
              type="text"
              value={storeSettings.supportPhone}
              onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-foreground border-b border-border pt-4 pb-3 flex items-center gap-2">
          <span>Shipping & Delivery Rules</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={theme.forms.label}>Free Shipping Min Order (₹)</label>
            <input
              type="number"
              value={storeSettings.freeShippingThreshold}
              onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
          <div>
            <label className={theme.forms.label}>Standard Delivery Fee (₹)</label>
            <input
              type="number"
              value={storeSettings.standardShippingFee}
              onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
              className={`mt-1.5 ${theme.forms.input}`}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className={theme.buttons.primary}
          >
            <Save className="w-4 h-4 mr-2" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
