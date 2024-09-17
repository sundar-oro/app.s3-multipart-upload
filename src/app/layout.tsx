import { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/redux/provider";
import { Toaster } from "sonner";

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
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
