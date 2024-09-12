import { Metadata } from "next";

import "../sass/app.scss";

export const metadata: Metadata = {
  title: "Yoda Reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
