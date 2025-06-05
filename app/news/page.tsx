"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardWrapper from '../components/DashboardWrapper';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, BookmarkIcon, Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { getLatestNews, getNewsByCategory, SimpleNewsArticle } from '../services/newsService';

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'bitcoin' | 'ethereum' | 'defi' | 'regulation'>('all');
  const [newsData, setNewsData] = useState<SimpleNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);

        let news: SimpleNewsArticle[];

        if (activeFilter === 'all') {
          news = await getLatestNews(20);
        } else {
          news = await getNewsByCategory(activeFilter, 20);
        }

        setNewsData(news);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [activeFilter]);

  // Filter news based on search term
  const filteredNews = newsData.filter(news => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      news.title.toLowerCase().includes(searchLower) ||
      news.summary.toLowerCase().includes(searchLower) ||
      news.source.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardWrapper>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* News Header */}
        <motion.div variants={itemVariants} className="flex items-center">
          <Newspaper className="h-8 w-8 mr-4 text-[var(--primary-500)]" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Crypto News</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Stay updated with the latest news in the crypto world</p>
          </div>
        </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            size="lg"
            className={`py-2.5 px-5 text-base shadow-sm ${activeFilter === 'all' ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All News
          </Button>
          <Button
            variant={activeFilter === 'bitcoin' ? 'primary' : 'outline'}
            size="lg"
            className={`py-2.5 px-5 text-base shadow-sm ${activeFilter === 'bitcoin' ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white' : ''}`}
            onClick={() => setActiveFilter('bitcoin')}
          >
            Bitcoin
          </Button>
          <Button
            variant={activeFilter === 'ethereum' ? 'primary' : 'outline'}
            size="lg"
            className={`py-2.5 px-5 text-base shadow-sm ${activeFilter === 'ethereum' ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white' : ''}`}
            onClick={() => setActiveFilter('ethereum')}
          >
            Ethereum
          </Button>
          <Button
            variant={activeFilter === 'defi' ? 'primary' : 'outline'}
            size="lg"
            className={`py-2.5 px-5 text-base shadow-sm ${activeFilter === 'defi' ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white' : ''}`}
            onClick={() => setActiveFilter('defi')}
          >
            DeFi
          </Button>
          <Button
            variant={activeFilter === 'regulation' ? 'primary' : 'outline'}
            size="lg"
            className={`py-2.5 px-5 text-base shadow-sm ${activeFilter === 'regulation' ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white' : ''}`}
            onClick={() => setActiveFilter('regulation')}
          >
            Regulation
          </Button>
        </div>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <motion.div variants={itemVariants} className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--primary-500)]" />
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants} className="text-center py-20 text-red-500">
          <p className="text-xl">{error}</p>
        </motion.div>
      ) : (
        <>
          {/* Featured News */}
          {filteredNews.length > 0 && (
            <motion.div variants={itemVariants} className="relative rounded-xl overflow-hidden h-[350px] sm:h-[450px] shadow-xl">
              <Image
                src={filteredNews[0].imageUrl}
                alt={filteredNews[0].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-medium bg-[var(--primary-500)] px-3 py-1.5 rounded-md shadow-md">Featured</span>
                    <span className="text-base">{formatDate(filteredNews[0].date)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">{filteredNews[0].title}</h2>
                  <p className="text-base sm:text-lg text-gray-200 line-clamp-2 mb-6">{filteredNews[0].summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">{filteredNews[0].source}</span>
                    <Button
                      href={filteredNews[0].url}
                      size="lg"
                      className="text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2.5 px-5 text-base shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Read more
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* News Grid - Only show when not loading */}
      {!isLoading && !error && filteredNews.length > 1 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.slice(1).map((news, index) => (
            <motion.div
              key={news.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Card className="flex flex-col h-full premium-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-52 rounded-t-lg overflow-hidden">
                  <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="flex-1 flex flex-col p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-[var(--primary-600)] dark:text-[var(--primary-400)]">{news.source}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(news.date)}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{news.title}</h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-3 mb-6">{news.summary}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <Button
                      href={news.url}
                      variant="outline"
                      size="lg"
                      className="py-2.5 px-5 text-base shadow-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read article
                    </Button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <BookmarkIcon className="h-6 w-6 text-gray-400 hover:text-[var(--primary-500)]" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && !error && filteredNews.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="premium-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6 shadow-inner">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md text-lg">
                We couldn't find any news matching your search. Try adjusting your filters or search term.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </motion.div>
    </DashboardWrapper>
  );
}
