import React, { useState } from 'react';
import MovieList from './components/MovieList';
import Filter from './components/Filter';
import AddMovieForm from './components/AddMovieForm';
import MovieModal from './components/MovieModal';
import './App.css';

const initialMovies = [
  /* ── Sci-Fi ──────────────────────────────────────────────── */
  {
    title: "Inception",
    genre: "Sci-Fi",
    description: "A thief who infiltrates dreams must plant an idea in a CEO's mind to reclaim his life.",
    posterURL: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    rating: 8.8,
  },
  {
    title: "Interstellar",
    genre: "Sci-Fi",
    description: "A group of astronauts travel through a wormhole to ensure humanity's survival.",
    posterURL: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    rating: 8.6,
  },
  {
    title: "The Matrix",
    genre: "Sci-Fi",
    description: "A programmer discovers that reality as he knows it is a computer simulation.",
    posterURL: "https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg",
    rating: 8.7,
  },
  {
    title: "Blade Runner 2049",
    genre: "Sci-Fi",
    description: "A blade runner uncovers a long-buried secret that could plunge society into chaos.",
    posterURL: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    rating: 8.0,
  },
  {
    title: "Arrival",
    genre: "Sci-Fi",
    description: "A linguist is recruited to communicate with aliens who have landed on Earth.",
    posterURL: "https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg",
    rating: 7.9,
  },
  {
    title: "Dune",
    genre: "Sci-Fi",
    description: "A young man born with an incredible destiny must travel to the most dangerous planet in the universe.",
    posterURL: "https://image.tmdb.org/t/p/w500/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg",
    rating: 8.0,
  },
  {
    title: "Ex Machina",
    genre: "Sci-Fi",
    description: "A programmer is selected to evaluate the capabilities of a female AI endowed with consciousness.",
    posterURL: "https://image.tmdb.org/t/p/w500/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg",
    rating: 7.7,
  },
  {
    title: "The Martian",
    genre: "Sci-Fi",
    description: "An astronaut is stranded alone on Mars and must survive while waiting for rescue.",
    posterURL: "https://image.tmdb.org/t/p/w500/fASz8A0yFE3QB6LgGoOfwvFSseV.jpg",
    rating: 8.0,
  },

  /* ── Action ──────────────────────────────────────────────── */
  {
    title: "The Dark Knight",
    genre: "Action",
    description: "Batman faces the Joker, a criminal who wants to plunge Gotham City into anarchy.",
    posterURL: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
  },
  {
    title: "Mad Max: Fury Road",
    genre: "Action",
    description: "In a post-apocalyptic desert, Max allies with Furiosa to flee a bloodthirsty tyrant.",
    posterURL: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    rating: 8.1,
  },
  {
    title: "John Wick",
    genre: "Action",
    description: "A retired hitman picks up his weapons again after the murder of his dog, a gift from his late wife.",
    posterURL: "https://image.tmdb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg",
    rating: 7.4,
  },
  {
    title: "Top Gun: Maverick",
    genre: "Action",
    description: "Maverick is back to train a new generation of pilots for a near-impossible mission.",
    posterURL: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    rating: 8.3,
  },
  {
    title: "Mission: Impossible — Fallout",
    genre: "Action",
    description: "Ethan Hunt and his team must prevent a global nuclear catastrophe.",
    posterURL: "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    rating: 7.7,
  },

  /* ── Drama ───────────────────────────────────────────────── */
  {
    title: "The Shawshank Redemption",
    genre: "Drama",
    description: "An innocent banker survives in a brutal prison thanks to an extraordinary friendship.",
    posterURL: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    rating: 9.3,
  },
  {
    title: "Forrest Gump",
    genre: "Drama",
    description: "The extraordinary story of an ordinary man from Alabama living through the major events of the 20th century.",
    posterURL: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    rating: 8.8,
  },
  {
    title: "The Godfather",
    genre: "Drama",
    description: "The aging patriarch of an organized crime family transfers control of his empire to his reluctant son.",
    posterURL: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    rating: 9.2,
  },
  {
    title: "Schindler's List",
    genre: "Drama",
    description: "The true story of Oskar Schindler, who saved more than 1,000 Jewish lives during the Holocaust.",
    posterURL: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    rating: 9.0,
  },
  {
    title: "Parasite",
    genre: "Drama",
    description: "A poor family gradually infiltrates the lives of a wealthy Seoul household with unexpected consequences.",
    posterURL: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    rating: 8.5,
  },

  /* ── Thriller ────────────────────────────────────────────── */
  {
    title: "The Silence of the Lambs",
    genre: "Thriller",
    description: "An FBI trainee must seek the help of imprisoned cannibal Dr. Hannibal Lecter to catch a serial killer.",
    posterURL: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    rating: 8.6,
  },
  {
    title: "Se7en",
    genre: "Thriller",
    description: "Two detectives hunt a serial killer who uses the seven deadly sins as the motive for each murder.",
    posterURL: "https://image.tmdb.org/t/p/w500/uAR0AWqhQL1hQa69UDEbb2rE5Wx.jpg",
    rating: 8.6,
  },
  {
    title: "Get Out",
    genre: "Thriller",
    description: "A young Black man visits his girlfriend's white family and uncovers a terrifying secret.",
    posterURL: "https://image.tmdb.org/t/p/w500/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg",
    rating: 7.7,
  },
  {
    title: "Gone Girl",
    genre: "Thriller",
    description: "The mysterious disappearance of a woman on her wedding anniversary casts suspicion on her husband.",
    posterURL: "https://image.tmdb.org/t/p/w500/ts996lKsxvjkO2yiYG0ht4qAicO.jpg",
    rating: 8.1,
  },
  {
    title: "Knives Out",
    genre: "Thriller",
    description: "The death of a wealthy family patriarch leads to a twisting murder investigation.",
    posterURL: "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    rating: 7.9,
  },

  /* ── Crime ───────────────────────────────────────────────── */
  {
    title: "Pulp Fiction",
    genre: "Crime",
    description: "Intertwined stories of criminals, gangsters, and shady individuals across Los Angeles.",
    posterURL: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    rating: 8.9,
  },
  {
    title: "Goodfellas",
    genre: "Crime",
    description: "The rise and fall of a New York mob gangster across three decades of crime.",
    posterURL: "https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg",
    rating: 8.7,
  },
  {
    title: "The Departed",
    genre: "Crime",
    description: "An undercover cop in the mob and a mobster in the police race to unmask each other.",
    posterURL: "https://image.tmdb.org/t/p/w500/tldtDfLnPFOtTWp758EmIP2Hbz5.jpg",
    rating: 8.5,
  },
  {
    title: "Heat",
    genre: "Crime",
    description: "An obsessive detective faces off against a master thief in the streets of Los Angeles.",
    posterURL: "https://image.tmdb.org/t/p/w500/umSVjVdbVwtx5ryCA2QXL44Durm.jpg",
    rating: 8.3,
  },

  /* ── Horror ──────────────────────────────────────────────── */
  {
    title: "Hereditary",
    genre: "Horror",
    description: "After the death of their grandmother, a family unravels terrifying secrets and supernatural forces.",
    posterURL: "https://image.tmdb.org/t/p/w500/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg",
    rating: 7.3,
  },
  {
    title: "A Quiet Place",
    genre: "Horror",
    description: "A family must live in near-complete silence to survive creatures that hunt by sound.",
    posterURL: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    rating: 7.5,
  },
  {
    title: "The Conjuring",
    genre: "Horror",
    description: "Paranormal investigators are called to help a family terrorized by a dark presence in their farmhouse.",
    posterURL: "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    rating: 7.5,
  },

  /* ── Comedy ──────────────────────────────────────────────── */
  {
    title: "The Grand Budapest Hotel",
    genre: "Comedy",
    description: "The adventures of a legendary concierge and his protégé at a famous European hotel between the two World Wars.",
    posterURL: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    rating: 8.1,
  },
  {
    title: "Superbad",
    genre: "Comedy",
    description: "Two awkward high schoolers try to score alcohol for a party and end up having the most chaotic night of their lives.",
    posterURL: "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
    rating: 7.6,
  },
  {
    title: "Game Night",
    genre: "Comedy",
    description: "A friends' game night spirals out of control when a real kidnapping gets mixed up with their murder mystery game.",
    posterURL: "https://image.tmdb.org/t/p/w500/85R8LMyn9f2Lev2YPBF8Nughrkv.jpg",
    rating: 7.0,
  },

  /* ── Animation ───────────────────────────────────────────── */
  {
    title: "Spirited Away",
    genre: "Animation",
    description: "A young girl becomes trapped in a fantastical spirit world and must find a way to free herself and her parents.",
    posterURL: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    rating: 8.6,
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    genre: "Animation",
    description: "Miles Morales becomes Spider-Man and teams up with multiple Spider-People from parallel dimensions.",
    posterURL: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    rating: 8.4,
  },
  {
    title: "Up",
    genre: "Animation",
    description: "An elderly widower fulfills his dream by tying thousands of balloons to his house and flying to South America.",
    posterURL: "https://image.tmdb.org/t/p/w500/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
    rating: 8.3,
  },
  {
    title: "WALL-E",
    genre: "Animation",
    description: "A lonely waste-collecting robot falls in love with a sleek probe and embarks on an interstellar adventure.",
    posterURL: "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    rating: 8.4,
  },

  /* ── Romance ─────────────────────────────────────────────── */
  {
    title: "La La Land",
    genre: "Romance",
    description: "A jazz pianist and an aspiring actress fall in love in Los Angeles while chasing their individual dreams.",
    posterURL: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    rating: 8.0,
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    genre: "Romance",
    description: "A man undergoes a procedure to erase all memories of his ex-girlfriend, only to rediscover why he loved her.",
    posterURL: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    rating: 8.3,
  },

  /* ── Fantasy ─────────────────────────────────────────────── */
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: "Fantasy",
    description: "A young hobbit sets out on a perilous quest to destroy the One Ring with a fellowship of heroes.",
    posterURL: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    rating: 8.8,
  },
  {
    title: "Avatar",
    genre: "Fantasy",
    description: "A paralyzed marine inhabits a Na'vi avatar on the moon Pandora and must choose between two worlds.",
    posterURL: "https://image.tmdb.org/t/p/w500/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg",
    rating: 7.9,
  },
];

const ALL_GENRES = [...new Set(initialMovies.map((m) => m.genre))].sort();

function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleAddMovie(newMovie) {
    setMovies([...movies, newMovie]);
  }

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

      <MovieList movies={filteredMovies} onMovieClick={setSelectedMovie} />

      <AddMovieForm
        onAdd={handleAddMovie}
        genres={ALL_GENRES}
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
      />

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default App;
