import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/ui/ThemeProviderLocal";
import { Viewport } from "next";
const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "dark",
};

export const metadata: Metadata = {
  title: "AWS Labs For Nerds",
  description: "Learn with AWS Labs!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " relative"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
