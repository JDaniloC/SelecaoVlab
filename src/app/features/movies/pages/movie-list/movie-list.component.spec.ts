import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { MovieListComponent } from './movie-list.component';
import { MovieFacade } from '../../services/movie.facade';
import { of, BehaviorSubject } from 'rxjs';
import { Movie, Genre, MovieFilters, SortBy } from '../../types/movie.type';

describe('MovieListComponent', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      overview: 'Overview 1',
      poster_path: '/test1.jpg',
      vote_average: 8.5,
      release_date: '2023-01-01',
      genres: [{ id: 1, name: 'Action' }],
      runtime: 120,
    },
    {
      id: 2,
      title: 'Test Movie 2',
      overview: 'Overview 2',
      poster_path: '/test2.jpg',
      vote_average: 7.5,
      release_date: '2023-06-15',
      genres: [{ id: 2, name: 'Comedy' }],
      runtime: 90,
    },
  ];

  const mockGenres: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
  ];

  const mockState$ = new BehaviorSubject<{
    movies: Movie[];
    genres: Genre[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    filters: MovieFilters;
    sortBy: SortBy | null;
  }>({
    movies: mockMovies,
    genres: mockGenres,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    filters: {},
    sortBy: null,
  });

  const mockFacade = {
    movies$: mockState$.asObservable(),
    loadGenres: jest.fn(),
    loadPopularMovies: jest.fn(),
    filterMovies: jest.fn(),
    sortMovies: jest.fn(),
    searchMovies: jest.fn(),
    isInMarathon: jest.fn().mockReturnValue(false),
    addToMarathon: jest.fn(),
    removeFromMarathon: jest.fn(),
    clearMarathon: jest.fn(),
  };

  beforeEach(() => {
    mockState$.next({
      movies: mockMovies,
      genres: mockGenres,
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      filters: {},
      sortBy: null,
    });
  });

  it('should create the component', async () => {
    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText('Buscar Filmes')).toBeTruthy();
  });

  it('should load genres and popular movies on init', async () => {
    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(mockFacade.loadGenres).toHaveBeenCalled();
    expect(mockFacade.loadPopularMovies).toHaveBeenCalled();
  });

  it('should display the correct number of movies found', async () => {
    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText('2 filmes encontrados')).toBeTruthy();
  });

  it('should render movie cards for each movie', async () => {
    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText('Test Movie 1')).toBeTruthy();
    expect(screen.getByText('Test Movie 2')).toBeTruthy();
  });

  it('should display loading spinner when loading', async () => {
    mockState$.next({
      movies: [],
      genres: [],
      loading: true,
      error: null,
      page: 1,
      totalPages: 1,
      filters: {},
      sortBy: null,
    });

    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText('Carregando filmes...')).toBeTruthy();
  });

  it('should display error message when there is an error', async () => {
    const errorMessage = 'Failed to load movies';
    mockState$.next({
      movies: [],
      genres: [],
      loading: false,
      error: errorMessage,
      page: 1,
      totalPages: 1,
      filters: {},
      sortBy: null,
    });

    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it('should display no results message when there are no movies and not loading', async () => {
    mockState$.next({
      movies: [],
      genres: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      filters: {},
      sortBy: null,
    });

    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(
      screen.getByText('Nenhum filme encontrado. Tente ajustar os filtros.')
    ).toBeTruthy();
  });

  it('should call filterMovies when filter changes', async () => {
    const { fixture } = await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    const component = fixture.componentInstance;
    const filters: MovieFilters = { genreId: 1, year: 2023 };

    component.onFilterChange(filters);

    expect(mockFacade.filterMovies).toHaveBeenCalledWith(filters, undefined);
    expect(component.currentFilters).toEqual(filters);
  });

  it('should call sortMovies when sort changes', async () => {
    const { fixture } = await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    const component = fixture.componentInstance;
    const sortBy: SortBy = 'vote_average.desc';

    component.onSortChange(sortBy);

    expect(mockFacade.sortMovies).toHaveBeenCalledWith(sortBy);
    expect(component.currentSort).toBe(sortBy);
  });

  it('should apply both filters and sort when both are set', async () => {
    const { fixture } = await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    const component = fixture.componentInstance;
    const filters: MovieFilters = { genreId: 28 };
    const sortBy: SortBy = 'release_date.desc';

    // First set sort
    component.onSortChange(sortBy);

    // Then apply filters
    component.onFilterChange(filters);

    expect(mockFacade.filterMovies).toHaveBeenCalledWith(filters, sortBy);
  });

  it('should display marathon section', async () => {
    await render(MovieListComponent, {
      providers: [{ provide: MovieFacade, useValue: mockFacade }],
    });

    expect(screen.getByText('🎬 Lista de Maratona')).toBeTruthy();
  });

  // TODO: Testes futuros para funcionalidade de maratona (quando implementada)
  // - should add movie to marathon when add button is clicked
  // - should remove movie from marathon when remove button is clicked
  // - should display correct number of movies in marathon
  // - should calculate and display total duration of marathon
  // - should update marathon duration when movies are added/removed
  // - should persist marathon movies in localStorage or state
  // - should display marathon movies in the marathon section
  // - should allow clearing all movies from marathon
});
