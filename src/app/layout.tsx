
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk, Orbitron } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400', '700'] });


export const metadata: Metadata = {
  title: 'PoliLIMS',
  description: 'LIMS para Polifusión S.A.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
