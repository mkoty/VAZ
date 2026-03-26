import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Интернет-приемная АвтоВАЗ",
  description: "Официальная интернет-приемная ПАО «АвтоВАЗ»",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
