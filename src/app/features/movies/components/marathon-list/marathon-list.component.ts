import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieFacade } from '../../services/movie.facade';
import { Movie } from '../../types/movie.type';

@Component({
  selector: 'app-marathon-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marathon-list.component.html',
  styleUrls: ['./marathon-list.component.scss']
})
export class MarathonListComponent {
  private facade = inject(MovieFacade);

  marathonMovies$ = this.facade.marathonMovies$;
  marathonDuration$ = this.facade.marathonDuration$;

  showSaveDialog = false;
  marathonName = '';
  saveError = '';
  saveSuccess = '';

  removeFromMarathon(movieId: number) {
    this.facade.removeFromMarathon(movieId);
  }

  clearMarathon() {
    if (confirm('Deseja limpar toda a lista de maratona?')) {
      this.facade.clearMarathon();
    }
  }

  openSaveDialog() {
    this.showSaveDialog = true;
    this.marathonName = '';
    this.saveError = '';
    this.saveSuccess = '';
  }

  closeSaveDialog() {
    this.showSaveDialog = false;
    this.marathonName = '';
    this.saveError = '';
    this.saveSuccess = '';
  }

  saveMarathon() {
    if (!this.marathonName.trim()) {
      this.saveError = 'Por favor, insira um nome para a maratona.';
      return;
    }

    try {
      this.facade.saveMarathon(this.marathonName.trim());
      this.saveSuccess = 'Maratona salva com sucesso!';
      setTimeout(() => {
        this.closeSaveDialog();
      }, 1500);
    } catch (error) {
      this.saveError = error instanceof Error ? error.message : 'Erro ao salvar maratona.';
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
