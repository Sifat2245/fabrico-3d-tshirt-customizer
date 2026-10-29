"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart, type CartItem } from "@/lib/cart-context";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeSidebar,
    totalItems,
    subtotal,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-zinc-50 border-l border-zinc-200 shadow-2xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-zinc-800" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Cart ({totalItems})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close cart"
                className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-zinc-400" />
                  <p className="text-sm font-medium text-zinc-600">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Browse our collection and add something you love
                  </p>
                  <button
                    type="button"
                    onClick={closeSidebar}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    Keep creating
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-4 rounded-xl border border-zinc-200 bg-zinc-100/50 p-3"
                    >
                      {/* Thumbnail */}
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-200">
                        <Image
                          src={
                            item.product.image.startsWith("/images/products/")
                              ? "/images/studio/original.png"
                              : item.product.image
                          }
                          alt="Your T-shirt design"
                          width={80}
                          height={80}
                          className={
                            item.product.image.startsWith("data:")
                              ? "h-full w-full scale-150 object-cover"
                              : "h-full w-full object-contain"
                          }
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-zinc-800">
                            {item.product.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-600">
                            {item.selectedSize && (
                              <span>Size: {item.selectedSize}</span>
                            )}
                            {item.selectedColor && (
                              <span
                                className="inline-block h-3 w-3 rounded-full border border-zinc-300"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-zinc-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-zinc-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                        className="self-start text-zinc-500 transition-colors hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-200 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-zinc-600">Subtotal</p>
                  <p className="text-lg font-bold text-zinc-900">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
                <Link
                  href="/cart"
                  onClick={closeSidebar}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Go to Cart
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="mt-2 w-full rounded-xl border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-500 hover:text-zinc-800"
                >
                  Keep creating
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
