import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieFacade } from '../../services/movie.facade';
import { Movie } from '../../types/movie.type';

@Component({
  selector: 'app-marathon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marathon-list.component.html',
  styleUrls: ['./marathon-list.component.scss']
})
export class MarathonListComponent {
  private facade = inject(MovieFacade);

  marathonMovies$ = this.facade.marathonMovies$;
  marathonDuration$ = this.facade.marathonDuration$;

  removeFromMarathon(movieId: number) {
    this.facade.removeFromMarathon(movieId);
  }

  clearMarathon() {
    if (confirm('Deseja limpar toda a lista de maratona?')) {
      this.facade.clearMarathon();
    }
  }

  getImageUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w200${posterPath}`;
  }

  formatRuntime(runtime?: number): string {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }
}
