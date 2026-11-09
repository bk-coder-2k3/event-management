'use client';

import React from 'react';
import { CATEGORY_SPECIFICATIONS, CategoryFieldDef } from '@vizhaspace/shared';
import { Check, Sparkles } from 'lucide-react';

interface CategoryFieldsRendererProps {
  categorySlug?: string;
  attributes: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export function CategoryFieldsRenderer({
  categorySlug,
  attributes = {},
  onChange,
}: CategoryFieldsRendererProps) {
  if (!categorySlug) return null;

  const fields: CategoryFieldDef[] = CATEGORY_SPECIFICATIONS[categorySlug] || [];
  if (fields.length === 0) return null;

  const toggleMultiSelectOption = (key: string, option: string) => {
    const currentList: string[] = Array.isArray(attributes[key]) ? attributes[key] : [];
    const exists = currentList.includes(option);
    const updated = exists
      ? currentList.filter((item) => item !== option)
      : [...currentList, option];
    onChange(key, updated);
  };

  return (
    <div className="bg-ivory-50/80 border border-gold-400/40 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-gold-300/40">
        <div className="w-8 h-8 rounded-lg bg-burgundy-900 text-gold-400 flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-burgundy-950 text-base">
            Category Specifications & Amenities
          </h3>
          <p className="text-xs text-gray-600">
            Provide details specific to your service category to attract matching wedding enquiries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const value = attributes[field.key];

          // 1. Number Input
          if (field.type === 'number') {
            return (
              <div key={field.key} className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {field.label} {field.unit && <span className="text-gray-400 normal-case">({field.unit})</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onChange(field.key, val);
                    }}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-700 focus:border-transparent transition"
                  />
                  {field.unit && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none">
                      {field.unit}
                    </span>
                  )}
                </div>
                {field.helpText && <p className="text-[11px] text-gray-500">{field.helpText}</p>}
              </div>
            );
          }

          // 2. Select Dropdown
          if (field.type === 'select') {
            return (
              <div key={field.key} className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {field.label}
                </label>
                <select
                  value={value ?? ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-700 focus:border-transparent transition"
                >
                  <option value="">Select option...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {field.helpText && <p className="text-[11px] text-gray-500">{field.helpText}</p>}
              </div>
            );
          }

          // 3. Multi-Select Tags / Pills
          if (field.type === 'multiselect') {
            const selectedList: string[] = Array.isArray(value) ? value : [];
            return (
              <div key={field.key} className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {field.label} <span className="text-gray-400 normal-case font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {field.options?.map((opt) => {
                    const isSelected = selectedList.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleMultiSelectOption(field.key, opt)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-burgundy-900 border-burgundy-900 text-gold-300 shadow-xs'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gold-500 hover:bg-gold-50/40'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {field.helpText && <p className="text-[11px] text-gray-500">{field.helpText}</p>}
              </div>
            );
          }

          // 4. Boolean Checkbox
          if (field.type === 'boolean') {
            const isChecked = Boolean(value);
            return (
              <label
                key={field.key}
                className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gold-500 transition select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="w-4 h-4 text-burgundy-700 rounded border-gray-300 focus:ring-burgundy-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-800">{field.label}</span>
              </label>
            );
          }

          // 5. Generic Text
          return (
            <div key={field.key} className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-700 focus:border-transparent transition"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

