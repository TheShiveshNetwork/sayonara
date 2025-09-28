import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import ChatbotPopup from "@/components/chatbot";

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
          <ChatbotPopup />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
