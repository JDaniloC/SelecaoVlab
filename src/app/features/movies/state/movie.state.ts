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
  marathonMovies: Movie[];
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
  marathonMovies: [],
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

  addToMarathon(movie: Movie) {
    const currentMarathon = this.getState().marathonMovies;
    if (!currentMarathon.find(m => m.id === movie.id)) {
      this.setState({ marathonMovies: [...currentMarathon, movie] });
    }
  }

  removeFromMarathon(movieId: number) {
    const currentMarathon = this.getState().marathonMovies;
    this.setState({
      marathonMovies: currentMarathon.filter(m => m.id !== movieId)
    });
  }

  clearMarathon() {
    this.setState({ marathonMovies: [] });
  }

  getMarathonDuration(): { hours: number; minutes: number } {
    const totalMinutes = this.getState().marathonMovies.reduce(
      (sum, movie) => sum + (movie.runtime || 0),
      0
    );
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }
}
