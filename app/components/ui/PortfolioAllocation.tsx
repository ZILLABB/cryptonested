"use client";

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ChartData, ChartOptions } from 'chart.js';

import('chart.js/auto');
import { Card, CardHeader, CardContent } from './Card.tsx';

interface AllocationItem {
  name: string;
  symbol: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioAllocationProps {
  allocation: AllocationItem[];
}

export function PortfolioAllocation({ allocation }: PortfolioAllocationProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = allocation.map(item => item.name);
    const data = allocation.map(item => item.percentage);
    const backgroundColor = allocation.map(item => item.color);

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };

    const chartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw as number;
              return `${label}: ${value.toFixed(1)}%`;
            },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [allocation]);

  return (
    <Card className="w-full">
      <CardHeader>Portfolio Allocation</CardHeader>
      <CardContent>
        <div className="h-60">
          <canvas ref={chartRef} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {allocation.map((item) => (
            <div key={item.symbol} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <span className="font-medium">{item.symbol}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
