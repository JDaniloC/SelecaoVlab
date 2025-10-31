import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MovieFacade } from './movie.facade';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { Movie, MovieResponse } from '../types/movie.type';

describe('MovieFacade', () => {
  let facade: MovieFacade;
  let apiService: jest.Mocked<MovieApiService>;
  let stateService: jest.Mocked<MovieStateService>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test Overview',
    poster_path: '/test.jpg',
    vote_average: 8.5,
    release_date: '2023-01-01',
    genres: [{ id: 1, name: 'Action' }],
  };

  const mockMovieResponse: MovieResponse = {
    results: [mockMovie],
    page: 1,
    total_pages: 10,
    total_results: 200,
  };

  beforeEach(() => {
    const apiServiceMock = {
      getPopularMovies: jest.fn(),
      searchMovies: jest.fn(),
      discoverMovies: jest.fn(),
      getGenres: jest.fn(),
      getMovieDetails: jest.fn(),
    };

    const stateServiceMock = {
      setMovies: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setPagination: jest.fn(),
      setFilters: jest.fn(),
      setSortBy: jest.fn(),
      setGenres: jest.fn(),
      addToMarathon: jest.fn(),
      removeFromMarathon: jest.fn(),
      clearMarathon: jest.fn(),
      getState: jest.fn().mockReturnValue({ 
        filters: {},
        marathonMovies: []
      }),
      movies$: of({
        movies: [],
        genres: [],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        filters: {},
        sortBy: null,
        marathonMovies: []
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        MovieFacade,
        { provide: MovieApiService, useValue: apiServiceMock },
        { provide: MovieStateService, useValue: stateServiceMock },
      ],
    });

    facade = TestBed.inject(MovieFacade);
    apiService = TestBed.inject(MovieApiService) as jest.Mocked<MovieApiService>;
    stateService = TestBed.inject(MovieStateService) as jest.Mocked<MovieStateService>;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('loadPopularMovies', () => {
    it('should load popular movies successfully', (done) => {
      apiService.getPopularMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.loadPopularMovies();

      setTimeout(() => {
        expect(stateService.setLoading).toHaveBeenCalledWith(true);
        expect(apiService.getPopularMovies).toHaveBeenCalledWith(1);
        expect(apiService.getMovieDetails).toHaveBeenCalledWith(1);
        expect(stateService.setMovies).toHaveBeenCalledWith([mockMovie]);
        expect(stateService.setPagination).toHaveBeenCalledWith(1, 10);
        expect(stateService.setLoading).toHaveBeenCalledWith(false);
        done();
      }, 100);
    });

    it('should handle errors when loading movies', (done) => {
      const error = new Error('API Error');
      apiService.getPopularMovies.mockReturnValue(throwError(() => error));

      facade.loadPopularMovies();

      setTimeout(() => {
        expect(stateService.setError).toHaveBeenCalledWith('Failed to load popular movies.');
        expect(stateService.setLoading).toHaveBeenCalledWith(false);
        done();
      }, 100);
    });

    it('should load movies for specific page', (done) => {
      apiService.getPopularMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.loadPopularMovies(2);

      setTimeout(() => {
        expect(apiService.getPopularMovies).toHaveBeenCalledWith(2);
        done();
      }, 100);
    });
  });

  describe('searchMovies', () => {
    it('should search movies successfully', (done) => {
      const query = 'Inception';
      apiService.searchMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.searchMovies(query);

      setTimeout(() => {
        expect(stateService.setLoading).toHaveBeenCalledWith(true);
        expect(apiService.searchMovies).toHaveBeenCalledWith(query, 1);
        expect(stateService.setMovies).toHaveBeenCalledWith([mockMovie]);
        expect(stateService.setLoading).toHaveBeenCalledWith(false);
        done();
      }, 100);
    });

    it('should handle search errors', (done) => {
      const error = new Error('Search Error');
      apiService.searchMovies.mockReturnValue(throwError(() => error));

      facade.searchMovies('test');

      setTimeout(() => {
        expect(stateService.setError).toHaveBeenCalledWith('Failed to search movies.');
        expect(stateService.setLoading).toHaveBeenCalledWith(false);
        done();
      }, 100);
    });
  });

  describe('loadGenres', () => {
    it('should load genres successfully', (done) => {
      const mockGenres = { genres: [{ id: 1, name: 'Action' }] };
      apiService.getGenres.mockReturnValue(of(mockGenres));

      facade.loadGenres();

      setTimeout(() => {
        expect(apiService.getGenres).toHaveBeenCalled();
        expect(stateService.setGenres).toHaveBeenCalledWith(mockGenres.genres);
        done();
      }, 100);
    });

    it('should handle genre loading errors', (done) => {
      const error = new Error('Genre Error');
      apiService.getGenres.mockReturnValue(throwError(() => error));

      facade.loadGenres();

      setTimeout(() => {
        expect(stateService.setError).toHaveBeenCalledWith('Failed to load genres.');
        done();
      }, 100);
    });
  });

  describe('filterMovies', () => {
    it('should filter movies by genre', (done) => {
      const filters = { genreId: 28 };
      apiService.discoverMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.filterMovies(filters);

      setTimeout(() => {
        expect(stateService.setFilters).toHaveBeenCalledWith(filters);
        expect(apiService.discoverMovies).toHaveBeenCalledWith(filters, undefined, 1);
        done();
      }, 100);
    });

    it('should search by name if name filter is provided', (done) => {
      const filters = { name: 'Matrix' };
      apiService.searchMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.filterMovies(filters);

      setTimeout(() => {
        expect(apiService.searchMovies).toHaveBeenCalledWith('Matrix', 1);
        done();
      }, 100);
    });

    it('should apply sort when provided', (done) => {
      const filters = { genreId: 28 };
      const sortBy = 'vote_average.desc' as const;
      apiService.discoverMovies.mockReturnValue(of(mockMovieResponse));
      apiService.getMovieDetails.mockReturnValue(of(mockMovie));

      facade.filterMovies(filters, sortBy);

      setTimeout(() => {
        expect(stateService.setSortBy).toHaveBeenCalledWith(sortBy);
        expect(apiService.discoverMovies).toHaveBeenCalledWith(filters, sortBy, 1);
        done();
      }, 100);
    });
  });

  describe('Marathon functionality', () => {
    it('should add movie to marathon', () => {
      facade.addToMarathon(mockMovie);
      expect(stateService.addToMarathon).toHaveBeenCalledWith(mockMovie);
    });

    it('should remove movie from marathon', () => {
      facade.removeFromMarathon(1);
      expect(stateService.removeFromMarathon).toHaveBeenCalledWith(1);
    });

    it('should clear marathon', () => {
      facade.clearMarathon();
      expect(stateService.clearMarathon).toHaveBeenCalled();
    });

    it('should check if movie is in marathon', () => {
      stateService.getState = jest.fn().mockReturnValue({
        marathonMovies: [mockMovie]
      });

      const result = facade.isInMarathon(1);
      expect(result).toBe(true);
    });

    it('should return false if movie is not in marathon', () => {
      stateService.getState = jest.fn().mockReturnValue({
        marathonMovies: []
      });

      const result = facade.isInMarathon(1);
      expect(result).toBe(false);
    });
  });
});
