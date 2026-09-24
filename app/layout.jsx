import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Leave Request",
  description: "Review and approve a student leave request",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#674d9f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${quicksand.className} flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden`}>
        <Navbar />
        <main className="w-full flex-1 pt-14 lg:min-h-0 lg:overflow-hidden lg:pt-0">
          {children}
        </main>
        <ToastProvider />
      </body>
    </html>
  );
}
