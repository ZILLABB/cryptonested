# CryptoNested - Premium Cryptocurrency Portfolio Tracker

<div align="center">
  <img src="https://raw.githubusercontent.com/vercel/next.js/canary/packages/next/src/shared/lib/picocolors.tsx" width="200" alt="CryptoNested Logo">
  <p align="center">A modern, premium cryptocurrency portfolio tracker and analytics platform built with Next.js 15.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.3.1-black" />
    <img src="https://img.shields.io/badge/React-19.0.0-blue" />
    <img src="https://img.shields.io/badge/Framer%20Motion-latest-purple" />
    <img src="https://img.shields.io/badge/TailwindCSS-latest-cyan" />
  </p>
</div>

## ✨ Features

- **Beautiful Modern UI** with premium gradients, animations, and design
- **Dark/Light Mode** with smooth transitions and system preference detection
- **Real-time Portfolio Tracking** with detailed analytics and visualizations
- **Comprehensive Dashboard** showing portfolio summary, holdings, and market trends
- **Market Data** including top gainers, losers, and real-time price information
- **Elegant Authentication** with sign-in and sign-up pages
- **Responsive Design** that looks great on all devices from mobile to desktop
- **Customizable Profile** with security settings and preferences
- **Interactive Charts** for portfolio allocation and performance tracking
- **News Aggregation** keeping users informed about the latest crypto developments

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/cryptonested.git
cd cryptonested
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/)

## 📁 Project Structure

```
/app                      # Next.js app directory
  /auth                   # Authentication pages
    /signin               # Sign-in page
    /signup               # Sign-up page
  /components             # Reusable components
    /ui                   # UI components (Button, Card, etc.)
    ThemeProvider.tsx     # Theme context provider
  /dashboard              # Dashboard page
  /landing                # Landing page
  /market                 # Market data page
  /news                   # News page
  /portfolio              # Portfolio page
  /profile                # User profile page
  /data                   # Mock data for development
  globals.css            # Global styles
  layout.tsx             # Root layout
  page.tsx               # Entry point
/public                   # Static assets
```

## 🎨 UI Components

The application includes a variety of premium UI components:

- **Button**: Customizable button with variants (primary, secondary, outline, ghost)
- **Card**: Styled container with header and content sections
- **Input**: Form input with label, icon, and error handling
- **PortfolioSummary**: Displays key portfolio metrics
- **CryptoHoldings**: Table of cryptocurrency holdings
- **PortfolioAllocation**: Doughnut chart showing portfolio distribution
- **MarketTrends**: Displays top gainers and losers
- **CryptoNews**: Displays latest cryptocurrency news

## 🔄 Theme Switching

CryptoNested supports both light and dark modes:

```tsx
// Using the theme in components
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop screens (1024px and above)
- Tablet devices (768px to 1023px)
- Mobile devices (below 768px)

## 🔮 Future Enhancements

- Real cryptocurrency API integration
- User authentication with JWT
- Portfolio import/export functionality
- Price alerts and notifications
- Transaction history and tax reporting
- Mobile app with React Native

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the incredible framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
- [Chart.js](https://www.chartjs.org/) for the beautiful charts
