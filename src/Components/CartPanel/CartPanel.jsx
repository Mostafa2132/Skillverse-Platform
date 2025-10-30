// CartPanel.jsx
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'
import { ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Props:
 * - open, onClose, cartItems, total, isMobile, i18n
 * - anchorRef: optional ref to the trigger element (e.g. cart button) — used for desktop positioning
 */
function CartPanelInner({
  onClose,
  cartItems = [],
  total = 0,
  isMobile = false,
  i18n = null,
  anchorRef = null
}) {
  const panelRef = useRef(null)
  const prevActiveRef = useRef(null)
  const [stylePos, setStylePos] = useState(null) // { top, left, right } for desktop
  const isRtl = i18n?.language === 'ar'

  // lock body scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // focus & escape
  useEffect(() => {
    prevActiveRef.current = document.activeElement
    if (panelRef.current) {
      try { panelRef.current.focus({ preventScroll: true }) } catch {}
    }

    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      try { prevActiveRef.current?.focus?.() } catch {}
    }
  }, [onClose])

  // click outside
  useEffect(() => {
    function onDocClick(e) {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [onClose])

  // compute desktop position anchored to anchorRef (if provided)
  useLayoutEffect(() => {
    if (isMobile) {
      setStylePos(null)
      return
    }
    function compute() {
      const panelEl = panelRef.current
      const anchorEl = anchorRef?.current
      const vw = window.innerWidth
      const vh = window.innerHeight

      // default fallback values (corner anchored)
      let left = null
      let right = 16 // px
      let top = 16 + 48 // below navbar approx (adjust if navbar height differs)

      if (anchorEl && panelEl) {
        const a = anchorEl.getBoundingClientRect()
        // prefer placing under the anchor aligned to its right edge (desktop LTR)
        const panelWidth = Math.min(384, Math.max(280, Math.floor(vw * 0.28))) // clamp width
        // decide side based on space on right
        const spaceRight = vw - a.right
        const spaceLeft = a.left

        // choose side with more space
        if (!isRtl) {
          if (spaceRight >= panelWidth + 16) {
            // place to the right edge aligned
            left = Math.min(a.right - 8, vw - panelWidth - 8) // small offset
            top = Math.max(8, a.bottom + 8)
            right = null
          } else if (spaceLeft >= panelWidth + 16) {
            // place aligned to left of trigger
            left = Math.max(8, a.left - panelWidth + 8)
            top = Math.max(8, a.bottom + 8)
            right = null
          } else {
            // not enough horizontal space, clamp to viewport with margin
            left = Math.max(8, Math.min(a.left, vw - panelWidth - 8))
            top = Math.max(8, a.bottom + 8)
            right = null
          }
        } else {
          // rtl: invert logic
          if (spaceLeft >= panelWidth + 16) {
            left = Math.max(8, a.left - panelWidth + 8)
            top = Math.max(8, a.bottom + 8)
            right = null
          } else if (spaceRight >= panelWidth + 16) {
            left = Math.min(a.right - 8, vw - panelWidth - 8)
            top = Math.max(8, a.bottom + 8)
            right = null
          } else {
            left = Math.max(8, Math.min(a.left, vw - panelWidth - 8))
            top = Math.max(8, a.bottom + 8)
            right = null
          }
        }
      } else {
        // fallback: anchored to right/left corner below navbar
        left = null
        right = 16
        top = 16 + 48
      }

      setStylePos({ left, right, top })
    }

    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, { passive: true })
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('scroll', compute)
    }
  }, [anchorRef, isMobile, isRtl])

  // wrapper classes (portal so absolute coords are relative to document)
  const wrapperClass = isMobile
    ? 'fixed inset-0 z-[60] flex items-end justify-center'
    : 'fixed inset-0 z-[60] pointer-events-none' // use fixed full-screen layer to place absolute panel

  // panel classes: mobile bottom sheet full-width, desktop anchored box
  const panelClass = isMobile
    ? 'fixed bottom-0 left-0 right-0 mx-2 mb-3 z-[61] rounded-t-2xl p-4 bg-white text-black shadow-2xl max-h-[80vh] overflow-auto touch-pan-y'
    : 'absolute pointer-events-auto glass rounded-2xl border border-white/20 p-4 shadow-lg z-[61] bg-white/5 max-h-[80vh] overflow-auto'

  // compute inline style for desktop placement & width clamp
  const desktopStyle = (() => {
    if (isMobile || !stylePos) return {}
    // width: choose a reasonable width but clamp to viewport
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const desired = Math.min(384, Math.max(280, Math.floor(vw * 0.28)))
    const style = { width: desired + 'px' }
    if (stylePos.left != null) style.left = stylePos.left + 'px'
    if (stylePos.right != null) style.right = stylePos.right + 'px'
    if (stylePos.top != null) style.top = stylePos.top + 'px'
    return style
  })()

  return (
    <div className={wrapperClass} role="dialog" aria-label="Shopping cart panel" aria-modal={isMobile ? 'true' : 'false'}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={panelClass}
        style={isMobile ? { WebkitOverflowScrolling: 'touch', boxSizing: 'border-box' } : { ...desktopStyle, boxSizing: 'border-box' }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </h4>
          <button onClick={onClose} aria-label="Close cart" className="p-1 rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* content */}
        {cartItems.length === 0 ? (
          <div className="text-center py-6">
            <ShoppingCart className="w-12 h-12 text-fg/40 mx-auto mb-3" />
            <p className="text-fg/70">Your cart is empty</p>
            <div className="mt-4">
              <Link to="/courses" onClick={onClose} className="btn-primary">Browse Courses</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 overflow-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {cartItems.map((item) => {
                const qty = Number(item.quantity || 1)
                const price = Number(item.price || 0)
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <img src={item.image || ''} alt={item.title || 'Product'} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title || 'Untitled product'}</div>
                      <div className="text-xs text-fg/60 truncate">{qty} x ${price.toFixed(2)}</div>
                    </div>

                    <div className="flex-none font-semibold text-sm">${(price * qty).toFixed(2)}</div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Total</div>
                <div className="font-extrabold text-gradient">${Number(total).toFixed(2)}</div>
              </div>

              <div className="flex text-center gap-2">
                <Link to="/cart" onClick={onClose} className="flex-1 px-3 py-2 rounded-xl bg-white/10">View Cart</Link>
                <Link to="/checkout" onClick={onClose} className="flex-1 px-3 py-2 rounded-xl bg-indigo-500 text-white">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Portal wrapper
export default function CartPanel({ open = false, onClose = () => {}, cartItems = [], total = 0, isMobile = false, i18n = null, anchorRef = null }) {
  if (!open) return null
  if (typeof document === 'undefined') return null

  return ReactDOM.createPortal(
    <CartPanelInner
      onClose={onClose}
      cartItems={cartItems}
      total={total}
      isMobile={isMobile}
      i18n={i18n}
      anchorRef={anchorRef}
    />,
    document.body
  )
}
