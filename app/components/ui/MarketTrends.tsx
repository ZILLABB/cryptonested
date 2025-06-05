"use client";

import { Card, CardHeader, CardContent } from './Card';

import { SimpleCryptoCoin } from '../../services/cryptoService';

interface GainersLosers {
  gainers: SimpleCryptoCoin[];
  losers: SimpleCryptoCoin[];
}

interface MarketTrendsProps {
  gainersLosers: GainersLosers;
}

export function MarketTrends({ gainersLosers }: MarketTrendsProps) {
  const { gainers, losers } = gainersLosers;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const renderCryptoList = (list: SimpleCryptoCoin[]) => {
    return (
      <div className="space-y-4">
        {list.map((crypto) => (
          <div key={crypto.symbol} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{crypto.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
            </div>
            <div className="text-right">
              <div>{formatCurrency(crypto.price)}</div>
              <div className={`text-sm ${getChangeColor(crypto.change24h)}`}>
                {formatPercentage(crypto.change24h)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>Market Trends</CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-green-500 mb-3">Top Gainers</h3>
            {renderCryptoList(gainers)}
          </div>
          <div>
            <h3 className="font-medium text-red-500 mb-3">Top Losers</h3>
            {renderCryptoList(losers)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
