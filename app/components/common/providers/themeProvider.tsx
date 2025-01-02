import { ThemeProvider } from 'next-themes';

export default function Themerovider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
    </ThemeProvider>
  );
} 