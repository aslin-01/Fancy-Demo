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
    { category: 'Silk Sarees', sales: 48, revenue: 142000 },
    { category: 'Wedding', sales: 24, revenue: 98000 },
    { category: 'Designer', sales: 32, revenue: 64000 },
    { category: 'Cotton', sales: 42, revenue: 45000 },
    { category: 'Party Wear', sales: 18, revenue: 38000 },
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
          <p className={`${theme.typography.bodyMuted} mb-6`}>Revenue earned per saree collection (₹)</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#6B6457" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6457" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8D8B5',
                    borderRadius: '6px',
                    color: '#12100D',
                    fontSize: '12px',
                    boxShadow: 'none',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#B87802" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Units Sold Comparison */}
        <div className={theme.cards.padded}>
          <h3 className={theme.typography.h3Card}>Units Sold by Saree Type</h3>
          <p className={`${theme.typography.bodyMuted} mb-6`}>Volume demand across bridal, festive, and everyday handlooms</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#6B6457" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6457" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8D8B5',
                    borderRadius: '6px',
                    color: '#12100D',
                    fontSize: '12px',
                    boxShadow: 'none',
                  }}
                />
                <Bar dataKey="sales" fill="#0C0A07" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
