/**
 * Format a price number for display with $ sign.
 * - If price is 0, returns "Gratis"
 * - Removes unnecessary .00 (5000 → $5,000, not $5,000.00)
 * - Adds thousand separators
 */
export function formatPrice(price: number): string {
  if (price === 0 || isNaN(price)) return 'Gratis';
  if (price % 1 === 0) {
    return '$' + price.toLocaleString('en-US');
  }
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function extractNumberFromPrice(price: string): number {
  const match = price.match(/[\d,.]+/);
  if (match) {
    const numStr = match[0].replace(/,/g, '');
    return parseFloat(numStr) || 0;
  }
  return 0;
}
