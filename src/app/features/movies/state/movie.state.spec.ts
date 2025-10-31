import { MovieStateService, MovieState } from './movie.state';
import { Movie, Genre } from '../types/movie.type';

describe('MovieStateService', () => {
  let service: MovieStateService;

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test Overview',
    poster_path: '/test.jpg',
    vote_average: 8.5,
    release_date: '2023-01-01',
    genres: [{ id: 1, name: 'Action' }],
  };

  const mockGenre: Genre = {
    id: 1,
    name: 'Action',
  };

  beforeEach(() => {
    service = new MovieStateService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    const state = service.getState();
    expect(state.movies).toEqual([]);
    expect(state.genres).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.page).toBe(1);
    expect(state.totalPages).toBe(1);
    expect(state.filters).toEqual({});
    expect(state.sortBy).toBeNull();
  });

  it('should set movies', (done) => {
    const movies = [mockMovie];
    
    service.movies$.subscribe((state) => {
      if (state.movies.length > 0) {
        expect(state.movies).toEqual(movies);
        done();
      }
    });

    service.setMovies(movies);
  });

  it('should set genres', () => {
    const genres = [mockGenre];
    service.setGenres(genres);
    
    const state = service.getState();
    expect(state.genres).toEqual(genres);
  });

  it('should set loading state', () => {
    service.setLoading(true);
    expect(service.getState().loading).toBe(true);

    service.setLoading(false);
    expect(service.getState().loading).toBe(false);
  });

  it('should set error message', () => {
    const errorMessage = 'Test error';
    service.setError(errorMessage);
    
    expect(service.getState().error).toBe(errorMessage);
  });

  it('should clear error message', () => {
    service.setError('Test error');
    service.setError(null);
    
    expect(service.getState().error).toBeNull();
  });

  it('should set pagination', () => {
    const page = 2;
    const totalPages = 10;
    
    service.setPagination(page, totalPages);
    
    const state = service.getState();
    expect(state.page).toBe(page);
    expect(state.totalPages).toBe(totalPages);
  });

  it('should set filters', () => {
    const filters = { genreId: 28, year: 2023 };
    
    service.setFilters(filters);
    
    expect(service.getState().filters).toEqual(filters);
  });

  it('should set sort by', () => {
    const sortBy = 'vote_average.desc' as const;
    
    service.setSortBy(sortBy);
    
    expect(service.getState().sortBy).toBe(sortBy);
  });

  it('should update state partially', () => {
    service.setState({ loading: true, error: 'Test error' });
    
    const state = service.getState();
    expect(state.loading).toBe(true);
    expect(state.error).toBe('Test error');
    expect(state.movies).toEqual([]); // Other state should remain unchanged
  });

  it('should emit state changes through observable', (done) => {
    let emissionCount = 0;
    
    service.movies$.subscribe(() => {
      emissionCount++;
      if (emissionCount === 2) {
        // First emission is initial state, second is after setMovies
        done();
      }
    });

    service.setMovies([mockMovie]);
  });
});
