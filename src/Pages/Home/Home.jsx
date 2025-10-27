import { useMemo, useState } from "react";
import Hero from "../../Components/Hero/Hero";
import Filters from "../../Components/Filters/Filters";
import CourseCard from "../../Components/Courses/CourseCard";

import {
  projectData,
  StudentsSay,
  TrendingTechnologies,
} from "../../../Data/Data";
import { motion } from "motion/react";
import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export default function Home() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  /* ========= state & filters ========= */
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    level: "",
    tag: "",
  });

  /* ========= data extraction ========= */
  const { courses, instructors, categories, levels, tags } = projectData;

  /* ========= filtered courses (useMemo) ========= */
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.includes(q));
      const matchesCategory =
        !filters.category || c.category === filters.category;
      const matchesLevel = !filters.level || c.level === filters.level;
      const matchesTag = !filters.tag || c.tags?.includes(filters.tag);
      return matchesQuery && matchesCategory && matchesLevel && matchesTag;
    });
  }, [courses, filters]);

  /* ========= instructor lookup map ========= */
  const instructorById = useMemo(
    () => new Map(instructors.map((i) => [i.id, i])),
    [instructors]
  );

  /* ========= render ========= */
  return (
    <>
      <Helmet>
        <title>Skillverse</title>
      </Helmet>
      {/*      ========= Hero ========= */}
      <Hero />
      {/*      ========= Home Content ========= */}

      <div className="px-4">
        {/* ========= Marquee: Trending Technologies ========= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="mt-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">
              {t("trending.title")}
            </h2>
            <p className="text-fg/70 mt-2">{t("trending.subtitle")}</p>
          </div>

          <Marquee speed={50} direction="left" className="flex">
            {TrendingTechnologies.map((tech, index) => (
              <div key={index} className="py-4 mx-4">
                <div className="glass shadow rounded-2xl px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {tech[0]}
                      </span>
                    </div>
                    <span className="font-semibold text-fg">{tech}</span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </motion.section>

        {/* ========= Filters component ========= */}
        <Filters
          query={filters.query}
          onChange={setFilters}
          categories={categories}
          levels={levels}
          tags={tags}
          selected={filters}
        />

        {/* ========= Courses grid ========= */}
        <section
          id="courses"
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructor={instructorById.get(course.instructorId)}
            />
          ))}
        </section>

        {/* ========= Features ========= */}
        <motion.section
          id="features"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              title: t("features.expert.title"),
              desc: t("features.expert.desc"),
            },
            {
              title: t("features.practical.title"),
              desc: t("features.practical.desc"),
            },
            {
              title: t("features.lifetime.title"),
              desc: t("features.lifetime.desc"),
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-6 border border-white/10"
            >
              <div className="text-2xl">🔥</div>
              <div className="mt-2 font-semibold">{f.title}</div>
              <div className="mt-1 opacity-80 text-sm">{f.desc}</div>
            </div>
          ))}
        </motion.section>

        {/* ========= Categories ========= */}
        <motion.section
          id="categories"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14"
        >
          <h2 className="text-xl font-bold">{t("sections.categories")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {projectData.categories.map((c) => (
              <span key={c} className="badge badge-soft">
                {c}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ========= Top Instructors ========= */}
        <motion.section
          id="instructors"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14"
        >
          <h2 className="text-xl font-bold">{t("sections.instructors")}</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {projectData.instructors.map((i) => (
              <div
                key={i.id}
                className="glass shadow rounded-2xl p-4 text-center border border-white/10"
              >
                <img
                  src={i.avatar}
                  alt={i.name}
                  className="w-16 h-16 object-contain rounded-full mx-auto"
                />
                <div className="mt-2 font-medium">{i.name}</div>
                <div className="text-xs opacity-70">{i.bio}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ========= Student testimonials marquee ========= */}
        <section className="mt-14">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">
              {t("sections.testimonialsTitle")}
            </h2>
            <p className="text-fg/70 mt-2">
              {t("sections.testimonialsSubtitle")}
            </p>
          </div>

          <Marquee speed={50} direction={"left"} className="py-4">
            {StudentsSay.map((testimonial, index) => (
              <div key={index} direction="left" className="py-4 px-4">
                <div className="glass shadow rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 min-w-[300px]">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-fg/90 text-sm mb-3">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <span className="font-semibold text-sm">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </section>

        {/* ========= FAQ ========= */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 mb-16"
        >
          <h2 className="text-xl font-bold">{t("sections.faq")}</h2>
          <div className="mt-4 space-y-3">
            {projectData.faqs.map((f) => {
              // attempt to show question/answer in current locale, fallback to .en
              const q =
                (f.question &&
                  (f.question[locale] || f.question.en || f.question)) ||
                "";
              const a =
                (f.answer && (f.answer[locale] || f.answer.en || f.answer)) ||
                "";
              return (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl border border-white/10 glass"
                >
                  <div className="font-medium">{q}</div>
                  <div className="text-sm opacity-80 mt-1">{a}</div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </>
  );
}
