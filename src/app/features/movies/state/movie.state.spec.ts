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

  describe('Marathon functionality', () => {
    const mockMovie1: Movie = {
      id: 1,
      title: 'Movie 1',
      overview: 'Overview 1',
      poster_path: '/test1.jpg',
      vote_average: 8.5,
      release_date: '2023-01-01',
      runtime: 120,
      genres: [{ id: 1, name: 'Action' }],
    };

    const mockMovie2: Movie = {
      id: 2,
      title: 'Movie 2',
      overview: 'Overview 2',
      poster_path: '/test2.jpg',
      vote_average: 7.5,
      release_date: '2023-02-01',
      runtime: 95,
      genres: [{ id: 2, name: 'Comedy' }],
    };

    it('should initialize with empty marathon list', () => {
      const state = service.getState();
      expect(state.marathonMovies).toEqual([]);
    });

    it('should add movie to marathon', () => {
      service.addToMarathon(mockMovie1);
      
      const state = service.getState();
      expect(state.marathonMovies).toHaveLength(1);
      expect(state.marathonMovies[0]).toEqual(mockMovie1);
    });

    it('should not add duplicate movies to marathon', () => {
      service.addToMarathon(mockMovie1);
      service.addToMarathon(mockMovie1);
      
      const state = service.getState();
      expect(state.marathonMovies).toHaveLength(1);
    });

    it('should add multiple different movies to marathon', () => {
      service.addToMarathon(mockMovie1);
      service.addToMarathon(mockMovie2);
      
      const state = service.getState();
      expect(state.marathonMovies).toHaveLength(2);
      expect(state.marathonMovies[0]).toEqual(mockMovie1);
      expect(state.marathonMovies[1]).toEqual(mockMovie2);
    });

    it('should remove movie from marathon', () => {
      service.addToMarathon(mockMovie1);
      service.addToMarathon(mockMovie2);
      service.removeFromMarathon(mockMovie1.id);
      
      const state = service.getState();
      expect(state.marathonMovies).toHaveLength(1);
      expect(state.marathonMovies[0]).toEqual(mockMovie2);
    });

    it('should handle removing non-existent movie', () => {
      service.addToMarathon(mockMovie1);
      service.removeFromMarathon(999);
      
      const state = service.getState();
      expect(state.marathonMovies).toHaveLength(1);
      expect(state.marathonMovies[0]).toEqual(mockMovie1);
    });

    it('should clear all movies from marathon', () => {
      service.addToMarathon(mockMovie1);
      service.addToMarathon(mockMovie2);
      service.clearMarathon();
      
      const state = service.getState();
      expect(state.marathonMovies).toEqual([]);
    });

    it('should calculate marathon duration correctly', () => {
      service.addToMarathon(mockMovie1); // 120 minutes
      service.addToMarathon(mockMovie2); // 95 minutes
      
      const duration = service.getMarathonDuration();
      expect(duration.hours).toBe(3); // 215 minutes = 3 hours
      expect(duration.minutes).toBe(35); // 35 remaining minutes
    });

    it('should return zero duration for empty marathon', () => {
      const duration = service.getMarathonDuration();
      expect(duration.hours).toBe(0);
      expect(duration.minutes).toBe(0);
    });

    it('should handle movies without runtime', () => {
      const movieWithoutRuntime: Movie = {
        ...mockMovie1,
        runtime: undefined
      };
      
      service.addToMarathon(movieWithoutRuntime);
      const duration = service.getMarathonDuration();
      
      expect(duration.hours).toBe(0);
      expect(duration.minutes).toBe(0);
    });

    it('should calculate duration correctly with mixed runtime values', () => {
      const movieWithoutRuntime: Movie = {
        ...mockMovie1,
        runtime: undefined
      };
      
      service.addToMarathon(movieWithoutRuntime);
      service.addToMarathon(mockMovie2); // 95 minutes
      
      const duration = service.getMarathonDuration();
      expect(duration.hours).toBe(1);
      expect(duration.minutes).toBe(35);
    });
  });
});
