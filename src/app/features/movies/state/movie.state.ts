import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie, Genre, MovieFilters, SortBy } from '../types/movie.type';

export interface MovieState {
  movies: Movie[];
  genres: Genre[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filters: MovieFilters;
  sortBy: SortBy | null;
  _internal?: unknown;
}

const initialState: MovieState = {
  movies: [],
  genres: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  filters: {},
  sortBy: null,
  _internal: undefined
};

@Injectable({
  providedIn: 'root'
})
export class MovieStateService {
  private readonly state = new BehaviorSubject<MovieState>(initialState);

  readonly movies$ = this.state.asObservable();

  getState() {
    return this.state.getValue();
  }

  setState(newState: Partial<MovieState>) {
    this.state.next({ ...this.getState(), ...newState });
  }

  setMovies(movies: Movie[]) {
    this.setState({ movies });
  }

  setGenres(genres: Genre[]) {
    this.setState({ genres });
  }

  setLoading(loading: boolean) {
    this.setState({ loading });
  }

  setError(error: string | null) {
    this.setState({ error });
  }

  setPagination(page: number, totalPages: number) {
    this.setState({ page, totalPages });
  }

  setFilters(filters: MovieFilters) {
    this.setState({ filters });
  }

  setSortBy(sortBy: SortBy | null) {
    this.setState({ sortBy });
  }
}
