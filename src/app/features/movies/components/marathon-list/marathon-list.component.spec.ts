import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarathonListComponent } from './marathon-list.component';
import { MovieFacade } from '../../services/movie.facade';
import { of } from 'rxjs';

describe('MarathonListComponent', () => {
  let component: MarathonListComponent;
  let fixture: ComponentFixture<MarathonListComponent>;
  let mockFacade: jest.Mocked<MovieFacade>;

  beforeEach(async () => {
    mockFacade = {
      marathonMovies$: of([]),
      marathonDuration$: of({ hours: 0, minutes: 0 }),
      removeFromMarathon: jest.fn(),
      clearMarathon: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [MarathonListComponent],
      providers: [
        { provide: MovieFacade, useValue: mockFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarathonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when no movies', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });

  it('should call removeFromMarathon when remove button is clicked', () => {
    component.removeFromMarathon(123);
    expect(mockFacade.removeFromMarathon).toHaveBeenCalledWith(123);
  });

  it('should format runtime correctly', () => {
    expect(component.formatRuntime(120)).toBe('2h 0min');
    expect(component.formatRuntime(95)).toBe('1h 35min');
    expect(component.formatRuntime(45)).toBe('45min');
    expect(component.formatRuntime(undefined)).toBe('N/A');
  });

  it('should get correct image URL', () => {
    const posterPath = '/test.jpg';
    expect(component.getImageUrl(posterPath)).toBe('https://image.tmdb.org/t/p/w200/test.jpg');
  });
});
