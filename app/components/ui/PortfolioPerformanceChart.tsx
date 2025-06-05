"use client";

import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { ChartData, ChartOptions } from 'chart.js';
import { Card, CardHeader, CardContent } from './Card';
import { PerformanceDataPoint } from '../../services/portfolioService';

interface PortfolioPerformanceChartProps {
  daily: PerformanceDataPoint[];
  weekly: PerformanceDataPoint[];
  monthly: PerformanceDataPoint[];
  yearly: PerformanceDataPoint[];
  allTime: PerformanceDataPoint[];
}

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'all';

export function PortfolioPerformanceChart({ 
  daily, 
  weekly, 
  monthly, 
  yearly, 
  allTime 
}: PortfolioPerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [percentChange, setPercentChange] = useState<number>(0);
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get data for selected time range
  const getDataForTimeRange = () => {
    switch (timeRange) {
      case 'day':
        return daily;
      case 'week':
        return weekly;
      case 'month':
        return monthly;
      case 'year':
        return yearly;
      case 'all':
        return allTime;
      default:
        return monthly;
    }
  };
  
  // Calculate percent change
  useEffect(() => {
    const data = getDataForTimeRange();
    if (data.length >= 2) {
      const firstValue = data[0].value;
      const lastValue = data[data.length - 1].value;
      const change = ((lastValue - firstValue) / firstValue) * 100;
      setPercentChange(change);
    }
  }, [timeRange, daily, weekly, monthly, yearly, allTime]);
  
  // Create and update chart
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Get data for selected time range
    const data = getDataForTimeRange();
    
    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    const labels = data.map(point => point.date);
    const values = data.map(point => point.value);
    
    // Determine if trend is positive
    const isPositive = values[values.length - 1] >= values[0];
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
    }
    
    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
          borderColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
          pointHoverBackgroundColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
          pointBorderColor: '#fff',
          pointHoverBorderColor: '#fff',
          pointBorderWidth: 2,
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
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return `Value: ${formatCurrency(value)}`;
            },
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          cornerRadius: 4,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
        },
        y: {
          grid: {
            borderDash: [5, 5],
          },
          ticks: {
            callback: function(value) {
              return formatCurrency(value as number);
            },
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      elements: {
        line: {
          tension: 0.4,
        },
      },
    };
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timeRange, daily, weekly, monthly, yearly, allTime]);
  
  return (
    <Card className="premium-card overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Portfolio Performance</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'day' ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setTimeRange('day')}
            >
              1D
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'week' ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setTimeRange('week')}
            >
              1W
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'month' ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setTimeRange('month')}
            >
              1M
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'year' ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setTimeRange('year')}
            >
              1Y
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === 'all' ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {formatCurrency(getDataForTimeRange()[getDataForTimeRange().length - 1]?.value || 0)}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${percentChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {timeRange === 'day' ? 'Last 24 hours' : 
             timeRange === 'week' ? 'Last 7 days' : 
             timeRange === 'month' ? 'Last 30 days' : 
             timeRange === 'year' ? 'Last 12 months' : 'All time'}
          </p>
        </div>
        <div className="h-64">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
