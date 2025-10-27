// CartPanel.jsx
// A small, reusable cart panel component that supports desktop dropdown and mobile sheet.
// - Click outside or press Esc to close.
// - Focus management: return focus to the previously-focused element when closed.
// - RTL support via i18n.language === 'ar' (keeps panel on left for RTL).
// - Mobile variant uses a full-screen fixed wrapper with a semi-opaque backdrop.
//
// Props:
// - open: boolean (whether the panel is visible)
// - onClose: function to call when panel should close
// - cartItems: array of items { id, title, price, quantity, image }
// - total: number (total price)
// - isMobile: boolean (responsive hint from parent)
// - i18n: optional i18n object (for rtl detection or translations)
//
// NOTE: this component intentionally does not mutate cart state — it only shows it.
// Cart actions (remove/update) should be handled via callbacks passed in props or via context.

import React, { useEffect, useRef } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom'

function CartPanel({ open, onClose, cartItems = [], total = 0, isMobile = false, i18n = null }) {
  const panelRef = useRef(null)
  const prevActiveRef = useRef(null)

  // derive rtl from i18n (if provided). Default to LTR.
  const isRtl = i18n?.language === 'ar'

  // If panel is controlled closed, render null early
  if (!open) return null

  // Position wrapper differently on mobile vs desktop.
  // On mobile we use fixed inset so the panel is a sheet and backdrop covers entire viewport.
  // On desktop we use absolute positioning so the panel behaves like a dropdown.
  const wrapperClass = isMobile
    ? 'fixed inset-0 z-[60] flex items-end' // align to bottom like a sheet
    : `absolute ${isRtl ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-2 w-80 sm:w-96 z-[60]`

  // When the panel opens, store the previously focused element and move focus into the panel.
  // When it closes, restore focus to the previous element.
  useEffect(() => {
    prevActiveRef.current = document.activeElement
    // focus the panel container for accessibility
    if (panelRef.current) {
      panelRef.current.focus({ preventScroll: true })
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // restore focus when panel closes
      try {
        prevActiveRef.current?.focus?.()
      } catch {}
    }
  }, [onClose])

  // close when clicking outside the panel (but ignore clicks inside)
  useEffect(() => {
    function onDocClick(e) {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [onClose])

  return (
    <div className={wrapperClass} role="dialog" aria-label="Shopping cart panel" aria-modal={isMobile ? 'true' : 'false'}>
      {/* Backdrop for mobile (semi-opaque) */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-[55]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel container */}
      <div
        ref={panelRef}
        // Make the container programmatically focusable for accessibility
        tabIndex={-1}
        className={
          isMobile
            ? 'relative mx-4 mb-4 rounded-t-2xl p-4 bg-white text-black max-h-[75vh] overflow-auto shadow-2xl z-[60]'
            : 'glass rounded-2xl border border-white/20 p-4 shadow-lg z-[60] bg-white/5'
        }
        style={{ zIndex: 60 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {/* Replace with i18n text if you pass a translator */}
            Cart
          </h4>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1 rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Empty state */}
        {cartItems.length === 0 ? (
          <div className="text-center py-6">
            <ShoppingCart className="w-12 h-12 text-fg/40 mx-auto mb-3" />
            <p className="text-fg/70">Your cart is empty</p>
            <div className="mt-4">
              <Link to="/courses" onClick={onClose} className="btn-primary">
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Items list (scrollable) */}
            <div className="space-y-3 max-h-[48vh] overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-fg/60 truncate">
                      {item.quantity} x ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Footer with total + actions */}
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Total</div>
                <div className="font-extrabold text-gradient">${Number(total).toFixed(2)}</div>
              </div>

              <div className="flex text-center gap-2">
                <Link to="/cart" onClick={onClose} className="flex-1 px-3 py-2 rounded-xl bg-white/10">
                  View Cart
                </Link>
                <Link to="/checkout" onClick={onClose} className="flex-1 px-3 py-2 rounded-xl bg-indigo-500 text-white">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPanel
