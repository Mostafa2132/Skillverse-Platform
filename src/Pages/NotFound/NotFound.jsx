import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0f172a]/80 to-[#0b1220] p-6">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative max-w-4xl w-full bg-gradient-to-tr from-[#0b1220]/60 via-[#0b1220]/40 to-[#061226]/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl p-10 md:p-16 overflow-hidden"
        aria-labelledby="notfound-title"
      >
        {/* Decorative gradient blobs */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-tr from-pink-500 via-violet-500 to-indigo-500 blur-3xl transform-gpu"
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.6 }}
          className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 blur-3xl transform-gpu"
        />

        <div className="relative z-10 text-center">
          <motion.h1
            id="notfound-title"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="text-7xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white to-white/70 drop-shadow-md"
          >
            {t("notfound.code")}
          </motion.h1>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            {t("notfound.message")}
          </motion.p>

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.45 }}
            className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-medium shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-300/30 transition-transform"
            >
              <ArrowLeft size={18} />
              {t("notfound.home")}
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 text-white/90 bg-white/5 hover:bg-white/6 transition"
            >
              {t("notfound.contact")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 pt-6 border-t border-white/5 max-w-2xl mx-auto"
          >
            <p className="text-sm text-white/60">{t("notfound.footer")}</p>
          </motion.div>
        </div>

        {/* Illustration / subtle animated dots */}
        <motion.ul
          aria-hidden
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute -bottom-8 right-8 flex gap-3 z-0"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.li
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2 + i * 0.15,
                delay: i * 0.06,
              }}
              className="w-3 h-3 rounded-full bg-white/60"
            />
          ))}
        </motion.ul>
      </motion.section>
    </main>
  );
}
