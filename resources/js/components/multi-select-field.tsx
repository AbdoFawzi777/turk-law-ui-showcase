import { t as localizeSystemText } from '@/utils/i18n';
// components/multi-select-field.tsx
import React from 'react';
import MultiSelect from '@/components/ui/multi-select';
import { FormField } from '@/types/crud';

interface MultiSelectFieldProps {
  field: Omit<FormField, 'disabled'> & { disabled?: boolean };
  formData: Record<string, any>;
  handleChange: (name: string, value: any) => void;
}

export function MultiSelectField({ field, formData, handleChange }: MultiSelectFieldProps) {
  // Ensure selected value is always an array of strings
  const selectedValues = Array.isArray(formData[field.name]) 
    ? formData[field.name] 
    : formData[field.name] 
      ? [formData[field.name].toString()] 
      : [];
  
  return (
    <MultiSelect
      options={(field.options || []).map((option) => ({ ...option, value: String(option.value) }))}
      value={selectedValues}
      disabled={field.disabled}
      onChange={(selected) => handleChange(field.name, selected)}
      placeholder={field.placeholder || localizeSystemText("Select {{field}}", { field: field.label })}
    />
  );
}
