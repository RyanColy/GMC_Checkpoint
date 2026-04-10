import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const { title, description, posterURL, rating, genre } = movie;
  const [imgError, setImgError] = useState(false);

  const ratingColor =
    rating >= 8.5 ? '#22c55e'
    : rating >= 7  ? '#f5c518'
    : '#ef4444';

  return (
    <Link to={`/movie/${encodeURIComponent(title)}`} className="movie-card">
      <div className="movie-card__poster-wrapper">
        {imgError ? (
          <div className="movie-card__poster-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="40" height="40" opacity="0.25">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{title}</span>
          </div>
        ) : (
          <img
            src={posterURL}
            alt={title}
            className="movie-card__poster"
            onError={() => setImgError(true)}
          />
        )}

        <div className="movie-card__overlay">
          <p className="movie-card__overlay-desc">{description}</p>
        </div>

        {genre && (
          <span className="movie-card__genre-badge">{genre}</span>
        )}

        <span className="movie-card__rating-badge" style={{ color: ratingColor }}>
          ★ {rating}
        </span>
      </div>

      <div className="movie-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
