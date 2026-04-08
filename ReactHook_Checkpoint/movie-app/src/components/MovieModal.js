import React from 'react';

function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  const ratingColor =
    movie.rating >= 8.5 ? '#22c55e'
    : movie.rating >= 7  ? '#f5c518'
    : '#ef4444';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <img
          src={movie.posterURL}
          alt={movie.title}
          className="modal-card__poster"
        />
        <div className="modal-card__body">
          <div className="modal-card__header">
            <h2 className="modal-card__title">{movie.title}</h2>
            <button
              className="modal-card__close"
              onClick={onClose}
              title="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="modal-card__meta">
            {movie.genre && (
              <span className="modal-card__genre">{movie.genre}</span>
            )}
            <span className="modal-card__rating" style={{ color: ratingColor }}>
              ★ {movie.rating}
            </span>
          </div>
          <p className="modal-card__desc">{movie.description}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
