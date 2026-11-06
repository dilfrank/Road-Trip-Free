import type { Metadata } from "next";
import "./globals.css";
import "./refined.css";
import "./v2.css";

export const metadata: Metadata = {
  title: "Road Trip Free｜自驾自由",
  description: "理解你的旅行想法，选择体验，整理可核对的自驾行程草案。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
