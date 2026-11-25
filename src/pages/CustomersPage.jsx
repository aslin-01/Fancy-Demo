import React, { useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { theme } from '../theme';

export const CustomersPage = ({ customers }) => {
  const [search, setSearch] = useState('');

  const customerList = customers || [
    {
      _id: 'c1',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98451 23456',
      createdAt: '2026-08-15',
      orderCount: 4,
      totalSpent: 48999,
    },
    {
      _id: 'c2',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      phone: '+91 99887 76655',
      createdAt: '2026-09-02',
      orderCount: 2,
      totalSpent: 32999,
    },
    {
      _id: 'c3',
      name: 'Meera Nambiar',
      email: 'meera.nambiar@example.com',
      phone: '+91 97412 89012',
      createdAt: '2026-09-24',
      orderCount: 3,
      totalSpent: 28498,
    },
    {
      _id: 'c4',
      name: 'Kavita Sen',
      email: 'kavita.sen@example.com',
      phone: '+91 98301 44556',
      createdAt: '2026-10-10',
      orderCount: 1,
      totalSpent: 13999,
    },
  ];

  const filtered = customerList.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-display text-foreground">Customer Directory</h2>
          <div className={theme.dividers.goldLeft} />
          <p className={`${theme.typography.bodyMuted} mt-2`}>
            View patron lifetime value, order frequency, and contact records
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron name, email, phone..."
            className={`${theme.forms.input} pl-9`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cust) => (
          <div
            key={cust._id}
            className={`${theme.cards.base} p-5 hover:border-[#C2185B] transition-colors flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white flex items-center justify-center font-bold text-sm border border-[#E91E8C]/30">
                  {cust.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{cust.name}</h3>
                  <span className={theme.badges.discount}>Verified Patron</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C2185B]" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C2185B]" />
                  <span>{cust.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-secondary/40 p-2 rounded-sm border border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Orders</span>
                <span className="font-bold text-foreground text-sm">{cust.orderCount || 1}</span>
              </div>
              <div className="bg-secondary/40 p-2 rounded-sm border border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Spent</span>
                <span className="font-bold text-[#C2185B] text-sm">
                  ₹{(cust.totalSpent || 18499).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
