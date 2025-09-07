import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(' '));
}


export function getPrice(price: unknown): string {
  const numPrice = Number(price);
  if (!isNaN(numPrice)) {
    return numPrice.toFixed(2);
  }
  return '0.00';
}

export function getQuantity(quantity: unknown): number {
  const numQuantity = Number(quantity);
  if (!isNaN(numQuantity)) {
    return numQuantity;
  }
  return 0;
}


export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}





