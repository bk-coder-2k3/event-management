'use client';

import React from 'react';
import { CATEGORY_SPECIFICATIONS, CategoryFieldDef } from '@vizhaspace/shared';
import {
  Users,
  Utensils,
  Camera,
  Car,
  Wind,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Clock,
  Shirt,
  Music,
  Mail,
  Palette,
  Check,
} from 'lucide-react';

interface VendorSpecificationsProps {
  categorySlug?: string;
  attributes?: Record<string, any> | null;
}

export function VendorSpecifications({ categorySlug, attributes }: VendorSpecificationsProps) {
  if (!categorySlug || !attributes || typeof attributes !== 'object') {
    return null;
  }

  const defs = CATEGORY_SPECIFICATIONS[categorySlug];
  if (!defs || defs.length === 0) {
    return null;
  }

  // Filter only definitions that actually have a recorded value
  const filledFields = defs.filter((def) => {
    const val = attributes[def.key];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  });

  if (filledFields.length === 0) {
    return null;
  }

  // Helper to pick an appropriate icon for specs
  const getFieldIcon = (key: string) => {
    switch (key) {
      case 'seatingCapacity':
      case 'diningCapacity':
      case 'teamSize':
      case 'guestCapacityHandled':
        return <Users className="w-4 h-4 text-burgundy-700" />;
      case 'parkingCapacity':
        return <Car className="w-4 h-4 text-burgundy-700" />;
      case 'vegPolicy':
      case 'serviceStyles':
      case 'traditionalFeastItems':
        return <Utensils className="w-4 h-4 text-burgundy-700" />;
      case 'airConditioning':
        return <Wind className="w-4 h-4 text-burgundy-700" />;
      case 'deliverables':
      case 'photographyStyles':
      case 'droneShoots':
        return <Camera className="w-4 h-4 text-burgundy-700" />;
      case 'instruments':
      case 'performanceFormats':
        return <Music className="w-4 h-4 text-burgundy-700" />;
      case 'bridalWearTypes':
      case 'fabricSpecialties':
        return <Shirt className="w-4 h-4 text-burgundy-700" />;
      case 'decorThemes':
        return <Palette className="w-4 h-4 text-burgundy-700" />;
      case 'printingMethods':
        return <Mail className="w-4 h-4 text-burgundy-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-gold-600" />;
    }
  };

  // Group into:
  // 1. Numeric / Key Stat cards (seating, dining, price per plate, deliverables, turnaround)
  // 2. Multiselect / Tags (cuisines, styles, decor themes, brands)
  // 3. Features & Amenities (booleans, short text, selects)
  const numericStats = filledFields.filter(
    (f) => f.type === 'number' || (f.unit && typeof attributes[f.key] !== 'boolean')
  );
  const tagFields = filledFields.filter((f) => f.type === 'multiselect');
  const featureFields = filledFields.filter(
    (f) => f.type === 'boolean' || (f.type === 'select' && !numericStats.includes(f))
  );

  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-0.5">
            Key Specifications & Highlights
          </span>
          <h2 className="font-serif text-2xl font-bold text-burgundy-950">
            Category Facilities & Details
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-800 text-xs font-bold rounded-full border border-gold-200">
          <Award className="w-3.5 h-3.5 text-gold-600" />
          <span>Verified Specs</span>
        </div>
      </div>

      {/* 1. Metric / Number Stats Grid */}
      {numericStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {numericStats.map((field) => {
            const val = attributes[field.key];
            return (
              <div
                key={field.key}
                className="p-3.5 sm:p-4 rounded-2xl bg-ivory-50/70 border border-ivory-200/80 hover:border-gold-300 transition"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-white border border-ivory-200 shadow-2xs">
                    {getFieldIcon(field.key)}
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">
                    {field.label}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-burgundy-950">
                    {typeof val === 'number' ? val.toLocaleString('en-IN') : String(val)}
                  </span>
                  {field.unit && (
                    <span className="text-xs font-medium text-gray-500">{field.unit}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Feature & Amenity Badges (Booleans, Key Policies) */}
      {featureFields.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-900 block">
            Amenities & Policies
          </span>
          <div className="flex flex-wrap gap-2.5">
            {featureFields.map((field) => {
              const val = attributes[field.key];
              if (field.type === 'boolean') {
                if (!val) return null; // Don't show negative flags unless desired
                return (
                  <span
                    key={field.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {field.label}
                  </span>
                );
              }

              return (
                <span
                  key={field.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-burgundy-50 text-burgundy-900 border border-burgundy-200 text-xs font-semibold"
                >
                  <span className="text-gray-500 font-medium">{field.label}:</span>
                  <span>{String(val)}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Multiselect Tag Lists (Cuisines, Themes, Styles, Deliverables, etc.) */}
      {tagFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {tagFields.map((field) => {
            const rawVal = attributes[field.key];
            const tags: string[] = Array.isArray(rawVal)
              ? rawVal
              : typeof rawVal === 'string'
              ? rawVal.split(',').map((s) => s.trim())
              : [];

            if (tags.length === 0) return null;

            return (
              <div
                key={field.key}
                className="p-4 rounded-2xl bg-white border border-ivory-200 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-gold-100 text-gold-800">
                    {getFieldIcon(field.key)}
                  </div>
                  <h3 className="text-xs font-bold text-burgundy-950 uppercase tracking-wider">
                    {field.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-100 text-gray-800 text-xs rounded-lg border border-ivory-300 font-medium"
                    >
                      <Check className="w-3 h-3 text-gold-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

