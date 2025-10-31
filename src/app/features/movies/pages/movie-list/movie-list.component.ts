import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { MovieFiltersComponent } from '../../components/movie-filters/movie-filters.component';
import { MovieSortComponent } from '../../components/movie-sort/movie-sort.component';
import { MarathonListComponent } from '../../components/marathon-list/marathon-list.component';
import { FilmographySearchComponent } from '../../components/filmography-search/filmography-search.component';
import { MovieFilters, SortBy } from '../../types/movie.type';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, MovieCardComponent, MovieFiltersComponent, MovieSortComponent, MarathonListComponent, FilmographySearchComponent]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);

  movies$ = this.facade.movies$.pipe(
    map(state => state.movies)
  );

  genres$ = this.facade.movies$.pipe(
    map(state => state.genres)
  );

  loading$ = this.facade.movies$.pipe(
    map(state => state.loading)
  );

  error$ = this.facade.movies$.pipe(
    map(state => state.error)
  );

  selectedPerson$ = this.facade.movies$.pipe(
    map(state => state.selectedPerson)
  );

  currentFilters: MovieFilters = {};
  currentSort: SortBy | null = null;

  ngOnInit() {
    this.facade.loadGenres();
    this.facade.loadPopularMovies();
  }

  onFilterChange(filters: MovieFilters) {
    this.currentFilters = filters;
    this.facade.filterMovies(filters, this.currentSort || undefined);
  }

  onSortChange(sortBy: SortBy) {
    this.currentSort = sortBy;
    this.facade.sortMovies(sortBy);
  }

  onFilmographySearch(personName: string) {
    this.facade.searchFilmography(personName);
  }

  onFilmographyClear() {
    this.currentFilters = {};
    this.currentSort = null;
    this.facade.clearFilmography();
  }
}
