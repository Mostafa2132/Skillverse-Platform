// CourseDetails.jsx
// Detailed course page with tabs: Overview, Curriculum, Instructor, Reviews.
// Uses i18n for translations, defensive checks for missing data,
// and Framer Motion for small entrance animations.

import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectData } from "../../../Data/Data";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  Play,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  ShoppingCart,
  Award,
  Download,
} from "lucide-react";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/CartContext";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

/* =====================================================
   CourseDetails component
   - All user-facing strings use `t()` for i18n
   - Defensive fallbacks if data is missing
   - Small formatting helpers for numbers/dates
   - Tabs for content sections
   ===================================================== */
export default function CourseDetails() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  // read slug from route params
  const { slug } = useParams();

  // safe access to mock data (avoid crashes if projectData missing)
  const courses = projectData?.courses || [];
  const instructors = projectData?.instructors || [];

  // find the target course by slug (memoized)
  const course = useMemo(
    () => courses.find((c) => c.slug === slug),
    [courses, slug]
  );

  // find the course instructor (memoized)
  const instructor = useMemo(
    () => instructors.find((i) => i.id === course?.instructorId),
    [instructors, course]
  );

  // local UI state
  const [activeSection, setActiveSection] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);

  // cart & wishlist hooks (defensive: fall back to no-op functions)
  const cart = useCart() || {};
  const wishlist = useWishlist() || {};
  const addToCart =
    typeof cart.addToCart === "function" ? cart.addToCart : () => {};
  const isInCart =
    typeof cart.isInCart === "function" ? cart.isInCart : () => false;
  const addToWishlist =
    typeof wishlist.addToWishlist === "function"
      ? wishlist.addToWishlist
      : () => {};
  const removeFromWishlist =
    typeof wishlist.removeFromWishlist === "function"
      ? wishlist.removeFromWishlist
      : () => {};
  const isInWishlist =
    typeof wishlist.isInWishlist === "function"
      ? wishlist.isInWishlist
      : () => false;

  // If course isn't found, show a friendly fallback UI
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gradient mb-2">
            {t("course.notFound.title", "Course Not Found")}
          </h1>

          <p className="text-fg/70 mb-6">
            {t(
              "course.notFound.desc",
              "The course you're looking for doesn't exist or has been removed."
            )}
          </p>

          <Link to="/courses" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            <span className="mr-2">
              {t("course.notFound.back", "Back to Courses")}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // tabs config (labels are translatable)
  const sections = [
    {
      id: "overview",
      label: t("course.tabs.overview", "Overview"),
      icon: BookOpen,
    },
    {
      id: "curriculum",
      label: t("course.tabs.curriculum", "Curriculum"),
      icon: CheckCircle,
    },
    {
      id: "instructor",
      label: t("course.tabs.instructor", "Instructor"),
      icon: Award,
    },
    { id: "reviews", label: t("course.tabs.reviews", "Reviews"), icon: Star },
  ];

  // render rating stars (safe for missing rating)
  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
        aria-hidden
      />
    ));

  // small localization helpers
  const numberFmt = (n) => {
    try {
      return new Intl.NumberFormat(locale).format(n);
    } catch {
      return String(n);
    }
  };

  const dateFmt = (iso) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  // event handlers
  const handleAddToCart = () => addToCart(course);
  const handleWishlistToggle = () => {
    if (isInWishlist(course.id)) removeFromWishlist(course.id);
    else addToWishlist(course);
  };

  // Render main content
  return (
    <>
      <Helmet>
        <title>Skillverse | {course.title}</title>
      </Helmet>

      <div className="py-8 px-4">
        {/* Breadcrumb / back link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/courses"
            className="flex items-center gap-2 text-fg/70 hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("course.breadcrumb.courses", "Back to Courses")}</span>
          </Link>
        </motion.div>

        {/* HERO: image + info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* left: image + badges + preview */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {course.isNew && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {t("course.badges.new", "New")}
                  </span>
                )}
                {course.isPopular && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {t("course.badges.popular", "Popular")}
                  </span>
                )}
              </div>

              {/* preview play button (UI only) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  aria-label={t("course.playPreview", "Play preview")}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                  onClick={() => console.info("Play preview (not implemented)")}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* right: course metadata, instructor preview, price card */}
          <div className="space-y-6">
            <div>
              {/* category + level */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {course.category ||
                    t("course.unknownCategory", "Uncategorized")}
                </span>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {course.level || t("course.unknownLevel", "All levels")}
                </span>
              </div>

              {/* title and short description (supports localized description object) */}
              <h1 className="text-4xl font-extrabold text-gradient mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-fg/80 leading-relaxed mb-6">
                {course.description?.[locale] ||
                  course.description?.en ||
                  t("course.noShortDesc", "No description available.")}
              </p>

              {/* ratings, students count, duration */}
              <div className="flex items-center flex-wrap sm:flex-nowrap gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex" aria-hidden>
                    {renderStars(course.rating)}
                  </div>
                  <span className="ml-2 font-semibold">
                    {course.rating ?? t("course.noRating", "N/A")}
                  </span>
                  <span className="text-fg/60">
                    ({numberFmt(course.reviews?.length || 0)}{" "}
                    {t("course.reviews", "reviews")})
                  </span>
                </div>

                <div className="flex items-center gap-1 text-fg/60">
                  <Users className="w-4 h-4" />
                  <span>
                    {numberFmt(course.studentsCount || 0)}{" "}
                    {t("course.students", "students")}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-fg/60">
                  <Clock className="w-4 h-4" />
                  <span>
                    {course.duration || t("course.defaultDuration", "8h 30m")}
                  </span>
                </div>
              </div>

              {/* small instructor preview */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={instructor?.avatar || "/images/avatar-placeholder.png"}
                  alt={
                    instructor?.name || t("course.anonInstructor", "Instructor")
                  }
                  className="w-16 h-16 rounded-full border-2 border-white/20"
                />
                <div>
                  <div className="font-bold text-lg">
                    {instructor?.name ||
                      t("course.anonInstructor", "Instructor")}
                  </div>
                  <div className="text-fg/70">
                    {instructor?.bio ||
                      t(
                        "course.anonInstructorBio",
                        "Instructor profile coming soon."
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & action card */}
            <div className="glass shadow rounded-3xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <div className="text-4xl font-extrabold text-gradient mb-2">
                  {t("course.pricePrefix", "$")}
                  {course.price}
                </div>
                <div className="text-fg/70">
                  {t("course.oneTimePayment", "One-time payment")}
                </div>
              </div>

              <div className="space-y-3">
                {/* Add to cart / enroll button (toggle based on isInCart) */}
                {!isInCart(course.id) ? (
                  <button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t("course.addToCart", "Add to Cart")}
                  </button>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => setIsEnrolled(true)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t("course.enrollNow", "Enroll Now")}
                  </button>
                )}

                {/* Wishlist + Share */}
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 py-3 px-4 shadow rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                      isInWishlist(course.id)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/10 border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(course.id) ? "fill-current" : ""
                      }`}
                    />
                    {isInWishlist(course.id)
                      ? t("course.inWishlist", "In Wishlist")
                      : t("course.wishlist", "Wishlist")}
                  </button>

                  <button
                    className="flex-1 shadow bg-white/10 border border-white/20 py-3 px-4 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    onClick={() => console.info("Share (not implemented)")}
                  >
                    <Share2 className="w-4 h-4" />
                    {t("course.share", "Share")}
                  </button>
                </div>
              </div>

              {/* Quick feature list */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                  <span>
                    {t("course.features.lifetime", "Lifetime access")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                  <span>
                    {t(
                      "course.features.certificate",
                      "Certificate of completion"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                  <span>
                    {t("course.features.access", "Mobile and desktop access")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                  <span>
                    {t("course.features.refund", "30-day money-back guarantee")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TABS NAV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2 flex-wrap sm:flex-nowrap overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex shadow items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-fg/70 hover:bg-white/20"
                  }`}
                  aria-pressed={activeSection === section.id}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* TAB CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeSection === "overview" && (
            <div className="grid  grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main (left) column */}
              <div className="lg:col-span-2  space-y-8">
                <div className="glass shadow rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">
                    {t("course.learnWhat", "What you'll learn")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(
                      course.whatYouLearn?.[locale] ||
                      course.whatYouLearn?.en || [
                        "Master React fundamentals and best practices",
                        "Build responsive UIs with Tailwind CSS",
                        "Implement state management solutions",
                        "Deploy applications to production",
                        "Work with modern development tools",
                        "Follow industry coding standards",
                      ]
                    ).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass shadow rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">
                    {t("course.description", "Course description")}
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-fg/80 leading-relaxed">
                      {course.description?.[locale] ||
                        course.description?.en ||
                        t(
                          "course.noLongDesc",
                          "No detailed description available."
                        )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right (details) column */}
              <div className="space-y-6">
                <div className="glass shadow rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">
                    {t("course.details", "Course details")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-fg/70">
                        {t("course.fields.duration", "Duration")}
                      </span>
                      <span className="font-semibold">
                        {course.duration ||
                          t("course.defaultDuration", "8h 30m")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fg/70">
                        {t("course.fields.level", "Level")}
                      </span>
                      <span className="font-semibold">
                        {course.level || t("course.unknownLevel", "All levels")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fg/70">
                        {t("course.fields.language", "Language")}
                      </span>
                      <span className="font-semibold">
                        {course.language ||
                          t("course.languageDefault", "English")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fg/70">
                        {t("course.fields.students", "Students")}
                      </span>
                      <span className="font-semibold">
                        {numberFmt(course.studentsCount || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fg/70">
                        {t("course.fields.rating", "Rating")}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {course.rating ?? t("course.noRating", "N/A")}
                        </span>
                        <div className="flex">{renderStars(course.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass shadow rounded-3xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">
                    {t("course.downloads", "Download resources")}
                  </h3>
                  <button
                    className="w-full shadow bg-white/10 border border-white/20 py-3 px-4 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    onClick={() =>
                      console.info("Download materials (not implemented)")
                    }
                  >
                    <Download className="w-4 h-4" />
                    {t("course.downloadMaterials", "Course Materials")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "curriculum" && (
            <div className="glass shadow rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-6">
                {t("course.curriculum.title", "Course curriculum")}
              </h3>
              <div className="space-y-4">
                {(course.curriculum || []).map((section, sectionIndex) => (
                  <div
                    key={section.id || sectionIndex}
                    className="border shadow border-black/10 dark:border-white/10 rounded-2xl overflow-hidden"
                  >
                    <div className="px-6  py-4 bg-white/5 border-b border-black/10 dark:border-white/10">
                      <div className="flex  items-center justify-between">
                        <h4 className="font-semibold">{section.title}</h4>
                        <span className="text-sm text-fg/70">
                          {numberFmt(section.items?.length || 0)}{" "}
                          {t("course.lessons", "lessons")}
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-white/10">
                      {(section.items || []).map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <span className="text-sm text-fg/70">
                            {item.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "instructor" && instructor && (
            <div className="glass shadow rounded-3xl p-6 border border-white/20">
              <div className="flex items-start gap-6">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-24 h-24 rounded-full border-2 border-white/20"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                  <p className="text-fg/70 mb-4">{instructor.bio}</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        4.9
                      </div>
                      <div className="text-sm text-fg/70">
                        {t("course.instructor.rating", "Instructor Rating")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">
                        1.2M
                      </div>
                      <div className="text-sm text-fg/70">
                        {t("course.instructor.students", "Students")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gradient">24</div>
                      <div className="text-sm text-fg/70">
                        {t("course.instructor.courses", "Courses")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "reviews" && (
            <div className="space-y-6">
              <div className="glass shadow rounded-3xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    {t("course.reviewsTitle", "Student reviews")}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(course.rating)}</div>
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-fg/70">
                      ({numberFmt(course.reviews?.length || 0)}{" "}
                      {t("course.reviews", "reviews")})
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {course.reviews?.length ? (
                    course.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-white/10 rounded-2xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">U</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">
                                {review.user ||
                                  t("course.reviewAnonymous", "Anonymous User")}
                              </span>
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-fg/80">
                              {review.comment?.[locale] ||
                                review.comment?.en ||
                                ""}
                            </p>
                            <div className="text-sm text-fg/60 mt-2">
                              {review.createdAt
                                ? dateFmt(review.createdAt)
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-fg/50" />
                      </div>
                      <h4 className="text-lg font-semibold">
                        {t("course.noReviewsTitle", "No reviews yet")}
                      </h4>
                      <p className="text-fg/70">
                        {t(
                          "course.noReviewsDesc",
                          "Be the first to review this course!"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
