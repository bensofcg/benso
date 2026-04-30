import { formatPrice, extractNumberFromPrice } from '@/lib/priceUtils';

interface PriceDisplayProps {
  price: string;
  priceNum?: number;
  className?: string;
}

export function PriceDisplay({ price, priceNum, className }: PriceDisplayProps) {
  // If the price field contains "Desde", reformat the number part properly
  if (price && price.toLowerCase().includes('desde')) {
    const num = priceNum ?? extractNumberFromPrice(price);
    const formatted = formatPrice(num);
    // Don't show "Desde Gratis" - just show "Gratis"
    if (formatted === 'Gratis') {
      return <span className={className}>Gratis</span>;
    }
    return <span className={className}>Desde {formatted}</span>;
  }

  // For numeric prices, format with $ and proper separators
  const num = priceNum ?? extractNumberFromPrice(price);
  const formatted = formatPrice(num);
  return <span className={className}>{formatted}</span>;
}
