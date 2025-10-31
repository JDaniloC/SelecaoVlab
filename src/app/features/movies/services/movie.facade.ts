import { Injectable, inject } from '@angular/core';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { MarathonStorageService } from './marathon-storage.service';
import { tap, catchError, switchMap, map, finalize } from 'rxjs/operators';
import { of, forkJoin, Observable } from 'rxjs';
import { MovieFilters, SortBy, Movie, MovieResponse, PersonMovieCredit, PersonMovieCreditsResponse, SavedMarathon } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieFacade {
  private api = inject(MovieApiService);
  private state = inject(MovieStateService);
  private marathonStorage = inject(MarathonStorageService);
  private readonly MAX_FILMOGRAPHY_RESULTS = 20;

  movies$ = this.state.movies$;

  marathonMovies$ = this.state.movies$.pipe(
    map(state => state.marathonMovies)
  );

  marathonDuration$ = this.state.movies$.pipe(
    map(() => this.state.getMarathonDuration())
  );

  loadPopularMovies(page = 1) {
    this.state.setLoading(true);
    this.state.setSelectedPerson(null);
    this.state.setError(null);
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
    this.state.setSelectedPerson(null);
    this.state.setError(null);
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

  searchFilmography(personName: string) {
    const trimmedName = personName.trim();
    if (!trimmedName) {
      return;
    }

    this.state.setLoading(true);
    this.state.setFilters({});
    this.state.setSortBy(null);
  this.state.setError(null);

    this.api.searchPerson(trimmedName).pipe(
      switchMap(searchResponse => {
        const person = searchResponse.results?.[0];

        if (!person) {
          this.state.setSelectedPerson(null);
          this.state.setMovies([]);
          this.state.setPagination(1, 1);
          this.state.setError('Nenhum profissional encontrado para o nome informado.');
          return of(null);
        }

        return this.api.getPersonMovieCredits(person.id).pipe(
          switchMap(credits => {
            const uniqueCredits = this.mergePersonCredits(credits);

            if (!uniqueCredits.length) {
              this.state.setSelectedPerson(person);
              this.state.setMovies([]);
              this.state.setPagination(1, 1);
              this.state.setError(`Nenhum filme encontrado para ${person.name}.`);
              return of(null);
            }

            const limitedCredits: PersonMovieCredit[] = uniqueCredits.slice(0, this.MAX_FILMOGRAPHY_RESULTS);
            const movieDetails$: Observable<Movie>[] = limitedCredits.map((credit: PersonMovieCredit) => this.api.getMovieDetails(credit.id));

            return forkJoin(movieDetails$).pipe(
              tap((detailedMovies: Movie[]) => {
                this.state.setSelectedPerson(person);
                this.state.setMovies(detailedMovies);
                this.state.setPagination(1, 1);
                this.state.setError(null);
              })
            );
          })
        );
      }),
      catchError(() => {
        this.state.setSelectedPerson(null);
        this.state.setError('Não foi possível carregar a filmografia.');
        return of(null);
      }),
      finalize(() => {
        this.state.setLoading(false);
      })
    ).subscribe();
  }

  filterMovies(filters: MovieFilters, sortBy?: SortBy, page = 1) {
    this.state.setLoading(true);
    this.state.setSelectedPerson(null);
    this.state.setError(null);
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

  clearFilmography() {
    this.state.setSelectedPerson(null);
    this.state.setFilters({});
    this.state.setSortBy(null);
    this.state.setError(null);
    this.loadPopularMovies();
  }

  addToMarathon(movie: Movie) {
    this.state.addToMarathon(movie);
  }

  removeFromMarathon(movieId: number) {
    this.state.removeFromMarathon(movieId);
  }

  clearMarathon() {
    this.state.clearMarathon();
  }

  isInMarathon(movieId: number): boolean {
    return this.state.getState().marathonMovies.some(m => m.id === movieId);
  }

  saveMarathon(name: string): SavedMarathon {
    const currentMovies = this.state.getState().marathonMovies;
    if (currentMovies.length === 0) {
      throw new Error('Cannot save an empty marathon');
    }
    return this.marathonStorage.saveMarathon(name, currentMovies);
  }

  getSavedMarathons(): SavedMarathon[] {
    return this.marathonStorage.getSavedMarathons();
  }

  loadMarathon(marathon: SavedMarathon): void {
    this.state.setState({ marathonMovies: marathon.movies });
  }

  deleteMarathon(id: string): void {
    this.marathonStorage.deleteMarathon(id);
  }

  private mergePersonCredits(credits: PersonMovieCreditsResponse): PersonMovieCredit[] {
    const combined = new Map<number, PersonMovieCredit>();

    const upsertCredit = (credit: PersonMovieCredit) => {
      if (!credit || !credit.id) {
        return;
      }

      const existing = combined.get(credit.id);
      if (existing) {
        combined.set(credit.id, {
          ...existing,
          popularity: Math.max(existing.popularity ?? 0, credit.popularity ?? 0),
          release_date: existing.release_date || credit.release_date,
          poster_path: existing.poster_path ?? credit.poster_path,
        });
      } else {
        combined.set(credit.id, credit);
      }
    };

    (credits.cast || []).forEach(upsertCredit);
    (credits.crew || []).forEach(upsertCredit);

    return Array.from(combined.values()).sort((a, b) => {
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      const popularityA = a.popularity ?? 0;
      const popularityB = b.popularity ?? 0;

      return popularityB - popularityA;
    });
  }
}
