// CartWishlistContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

/*
  Simple combined Cart + Wishlist context using useState.
  - Safe localStorage read/write with try/catch.
  - Exposes straightforward API: add/remove/update/clear/getTotals/isIn...
  - Designed for readability and to be easy for juniors to follow.
  - Toast usage is guarded so messages don't duplicate under StrictMode or double-calls.
*/

/* -----------------------
   localStorage helpers
   - safeGet / safeSet wrap localStorage calls and avoid breaking in SSR or private mode.
------------------------*/
const safeGet = (key) => {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`safeGet ${key} parse error:`, err)
    return null
  }
}

const safeSet = (key, value) => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`safeSet ${key} error:`, err)
  }
}

/* -----------------------
   Contexts
   - CartContext and WishlistContext provide separate APIs.
------------------------*/
const CartContext = createContext(null)
const WishlistContext = createContext(null)

/* -----------------------
   Cart Provider
   - items: array of cart items { id, title, price, quantity, ... }
   - Persist to localStorage on change.
   - Exposes utility functions for common cart operations.
------------------------*/
export const CartProvider = ({ children }) => {
  // Load initial cart safely (supports older shapes: plain array or { items: [] } shape)
  const [items, setItems] = useState(() => {
    const saved = safeGet('cart')
    if (!saved) return []
    if (Array.isArray(saved.items)) return saved.items
    if (Array.isArray(saved)) return saved
    return []
  })

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    safeSet('cart', { items, updatedAt: Date.now() })
  }, [items])

  // Add item: increment quantity if exists, otherwise push with quantity = 1
  // Use `added` flag to ensure toast fires only once (prevents double toasts in StrictMode)
  const addToCart = useCallback((product) => {
    let added = false

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id)
      if (idx > -1) {
        // increment quantity for existing item
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: (Number(next[idx].quantity) || 0) + 1 }
        return next
      }
      // new item
      added = true
      return [...prev, { ...product, quantity: 1 }]
    })

    // toast outside setState to avoid running twice
    if (added) {
      try { toast.success(`${product.title || 'Item'} added to cart`) } catch (e) { console.warn(e) }
    } else {
      // If item already existed we may still want a subtle feedback (optional)
      try { /* no duplicate toast */ } catch {}
    }
  }, [])

  // Remove item by id
  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    try { toast.error('Removed from cart') } catch {}
  }, [])

  // Update quantity (set). If quantity <= 0 remove the item.
  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.id === id ? { ...i, quantity: Number(quantity) } : i))
        .filter((i) => Number(i.quantity) > 0)
      return next
    })
  }, [])

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setItems([])
    try { toast.success('Cart cleared!') } catch {}
  }, [])

  // Derived helpers
  const getTotalItems = useCallback(() => items.reduce((s, i) => s + (Number(i.quantity) || 0), 0), [items])
  const getTotalPrice = useCallback(() => items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0), [items])
  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items])

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* -----------------------
   Wishlist Provider
   - items: array of wishlist items
   - prevents duplicate toasts and duplicate items
------------------------*/
export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = safeGet('wishlist')
    if (!saved) return []
    if (Array.isArray(saved.items)) return saved.items
    if (Array.isArray(saved)) return saved
    return []
  })

  // Persist wishlist to localStorage
  useEffect(() => {
    safeSet('wishlist', { items, updatedAt: Date.now() })
  }, [items])

  // Add to wishlist with the same "added" flag pattern to avoid double toasts
  const addToWishlist = useCallback((product) => {
    let added = false

    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) {
        return prev // already exists — do nothing
      }
      added = true
      return [...prev, product]
    })

    if (added) {
      try { toast.success(`${product.title || 'Item'} added to wishlist`) } catch (e) { console.warn(e) }
    }
  }, [])

  // Remove by id
  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    try { toast.error('Removed from wishlist') } catch {}
  }, [])

  const getTotalItems = useCallback(() => items.length, [items])
  const isInWishlist = useCallback((id) => items.some((i) => i.id === id), [items])

  const value = { items, addToWishlist, removeFromWishlist, getTotalItems, isInWishlist }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

/* -----------------------
   Custom hooks for consumers
   - Throw helpful errors if used outside provider
------------------------*/
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}

/* -----------------------
   CombinedProvider helper
   - Wraps the app with both providers in the correct order.
------------------------*/
export const CombinedProvider = ({ children }) => (
  <CartProvider>
    <WishlistProvider>
      {children}
    </WishlistProvider>
  </CartProvider>
)
