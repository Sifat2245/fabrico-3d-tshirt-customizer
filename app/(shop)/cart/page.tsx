"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

export default function CartPage() {
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart } =
    useCart();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f2f3ef] px-6 pt-24">
        <ShoppingBag className="mb-4 h-16 w-16 text-zinc-400" />
        <h1 className="font-display text-2xl font-bold text-zinc-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your next favorite piece starts in the studio.
        </p>
        <Link
          href="/customizer"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Make something yours
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#f2f3ef] pt-28 pb-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-zinc-900">
              Your bag
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-red-400"
          >
            Clear all
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-5 rounded-2xl border border-zinc-200 bg-zinc-100/40 p-4 sm:p-5"
                >
                  {/* Thumbnail */}
                  <div className="flex h-28 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-200">
                    <Image
                      src={
                        item.product.image.startsWith("/images/products/")
                          ? "/images/studio/original.png"
                          : item.product.image
                      }
                      alt={item.product.name}
                      width={96}
                      height={112}
                      className={
                        item.product.image.startsWith("data:")
                          ? "h-full w-full scale-150 object-cover"
                          : "h-full w-full object-contain"
                      }
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={
                            item.product.id.startsWith("custom-")
                              ? `/customizer?garment=${item.product.garment ?? "tshirt"}`
                              : `/product/${item.product.id}`
                          }
                          className="text-base font-medium text-zinc-800 transition-colors hover:text-zinc-900"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {item.product.category}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                          {item.selectedSize && (
                            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-zinc-600">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              Color:
                              <span
                                className="inline-block h-3.5 w-3.5 rounded-full border border-zinc-300"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                        className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-800"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-base font-semibold text-zinc-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/customizer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Keep creating
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-zinc-200 bg-zinc-100/40 p-6">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-medium text-zinc-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">Shipping</span>
                  <span className="font-medium text-zinc-800">
                    {shipping === 0 ? (
                      <span className="text-emerald-500">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-zinc-500">
                    Free shipping on orders over $100
                  </p>
                )}
                <div className="border-t border-zinc-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-zinc-800">
                      Total
                    </span>
                    <span className="text-xl font-bold text-zinc-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 text-center text-xs text-zinc-500">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
