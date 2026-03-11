import type { PropertyType } from '../types/property.types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatMultiple(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const PROPERTY_TYPE_VARIANT: Record<PropertyType, 'blue' | 'green' | 'yellow' | 'red' | 'grey'> = {
  multifamily: 'blue',
  office: 'green',
  retail: 'yellow',
  industrial: 'grey',
};
