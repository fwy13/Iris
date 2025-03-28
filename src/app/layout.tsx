import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "RoxyDEX",
    description: "RoxyDEX is a website exam!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
