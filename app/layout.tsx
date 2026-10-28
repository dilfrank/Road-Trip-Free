import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Road Trip Free",
  description: "Season-aware road trip planning for budget-conscious drivers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
