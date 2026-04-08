import React from 'react';

const RATING_OPTIONS = [
  { label: 'All', value: '' },
  { label: '6+', value: '6' },
  { label: '7+', value: '7' },
  { label: '8+', value: '8' },
  { label: '9+', value: '9' },
];

function Filter({ titleFilter, ratingFilter, genreFilter, sortFilter, onTitleChange, onRatingChange, onGenreChange, onSortChange, genres }) {
  return (
    <div className="filter">

      {/* ── Search bar ── */}
      <div className="filter__search-wrap">
        <svg className="filter__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="filter__search-input"
          type="text"
          placeholder="Search a movie..."
          value={titleFilter}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        {titleFilter && (
          <button className="filter__clear-btn" onClick={() => onTitleChange('')} title="Clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div className="filter__bottom">

        {/* Genres */}
        <div className="filter__genres">
          <button
            className={`filter__chip ${genreFilter === '' ? 'filter__chip--active' : ''}`}
            onClick={() => onGenreChange('')}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              className={`filter__chip ${genreFilter === g ? 'filter__chip--active' : ''}`}
              onClick={() => onGenreChange(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sort A-Z */}
        <div className="filter__rating-wrap">
          <span className="filter__rating-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="9" y2="18" />
            </svg>
            Sort
          </span>
          <div className="filter__rating-pills">
            <button
              className={`filter__pill ${sortFilter === '' ? 'filter__pill--active' : ''}`}
              onClick={() => onSortChange('')}
            >
              Default
            </button>
            <button
              className={`filter__pill ${sortFilter === 'az' ? 'filter__pill--active' : ''}`}
              onClick={() => onSortChange('az')}
            >
              A–Z
            </button>
          </div>
        </div>

        {/* Minimum rating */}
        <div className="filter__rating-wrap">
          <span className="filter__rating-label">
            <svg viewBox="0 0 24 24" fill="#f5c518" width="14" height="14">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            Min rating
          </span>
          <div className="filter__rating-pills">
            {RATING_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                className={`filter__pill ${ratingFilter === value ? 'filter__pill--active' : ''}`}
                onClick={() => onRatingChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Filter;
