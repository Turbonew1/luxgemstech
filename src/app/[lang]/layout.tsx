import { AuthProvider } from "@/components/layout/AuthProvider";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
