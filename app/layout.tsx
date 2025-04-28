import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Media Wave",
  description: "Under development !!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>

        {children}
        <Toaster/>
        </AppContextProvider>
        </body>
    </html>
  );
}
