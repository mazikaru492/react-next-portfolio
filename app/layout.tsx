import type { Metadata, Viewport } from "next";
import type { FC, ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

// ==========================================
// Types & Interfaces
// ==========================================

interface RootLayoutProps {
  readonly children: ReactNode;
}

// ==========================================
// Constants
// ==========================================

const THEME_COLOR = "#0b0b0b" as const;

const MAIN_PADDING_TOP = "80px" as const;

// ==========================================
// Metadata Configuration
// ==========================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR,
};

export const metadata: Metadata = {
  title: "HURUYA Portfolio",
  description: "ホワイトハッカーを目指す学生のポートフォリオサイト",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HURUYA",
  },
  formatDetection: {
    telephone: false,
  },
};

// ==========================================
// Layout Component
// ==========================================

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="ja">
    <body>
      <Header />
      <main style={{ paddingTop: MAIN_PADDING_TOP }}>{children}</main>
      <Footer />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
