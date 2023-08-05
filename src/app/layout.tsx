import './globals.css';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
// or only core styles
import '@splidejs/react-splide/css/core';

const workSans = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Biosense',
  description:
    'IoT system for indoor plant care, monitoring health and offering personalized recommendations for growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`flex justify-center items-center ${workSans.className} px-4 pt-8 w-screen min-h-screen bg-gradient-to-t from-primary-600 overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
