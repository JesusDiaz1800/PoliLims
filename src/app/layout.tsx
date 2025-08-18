
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk, Orbitron } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { DynamicDataProvider, type InitialData } from '@/context/data-context';
import { getInitialData } from '@/services/data-service';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400', '700'] });


export const metadata: Metadata = {
  title: 'PoliLIMS',
  description: 'LIMS para Polifusión S.A.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial data once at the root level
  const initialData = await getInitialData();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          <DynamicDataProvider initialData={initialData}>
            {children}
            <Toaster />
          </DynamicDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
