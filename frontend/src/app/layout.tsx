import { Inter } from "next/font/google";
import "./globals.css";
import LexaChat from "@/components/LexaChat";

const inter = Inter({ subsets: ["latin"] });
/* ... metadata ... */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary selection:text-primary-foreground`}>
        {children}
        <LexaChat />
      </body>
    </html>
  );
}
