// Courses.jsx
// This page displays all available courses with filters for category, level, tags, and search query.
// It uses local mock data (projectData) and memoized filtering for performance.

import React, { useMemo, useState } from 'react'
import Filters from '../../Components/Filters/Filters'        // Reusable filter component (search, dropdowns, etc.)
import CourseCard from '../../Components/Courses/CourseCard'  // Component that displays each course card
import { projectData } from '../../../Data/Data'              // Local mock data (courses, instructors, etc.)
import { Helmet } from 'react-helmet'                         // For setting the page title and metadata dynamically

export default function Courses() {
  /* ----------------------------------------------
     Local state to hold filter selections:
     - query: search text
     - category: selected category
     - level: selected course difficulty
     - tag: selected tag (like 'React', 'UI', etc.)
  ---------------------------------------------- */
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    level: '',
    tag: ''
  })

  // Destructure the data from projectData
  const { courses, instructors, categories, levels, tags } = projectData

  /* ----------------------------------------------
     Filter logic:
     - Runs only when `filters` or `courses` change.
     - Filters courses based on the selected filters.
     - All matching conditions must be true.
  ---------------------------------------------- */
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()

    return courses.filter((c) => {
      // Match search query in title or tags
      const matchesQuery =
        !q || c.title.toLowerCase().includes(q) || c.tags?.some((t) => t.includes(q))

      // Match category, level, and tag if selected
      const matchesCategory = !filters.category || c.category === filters.category
      const matchesLevel = !filters.level || c.level === filters.level
      const matchesTag = !filters.tag || c.tags?.includes(filters.tag)

      // Return only if all selected filters match
      return matchesQuery && matchesCategory && matchesLevel && matchesTag
    })
  }, [courses, filters])

  /* ----------------------------------------------
     Map instructors by ID for quick access:
     - Converts instructor array → Map(id → instructor)
     - So we can easily get the instructor for each course.
  ---------------------------------------------- */
  const instructorById = useMemo(
    () => new Map(instructors.map((i) => [i.id, i])),
    [instructors]
  )

  /* ----------------------------------------------
     Render section:
     - Helmet → Sets the browser tab title.
     - Filters → Displays the filter UI.
     - Course grid → Displays filtered courses as cards.
  ---------------------------------------------- */
  return (
    <>
      <Helmet>
        <title>Skillverse | All Courses</title>
      </Helmet>

      <div className="py-8 px-4">
        <h1 className="text-2xl font-bold">All Courses</h1>

        {/* Filter component (handles search, dropdowns, etc.) */}
        <Filters
          query={filters.query}
          onChange={setFilters}
          categories={categories}
          levels={levels}
          tags={tags}
          selected={filters}
        />

        {/* Display the filtered courses in a responsive grid */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructor={instructorById.get(course.instructorId)}
            />
          ))}
        </section>
      </div>
    </>
  )
}
