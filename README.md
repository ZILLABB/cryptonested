# CryptoNested - Premium Cryptocurrency Portfolio Tracker

<div align="center">
  <img src="/public/logo.png" width="200" alt="CryptoNested Logo">
  <p align="center">A comprehensive cryptocurrency portfolio tracker and analytics platform with staking rewards, built with Next.js 15 and Supabase.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.3.1-black" />
    <img src="https://img.shields.io/badge/React-19.0.0-blue" />
    <img src="https://img.shields.io/badge/Supabase-Backend-green" />
    <img src="https://img.shields.io/badge/TypeScript-5.8.3-blue" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.3.5-cyan" />
  </p>
</div>

## 🚀 Project Overview

CryptoNested is a modern, feature-rich cryptocurrency portfolio tracker that allows users to monitor their crypto investments, track market trends, and earn passive income through staking. The platform combines real-time market data with comprehensive portfolio analytics and a beautiful, responsive user interface.

**Key Highlights:**
- 🎯 **Portfolio Management**: Track multiple portfolios with detailed analytics
- 💰 **Staking Rewards**: Earn up to 12% APY on supported cryptocurrencies
- 📊 **Real-time Data**: Live price updates and market information
- 🔐 **Secure Authentication**: Supabase-powered user management
- 📱 **Responsive Design**: Optimized for all devices
- 🌙 **Dark/Light Mode**: System preference detection with smooth transitions

## ✨ Current Features (Implemented)

### 🔐 Authentication & User Management
- ✅ **User Registration & Login** - Complete Supabase authentication
- ✅ **Password Reset** - Forgot password functionality
- ✅ **Session Management** - Automatic session handling with inactivity timeout
- ✅ **User Profiles** - Customizable user profiles with avatar support
- ✅ **Row-Level Security** - Database-level security policies

### 📊 Dashboard & Analytics
- ✅ **Comprehensive Dashboard** - Portfolio overview with key metrics
- ✅ **Market Overview** - Total market cap, volume, and dominance data
- ✅ **Live Price Ticker** - Real-time cryptocurrency prices
- ✅ **Portfolio Summary** - Total value, profit/loss, and performance metrics
- ✅ **Interactive Charts** - Portfolio allocation and performance visualization
- ✅ **Recent Transactions** - Transaction history display

### 💼 Portfolio Management
- ✅ **Multiple Portfolios** - Create and manage multiple portfolios
- ✅ **Holdings Tracking** - Add, edit, and remove cryptocurrency holdings
- ✅ **Transaction History** - Complete transaction logging (buy/sell/transfer)
- ✅ **Asset Allocation** - Visual portfolio distribution charts
- ✅ **Performance Analytics** - Profit/loss calculations and trends
- ✅ **CSV Import/Export** - Import portfolio data from CSV files

### 📈 Market Data & Analysis
- ✅ **Real-time Prices** - Live cryptocurrency price updates
- ✅ **Market Trends** - Top gainers, losers, and trending coins
- ✅ **Market Data Integration** - CoinGecko API integration with fallback
- ✅ **Price Charts** - Interactive price and performance charts
- ✅ **Market Statistics** - Volume, market cap, and dominance metrics

### 📰 News & Information
- ✅ **Crypto News Feed** - Latest cryptocurrency news aggregation
- ✅ **News Categories** - Filter news by categories (Bitcoin, Ethereum, DeFi, etc.)
- ✅ **News Search** - Search functionality for news articles
- ✅ **Real-time Updates** - Fresh news content with automatic updates

### 🎨 UI & Design
- ✅ **Modern Interface** - Premium gradients, animations, and design
- ✅ **Responsive Layout** - Mobile-first design with desktop optimization
- ✅ **Dark/Light Theme** - System preference detection with manual toggle
- ✅ **Smooth Animations** - Framer Motion powered transitions
- ✅ **Loading States** - Skeleton loaders and loading indicators
- ✅ **Toast Notifications** - User feedback for actions and errors

### 🔧 Technical Features
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Error Handling** - Comprehensive error boundaries and fallbacks
- ✅ **Caching** - Intelligent data caching for performance
- ✅ **WebSocket Support** - Real-time price updates via WebSocket
- ✅ **API Integration** - Multiple cryptocurrency data sources
- ✅ **Database Integration** - Supabase PostgreSQL with RLS

## 📋 Project Status

### ✅ Completed Features
- **Core Infrastructure**: Authentication, database, routing, state management
- **Portfolio Management**: Full CRUD operations for portfolios and holdings
- **Market Data**: Real-time prices, market trends, and statistics
- **User Interface**: Complete responsive design with dark/light themes
- **News Integration**: Cryptocurrency news aggregation and filtering
- **Charts & Analytics**: Interactive charts and performance metrics

### ✅ Recently Completed
- **Staking Platform**: Complete staking system with 3 plans (Flexible 4%, Standard 8%, Premium 12% APY)
- **Staking Dashboard**: Full-featured staking management interface
- **Staking Backend**: Database schema, API endpoints, and reward calculations
- **Staking Modal**: Interactive staking position creation

