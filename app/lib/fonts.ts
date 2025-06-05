import { Inter, Poppins, Montserrat, Roboto_Mono } from 'next/font/google';

// Inter - Clean, modern sans-serif font with excellent readability
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Poppins - Geometric sans-serif with friendly, modern feel
export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// Montserrat - Elegant, versatile sans-serif with distinctive character
export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Roboto Mono - Clean monospace font for code and technical content
export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

// Font combinations for different purposes
export const fontVariables = [
  inter.variable, 
  poppins.variable, 
  montserrat.variable, 
  robotoMono.variable
].join(' ');
