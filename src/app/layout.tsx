import { Metadata } from "next";

import { Providers } from "@/redux/provider";
import "./globals.css";

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
