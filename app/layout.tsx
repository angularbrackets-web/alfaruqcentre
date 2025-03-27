// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Assuming you have global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Al-Faruq Islamic Centre',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ]
  },
  description: 'Come visit us',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar /> {/* Include the Navbar component here */}
        <main className="flex-1 flex flex-col min-h-0 pt-24">
        {children} {/*  This is where page.tsx content will be rendered */}
        </main>
        <Footer /> {/* Include the Footer component here */}
      </body>
    </html>
  );
}