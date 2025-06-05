"use client";

import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function SkeletonMarketOverview() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-900/20 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTrendingCoins() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-16 mr-1" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
      <div className="space-y-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonPortfolioSummary() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-20 mr-1" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 rounded-full mr-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-8 ml-1" />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 rounded-full mr-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-8 ml-1" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonMarketTrends() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 rounded-md mr-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 rounded-md mr-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonNews() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-16 mr-1" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 mb-4">
            <Skeleton className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex items-center">
                <Skeleton className="h-3 w-16 mr-2" />
                <Skeleton className="h-3 w-3 rounded-full mx-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTransactions() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-16 mr-1" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                <Skeleton className="w-4 h-4 rounded-sm" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portfolio Page Skeletons
export function SkeletonPortfolioSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-800">
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPortfolioPerformanceChart() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex space-x-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-md" />
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonAssetAllocation() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 h-full">
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-6 rounded-md mr-3" />
        <Skeleton className="h-7 w-40" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="w-full space-y-3 mt-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="h-3 w-3 rounded-full mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTopHoldings() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonHoldingsTable() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left pb-4"><Skeleton className="h-4 w-12" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-12 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-20 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-12 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-8 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-5">
                  <div className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="py-5 text-right">
                  <Skeleton className="h-4 w-20 ml-auto mb-1" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </td>
                <td className="py-5 text-right">
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-4 rounded-full mr-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonTransactionsTable() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left pb-4"><Skeleton className="h-4 w-12" /></th>
              <th className="text-left pb-4"><Skeleton className="h-4 w-12" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-12 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-12 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-8 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-5">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="py-5">
                  <div className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                <td className="py-5 text-right">
                  <Skeleton className="h-6 w-16 rounded-full ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Market Page Skeletons
export function SkeletonPopularCoins() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-6 rounded-md mr-3" />
        <Skeleton className="h-7 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <div className="flex items-center justify-end">
                <Skeleton className="h-4 w-4 rounded-full mr-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGainersLosers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gainers Card */}
      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-5">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 p-2">
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1" />
                <div className="flex items-center justify-end">
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Losers Card */}
      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center mb-6">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-5">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 p-2">
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1" />
                <div className="flex items-center justify-end">
                  <Skeleton className="h-4 w-4 rounded-full mr-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonMarketTable() {
  return (
    <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md mr-3" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left pb-4"><Skeleton className="h-4 w-8" /></th>
              <th className="text-left pb-4"><Skeleton className="h-4 w-16" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-24 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-24 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
              <th className="text-right pb-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array(10).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-5 pl-6"><Skeleton className="h-4 w-8" /></td>
                <td className="py-5">
                  <div className="flex items-center">
                    <Skeleton className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                <td className="py-5 text-right">
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-4 rounded-full mr-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-28 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-28 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="py-5 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
