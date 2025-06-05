"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from './Card';
import { Newspaper, ArrowRight } from 'lucide-react';
import { SimpleNewsArticle } from '../../services/newsService';

interface CryptoNewsProps {
  news: SimpleNewsArticle[];
}

export function CryptoNews({ news, compact = false }: CryptoNewsProps & { compact?: boolean }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Newspaper className="h-6 w-6 mr-3 text-[var(--primary-500)]" />
            <span className="text-xl font-semibold">Latest News</span>
          </div>
          <Link
            href="/news"
            className="text-sm flex items-center text-[var(--primary-600)] dark:text-[var(--primary-400)] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {news.slice(0, compact ? 3 : news.length).map((item, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative rounded-md overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                >
                  {item.title}
                </a>
                {!compact && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {item.summary}
                  </p>
                )}
                <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
