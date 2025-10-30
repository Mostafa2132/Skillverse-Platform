import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowBigLeft, ArrowBigRight, User } from "lucide-react";
import CountUp from "react-countup";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
  }, [locale]);

  const title = t("home.title", "Skillverse");

  return (
    <header
      aria-label="Hero"
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -inset-x-20 -top-32 h-64 blur-3xl opacity-20 gradient-primary" />

      {/* floating shapes (same as before) */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full opacity-20 blur-sm"
      />
      {/* ... other shapes omitted for brevity (keep them) ... */}

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* text column */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-fg"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="badge badge-soft mb-4 w-max"
            >
              {/* kept the icon inline */}
              <User className="w-4 h-4 mr-2" />
              {t("home.tagline", "Top courses • Expert instructors")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-extrabold leading-tight text-gradient mb-6"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-fg/90 max-w-xl leading-relaxed mb-8"
            >
              {t(
                "home.subtitle",
                "Master the skills that matter in today's digital world. Learn from industry experts and build your future with our comprehensive courses."
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/courses"
                className="btn-primary"
                aria-label={t("buttons.viewCourse", "Explore Courses")}
              >
                {t("buttons.viewCourse", "Explore Courses")}
                <ArrowBigRight className="w-4 h-4 ml-2" />
              </Link>

              <a href="#features" className="btn-secondary">
                {t("buttons.learnMore", "Learn more")}
              </a>
            </motion.div>

            {/* search */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 w-full max-w-md"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="hero-search" className="sr-only">
                {t("navbar.search", "Search courses")}
              </label>
              <div className="glass rounded-2xl p-1 flex items-center gap-2 border border-white/20">
                <input
                  id="hero-search"
                  type="search"
                  placeholder={t(
                    "hero.searchPlaceholder",
                    "Search courses, e.g. React"
                  )}
                  className="flex-1 bg-transparent placeholder:text-fg/70 text-fg px-4 py-3 focus:outline-none"
                />
                <button
                  className="px-4 py-2 bg-white/10 rounded-lg text-fg/90 hover:bg-white/20 transition"
                  aria-label={t("navbar.search", "Search courses")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    />
                  </svg>
                </button>
              </div>
            </motion.form>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 grid grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  <CountUp start={0} duration={6} end={50} />K+
                </div>
                <div className="text-sm opacity-70">
                  {t("hero.stats.students", "Students")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  <CountUp start={0} duration={6} end={200} />+
                </div>
                <div className="text-sm opacity-70">
                  {t("hero.stats.courses", "Courses")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  <CountUp
                    start={0}
                    decimals={1}
                    startOnMount
                    decimal="."
                    duration={6}
                    end={4.9}
                  />
                  ★
                </div>
                <div className="text-sm opacity-70">
                  {t("hero.stats.rating", "Rating")}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* visual column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-lg">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-amber-50 to-orange-100"
              >
                <div className="relative h-72 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
                  <img src="/imgs/coursesImgs/c2.avif" alt="" />
                </div>

                <div className="p-6 glass text-fg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-soft">
                      {t("hero.featuredLibrary", "Featured Library")}
                    </span>
                    <span className="badge badge-soft">4.9★</span>
                  </div>
                  <h4 className="font-bold text-xl">
                    {t(
                      "hero.completeLibraryTitle",
                      "Complete Learning Library"
                    )}
                  </h4>
                  <p className="text-sm mt-2 opacity-80">
                    {t(
                      "hero.completeLibraryDesc",
                      "Access thousands of courses, books, and learning materials"
                    )}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-lg font-bold text-gradient">
                      {t("hero.freeAccess", "Free Access")}
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">
                      {t("hero.exploreNow", "Explore Now")}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* floating testimonial cards (use translations) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-8 -top-8 w-48 glass rounded-2xl shadow-lg p-4 hidden md:block border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {t("testimonials.aName", "Ahmed M.")}
                    </div>
                    <div className="text-xs opacity-70">
                      {t("testimonials.aRole", "Student")}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  "
                  {t(
                    "testimonials.aText",
                    "This course changed my career! Highly recommended."
                  )}
                  "
                </div>
                <div className="text-xs opacity-70 mt-1">⭐⭐⭐⭐⭐</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 -bottom-8 w-44 glass rounded-2xl shadow-lg p-4 hidden lg:block border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {t("testimonials.sName", "Sarah K.")}
                    </div>
                    <div className="text-xs opacity-70">
                      {t("testimonials.sRole", "Developer")}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  "
                  {t(
                    "testimonials.sText",
                    "Best investment I made for my skills!"
                  )}
                  "
                </div>
                <div className="text-xs opacity-70 mt-1">⭐⭐⭐⭐⭐</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* animated wave */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
        <motion.svg
          viewBox="0 0 1440 120"
          className="w-full h-20"
          preserveAspectRatio="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <path
            d="M0 40 C 360 140 1080 -40 1440 40 L1440 120 L0 120 Z"
            fill="rgba(99,102,241,0.15)"
          ></path>
        </motion.svg>
      </div>
    </header>
  );
}
