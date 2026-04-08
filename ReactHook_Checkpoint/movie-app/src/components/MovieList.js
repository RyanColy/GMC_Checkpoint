import React from 'react';
import MovieCard from './MovieCard';

function MovieList({ movies, onMovieClick }) {
  if (movies.length === 0) {
    return <p className="no-results">No movies found.</p>;
  }

  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <MovieCard key={index} movie={movie} onClick={() => onMovieClick(movie)} />
      ))}
    </div>
  );
}

export default MovieList;
