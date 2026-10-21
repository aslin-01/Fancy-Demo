import React from 'react';
import { theme } from '../theme';

export const StatusBadge = ({ status }) => {
  const styles = {
    Pending: theme.colors.status.warning,
    Processing: theme.colors.status.info,
    Shipped: 'text-indigo-800 bg-indigo-50 border-indigo-200',
    Delivered: theme.colors.status.success,
    Cancelled: theme.colors.status.error,
  };

  const dots = {
    Pending: 'bg-amber-600',
    Processing: 'bg-sky-600',
    Shipped: 'bg-indigo-600',
    Delivered: 'bg-emerald-600',
    Cancelled: 'bg-rose-600',
  };

  const currentStyle = styles[status] || 'bg-secondary text-foreground border-border';
  const currentDot = dots[status] || 'bg-muted-foreground';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-semibold border ${currentStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${currentDot}`} />
      {status}
    </span>
  );
};