### 🚧 In Development
- **Price Alerts**: Notification system for price thresholds
- **Advanced Analytics**: More detailed portfolio performance metrics
- **Mobile App**: React Native version for iOS and Android
- **Staking Automation**: Automated reward distribution and compounding

### 📅 Planned Features (Roadmap)
- **DeFi Integration**: Connect to DeFi protocols for yield farming
- **NFT Portfolio**: Track and manage NFT collections
- **Tax Reporting**: Generate tax reports for crypto transactions
- **Social Features**: Share portfolios and follow other investors
- **API Access**: Public API for third-party integrations
- **Advanced Trading**: Integration with exchanges for direct trading

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Supabase Account** (for backend services)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/cryptonested.git
cd cryptonested
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key (optional)
```

4. **Database Setup**

- Create a new Supabase project
- Run the SQL commands from `supabase/schema.sql` in your Supabase SQL editor
- Configure Row Level Security policies as described in `supabase/README.md`

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and React Server Components
- **UI Library**: [React 19](https://react.dev/) with TypeScript
- **Styling**: [TailwindCSS 3.3.5](https://tailwindcss.com/) with custom design system
- **Animations**: [Framer Motion 12.9.4](https://www.framer.com/motion/) for smooth transitions
- **Icons**: [Lucide React](https://lucide.dev/) and [Heroicons](https://heroicons.com/)
- **Charts**: [Chart.js 4.4.9](https://www.chartjs.org/) & [Recharts 2.15.3](https://recharts.org/)
- **State Management**: React Context + Zustand for complex state
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

### Backend & Database
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth with Row Level Security
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: Supabase Storage for user content and avatars
- **API Integration**: CoinGecko API for cryptocurrency data

### Development & Deployment
- **Language**: TypeScript 5.8.3 for type safety
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm with package-lock.json
- **Build Tool**: Next.js built-in bundler with Turbopack
- **Deployment**: Vercel (recommended) or any Node.js hosting platform

## 📁 Project Structure

```
cryptonested/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # Authentication endpoints
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign-in page
│   │   ├── signup/               # Sign-up page
│   │   ├── forgot-password/      # Password reset
│   │   └── update-password/      # Password update
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # UI component library
│   │   │   ├── Button.tsx        # Custom button component
│   │   │   ├── Card.tsx          # Card container component
│   │   │   ├── Input.tsx         # Form input component
│   │   │   ├── PortfolioSummary.tsx    # Portfolio metrics
│   │   │   ├── CryptoHoldings.tsx      # Holdings table
│   │   │   ├── PortfolioAllocation.tsx # Allocation charts
│   │   │   ├── MarketTrends.tsx        # Market data display
│   │   │   ├── CryptoNews.tsx          # News feed component
│   │   │   ├── LoadingScreen.tsx       # Loading states
│   │   │   └── ...               # 20+ other UI components
│   │   ├── AuthLayout.tsx        # Authentication wrapper
│   │   ├── DashboardWrapper.tsx  # Dashboard layout
│   │   └── ThemeProvider.tsx     # Theme context
│   ├── dashboard/                # Main dashboard page
│   ├── portfolio/                # Portfolio management
│   ├── market/                   # Market data and analysis
│   ├── news/                     # Cryptocurrency news
│   ├── profile/                  # User profile management
│   ├── landing/                  # Landing page with staking info
│   ├── data/                     # Mock data for development
│   ├── lib/                      # Utility functions
│   ├── services/                 # API service layer
│   │   ├── cryptoService.ts      # Cryptocurrency data
│   │   ├── portfolioService.ts   # Portfolio management
│   │   ├── newsService.ts        # News aggregation
│   │   ├── dashboardService.ts   # Dashboard data
│   │   └── ...                   # Other services
│   ├── globals.css               # Global styles and Tailwind
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page (redirects to landing)
│   └── providers.tsx             # Context providers setup
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   ├── PriceContext.tsx          # Real-time price data
│   ├── InactivityContext.tsx     # Session management
│   └── CryptoPricesContext.tsx   # Price updates
├── lib/                          # Core utility functions
│   ├── auth.ts                   # Authentication helpers
│   ├── supabase.ts               # Supabase client
│   ├── portfolio.ts              # Portfolio database operations
│   ├── profile.ts                # User profile management
│   ├── watchlist.ts              # Watchlist functionality
│   ├── marketData.ts             # Market data utilities
│   ├── websocket.ts              # WebSocket connections
│   └── utils.ts                  # General utilities
├── supabase/                     # Database schema and setup
│   ├── schema.sql                # Complete database schema
│   ├── README.md                 # Setup instructions
│   └── fix-rls.sql               # RLS policy fixes
├── public/                       # Static assets
│   ├── logo.png                  # Application logo
│   ├── dashboard.png             # Dashboard preview
│   └── logos/                    # Cryptocurrency logos
├── types/                        # TypeScript type definitions
│   └── supabase.ts               # Generated Supabase types
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.ts                # Next.js configuration
```

## 🎨 UI Component Library

CryptoNested includes a comprehensive set of reusable UI components:

### Core Components
- **Button**: Multi-variant button (primary, secondary, outline, ghost) with loading states
- **Card**: Flexible container with header, content, and footer sections
- **Input**: Form input with validation, icons, and error handling
- **LoadingScreen**: Full-screen loading with animated logo
- **Skeleton**: Loading placeholders for different content types

### Portfolio Components
- **PortfolioSummary**: Key metrics display (total value, profit/loss, changes)
- **CryptoHoldings**: Interactive table with sorting and filtering
- **PortfolioAllocation**: Doughnut and pie charts for asset distribution
- **PortfolioPerformanceChart**: Line charts for performance tracking
- **TransactionHistory**: Paginated transaction list with filters
- **AddAssetModal**: Modal for adding new cryptocurrency holdings
- **EditHoldingModal**: Modal for editing existing holdings
- **ImportCSVModal**: CSV import functionality for bulk data

### Market & Analytics Components
- **MarketOverview**: Market statistics and dominance metrics
- **MarketTrends**: Top gainers, losers, and trending cryptocurrencies
- **TrendingCoins**: Popular cryptocurrency showcase
- **AssetChart**: Individual cryptocurrency price charts
- **LivePricesTicker**: Real-time scrolling price ticker

### News & Information
- **CryptoNews**: News feed with category filtering
- **NewsCard**: Individual news article display
- **FilterModal**: Advanced filtering options

### User Interface
- **Header**: Navigation with user menu and theme toggle
- **ProfileCard**: User profile information display
- **QuickActions**: Shortcut buttons for common actions
- **Watchlist**: Cryptocurrency watchlist management

## 🔄 Theme System

CryptoNested features a sophisticated dark/light theme system:

```tsx
// Theme usage in components
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-colors duration-200"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

