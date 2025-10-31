import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieApiService } from './movie.api';
import { MovieResponse, Genre, MovieFilters } from '../types/movie.type';

describe('MovieApiService', () => {
  let service: MovieApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieApiService]
    });
    service = TestBed.inject(MovieApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies', () => {
      const dummyResponse: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0
      };

      service.getPopularMovies().subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(req => req.url.includes('/movie/popular'));
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });

    it('should fetch popular movies with specific page', () => {
      const mockResponse: MovieResponse = {
        page: 2,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      service.getPopularMovies(2).subscribe((response) => {
        expect(response.page).toBe(2);
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('page=2')
      );
      req.flush(mockResponse);
    });
  });

  describe('searchMovies', () => {
    it('should search movies', () => {
      const dummyResponse: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0
      };
      const query = 'Inception';

      service.searchMovies(query).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(req => req.url.includes('/search/movie') && req.url.includes(`query=${query}`));
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });

    it('should search movies with pagination', () => {
      const query = 'Matrix';
      const page = 3;

      service.searchMovies(query, page).subscribe();

      const req = httpMock.expectOne((request) =>
        request.url.includes('query=Matrix') && request.url.includes('page=3')
      );
      req.flush({ page, results: [], total_pages: 5, total_results: 100 });
    });
  });

  describe('searchPerson', () => {
    it('should search for a person by name', () => {
      const query = 'Christopher Nolan';
      const dummyResponse = {
        page: 1,
        results: [{ id: 525, name: 'Christopher Nolan' }],
        total_pages: 1,
        total_results: 1,
      };

      service.searchPerson(query).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('/search/person') && request.url.includes('query=Christopher')
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });

    it('should search person with pagination', () => {
      const query = 'Tom Hanks';
      const page = 2;

      service.searchPerson(query, page).subscribe();

      const req = httpMock.expectOne((request) =>
        request.url.includes('query=Tom') && request.url.includes('page=2')
      );
      req.flush({ page, results: [], total_pages: 3, total_results: 60 });
    });
  });

  describe('discoverMovies', () => {
    it('should discover movies with filters', () => {
      const filters: MovieFilters = {
        genreId: 28,
        year: 2023,
      };

      service.discoverMovies(filters).subscribe();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/discover/movie') &&
        request.url.includes('with_genres=28') &&
        request.url.includes('primary_release_year=2023')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
    });

    it('should discover movies with sort option', () => {
      const filters: MovieFilters = {};
      const sortBy = 'vote_average.desc';

      service.discoverMovies(filters, sortBy).subscribe();

      const req = httpMock.expectOne((request) =>
        request.url.includes('sort_by=vote_average.desc')
      );
      req.flush({ page: 1, results: [], total_pages: 1, total_results: 0 });
    });
  });

  describe('getGenres', () => {
    it('should fetch movie genres', () => {
      const mockGenres: Genre[] = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ];

      service.getGenres().subscribe((response) => {
        expect(response.genres).toEqual(mockGenres);
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('/genre/movie/list')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ genres: mockGenres });
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details by id', () => {
      const movieId = 550;
      const mockMovie = {
        id: movieId,
        title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac...',
        poster_path: '/path.jpg',
        vote_average: 8.4,
        release_date: '1999-10-15',
        genres: [{ id: 18, name: 'Drama' }],
      };

      service.getMovieDetails(movieId).subscribe((movie) => {
        expect(movie.id).toBe(movieId);
        expect(movie.title).toBe('Fight Club');
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`/movie/${movieId}`)
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockMovie);
    });
  });

  describe('getPersonMovieCredits', () => {
    it('should fetch movie credits for a person', () => {
      const personId = 31;
      const mockCredits = {
        cast: [{ id: 1, title: 'Movie Cast' }],
        crew: [{ id: 2, title: 'Movie Crew' }],
      };

      service.getPersonMovieCredits(personId).subscribe((response) => {
        expect(response).toEqual(mockCredits);
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`/person/${personId}/movie_credits`)
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockCredits);
    });
  });
});
