import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortBy } from '../../types/movie.type';

interface SortOption {
  value: SortBy;
  label: string;
}

@Component({
  selector: 'app-movie-sort',
  templateUrl: './movie-sort.component.html',
  styleUrls: ['./movie-sort.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MovieSortComponent {
  @Output() sortChange = new EventEmitter<SortBy>();

  selectedSort: SortBy | '' = '';

  sortOptions: SortOption[] = [
    { value: 'release_date.desc', label: 'Ano (Mais Recente)' },
    { value: 'release_date.asc', label: 'Ano (Mais Antigo)' },
    { value: 'vote_average.desc', label: 'Nota (Maior)' },
    { value: 'vote_average.asc', label: 'Nota (Menor)' },
    { value: 'title.asc', label: 'Título (A-Z)' },
    { value: 'title.desc', label: 'Título (Z-A)' },
    { value: 'popularity.desc', label: 'Popularidade (Maior)' },
    { value: 'popularity.asc', label: 'Popularidade (Menor)' }
  ];

  onSortChange(value: string) {
    if (value) {
      this.sortChange.emit(value as SortBy);
    }
  }
}
