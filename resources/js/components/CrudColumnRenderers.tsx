import i18next from 'i18next';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { t } from '@/utils/i18n';
import { formatStatusText } from '@/utils/helpers';

interface StatusBadgeProps {
  value: any;
  colorMap?: Record<string, string>;
  defaultColor?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  value, 
  colorMap = {}, 
  defaultColor = 'bg-gray-100 text-gray-800' 
}) => {
  if (!value) return <span>-</span>;
  
  const color = colorMap[value] || defaultColor;
  
  return (
    <Badge className={cn("capitalize", color)}>
      {typeof value === 'string' ? formatStatusText(value) : value}
    </Badge>
  );
};

interface ImageColumnProps {
  src: any;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

export const ImageColumn: React.FC<ImageColumnProps> = ({ 
  src, 
        alt = 'صورة',
  className = 'h-16 w-20 rounded-md object-cover shadow-sm',
  fallbackSrc = 'https://placehold.co/200x150?text=Image+Not+Found'
}) => {
  if (!src) {
    return <div className="text-center text-gray-400">{t('No image')}</div>;
  }
  
  const imageSrc = src.startsWith && src.startsWith('http') ? src : `/storage/${src}`;
  
  return (
    <div className="flex justify-center">
      <img 
        src={imageSrc} 
        alt={alt} 
        className={className} 
        onError={(e) => {
          e.currentTarget.src = fallbackSrc;
        }}
      />
    </div>
  );
};

interface PriceColumnProps {
  value: any;
  currency?: string;
  locale?: string;
}

export const PriceColumn: React.FC<PriceColumnProps> = ({ 
  value, 
  currency = 'USD', 
  locale = i18next.resolvedLanguage || i18next.language || 'ar' 
}) => {
  if (!value && value !== 0) return <span>-</span>;
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return (
    <span className="text-sm font-medium">
      {numValue.toLocaleString(locale, { style: 'currency', currency })}
    </span>
  );
};

interface DateColumnProps {
  value: any;
  format?: Intl.DateTimeFormatOptions;
  locale?: string;
}

export const DateColumn: React.FC<DateColumnProps> = ({ 
  value, 
  format = { dateStyle: 'medium' },
  locale = i18next.resolvedLanguage || i18next.language || 'ar'
}) => {
  if (!value) return <span>-</span>;
  
  try {
    const date = new Date(value);
    return <span className="text-sm">{date.toLocaleDateString(locale, format)}</span>;
  } catch (e) {
    return <span className="text-sm">{value}</span>;
  }
};
