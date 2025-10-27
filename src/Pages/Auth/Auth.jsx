// Auth.jsx
// Authentication page (Login / Register toggle)
// - Uses react-i18next for translations (t())
// - Uses Framer Motion's AnimatePresence for smooth form transitions
// - Persists simple auth data to localStorage on success (demo purpose)
// - Accessible toggles and decorative elements are marked aria-hidden where appropriate

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../../Components/Auth/Login";
import Register from "../../Components/Auth/Register";
import { Helmet } from "react-helmet";

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Keep document direction in sync with current language (RTL support)
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Toggle between Login and Register forms
  const handleToggleMode = () => setIsLoginMode((v) => !v);

  // Called when login/register succeeds.
  // NOTE: this example stores a plain object in localStorage for demo only.
  // In a real app, store an auth token (httpOnly cookie or secure storage) and never store sensitive data.
  const handleAuthSuccess = (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
    } catch (e) {
      // localStorage might be unavailable (private mode). We avoid crashing the app.
      console.warn("Could not persist auth to localStorage", e);
    }

    // Redirect to dashboard after successful auth
    navigate("/dashboard");
  };

  return (
    <>
      <Helmet>
        <title>Skillverse | {isLoginMode ? t("auth.loginTitle", "Login") : t("auth.registerTitle", "Register")}</title>
      </Helmet>

      {/* Main container */}
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
        role="main"
        aria-label={t("auth.pageTitle", "Authentication")}
      >
        {/* Decorative blurred blobs — purely visual, hidden from assistive tech */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -inset-10 opacity-50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* Card / content */}
        <div className="relative z-10 w-full max-w-md">
          {/* Title + subtitle */}
          <div className="mb-6 text-center text-white">
            <h1 className="text-2xl font-bold">
              {isLoginMode ? t("auth.loginTitle", "Sign in to your account") : t("auth.registerTitle", "Create your account")}
            </h1>
            <p className="text-sm opacity-80 mt-1">
              {isLoginMode ? t("auth.loginSubtitle", "Welcome back — please sign in.") : t("auth.registerSubtitle", "Create an account to start learning.")}
            </p>
          </div>

          {/* AnimatePresence ensures only one form is visible and transitions are smooth */}
          <AnimatePresence mode="wait">
            {isLoginMode ? (
              <Login key="login" onToggleMode={handleToggleMode} onLogin={handleAuthSuccess} />
            ) : (
              <Register key="register" onToggleMode={handleToggleMode} onRegister={handleAuthSuccess} />
            )}
          </AnimatePresence>

          {/* Small toggle link — accessible and descriptive */}
          <div className="mt-4 text-center">
            <button
              onClick={handleToggleMode}
              className="text-sm text-fg/80 cursor-pointer underline"
              aria-label={isLoginMode ? t("auth.switchToRegister", "Switch to register") : t("auth.switchToLogin", "Switch to login")}
              type="button"
            >
              {isLoginMode ? t("auth.switchToRegister", "Don't have an account? Register") : t("auth.switchToLogin", "Already have an account? Log in")}
            </button>
          </div>
        </div>

        {/* Floating decorative motion elements — aria-hidden */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full opacity-20 blur-sm hidden lg:block"
          aria-hidden
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full opacity-20 blur-sm hidden lg:block"
          aria-hidden
        />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 blur-sm hidden lg:block"
          aria-hidden
        />
      </div>
    </>
  );
}
