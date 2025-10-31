import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { MovieFilters, SortBy, Movie, MovieResponse } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  private api = inject(MovieApiService);
  private state = inject(MovieStateService);

  movies$ = this.state.movies$;

  loadPopularMovies(page = 1) {
    this.state.setLoading(true);
    this.api.getPopularMovies(page).pipe(
      switchMap((response: MovieResponse) => {
        const movies = response.results;
        const movieDetails$ = movies.map(movie => this.api.getMovieDetails(movie.id));
        return forkJoin(movieDetails$).pipe(
          tap(detailedMovies => {
            this.state.setMovies(detailedMovies);
            this.state.setPagination(response.page, response.total_pages);
            this.state.setLoading(false);
          })
        );
      }),
      catchError(err => {
        this.state.setError('Failed to load popular movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  searchMovies(query: string, page = 1) {
    this.state.setLoading(true);
    this.api.searchMovies(query, page).pipe(
      switchMap((response: MovieResponse) => {
        const movies = response.results;
        const movieDetails$ = movies.map(movie => this.api.getMovieDetails(movie.id));
        return forkJoin(movieDetails$).pipe(
          tap(detailedMovies => {
            this.state.setMovies(detailedMovies);
            this.state.setPagination(response.page, response.total_pages);
            this.state.setLoading(false);
          })
        );
      }),
      catchError(err => {
        this.state.setError('Failed to search movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  filterMovies(filters: MovieFilters, sortBy?: SortBy, page = 1) {
    this.state.setLoading(true);
    this.state.setFilters(filters);
    if (sortBy) {
      this.state.setSortBy(sortBy);
    }

    if (filters.name && filters.name.trim()) {
      this.searchMovies(filters.name, page);
      return;
    }

    this.api.discoverMovies(filters, sortBy, page).pipe(
      switchMap((response: MovieResponse) => {
        const movies = response.results;
        const movieDetails$ = movies.map(movie => this.api.getMovieDetails(movie.id));
        return forkJoin(movieDetails$).pipe(
          tap(detailedMovies => {
            this.state.setMovies(detailedMovies);
            this.state.setPagination(response.page, response.total_pages);
            this.state.setLoading(false);
          })
        );
      }),
      catchError(err => {
        this.state.setError('Failed to filter movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadGenres() {
    this.api.getGenres().pipe(
      tap(response => {
        this.state.setGenres(response.genres);
      }),
      catchError(err => {
        this.state.setError('Failed to load genres.');
        return of(null);
      })
    ).subscribe();
  }

  sortMovies(sortBy: SortBy, page = 1) {
    const currentFilters = this.state.getState().filters;
    this.filterMovies(currentFilters, sortBy, page);
  }
}
