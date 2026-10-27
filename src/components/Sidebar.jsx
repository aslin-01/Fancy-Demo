import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  ShieldCheck
} from 'lucide-react';
import { theme } from '../theme';

export function Sidebar({ activeTab, setActiveTab, productCount, orderCount }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products',
      label: 'Products',
      icon: ShoppingBag,
      badge: productCount !== null ? productCount : null,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: PackageCheck,
      badge: orderCount !== null && orderCount !== undefined ? orderCount : 3,
    },
    {
      id: 'user-access',
      label: 'User Access',
      icon: ShieldCheck,
      badge: 'Roles',
    },
  ];

  return (
    <aside className="w-72 shrink-0 bg-[#F7F3EA] text-[#12100D] flex flex-col justify-between border-r border-[#E8D8B5] select-none h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div>
        <div className="p-3 border-b border-[#E8D8B5] bg-[#EFE7D8]">
          <div className="flex items-center gap-3">
            <img
              src="/brand-logo.jpg"
              alt="CF Handlooms Official Logo"
              className="h-10 w-10 object-contain bg-[#0C0A07] border border-[#B87802]/40 shadow-md shadow-[#B87802]/20 shrink-0"
            />
            <div className="min-w-0 flex-1 overflow-visible">
              <div className="flex items-center gap-2 overflow-visible">
                <span className={`${theme.fonts.display} font-semibold text-2xl leading-normal text-[#996300] tracking-wide whitespace-nowrap overflow-visible`}>
                  CF Handlooms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7E6A]">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'add-product');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs tracking-wide uppercase font-semibold transition-colors duration-150 cursor-pointer border border-l-4 ${
                  isActive
                    ? 'bg-white text-[#B87802] border-[#E8D8B5] border-l-[#B87802] shadow-sm'
                    : 'text-[#4A4235] border-transparent border-l-transparent hover:bg-[#EAE0CE] hover:text-[#B87802]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#B87802]' : 'text-[#8C7E6A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-[#FAF8F2] text-[#B87802] border border-[#E8D8B5]'
                        : 'bg-[#E5DAC6] text-[#B87802] border border-[#D9CDB7]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: User Profile */}
      <div className="p-4 border-t border-[#E8D8B5] bg-[#EFE7D8]">

        {/* User Access Identity Badge */}
        <div className="flex items-center gap-3 pt-1 px-1">
          <div className="w-8 h-8 rounded-full bg-white border border-[#B87802] flex items-center justify-center text-xs font-bold text-[#B87802] shadow-xs">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#12100D] truncate">Super Admin</p>
            <p className="text-[10px] uppercase tracking-wider text-[#736858] truncate">CF Handlooms</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
