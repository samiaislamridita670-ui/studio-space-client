import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "StudioSpace | Creative Workspace Booking",
description:
"Discover, explore, and book creative studios, photography spaces, podcast rooms, and production studios with StudioSpace.",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html
lang="en"
className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
> <body className="flex min-h-full flex-col"> <Navbar /> <div className="flex-1">{children}</div>         <Toaster position="top-right" richColors closeButton />
      </body> </html>
);
}

