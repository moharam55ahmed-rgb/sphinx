import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';var d=document.documentElement;d.classList.remove('light','dark');d.classList.add(t);d.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
