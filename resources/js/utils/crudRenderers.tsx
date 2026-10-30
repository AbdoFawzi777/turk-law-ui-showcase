import i18next from 'i18next';
import { t as localizeSystemText } from '@/utils/i18n';
import { formatStatusText } from '@/utils/helpers';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Simple renderers without importing components
export const columnRenderers = {
  // Status badge renderer
  status: (colorMap: Record<string, string> = {}, defaultColor = 'bg-gray-100 text-gray-800') => {
    return (value: string | number | null | undefined) => {
      if (!value) return <span>-</span>;
      const color = colorMap[value] || defaultColor;
      return (
        <Badge className={cn("capitalize", color)}>
          {typeof value === 'string' ? formatStatusText(value) : value}
        </Badge>
      );
    };
  },
  
  // Image renderer
  image: (className = 'h-16 w-20 rounded-md object-cover shadow-sm', fallbackSrc = 'https://placehold.co/200x150?text=Image+Not+Found') => {
    return (_: unknown, row: Record<string, unknown>, key: string) => {
      const value = row[key];
      if (typeof value !== 'string' || !value) return <div className="text-center text-gray-400">{localizeSystemText("No image")}</div>;
      
      const imageSrc = value.startsWith('http') ? value : `/storage/${value}`;
      
      return (
        <div className="flex justify-center">
          <img 
            src={imageSrc} 
            alt="صورة" 
            className={className} 
            onError={(e) => {
              e.currentTarget.src = fallbackSrc;
            }}
          />
        </div>
      );
    };
  },
  
  // Price renderer
  price: (currency = 'USD', locale = i18next.resolvedLanguage || i18next.language || 'ar') => {
    return (value: string | number | null | undefined) => {
      if (value === null || value === undefined) return <span>-</span>;
      
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      return (
        <span className="text-sm font-medium">
          {numValue.toLocaleString(locale, { style: 'currency', currency })}
        </span>
      );
    };
  },
  
  // Date renderer
  date: (format: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }, locale = i18next.resolvedLanguage || i18next.language || 'ar') => {
    return (value: string | number | Date | null | undefined) => {
      if (!value) return <span>-</span>;
      
      try {
        const date = value instanceof Date ? value : new Date(value);
        return <span className="text-sm">{date.toLocaleDateString(locale, format)}</span>;
      } catch (e) {
        return <span className="text-sm">{String(value)}</span>;
      }
    };
  },
  
  // Boolean renderer
  boolean: () => {
    return (value: unknown) => <span>{value ? localizeSystemText('Yes') : localizeSystemText('No')}</span>;
  },
  
  // Relation renderer
  relation: (field: string) => {
    return (_: unknown, row: Record<string, unknown>, key: string) => {
      const relation = row[key];
      if (!relation || typeof relation !== 'object' || !(field in relation)) return <span>-</span>;
      const value: unknown = Reflect.get(relation, field);
      return <span>{typeof value === 'string' || typeof value === 'number' ? value : '-'}</span>;
    };
  }
};
