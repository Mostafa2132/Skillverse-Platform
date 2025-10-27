// Wishlist.jsx
// - Shows user wishlist items (from useWishlist()).
// - Allows moving single items to cart or removing them.
// - Includes "Add all to cart" action with safe handling.
// - Uses Framer Motion for simple entrance animations.

import { motion } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../Context/CartContext";
import { useCart } from "../../Context/CartContext";
import { Helmet } from "react-helmet";

export default function Wishlist() {
  // Read wishlist and cart API from context (these hooks throw if provider is missing).
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Move one course from wishlist to cart:
  // - Add to cart
  // - Remove from wishlist
  const handleMoveToCart = (course) => {
    // Defensive: ensure addToCart exists
    if (typeof addToCart === "function") addToCart(course);
    if (typeof removeFromWishlist === "function") removeFromWishlist(course.id);
  };

  const handleRemoveFromWishlist = (courseId) => {
    if (typeof removeFromWishlist === "function") removeFromWishlist(courseId);
  };

  // NOTE:
  // When doing "add all to cart" we avoid calling removeFromWishlist inside the loop
  // while the same array is being iterated and mutated. Instead we:
  // 1) copy item ids, 2) call addToCart for each, 3) call removeFromWishlist for each id.
  // This prevents potential race conditions if provider updates synchronously.

  return (
    <>
      <Helmet>
        <title>Skillverse | Wishlist</title>
      </Helmet>

      <div className="py-8 px-4">
        {/* Header / breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-fg/70 hover:text-fg transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gradient">My Wishlist</h1>
              <p className="text-fg/70 mt-1">{items.length} courses saved</p>
            </div>
          </div>
        </motion.div>

        {/* Empty state */}
        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-red-500/50" />
            </div>
            <h2 className="text-2xl font-bold text-gradient mb-4">Your wishlist is empty</h2>
            <p className="text-fg/70 mb-8 max-w-md mx-auto">
              Start exploring our amazing courses and add them to your wishlist to save for later.
            </p>
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Browse Courses
            </Link>
          </motion.div>
        ) : (
          /* Grid of wishlist items */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="glass rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                {/* Course image + overlays */}
                <div className="relative mb-4">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />

                  {/* Badges (New / Popular) */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.isNew && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        New
                      </span>
                    )}
                    {course.isPopular && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Quick remove button (remove from wishlist) */}
                  <button
                    onClick={() => handleRemoveFromWishlist(course.id)}
                    aria-label={`Remove ${course.title} from wishlist`}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-current" />
                  </button>
                </div>

                {/* Course info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full text-xs font-semibold">{course.category}</span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold">{course.level}</span>
                  </div>

                  <h3 className="font-bold text-lg group-hover:text-gradient transition-colors">{course.title}</h3>

                  <p className="text-sm text-fg/70 line-clamp-2">{course.shortDescription?.en || course.description?.en || ""}</p>

                  {/* Small stats row */}
                  <div className="flex items-center justify-between text-sm text-fg/60">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">{course.rating ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>{(course.studentsCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{course.duration || "8h"}</span>
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="text-2xl font-bold text-gradient">${course.price}</div>

                    <div className="flex gap-2">
                      {/* View details */}
                      <Link to={`/courses/${course.slug}`} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                        View
                      </Link>

                      {/* Move to cart */}
                      <button
                        onClick={() => handleMoveToCart(course)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bulk actions (Add all to cart / Continue shopping) */}
        {items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                // 1) copy ids so we don't mutate while iterating
                const ids = items.map((c) => c.id);
                // 2) add all to cart (call addToCart for each item)
                items.forEach((course) => {
                  if (typeof addToCart === "function") addToCart(course);
                });
                // 3) remove from wishlist using the copied ids
                ids.forEach((id) => {
                  if (typeof removeFromWishlist === "function") removeFromWishlist(id);
                });
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </button>

            <Link to="/courses" className="btn-secondary inline-flex items-center gap-2">
              Continue Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </>
  );
}
