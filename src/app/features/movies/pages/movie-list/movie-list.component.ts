import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CarouselComponent, CarouselItem } from '@shared/components/carousel/carousel.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, MovieCardComponent, ReactiveFormsModule, CarouselComponent]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);
  searchControl = new FormControl('');

  popularMovies: CarouselItem[] = [];
  topRatedMovies: CarouselItem[] = [];
  upcomingMovies: CarouselItem[] = [];
  nowPlayingMovies: CarouselItem[] = [];

  ngOnInit() {
    this.loadMovieCategories();

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.facade.searchMovies(query);
      } else {
        this.facade.loadPopularMovies();
      }
    });
  }

  private loadMovieCategories() {
    // Load popular movies
    this.facade.loadPopularMovies();

    // For demo purposes, we'll use the same data for different categories
    // In a real app, you'd have separate API calls for each category
    this.facade.movies$.subscribe(state => {
      if (state.movies.length > 0) {
        const movies = state.movies.map(movie => ({
          id: movie.id,
          title: movie.title,
          imgSrc: movie.poster_path,
          link: `/movie/${movie.id}`,
          rating: (movie.vote_average / 10) * 100, // Convert to percentage for star rating
          vote: movie.vote_average
        }));

        this.popularMovies = movies;
        this.topRatedMovies = movies.slice(0, 10);
        this.upcomingMovies = movies.slice(10, 20);
        this.nowPlayingMovies = movies.slice(20, 30);
      }
    });
  }
}
