import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import "./studio.css";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </>
  );
}
