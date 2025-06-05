import { useCryptoPrices } from '../contexts/CryptoPricesContext.js';

export const useFormattedPrices = () => {
  const { prices, isLoading, error } = useCryptoPrices();

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return { formatted: 'N/A', numeric: 0 };
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Format with 2 decimal places and add $ prefix
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);

    return { formatted, numeric: numericPrice };
  };

  const getPriceChangeClass = (current: number, previous: number) => {
    if (current > previous) return 'text-green-500';
    if (current < previous) return 'text-red-500';
    return 'text-gray-500';
  };

  const getPriceChangeIcon = (current: number, previous: number) => {
    if (current > previous) return '▲';
    if (current < previous) return '▼';
    return '→';
  };

  const getPriceChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    formatPrice,
    getPriceChangeClass,
    getPriceChangeIcon,
    getPriceChange,
    prices,
    isLoading,
    error
  };
};
