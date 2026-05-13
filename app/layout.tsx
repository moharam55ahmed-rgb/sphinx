import './globals.css';

// This root layout is minimal because the locale layout handles
// html/body tags, fonts, and providers
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
