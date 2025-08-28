import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";

import { cn } from "@/lib/cn";

import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "DoubleO chat widget",
  description: "DoubleO chat widget app",
};

const monaSansFont = localFont({
  variable: "--mona-sans",
  src: [
    {
      path: "../fonts/MonaSans-Light.woff2",
      weight: "200 350",
    },
    {
      path: "../fonts/MonaSans-Regular.woff2",
      weight: "400 450",
    },
    {
      path: "../fonts/MonaSans-Medium.woff2",
      weight: "500 550",
    },
    {
      path: "../fonts/MonaSans-SemiBold.woff2",
      weight: "600 750",
    },
    {
      path: "../fonts/MonaSans-Bold.woff2",
      weight: "800 900",
    },
  ],
});

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>

      <body className={cn(monaSansFont.variable, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
