import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Providers from "@/components/common/Providers";
import ReactQueryProvider from "@/components/common/QueryClientProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance tracker",
  description: "Finance tracker by Jakub Cieślik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-r from-stone-900 via-stone-800 to-stone-800 ${inter.className} min-h-screen`}>
        <ReactQueryProvider>
          <Providers>
            <NextUIProvider>
              <main className="w-full flex flex-col gap-10 items-center justify-center dark text-white">
                <Header />
                {children}
              </main>
            </NextUIProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
