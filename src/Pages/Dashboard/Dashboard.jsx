// Dashboard.jsx
// Dashboard page with multiple panels: Overview, My Courses, Cart, Wishlist, Progress, Achievements.
// - Panels are small components inside this file for clarity.
// - activeTab is persisted to localStorage.
// - Uses i18n for strings and defensive access to Context (cart/wishlist).

import React, { useMemo, useState, useCallback } from "react";
import { projectData } from "../../../Data/Data";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  ShoppingBag,
  Heart,
  TrendingUp,
  Award,
  Clock,
  Star,
  Play,
  Download,
  Share2,
  Target,
  Zap,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/CartContext";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

/* -----------------------
  Small reusable stat card
  Props:
    - icon: Icon component (Lucide)
    - value: main value (string|number)
    - label: small label text
    - accent: optional CSS class for icon color
------------------------*/
function StatCard({ icon: Icon, value, label, accent }) {
  return (
    <div className="glass shadow rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${accent || "text-indigo-500"}`} />
      </div>
      <div className="text-3xl font-extrabold text-gradient">{value}</div>
      <div className="text-sm text-fg/70">{label}</div>
    </div>
  );
}

/* -----------------------
  OverviewPanel
  - shows key stats, quick actions, and uses helper formatters passed from parent
------------------------*/
function OverviewPanel({
  purchased,
  stats,
  getTotalPrice,
  getTotalItems,
  getWishlistItems,
  t,
  currencyFmt,
  numberFmt,
}) {
  return (
    <div className="space-y-8">
      {/* Top stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* My Courses */}
        <div className="glass shadow rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            <span className="text-sm text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
              +{purchased.length}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-gradient">
            {numberFmt.format(purchased.length)}
          </div>
          <div className="text-sm text-fg/70">
            {t("dashboard.stats.myCourses", "My Courses")}
          </div>
        </div>

        {/* Cart total */}
        <StatCard
          icon={ShoppingCart}
          value={currencyFmt(getTotalPrice())}
          label={t("dashboard.stats.cartTotal", "Cart Total")}
          accent="text-blue-500"
        />

        {/* Wishlist items */}
        <StatCard
          icon={Heart}
          value={numberFmt.format(getWishlistItems())}
          label={t("dashboard.stats.wishlistItems", "Wishlist Items")}
          accent="text-red-500"
        />

        {/* Learning hours */}
        <div className="glass shadow rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-500" />
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-gradient">
            {numberFmt.format(stats.totalHours)}h
          </div>
          <div className="text-sm text-fg/70">
            {t("dashboard.stats.learningHours", "Learning Hours")}
          </div>
        </div>

        {/* Average rating */}
        <StatCard
          icon={Star}
          value={stats.avgRating}
          label={t("dashboard.stats.avgRating", "Avg Rating")}
          accent="text-yellow-500"
        />

        {/* Completion rate */}
        <div className="glass shadow rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-gradient">
            {numberFmt.format(stats.completionRate)}%
          </div>
          <div className="text-sm text-fg/70">
            {t("dashboard.stats.completionRate", "Completion Rate")}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-6 shadow border border-white/10"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500" />
          {t("dashboard.quickActions.title", "Quick Actions")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Browse courses */}
          <Link
            to="/courses"
            className="group p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
          >
            <BookOpen className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">
              {t("dashboard.quickActions.browse", "Browse Courses")}
            </div>
            <div className="text-sm text-fg/70">
              {t("dashboard.quickActions.browseDesc", "Discover new content")}
            </div>
          </Link>

          {/* Continue learning */}
          <button className="group p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
            <Play className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">
              {t("dashboard.quickActions.continue", "Continue Learning")}
            </div>
            <div className="text-sm text-fg/70">
              {t("dashboard.quickActions.continueDesc", "Resume your progress")}
            </div>
          </button>

          {/* Download certificates */}
          <button className="group p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
            <Download className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">
              {t("dashboard.quickActions.download", "Download Certificates")}
            </div>
            <div className="text-sm text-fg/70">
              {t("dashboard.quickActions.downloadDesc", "Get your achievements")}
            </div>
          </button>

          {/* Share progress */}
          <button className="group p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
            <Share2 className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold">
              {t("dashboard.quickActions.share", "Share Progress")}
            </div>
            <div className="text-sm text-fg/70">
              {t("dashboard.quickActions.shareDesc", "Show your achievements")}
            </div>
          </button>
        </div>
      </motion.section>
    </div>
  );
}

