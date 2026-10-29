import type { Metadata } from "next";
import { studioDisplay, studioBody } from "@/lib/fonts";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Fabrico — Your ideas. Your T-shirt.", template: "%s · Fabrico" },
  description:
    "Your next favorite T-shirt starts with you. Choose your colors, add your artwork, and bring your ideas to life in Fabrico’s live 3D design studio.",
  keywords: ["T-shirt designer", "3D customization", "custom T-shirt", "design studio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${studioDisplay.variable} ${studioBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
