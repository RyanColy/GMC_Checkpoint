import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import MovieList from './components/MovieList';
import Filter from './components/Filter';
import AddMovieForm from './components/AddMovieForm';
import MovieDetail from './pages/MovieDetail';
import initialMovies from './data/movies';
import './App.css';

const ALL_GENRES = [...new Set(initialMovies.map((m) => m.genre))].sort();

function HomePage({ movies, onAddMovie }) {
  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  let filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesRating = ratingFilter === '' || movie.rating >= parseFloat(ratingFilter);
    const matchesGenre = genreFilter === '' || movie.genre === genreFilter;
    return matchesTitle && matchesRating && matchesGenre;
  });

  if (sortFilter === 'az') {
    filteredMovies = [...filteredMovies].sort((a, b) => a.title.localeCompare(b.title));
  }

  const genres = [...new Set(movies.map((m) => m.genre))].sort();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__logo">🎬</div>
        <h1>CineVault</h1>
        <p className="app-header__subtitle">Your personal collection of great movies</p>
        <button className="app-header__cta" onClick={() => setIsFormOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add a movie
        </button>
      </header>

      <Filter
        titleFilter={titleFilter}
        ratingFilter={ratingFilter}
        genreFilter={genreFilter}
        sortFilter={sortFilter}
        onTitleChange={setTitleFilter}
        onRatingChange={setRatingFilter}
        onGenreChange={setGenreFilter}
        onSortChange={setSortFilter}
        genres={genres}
      />

      <p className="movie-count">
        <span className="movie-count__num">{filteredMovies.length}</span> movie{filteredMovies.length !== 1 ? 's' : ''} out of{' '}
        <span className="movie-count__num">{movies.length}</span>
      </p>

      <MovieList movies={filteredMovies} />

      <AddMovieForm
        onAdd={onAddMovie}
        genres={ALL_GENRES}
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
      />
    </div>
  );
}

function App() {
  const [movies, setMovies] = useLocalStorage('movies', initialMovies);

  function handleAddMovie(newMovie) {
    setMovies([...movies, newMovie]);
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage movies={movies} onAddMovie={handleAddMovie} />} />
      <Route path="/movie/:title" element={<MovieDetail movies={movies} />} />
    </Routes>
  );
}

export default App;
