import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";

export const metadata: Metadata = {
    title: "Iris",
    description: "Iris is a website exam!",
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
