import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer SEU_TOKEN_AQUI`
  }
});

export const getMovies = (page: number, language = 'pt-BR') =>
  api.get('/discover/movie', { params: { page, language } });
