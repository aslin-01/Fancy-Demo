import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { theme } from '../theme';

export const StatCard = ({ title, value, change, isPositive, icon: Icon }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-[#B87802] transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {title}
        </span>
        <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-[#B87802] group-hover:scale-105 group-hover:bg-[#F5B815]/20 transition-all">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold font-display text-foreground">{value}</h3>
        {change && (
          <div
            className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-sm border ${
              isPositive
                ? theme.colors.status.success
                : theme.colors.status.error
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  );
};
