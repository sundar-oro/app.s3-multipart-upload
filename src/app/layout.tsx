import { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/redux/provider";

export const metadata: Metadata = {
  title: "File Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