/* -----------------------
  CoursesPanel - shows purchased courses
------------------------*/
function CoursesPanel({ purchased, numberFmt, t }) {
  if (!purchased.length) {
    return <div className="text-center py-16">{t("dashboard.courses.empty", "No purchased courses")}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchased.map((course) => (
        <div key={course.id} className="glass shadow rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="relative mb-4">
            <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-2xl" />
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">{course.duration}</div>
          </div>

          <h3 className="font-bold text-lg mb-2">{course.title}</h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm">{course.rating}</span>
            </div>
            <span className="text-sm text-fg/70">•</span>
            <span className="text-sm text-fg/70">{numberFmt.format(course.studentsCount || 0)} {t("dashboard.students", "students")}</span>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-500 cursor-pointer text-white py-2 px-4 rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              {t("dashboard.continue", "Continue")}
            </button>
            <button className="p-2 border border-white dark:border-white/10 cursor-pointer shadow rounded-xl hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* -----------------------
  CartPanel - shows items in cart + order summary
------------------------*/
function CartPanel({ cartItems, currencyFmt, t, numberFmt }) {
  if (!cartItems.length) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-24 h-24 text-fg/30 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gradient mb-2">{t("dashboard.cart.emptyTitle", "Your cart is empty")}</h3>
        <p className="text-fg/70 mb-6">{t("dashboard.cart.emptyDesc", "Add some courses to get started!")}</p>
        <Link to="/courses" className="btn-primary">{t("dashboard.cart.browse", "Browse Courses")}</Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="glass rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-fg/70 text-sm mb-2">{item.category} • {item.level}</p>
                  <div className="text-xl font-bold text-gradient">{currencyFmt(item.price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-fg/70 mb-2">{t("dashboard.quantity", "Quantity")}: {item.quantity}</div>
                  <div className="text-lg font-bold">{currencyFmt(item.price * item.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">{t("dashboard.orderSummary", "Order Summary")}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{t("dashboard.subtotal", "Subtotal")}:</span>
              <span>{currencyFmt(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("dashboard.tax", "Tax")}:</span>
              <span>{t("dashboard.taxAmount", "$0.00")}</span>
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t("dashboard.total", "Total")}:</span>
                <span className="text-gradient">{currencyFmt(subtotal)}</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
            {t("dashboard.checkout", "Proceed to Checkout")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* -----------------------
  WishlistPanel
------------------------*/
function WishlistPanel({ wishlistItems, currencyFmt, t }) {
  if (!wishlistItems.length) {
    return (
      <div className="text-center py-16">
        <Heart className="w-24 h-24 text-fg/30 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gradient mb-2">{t("dashboard.wishlist.emptyTitle", "Your wishlist is empty")}</h3>
        <p className="text-fg/70 mb-6">{t("dashboard.wishlist.emptyDesc", "Save courses you're interested in for later!")}</p>
        <Link to="/courses" className="btn-primary">{t("dashboard.wishlist.browse", "Browse Courses")}</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((course) => (
        <div key={course.id} className="glass rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="relative mb-4">
            <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-2xl" />
            <div className="absolute top-2 right-2 bg-red-500/20 backdrop-blur-sm rounded-full p-2">
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </div>
          </div>
          <h4 className="font-bold text-lg mb-2">{course.title}</h4>
          <p className="text-fg/70 text-sm mb-3">{course.category} • {course.level}</p>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gradient">{currencyFmt(course.price)}</div>
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-current" /><span className="text-sm font-semibold">{course.rating}</span></div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* -----------------------
  ProgressPanel - simple visual progress for purchased courses
------------------------*/
function ProgressPanel({ purchased, t }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 ">
      <div className="glass shadow rounded-3xl p-6 border border-white/10">
        <h3 className="text-lg font-bold mb-4">{t("dashboard.progress.title", "Learning Progress")}</h3>
        <div className="space-y-4">
          {purchased.map((course, index) => (
            <div key={course.id} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{course.title}</div>
                <div className="text-sm text-fg/70">{course.category} • {course.level}</div>
                <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (index + 1) * 20)}%` }} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{Math.min(100, (index + 1) * 20)}%</div>
                <div className="text-sm text-fg/70">{t("dashboard.progress.complete", "Complete")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -----------------------
  AchievementsPanel - simple grid of achievement cards
------------------------*/
function AchievementsPanel({ t }) {
  const items = [
    { key: "firstCourse", title: t("dashboard.achievements.firstCourse.title", "First Course"), description: t("dashboard.achievements.firstCourse.desc", "Completed your first course"), icon: Award, earned: true },
    { key: "streak", title: t("dashboard.achievements.streak.title", "Learning Streak"), description: t("dashboard.achievements.streak.desc", "7 days in a row"), icon: Zap, earned: true },
    { key: "quizMaster", title: t("dashboard.achievements.quiz.title", "Quiz Master"), description: t("dashboard.achievements.quiz.desc", "Scored 100% on 5 quizzes"), icon: Target, earned: false },
    { key: "social", title: t("dashboard.achievements.social.title", "Social Learner"), description: t("dashboard.achievements.social.desc", "Shared 3 achievements"), icon: Share2, earned: false },
    { key: "nightOwl", title: t("dashboard.achievements.night.title", "Night Owl"), description: t("dashboard.achievements.night.desc", "Studied after 10 PM"), icon: Clock, earned: true },
    { key: "perfectionist", title: t("dashboard.achievements.perf.title", "Perfectionist"), description: t("dashboard.achievements.perf.desc", "Completed all exercises"), icon: Star, earned: false },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((achievement) => (
        <div key={achievement.key} className={`glass rounded-3xl shadow p-6 border transition-all duration-300 ${achievement.earned ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" : "border-white/10 bg-white/5"}`}>
          <div className={`w-12 h-12 rounded-xl flex shadow items-center justify-center mb-4 ${achievement.earned ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-white/10"}`}>
            <achievement.icon className={`w-6 h-6 ${achievement.earned ? "text-white" : "text-fg/50"}`} />
          </div>
          <h3 className={`font-bold ${achievement.earned ? "text-yellow-400" : "text-fg/50"}`}>{achievement.title}</h3>
          <p className={`text-sm mt-1 ${achievement.earned ? "text-fg/80" : "text-fg/40"}`}>{achievement.description}</p>
          {achievement.earned && <div className="mt-3 text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full w-fit">✓ {t("dashboard.achievements.earned", "Earned")}</div>}
        </div>
      ))}
    </motion.div>
  );
}

/* -----------------------
  Main Dashboard component
  - prepares data, formatters and maps tabs to panel components
------------------------*/
export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  // fallback user (safe access if projectData missing)
  const user = projectData?.users?.[0] || { id: null, name: t("dashboard.guest", "Guest"), purchasedCourseIds: [] };
  const courses = projectData?.courses || [];

  // purchased courses (memoized)
  const purchased = useMemo(() => courses.filter((c) => user?.purchasedCourseIds?.includes(c.id)), [courses, user]);

  // user orders (example usage)
  const orders = projectData?.orders?.filter((o) => o.userId === user.id) || [];

  // active tab (persisted to localStorage)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("dashboard.activeTab") || "overview";
    } catch {
      return "overview";
    }
  });

  // cart/wishlist context (defensive)
  const cartCtx = useCart() || {};
  const wishlistCtx = useWishlist() || {};
  const cartItems = cartCtx.items || [];
  const wishlistItems = wishlistCtx.items || [];
  const getTotalPrice = typeof cartCtx.getTotalPrice === "function" ? cartCtx.getTotalPrice : () => 0;
  const getTotalItems = typeof cartCtx.getTotalItems === "function" ? cartCtx.getTotalItems : () => cartItems.length;
  const getWishlistItems = typeof wishlistCtx.getTotalItems === "function" ? wishlistCtx.getTotalItems : () => wishlistItems.length;

  // formatters (locale aware)
  const numberFmt = new Intl.NumberFormat(locale);
  const currencyFmt = useCallback(
    (value) => {
      try {
        return new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(value);
      } catch {
        return `$${Number(value).toFixed(2)}`;
      }
    },
    [locale]
  );

  // derived statistics
  const stats = useMemo(() => {
    const totalHours = purchased.reduce((acc, course) => {
      const match = course.duration?.match(/(\d+)h/);
      const hours = match ? parseInt(match[1], 10) : 0;
      return acc + hours;
    }, 0);

    const avgRating = purchased.length > 0 ? (purchased.reduce((acc, c) => acc + (c.rating || 0), 0) / purchased.length).toFixed(1) : "0.0";
    const completionRate = Math.floor((purchased.length / Math.max(1, courses.length)) * 100);

    return { totalHours, avgRating, completionRate };
  }, [purchased, courses]);

  // tabs configuration
  const tabs = [
    { id: "overview", label: t("dashboard.tabs.overview", "Overview"), icon: TrendingUp },
    { id: "courses", label: t("dashboard.tabs.courses", "My Courses"), icon: BookOpen },
    { id: "cart", label: t("dashboard.tabs.cart", "Cart"), icon: ShoppingCart },
    { id: "wishlist", label: t("dashboard.tabs.wishlist", "Wishlist"), icon: Heart },
    { id: "progress", label: t("dashboard.tabs.progress", "Progress"), icon: Target },
    { id: "achievements", label: t("dashboard.tabs.achievements", "Achievements"), icon: Award },
  ];

  // map tab id -> panel component (keeps JSX compact)
  const TAB_PANELS = {
    overview: (
      <OverviewPanel
        purchased={purchased}
        stats={stats}
        getTotalPrice={getTotalPrice}
        getTotalItems={getTotalItems}
        getWishlistItems={getWishlistItems}
        t={t}
        currencyFmt={currencyFmt}
        numberFmt={numberFmt}
      />
    ),
    courses: <CoursesPanel purchased={purchased} numberFmt={numberFmt} t={t} />,
    cart: <CartPanel cartItems={cartItems} currencyFmt={currencyFmt} t={t} numberFmt={numberFmt} />,
    wishlist: <WishlistPanel wishlistItems={wishlistItems} currencyFmt={currencyFmt} t={t} />,
    progress: <ProgressPanel purchased={purchased} t={t} />,
    achievements: <AchievementsPanel t={t} />,
  };

  // persist active tab
  const handleSetTab = (id) => {
    setActiveTab(id);
    try {
      localStorage.setItem("dashboard.activeTab", id);
    } catch {}
  };

  return (
    <>
      <Helmet>
        <title>Skillverse | Dashboard</title>
      </Helmet>

      <div className="py-8 px-4">
        {/* Header: avatar + welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{(user.name || "G")[0]}</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gradient">
                {t("dashboard.welcomeBack", "Welcome back")}, {user.name}
                {typeof user.name === "string" && "!"}
              </h1>
              <p className="text-fg/70">{t("dashboard.readyToContinue", "Ready to continue your learning journey?")}</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSetTab(tab.id)}
                  className={`flex items-center shadow gap-2 px-4 cursor-pointer py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? "bg-indigo-500 text-white" : "bg-white/10 text-fg/70 hover:bg-white/20"}`}
                  aria-pressed={activeTab === tab.id}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Render the active panel (keeps main render clean) */}
        <div>{TAB_PANELS[activeTab]}</div>
      </div>
    </>
  );
}
