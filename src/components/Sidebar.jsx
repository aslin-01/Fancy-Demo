import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Tv,
  Tag
} from 'lucide-react';
import { theme } from '../theme';

export function Sidebar({ activeTab, setActiveTab, productCount, orderCount, returnsCount, lowStockCount, allowedPages }) {
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
      id: 'low-stock',
      label: 'Low Stock',
      icon: AlertTriangle,
      badge: lowStockCount !== null && lowStockCount !== undefined && lowStockCount > 0 ? lowStockCount : null,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: PackageCheck,
      badge: orderCount !== null && orderCount !== undefined ? orderCount : null,
    },
    // Hidden per user request:
    // {
    //   id: 'returns',
    //   label: 'Exchange',
    //   icon: RotateCcw,
    //   badge: returnsCount !== null && returnsCount !== undefined ? returnsCount : null,
    // },
    {
      id: 'hero-banner',
      label: 'Hero Banner',
      icon: Tv,
      badge: 'Hero',
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: Tag,
      badge: 'Deals',
    },
    {
      id: 'user-access',
      label: 'User Access',
      icon: ShieldCheck,
      badge: 'Roles',
    },
  ];

  const visibleNavItems = allowedPages && Array.isArray(allowedPages) && allowedPages.length > 0
    ? navItems.filter((item) => allowedPages.includes(item.id))
    : navItems;

  return (
    <aside className="w-72 shrink-0 bg-[#FFF0F5] text-[#1A0510] flex flex-col justify-between border-r border-[#F8C4D8] select-none h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div>
        <div className="p-3 border-b border-[#F8C4D8] bg-[#FCE4EC]">
          <div className="flex items-center gap-3">
            <img
              src="/brand-logo.jpg"
              alt="Madha Fancy Official Logo"
              className="h-10 w-10 object-contain bg-[#1A0510] border border-[#C2185B]/40 shrink-0"
            />
            <div className="min-w-0 flex-1 overflow-visible">
              <div className="flex items-center gap-2 overflow-visible">
                <span className={`${theme.fonts.display} font-semibold text-2xl leading-normal text-[#880E4F] tracking-wide whitespace-nowrap overflow-visible`}>
                  Madha Fancy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B4A5E]">
            Main Menu
          </div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'add-product');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs tracking-wide uppercase font-semibold transition-colors duration-150 cursor-pointer border border-l-4 ${
                  isActive
                    ? 'bg-white text-[#C2185B] border-[#F8C4D8] border-l-[#C2185B]'
                    : 'text-[#4A1C30] border-transparent border-l-transparent hover:bg-[#FCE4EC] hover:text-[#C2185B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#C2185B]' : 'text-[#7B4A5E]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-[#FFF5F8] text-[#C2185B] border border-[#F8C4D8]'
                        : 'bg-[#FCE4EC] text-[#C2185B] border border-[#F8C4D8]'
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
      <div className="p-4 border-t border-[#F8C4D8] bg-[#FCE4EC]">

        {/* User Access Identity Badge */}
        <div className="flex items-center gap-3 pt-1 px-1">
          <div className="w-8 h-8 rounded-full bg-white border border-[#C2185B] flex items-center justify-center text-xs font-bold text-[#C2185B]">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1A0510] truncate">Super Admin</p>
            <p className="text-[10px] uppercase tracking-wider text-[#7B4A5E] truncate">Madha Fancy</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
