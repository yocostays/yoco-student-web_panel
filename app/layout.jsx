import { Quicksand } from "next/font/google";
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
      <body className={quicksand.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
