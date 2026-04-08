import React, { useState } from 'react';

function AddMovieForm({ onAdd, genres, isOpen, setIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterURL, setPosterURL] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [posterPreview, setPosterPreview] = useState('');

  function handlePosterChange(e) {
    const url = e.target.value;
    setPosterURL(url);
    setPosterPreview(url);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !posterURL || !rating || !genre) {
      setError('All fields are required.');
      return;
    }
    const r = parseFloat(rating);
    if (isNaN(r) || r < 0 || r > 10) {
      setError('Rating must be between 0 and 10.');
      return;
    }
    setError('');
    onAdd({ title, description, posterURL, rating: r, genre });

    setTitle('');
    setDescription('');
    setPosterURL('');
    setPosterPreview('');
    setRating('');
    setGenre('');

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
    }, 2000);
  }

  function handleCancel() {
    setIsOpen(false);
    setError('');
    setSuccess(false);
  }

  return (
    <>
      {/* ── Toggle button at the bottom of the list ── */}
      <section className="amf-section">
        {!isOpen && (
          <button className="amf-toggle-btn" onClick={() => setIsOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add a movie
          </button>
        )}
      </section>

      {/* ── Popup modal ── */}
      {isOpen && (
        <div className="amf-backdrop" onClick={handleCancel}>
          <div className="amf-card" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="amf-card__header">
              <div>
                <h2 className="amf-card__title">New movie</h2>
                <p className="amf-card__subtitle">Fill in the information below</p>
              </div>
              <button className="amf-card__close" onClick={handleCancel} title="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="amf-card__body">
              <div className="amf-layout">

                {/* Poster preview */}
                <div className="amf-preview">
                  {posterPreview ? (
                    <img src={posterPreview} alt="Poster preview" className="amf-preview__img" onError={() => setPosterPreview('')} />
                  ) : (
                    <div className="amf-preview__placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36" opacity="0.3">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Poster preview</span>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <form className="amf-fields" onSubmit={handleSubmit}>

                  <div className="amf-row">
                    <div className="amf-field">
                      <label className="amf-label">Title</label>
                      <input
                        className="amf-input"
                        type="text"
                        placeholder="e.g. Inception"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="amf-field">
                      <label className="amf-label">Genre</label>
                      <select
                        className="amf-input amf-select"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                      >
                        <option value="">Choose a genre</option>
                        {genres.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="amf-row">
                    <div className="amf-field amf-field--grow">
                      <label className="amf-label">Poster URL</label>
                      <input
                        className="amf-input"
                        type="text"
                        placeholder="https://..."
                        value={posterURL}
                        onChange={handlePosterChange}
                      />
                    </div>
                    <div className="amf-field amf-field--small">
                      <label className="amf-label">Rating (0–10)</label>
                      <input
                        className="amf-input"
                        type="number"
                        placeholder="8.5"
                        min="0"
                        max="10"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="amf-field">
                    <label className="amf-label">Description</label>
                    <textarea
                      className="amf-input amf-textarea"
                      placeholder="Brief description of the movie..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="amf-error">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="amf-success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Movie added successfully!
                    </div>
                  )}

                  <div className="amf-actions">
                    <button type="button" className="amf-btn amf-btn--ghost" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="amf-btn amf-btn--primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add movie
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default AddMovieForm;
