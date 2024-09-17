import { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/redux/provider";
import { Toaster } from "sonner";
import Navbar from "@/components/Dashboard/navbar";
import { usePathname } from "next/navigation";

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
        <Providers>
          <Navbar>{children}</Navbar>
        </Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
