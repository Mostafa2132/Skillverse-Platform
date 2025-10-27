// CartIcon.jsx
// Small cart button that toggles a dropdown panel.
// - Uses useCart() from Cart context (defensive checks).
// - Framer Motion + AnimatePresence for smooth enter/exit animations.
// - Quantity controls, remove, and checkout link.
// - Minor accessibility and UX improvements (aria attributes, backdrop click).

import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../Context/CartContext';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  // Read cart API from context. The hooks throw if provider is missing,
  // which is useful during development so you notice missing provider.
  const cart = useCart() || {};
  const {
    items = [],
    removeFromCart = () => {},
    updateQuantity = () => {},
    getTotalPrice = () => 0,
    getTotalItems = () => 0,
  } = cart;

  const [isOpen, setIsOpen] = useState(false);

  // handle increment / decrement quantity
  const handleQuantityChange = (courseId, newQuantity) => {
    // If new quantity is less than 1 -> remove the item, otherwise update.
    if (newQuantity < 1) {
      removeFromCart(courseId);
    } else {
      updateQuantity(courseId, newQuantity);
    }
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((s) => !s)}
        className="relative p-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-200"
        title="Open cart"
      >
        <ShoppingCart className="w-5 h-5" aria-hidden />
        {getTotalItems() > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            aria-live="polite"
          >
            {getTotalItems()}
          </motion.span>
        )}
      </button>

      {/* Dropdown panel (portal-like, but kept inline for simplicity) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — closes the panel when clicked */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 w-96 glass rounded-2xl border border-white/20 p-4 shadow-xl z-50"
              role="dialog"
              aria-label="Shopping cart"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Shopping Cart</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // close only
                      setIsOpen(false);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close cart"
                    title="Close cart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-fg/30 mx-auto mb-2" />
                    <p className="text-fg/60">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.12 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                        <p className="text-xs text-fg/60">${Number(item.price).toFixed(2)}</p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, (Number(item.quantity) || 0) - 1)}
                          className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition-colors"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-8 text-center text-sm font-medium" aria-live="polite">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.id, (Number(item.quantity) || 0) + 1)}
                          className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition-colors"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        aria-label={`Remove ${item.title}`}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer with total + checkout */}
              {items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-gradient">${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
