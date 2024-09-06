// Import global styles
import './globals.css';
// Import required types from React
import { ReactNode } from 'react';
// Import Next.js Metadata API
import { Metadata } from 'next';
import { Footer } from '../components/footer'
import { Header } from '../components/header';
import { BackToTop } from '@/components/back-to-top/backToTop';
// Initialize fonts
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Define metadata
export const metadata: Metadata = {
  title: {
    default:'Eduardo Falcao',
    template:'%s | Eduardo Falcao'
  },
  description: 'Portfolio',
  icons: {
    icon: '/images/logo.svg',
  },
};

// Define and export the RootLayout component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        <Header />
        {children}
        <Footer/>
      </body>
      <BackToTop/>
    </html>
  );
}
