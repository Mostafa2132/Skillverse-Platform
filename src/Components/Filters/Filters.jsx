import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Filters({ query, onChange, categories, levels, tags, selected }) {
  // Initialize the translation hook
  const { t } = useTranslation()

  // Helper function to update a specific filter
  const update = (key, value) => {
    onChange({ ...selected, [key]: value })
  }

  return (
    // Filters section wrapper with glassmorphism styling
    <section id="filters" className="mt-8 glass shadow border border-white/10 rounded-3xl p-4">
      <div className="flex flex-col gap-4">
        
        {/* Search + Dropdown Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          {/* Search Input Field */}
          <div className="flex shadow items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-white/70 dark:bg-black/40">
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
            </svg>
            {/* Search Input Field */}
            <input
              type="search"
              value={query}
              onChange={(e) => onChange({ ...selected, query: e.target.value })}
              placeholder={t('filters.search')}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selected.category || ''}
            onChange={(e) => update('category', e.target.value)}
            className="px-3 py-2 shadow rounded-2xl border border-white/10 bg-white/70 dark:bg-black/40"
          >
            <option value="">{t('filters.category')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Level Dropdown */}
          <select
            value={selected.level || ''}
            onChange={(e) => update('level', e.target.value)}
            className="px-3 py-2 shadow rounded-2xl border border-white/10 bg-white/70 dark:bg-black/40"
          >
            <option value="">{t('filters.level')}</option>
            {levels.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Tags Dropdown */}
          <select
            value={selected.tag || ''}
            onChange={(e) => update('tag', e.target.value)}
            className="px-3 py-2 shadow rounded-2xl border border-white/10 bg-white/70 dark:bg-black/40"
          >
            <option value="">{t('filters.tags')}</option>
            {tags.map((tTag) => (
              <option key={tTag} value={tTag}>{tTag}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={() => onChange({ query: '', category: '', level: '', tag: '' })}
            className="btn-secondary shadow rounded-2xl"
          >
            {t('filters.clear')}
          </button>
        </div>
      </div>
    </section>
  )
}
