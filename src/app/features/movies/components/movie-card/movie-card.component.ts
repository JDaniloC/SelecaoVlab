import { Component, Input, OnInit, inject } from '@angular/core';
import { Movie, Genre } from '../../types/movie.type';
import { CommonModule } from '@angular/common';
import { MovieStateService } from '../../state/movie.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: Movie;

  private state = inject(MovieStateService);
  genres: Genre[] = [];

  ngOnInit() {
    this.state.movies$.pipe(
      map(state => state.genres)
    ).subscribe(genres => {
      this.genres = genres;
    });
  }

  getPosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  getMovieGenres(): string {
    if (!this.movie.genre_ids || this.movie.genre_ids.length === 0 || this.genres.length === 0) {
      return 'Sem gênero';
    }

    const genreNames = this.movie.genre_ids
      .map(id => this.genres.find(g => g.id === id)?.name)
      .filter(name => name !== undefined)
      .slice(0, 3); // Mostrar no máximo 3 gêneros

    return genreNames.join(', ') || 'Sem gênero';
  }
}
