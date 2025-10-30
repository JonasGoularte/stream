'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const moviesPerPage = 10;

  // 🔁 Atualiza o termo com debounce (espera 600ms após parar de digitar)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔍 Busca filmes (com ou sem pesquisa)
  const getMovies = async () => {
    setLoading(true);
    try {
      const endpoint = debouncedSearch
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/discover/movie';

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMGYzNDEzNTk1Njk2MGQxOTUzZmU0ZGU1N2VjZWY2MCIsIm5iZiI6MTc1OTI1ODEzMS43Mjk5OTk4LCJzdWIiOiI2OGRjMjYxM2M3MGIzMmQ4NzRiYjE2MzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.I5jQ4uFw55cTicqgsjm7qIWRZpzlrJJzeZxM4yNqlPw`
        },
        params: {
          language: 'pt-BR',
          page: currentPage,
          query: debouncedSearch || undefined
        }
      });

      const filmes = response.data.results.slice(1);
      setMovies(filmes);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, [currentPage, debouncedSearch]);

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={styles.container}>
      {/* 🔍 Campo de pesquisa */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar filme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 💫 Skeleton Loader */}
      {loading ? (
        <div className={styles.skeletonContainer}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : (
        <ul className={styles.movielist}>
          {movies.map(movie => (
            <li
              key={movie.id}
              className={styles.movieItem}
              onClick={() => openModal(movie)}
            >
              <Image
                className={styles.poster}
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=Sem+Imagem'
                }
                alt={movie.title}
                width={200}
                height={300}
                unoptimized
              />
              <div className={styles.details}>
                <h2 className={styles.title}>{movie.title}</h2>
                <p className={styles.release}>{movie.release_date}</p>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal flutuante */}
      {selectedMovie && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>✕</button>
            <Image
              className={styles.modalPoster}
              src={
                selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=Sem+Imagem'
              }
              alt={selectedMovie.title}
              width={300}
              height={450}
              unoptimized
            />
            <div className={styles.modalDetails}>
              <h2>{selectedMovie.title}</h2>
              <p><strong>Lançamento:</strong> {selectedMovie.release_date}</p>
              <p><strong>Idioma original:</strong> {selectedMovie.original_language?.toUpperCase()}</p>
              <p><strong>Popularidade:</strong> {Math.round(selectedMovie.popularity)}</p>
              <p><strong>Likes:</strong> {selectedMovie.vote_count}</p>
              <p><strong>Nota média:</strong> ⭐ {selectedMovie.vote_average?.toFixed(1)}</p>
              <p className={styles.modalOverview}>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}

      {/* Paginação */}
      {!loading && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀ Anterior
          </button>

          <span className={styles.currentPage}>Página {currentPage}</span>

          <button onClick={() => setCurrentPage(p => p + 1)}>
            Próxima ▶
          </button>
        </div>
      )}
    </div>
  );
}
