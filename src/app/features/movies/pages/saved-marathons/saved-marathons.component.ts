import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieFacade } from '../../services/movie.facade';
import { SavedMarathon } from '../../types/movie.type';

@Component({
  selector: 'app-saved-marathons',
  imports: [CommonModule],
  templateUrl: './saved-marathons.component.html',
  styleUrl: './saved-marathons.component.scss'
})
export class SavedMarathonsComponent implements OnInit {
  private facade = inject(MovieFacade);
  private router = inject(Router);

  savedMarathons: SavedMarathon[] = [];

  ngOnInit() {
    this.loadSavedMarathons();
  }

  loadSavedMarathons() {
    this.savedMarathons = this.facade.getSavedMarathons();
  }

  loadMarathon(marathon: SavedMarathon) {
    if (confirm(`Deseja carregar "${marathon.name}"? Isso substituirá sua lista atual.`)) {
      this.facade.loadMarathon(marathon);
      this.router.navigate(['/movies']);
    }
  }

  deleteMarathon(marathon: SavedMarathon, event: Event) {
    event.stopPropagation();
    if (confirm(`Deseja excluir "${marathon.name}"? Esta ação não pode ser desfeita.`)) {
      this.facade.deleteMarathon(marathon.id);
      this.loadSavedMarathons();
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  }

  goBack() {
    this.router.navigate(['/movies']);
  }
}
