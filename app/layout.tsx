import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Road Trip Free 1.0｜先理解你的旅行想法，再生成路线",
  description: "先询问用户想要的感觉，再选择景点，最后生成适合季节、驾驶强度和预算的 California 自驾路线。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
