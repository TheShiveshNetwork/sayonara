import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Sayonara",
  description: "Sayonara to your old friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute={"class"} enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
