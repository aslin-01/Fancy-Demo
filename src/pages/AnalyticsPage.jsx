import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { theme } from '../theme';

export const AnalyticsPage = ({ stats }) => {
  const categoryData = [
    { category: 'Bridal Sets', sales: 48, revenue: 232000 },
    { category: 'Harams', sales: 36, revenue: 112000 },
    { category: 'Chokers', sales: 44, revenue: 86000 },
    { category: 'Bangles', sales: 58, revenue: 72000 },
    { category: 'Jhumkas', sales: 65, revenue: 55000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-display text-foreground">Store Analytics & Insights</h2>
        <div className={theme.dividers.goldLeft} />
        <p className={`${theme.typography.bodyMuted} mt-2`}>
          Deep dive into sales channels, best performing weaves, and revenue streams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Bar Chart */}
        <div className={theme.cards.padded}>
          <h3 className={theme.typography.h3Card}>Sales by Category</h3>
          <p className={`${theme.typography.bodyMuted} mb-6`}>Revenue earned per jewellery collection (₹)</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#7B4A5E" fontSize={11} tickLine={false} />
                <YAxis stroke="#7B4A5E" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F8C4D8',
                    borderRadius: '6px',
                    color: '#1A0510',
                    fontSize: '12px',
                    boxShadow: 'none',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#C2185B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Units Sold Comparison */}
        <div className={theme.cards.padded}>
          <h3 className={theme.typography.h3Card}>Units Sold by Jewellery Category</h3>
          <p className={`${theme.typography.bodyMuted} mb-6`}>Volume demand across bridal, temple festive, and daily wear collections</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#7B4A5E" fontSize={11} tickLine={false} />
                <YAxis stroke="#7B4A5E" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #F8C4D8',
                    borderRadius: '6px',
                    color: '#1A0510',
                    fontSize: '12px',
                    boxShadow: 'none',
                  }}
                />
                <Bar dataKey="sales" fill="#1A0510" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
