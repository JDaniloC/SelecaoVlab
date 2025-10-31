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

  ngOnInit() {
  }

  getPosterUrl(posterPath: string): string {
    if (!posterPath) {
      return 'https://via.placeholder.com/200x300.png?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }
}
