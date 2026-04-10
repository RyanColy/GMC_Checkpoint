import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetail({ movies }) {
  const { title } = useParams();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const movie = movies.find(
    (m) => m.title === decodeURIComponent(title)
  );

  if (!movie) {
    return (
      <div className="detail-not-found">
        <p>Movie not found.</p>
        <button className="detail-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const ratingColor =
    movie.rating >= 8.5 ? '#22c55e'
    : movie.rating >= 7  ? '#f5c518'
    : '#ef4444';

  return (
    <div className="detail-page">
      <button className="detail-back-btn" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="detail-card">
        <div className="detail-card__left">
          {imgError ? (
            <div className="detail-card__poster-fallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="48" height="48" opacity="0.25">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          ) : (
            <img
              src={movie.posterURL}
              alt={movie.title}
              className="detail-card__poster"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className="detail-card__right">
          <div className="detail-card__meta">
            {movie.genre && (
              <span className="detail-card__genre">{movie.genre}</span>
            )}
            <span className="detail-card__rating" style={{ color: ratingColor }}>
              ★ {movie.rating}
            </span>
          </div>

          <h1 className="detail-card__title">{movie.title}</h1>
          <p className="detail-card__desc">{movie.description}</p>
        </div>
      </div>

      <div className="detail-trailer">
        <h2 className="detail-trailer__heading">Trailer</h2>
        <div className="detail-trailer__wrapper">
          <iframe
            src={movie.trailerLink}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="detail-trailer__iframe"
          />
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
