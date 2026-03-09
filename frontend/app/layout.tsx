import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Attendance System",
  description: "AI-based Face Recognition Attendance Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
      </body>
    </html>
  );
}
