import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopHub — Amazon-Style E-Commerce',
  description: 'Best deals on electronics, fashion, and more',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 64px - 200px)' }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
