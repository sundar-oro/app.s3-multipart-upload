"use client";
// import { Metadata } from "next";

import NavBar from "@/components/Dashboard/navbar";
import { Providers } from "@/redux/provider";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import "./globals.css";
import SideBar from "@/components/Dashboard/sidebar";

// export const metadata: Metadata = {
//   title: "File Manager",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="eng">
      <body>
        <Providers>
          {pathname == "/" ? (
            children
          ) : (
            <>
              <NavBar />
              <div className="h-screen w-50 bg-white">
                <SideBar>{children}</SideBar>
              </div>
            </>
          )}
        </Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
