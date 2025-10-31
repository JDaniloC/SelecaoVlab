import { TestBed } from '@angular/core/testing';
import { MarathonStorageService } from './marathon-storage.service';
import { Movie } from '../types/movie.type';

describe('MarathonStorageService', () => {
  let service: MarathonStorageService;
  let localStorageSpy: { getItem: jest.Mock; setItem: jest.Mock; clear: jest.Mock };

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/test1.jpg',
      overview: 'Test overview 1',
      release_date: '2024-01-01',
      vote_average: 8.5,
      runtime: 120,
      genres: []
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/test2.jpg',
      overview: 'Test overview 2',
      release_date: '2024-02-01',
      vote_average: 7.5,
      runtime: 90,
      genres: []
    }
  ];

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(MarathonStorageService);
  });

  afterEach(() => {
    localStorageSpy.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveMarathon', () => {
    it('should save a marathon to localStorage', () => {
      const marathonName = 'Test Marathon';
      localStorageSpy.getItem.mockReturnValue(null);

      const savedMarathon = service.saveMarathon(marathonName, mockMovies);

      expect(savedMarathon.name).toBe(marathonName);
      expect(savedMarathon.movies).toEqual(mockMovies);
      expect(savedMarathon.totalDuration).toBe(210); // 120 + 90
      expect(savedMarathon.id).toBeDefined();
      expect(savedMarathon.createdAt).toBeInstanceOf(Date);
      expect(localStorageSpy.setItem).toHaveBeenCalled();
    });

    it('should append to existing marathons', () => {
      const existingMarathon = {
        id: 'existing-id',
        name: 'Existing Marathon',
        movies: mockMovies,
        createdAt: new Date(),
        totalDuration: 210
      };
      
      localStorageSpy.getItem.mockReturnValue(JSON.stringify([existingMarathon]));

      const newMarathon = service.saveMarathon('New Marathon', mockMovies);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'saved_marathons',
        expect.stringContaining('New Marathon')
      );
    });
  });

  describe('getSavedMarathons', () => {
    it('should return empty array when no marathons are saved', () => {
      localStorageSpy.getItem.mockReturnValue(null);

      const marathons = service.getSavedMarathons();

      expect(marathons).toEqual([]);
    });

    it('should return saved marathons', () => {
      const marathon = {
        id: 'test-id',
        name: 'Test Marathon',
        movies: mockMovies,
        createdAt: new Date().toISOString(),
        totalDuration: 210
      };

      localStorageSpy.getItem.mockReturnValue(JSON.stringify([marathon]));

      const marathons = service.getSavedMarathons();

      expect(marathons).toHaveLength(1);
      expect(marathons[0].name).toBe('Test Marathon');
      expect(marathons[0].createdAt).toBeInstanceOf(Date);
    });

    it('should handle corrupted localStorage data', () => {
      localStorageSpy.getItem.mockReturnValue('invalid json');

      const marathons = service.getSavedMarathons();

      expect(marathons).toEqual([]);
    });
  });

  describe('deleteMarathon', () => {
    it('should delete a marathon by id', () => {
      const marathon1 = {
        id: 'id-1',
        name: 'Marathon 1',
        movies: mockMovies,
        createdAt: new Date().toISOString(),
        totalDuration: 210
      };
      const marathon2 = {
        id: 'id-2',
        name: 'Marathon 2',
        movies: mockMovies,
        createdAt: new Date().toISOString(),
        totalDuration: 210
      };

      localStorageSpy.getItem.mockReturnValue(JSON.stringify([marathon1, marathon2]));

      service.deleteMarathon('id-1');

      const savedData = JSON.parse(localStorageSpy.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('id-2');
    });
  });
});
