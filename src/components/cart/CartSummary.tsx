import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  currency: string;
}

export function CartSummary({ subtotal, currency }: CartSummaryProps) {
  const shipping = 0; // Free shipping

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
      <h3 className="font-semibold text-[#1a1a2e] mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-[#1a1a2e]">
            {formatPrice(subtotal, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : (
            <span className="font-medium text-[#1a1a2e]">
              {formatPrice(shipping, currency)}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1a1a2e]">Total</span>
            <span className="text-lg font-bold text-[#1a1a2e]">
              {formatPrice(subtotal + shipping, currency)}
            </span>
          </div>
          {currency !== "USD" && (
            <p className="text-xs text-gray-400 mt-1">
              Tax calculated at checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
