// NavbarWithCartAndSettings.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../Theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import {
  User,
  LogOut,
  Settings as IconSettings,
  Heart,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import CartIcon from "../Cart/CartIcon";
import { useWishlist, useCart } from "../../Context/CartContext";
import CartPanel from "../CartPanel/CartPanel";

/*
  Navbar component:
  - contains links (Home, Courses, Dashboard)
  - theme & language toggles
  - wishlist and cart (with a CartPanel dropdown/sheet)
  - user menu (auth / dashboard / logout)
  Comments below explain each part and suggest small improvements inline.
*/
export default function Navbar() {
  // Theme provider: toggles dark/light
  const { theme, toggleTheme } = useTheme();

  // i18n hook for translations and language detection
  const { t, i18n } = useTranslation();

  // user/auth state: stored in localStorage on mount
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Context hooks: wishlist and cart
  // These contexts should expose helper methods (getTotalItems/getTotalPrice) to avoid re-calculation here.
  const wishlistCtx = useWishlist() || {};
  const cartCtx = useCart() || {};

  // Defensive: check if context exposes methods; otherwise fallback to simple counts
  const wishlistCount =
    typeof wishlistCtx.getTotalItems === "function"
      ? wishlistCtx.getTotalItems()
      : wishlistCtx.items?.length || 0;

  const cartCount =
    typeof cartCtx.getTotalItems === "function"
      ? cartCtx.getTotalItems()
      : cartCtx.items?.length || 0;

  // Cart items and total price calculation (fallback if context doesn't provide a helper)
  const cartItems = cartCtx.items || [];
  const cartTotal =
    typeof cartCtx.getTotalPrice === "function"
      ? cartCtx.getTotalPrice()
      : cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdown states
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Refs used for click-outside detection
  const cartContainerRef = useRef(null);
  const settingsButtonRef = useRef(null);

  /*
    Responsive state (isMobile)
    - currently uses window.innerWidth < 640
    - note: accessing window during SSR will break; the conditional guards against that
    - improvement: use a small custom hook (useMediaQuery) or css-only approach with CSS breakpoints
  */
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // run once on mount to ensure correct state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /*
    Setup language from localStorage or from i18n
    - we also set document.documentElement.dir to support RTL
    - this runs whenever `i18n` changes (i18n is stable so this is fine)
    - improvement: centralize this logic in your i18n init file (so it's not repeated across components)
  */
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("lang");
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
        document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      } else {
        document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
      }
    } catch (e) {
      // if localStorage is blocked, just set dir from i18n
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }

    // load auth state from localStorage (simple persistence)
    try {
      const authStatus = localStorage.getItem("isAuthenticated");
      const rawUser = localStorage.getItem("user");
      if (authStatus === "true" && rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed && (parsed.name || parsed.email || parsed.id)) {
          setIsAuthenticated(true);
          setUser(parsed);
        } else {
          // cleanup bad user data
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (err) {
      // if parse fails, clear storage and reset
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [i18n]);

  /*
    Click outside to close settings menu.
    - A general `useClickOutside` hook would be cleaner and reusable (recommended).
    - Currently it checks settingsOpen and the settingsButtonRef; if button is not the only element of the menu
      you may need a wrapper ref for the whole menu instead.
  */
  useEffect(() => {
    function onDocClick(e) {
      if (settingsOpen) {
        if (
          settingsButtonRef.current &&
          !settingsButtonRef.current.contains(e.target)
        ) {
          setSettingsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [settingsOpen]);

  /*
    Lock body scroll when mobile menu is open.
    - simple and effective: sets body overflow
    - improvement: toggle `touch-action` on mobile and always cleanup on unmount (already handled here)
  */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Language switch helper: toggles between 'ar' and 'en' or sets provided nextLang
  const switchLang = (nextLang) => {
    const next = nextLang || (i18n.language === "ar" ? "en" : "ar");
    i18n.changeLanguage(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  // Logout handler clears localStorage and resets state
  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    } catch (e) {}
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    setMobileOpen(false);
  };

  // Navigation helper to close all panels/menus on navigation
  const onNavigate = () => {
    setMobileOpen(false);
    setShowUserMenu(false);
    setCartOpen(false);
    setSettingsOpen(false);
  };

  // display name fallback; translate 'guest' if needed
  const displayName = user?.name || user?.email || t("navbar.guest", "User");

  return (
    <nav
      className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10"
      aria-label="Main navigation"
    >
      {/* small gradient line under navbar */}
      <div className="gradient-primary h-0.5" />
      <div className="backdrop-blur glass">
        <div className=" mx-auto px-2 h-16 flex items-center gap-4">
          {/* Logo / Home link */}
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-xl"
            onClick={onNavigate}
          >
            <span className="text-gradient text-sm sm:text-base">
              <img src="./imgs/logo.png" className="w-30 object-cover" alt="" />
            </span>
          </Link>

          {/* Desktop links (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${
                  isActive ? "font-semibold" : ""
                }`
              }
              onClick={onNavigate}
            >
              {t("navbar.home", "Home")}
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${
                  isActive ? "font-semibold bg-black/5 dark:bg-white/10" : ""
                }`
              }
              onClick={onNavigate}
            >
              {t("navbar.courses", "Courses")}
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${
                  isActive ? "font-semibold bg-black/5 dark:bg-white/10" : ""
                }`
              }
              onClick={onNavigate}
            >
              {t("navbar.dashboard", "Dashboard")}
            </NavLink>
          </div>

          {/* Right side actions */}
          <div className="ms-auto flex items-center gap-2">
            {/* Language toggle button (hidden on very small screens) */}
            <button
              aria-label={t("navbar.language", "Language")}
              title={t("navbar.language", "Language")}
              onClick={() => switchLang()}
              className="px-3 py-2 rounded-xl cursor-pointer border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 hidden sm:inline-flex"
            >
              {i18n.language === "ar" ? "EN" : "AR"}
            </button>

            {/* Theme toggle */}
            <button
              aria-label={t("navbar.theme", "Theme")}
              title={t("navbar.theme", "Theme")}
              onClick={() => toggleTheme()}
              className="px-3 py-2 rounded-xl cursor-pointer border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 hidden sm:inline-flex"
            >
              {theme === "dark" ? t("☀️") : t("🌙")}
            </button>

            {/* Cart button + panel */}
            <div ref={cartContainerRef} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Navbar cart click", {
                    cartItems,
                    cartCount,
                    cartTotal,
                  });
                  setCartOpen((v) => !v);
                }}
                className="relative p-2 cursor-pointer rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
                aria-expanded={cartOpen}
                aria-haspopup="true"
                aria-label={t("navbar.cart", "Cart")}
                title={t("navbar.cart", "Cart")}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    aria-live="polite"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

    <CartPanel
  open={!!cartOpen}
  onClose={() => setCartOpen(false)}
  cartItems={Array.isArray(cartItems) ? cartItems : []}
  total={Number(cartTotal) || 0}
  isMobile={!!isMobile}
  i18n={i18n}
  anchorRef={cartContainerRef}   // <-- هنا
/>

            </div>

            {/* Wishlist (hidden on small screens) */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 hidden sm:inline-flex"
              onClick={onNavigate}
              aria-label={t("navbar.wishlist", "Wishlist")}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  aria-live="polite"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth / User menu (desktop) */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((s) => !s)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
                    aria-expanded={showUserMenu}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {displayName[0] || "U"}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {displayName}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div
                      id="user-menu"
                      className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl border border-white/20 p-2 shadow-lg"
                      role="menu"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate();
                        }}
                        role="menuitem"
                      >
                        <User className="w-4 h-4" />
                        {t("navbar.dashboard", "Dashboard")}
                      </Link>

                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                        onClick={() => {
                          /* settings */
                        }}
                        role="menuitem"
                      >
                        <IconSettings className="w-4 h-4" />
                        {t("navbar.settings", "Settings")}
                      </button>

                      <hr className="my-2 border-white/10" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors text-left"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("navbar.logout", "Logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  onClick={onNavigate}
                >
                  {t("navbar.signIn", "Sign In")}
                </Link>
              )}
            </div>

            {/* Mobile burger (visible only on small screens) */}
            <button
              className="inline-flex sm:hidden items-center justify-center p-2 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={
                mobileOpen
                  ? t("navbar.closeMenu", "Close menu")
                  : t("navbar.openMenu", "Open menu")
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown/menu that slides down */}
      <div
        className={`sm:hidden overflow-hidden bg-white dark:bg-gray-800 transition-[max-height] duration-300 ${
          mobileOpen ? "max-h-[100vh]" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 pb-4 space-y-3">
          <NavLink
            to="/"
            onClick={onNavigate}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive ? "font-semibold bg-black/5" : "hover:bg-black/5"
              }`
            }
          >
            {t("navbar.home", "Home")}
          </NavLink>

          <NavLink
            to="/courses"
            onClick={onNavigate}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive ? "font-semibold bg-black/5" : "hover:bg-black/5"
              }`
            }
          >
            {t("navbar.courses", "Courses")}
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={onNavigate}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${
                isActive ? "font-semibold bg-black/5" : "hover:bg-black/5"
              }`
            }
          >
            {t("navbar.dashboard", "Dashboard")}
          </NavLink>

          <div className="border-t pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                switchLang();
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-black/5"
            >
              {t("navbar.language", "Language")}:{" "}
              {i18n.language === "ar" ? "AR" : "EN"}
            </button>

            <button
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-black/5"
            >
              {t("navbar.theme", "Theme")}:{" "}
              {theme === "dark"
                ? t("navbar.dark", "Dark")
                : t("navbar.light", "Light")}
            </button>

            <Link
              to="/wishlist"
              onClick={onNavigate}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5"
            >
              <span>{t("navbar.wishlist", "Wishlist")}</span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart link on mobile opens sheet */}
       
          </div>

          <div className="border-t pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {displayName[0] || "U"}
                  </div>
                  <div>
                    <div className="font-medium">{displayName}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={onNavigate}
                  className="block px-3 py-2 rounded-lg hover:bg-black/5 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />{" "}
                  {t("navbar.dashboard", "Dashboard")}
                </Link>

                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 flex items-center gap-2">
                  <IconSettings className="w-4 h-4" />{" "}
                  {t("navbar.settings", "Settings")}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> {t("navbar.logout", "Logout")}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={onNavigate}
                className="block text-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
              >
                {t("navbar.signIn", "Sign In")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
