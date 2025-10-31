import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { MovieCardComponent } from './movie-card.component';
import { Movie } from '../../types/movie.type';
import { MovieStateService } from '../../state/movie.state';
import { of } from 'rxjs';

describe('MovieCardComponent', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'This is a test movie overview',
    poster_path: '/test-poster.jpg',
    vote_average: 8.5,
    release_date: '2023-01-01',
    genres: [{ id: 1, name: 'Action' }],
  };

  const mockStateService = {
    movies$: of([]),
    getState: jest.fn(),
    setState: jest.fn(),
    setMovies: jest.fn(),
    setGenres: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setPagination: jest.fn(),
    setFilters: jest.fn(),
    setSortBy: jest.fn(),
  };

  it('should create', async () => {
    await render(MovieCardComponent, {
      componentInputs: { movie: mockMovie },
      providers: [
        { provide: MovieStateService, useValue: mockStateService }
      ],
    });

    expect(screen.getByText('Test Movie')).toBeTruthy();
  });

  it('should display movie information correctly', async () => {
    await render(MovieCardComponent, {
      componentInputs: { movie: mockMovie },
      providers: [
        { provide: MovieStateService, useValue: mockStateService }
      ],
    });

    expect(screen.getByText('Test Movie')).toBeTruthy();
    const ratingElement = screen.getByText(/8.5/);
    expect(ratingElement).toBeTruthy();
  });

  it('should display poster image with correct URL', async () => {
    const { fixture } = await render(MovieCardComponent, {
      componentInputs: { movie: mockMovie },
      providers: [
        { provide: MovieStateService, useValue: mockStateService }
      ],
    });

    const component = fixture.componentInstance;
    const posterUrl = component.getPosterUrl(mockMovie.poster_path);
    expect(posterUrl).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');
  });

  it('should display fallback image when poster_path is null', async () => {
    const { fixture } = await render(MovieCardComponent, {
      componentInputs: { movie: mockMovie },
      providers: [
        { provide: MovieStateService, useValue: mockStateService }
      ],
    });

    const component = fixture.componentInstance;
    const posterUrl = component.getPosterUrl('');
    expect(posterUrl).toContain('placeholder');
  });

  it('should have movie input property', async () => {
    const { fixture } = await render(MovieCardComponent, {
      componentInputs: { movie: mockMovie },
      providers: [
        { provide: MovieStateService, useValue: mockStateService }
      ],
    });

    const component = fixture.componentInstance;
    expect(component.movie).toEqual(mockMovie);
  });
});