**Theme Features:**
- System preference detection
- Smooth transitions between themes
- Persistent theme selection
- Custom color schemes for charts and components
- Optimized for accessibility

## 📱 Responsive Design

The application is fully responsive with mobile-first design:

### Breakpoints
- **Mobile**: < 768px (optimized for phones)
- **Tablet**: 768px - 1023px (optimized for tablets)
- **Desktop**: 1024px - 1439px (standard desktop)
- **Large Desktop**: ≥ 1440px (wide screens)

### Responsive Features
- Adaptive navigation (hamburger menu on mobile)
- Flexible grid layouts that stack on smaller screens
- Touch-optimized interactive elements
- Optimized typography scaling
- Responsive charts and data visualizations

## � Usage Guide

### Getting Started
1. **Create Account**: Sign up with email and password
2. **Setup Profile**: Add your name and profile picture
3. **Create Portfolio**: Create your first cryptocurrency portfolio
4. **Add Holdings**: Add your cryptocurrency holdings manually or via CSV import
5. **Track Performance**: Monitor your portfolio performance and analytics

### Key Features Usage

#### Portfolio Management
```typescript
// Adding a new holding
const newHolding = {
  coinId: 'bitcoin',
  quantity: 0.5,
  purchasePrice: 35000,
  purchaseDate: new Date()
};
```

#### Real-time Price Updates
The application automatically fetches real-time prices every 30 seconds and updates your portfolio values accordingly.

#### CSV Import
Upload CSV files with the following format:
```csv
Symbol,Quantity,Purchase Price,Purchase Date
BTC,0.5,35000,2024-01-15
ETH,2.0,2500,2024-01-16
```

### Staking Platform (Now Available!)
- **Flexible Staking**: 4% APY with no lock-up period - withdraw anytime
- **Standard Staking**: 8% APY with 3-month lock-up - higher returns
- **Premium Staking**: 12% APY with 12-month lock-up - maximum rewards
- **15+ Supported Cryptocurrencies**: Bitcoin, Ethereum, Cardano, Solana, and more
- **Automated Rewards**: Daily/weekly reward distribution
- **Real-time Tracking**: Monitor your staking positions and earnings

## 🔧 Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Building for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Environment Variables
Required environment variables for full functionality:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional API Keys
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key

# Optional Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Authentication**: Secure email/password authentication with Supabase
- **Session Management**: Automatic session timeout and refresh
- **Data Encryption**: All sensitive data encrypted at rest
- **HTTPS Only**: Secure connections in production
- **Input Validation**: Comprehensive input sanitization
- **CSRF Protection**: Built-in CSRF protection with Next.js

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions to CryptoNested! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Areas for Contribution
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations
- 🧪 Test coverage improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Supabase](https://supabase.com/)** - Open source Firebase alternative
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Motion library for React
- **[Chart.js](https://www.chartjs.org/)** - Simple yet flexible JavaScript charting
- **[CoinGecko](https://www.coingecko.com/)** - Cryptocurrency data API
- **[Lucide](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[Vercel](https://vercel.com/)** - Platform for frontend frameworks and static sites

---

<div align="center">
  <p>Built with ❤️ by the CryptoNested team</p>
  <p>
    <a href="https://github.com/yourusername/cryptonested/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/cryptonested/issues">Request Feature</a> •
    <a href="https://cryptonested.com">Live Demo</a>
  </p>
</div>
