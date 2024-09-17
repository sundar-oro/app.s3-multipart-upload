"use client";
import { Metadata } from "next";

import NavBar from "@/components/Dashboard/navbar";
import { Providers } from "@/redux/provider";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>
          {pathname == "/" ? children : <NavBar>{children}</NavBar>}
        </Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
