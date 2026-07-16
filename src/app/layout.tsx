import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { ToastProvider } from "@/components/ui/Toast";
import MonetagRegister from "@/components/MonetagRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PDFNova - Premium PDF Tools, Refined.",
  description: "Securely merge, split, compress, convert, protect, unlock, and edit your PDF files entirely in your browser. Fast, modern, and private.",
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      {/* Anti-flicker script: runs before page paint to apply saved theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch(e) {}
              })()
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthModalProvider>
                <MonetagRegister />
                {children}
              </AuthModalProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
