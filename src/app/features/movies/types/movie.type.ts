export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity?: number;
  runtime?: number;
  genre_ids?: number[];
  genres: Genre[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieFilters {
  name?: string;
  genreId?: number;
  year?: number;
}

export type SortBy =
  | 'release_date.asc'
  | 'release_date.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'title.asc'
  | 'title.desc'
  | 'popularity.asc'
  | 'popularity.desc';

export interface Person {
  id: number;
  name: string;
  known_for_department?: string;
  profile_path?: string | null;
}

export interface PersonSearchResponse {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  release_date?: string;
  popularity?: number;
  poster_path?: string | null;
  character?: string;
  job?: string;
}

export interface PersonMovieCreditsResponse {
  cast: PersonMovieCredit[];
  crew: PersonMovieCredit[];
}
