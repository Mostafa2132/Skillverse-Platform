import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Star,
  Clock,
  Users,
  Play,
  BookOpen,
  ShoppingCart,
  Heart,
} from 'lucide-react'
import { useCart } from '../../Context/CartContext'
import { useWishlist } from '../../Context/CartContext'

/**
 * Reusable Stars component to render dynamic rating visually.
 */
function Stars({ rating, size = 4 }) {
  const floor = Math.floor(Number(rating) || 0)
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < floor ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

/**
 * Main CourseCard component
 * Displays course details, instructor info, and action buttons (cart/wishlist).
 * Animated using Framer Motion and styled with Tailwind CSS.
 */
function CourseCard({ course, instructor, i18n }) {
  const { addToCart, isInCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Memoized checks to prevent redundant context calls
  const inCart = useMemo(() => isInCart(course?.id), [isInCart, course?.id])
  const inWishlist = useMemo(
    () => isInWishlist(course?.id),
    [isInWishlist, course?.id]
  )

  // Add course to cart
  const handleAddToCart = useCallback(
    (e) => {
      e?.preventDefault()
      if (!course) return
      addToCart(course)
    },
    [addToCart, course]
  )

  // Toggle course in wishlist
  const handleWishlistToggle = useCallback(
    (e) => {
      e?.preventDefault()
      if (!course) return
      if (inWishlist) removeFromWishlist(course.id)
      else addToWishlist(course)
    },
    [addToWishlist, removeFromWishlist, inWishlist, course]
  )

  // Choose correct language description
  const shortDesc =
    (i18n && course?.shortDescription?.[i18n.language]) ||
    course?.shortDescription?.en ||
    course?.shortDescription?.default ||
    ''

  return (
    <motion.article
      /** Animation when card comes into view */
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-3xl shadow overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl glass border border-white/20"
      aria-labelledby={`course-title-${course?.id}`}
    >
      {/* === Image Section === */}
      <div className="relative overflow-hidden">
        {/* Course image */}
        <img
          src={course?.image}
          alt={course?.title || 'Course image'}
          className="w-full h-72 object-contain group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* "New" / "Popular" badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {course?.isNew && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              New
            </span>
          )}
          {course?.isPopular && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Popular
            </span>
          )}
        </div>

        {/* Price tag */}
        <div className="absolute top-4 right-4 glass rounded-2xl px-3 py-2 border border-white/30">
          <div className="text-white font-bold text-lg">${course?.price}</div>
        </div>

        {/* Play icon overlay (hover animation) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            role="button"
            aria-label={`Preview ${course?.title || 'course'}`}
          >
            <Play className="w-6 h-6 text-white ml-1" aria-hidden />
          </div>
        </div>
      </div>

      {/* === Card Content === */}
      <div className="p-6">
        {/* Course category & level tags */}
        <div className="flex items-center gap-2 mb-4">
          {course?.category && (
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
              {course.category}
            </span>
          )}
          {course?.level && (
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
              {course.level}
            </span>
          )}
        </div>

        {/* Course title */}
        <h3
          id={`course-title-${course?.id}`}
          className="font-bold text-xl leading-tight mb-3 group-hover:text-gradient transition-colors"
        >
          {course?.title}
        </h3>

        {/* Short description */}
        <p className="text-sm text-fg/70 line-clamp-2 mb-4 leading-relaxed">
          {shortDesc}
        </p>

        {/* Stats: rating, students count, duration */}
        <div className="flex items-center gap-4 mb-4 text-sm text-fg/60">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Stars rating={course?.rating} />
            <span className="font-semibold ml-1">{course?.rating ?? '0'}</span>
          </div>

          {/* Students count */}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" aria-hidden />
            <span>{course?.studentsCount?.toLocaleString() || '0'}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden />
            <span>{course?.duration || '8h'}</span>
          </div>
        </div>

        {/* Instructor info */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={instructor?.avatar}
            alt={instructor?.name || 'Instructor avatar'}
            className="w-10 object-contain h-10 rounded-full border-2 border-white/20"
            loading="lazy"
          />
          <div>
            <div className="font-semibold text-sm">{instructor?.name}</div>
            <div className="text-xs text-fg/60">{instructor?.bio}</div>
          </div>
        </div>

        {/* === Action Buttons === */}
        <div className="space-y-3">
          {/* View course details */}
          <Link
            to={`/courses/${course?.slug}`}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105 transform"
            aria-label={`View course ${course?.title}`}
          >
            <BookOpen className="w-4 h-4" aria-hidden />
            View Course
          </Link>

          {/* Add to cart + wishlist */}
          <div className="flex gap-2">
            {/* Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-4 rounded-xl shadow font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                inCart
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
              aria-pressed={inCart}
              aria-label={inCart ? 'In cart' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4" aria-hidden />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>

            {/* Wishlist button */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className={`p-2 rounded-xl shadow transition-all duration-200 flex items-center justify-center ${
                inWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
              aria-pressed={inWishlist}
              aria-label={
                inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <Heart
                className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>

      {/* === Decorative floating element === */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-60 hidden lg:block"
        aria-hidden
      />
    </motion.article>
  )
}

/** Type-checking and default values */
CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isNew: PropTypes.bool,
    isPopular: PropTypes.bool,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    studentsCount: PropTypes.number,
    duration: PropTypes.string,
    category: PropTypes.string,
    level: PropTypes.string,
    shortDescription: PropTypes.object,
    slug: PropTypes.string,
  }).isRequired,
  instructor: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    bio: PropTypes.string,
  }),
  i18n: PropTypes.object,
}

CourseCard.defaultProps = {
  instructor: {},
  i18n: null,
}

export default React.memo(CourseCard)
