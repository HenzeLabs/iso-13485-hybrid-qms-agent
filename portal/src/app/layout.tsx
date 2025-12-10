import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QMS Portal - ISO 13485 Compliance System',
  description: 'Quality Management System portal for CAPA and DCR workflow management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}