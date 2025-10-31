import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Genre, MovieFilters } from '../../types/movie.type';

@Component({
  selector: 'app-movie-filters',
  templateUrl: './movie-filters.component.html',
  styleUrls: ['./movie-filters.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MovieFiltersComponent {
  @Input() genres: Genre[] = [];
  @Output() filterChange = new EventEmitter<MovieFilters>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      genreId: [null],
      year: [null]
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        const cleanFilters: MovieFilters = {};

        if (filters.name) cleanFilters.name = filters.name;
        if (filters.genreId) cleanFilters.genreId = +filters.genreId;
        if (filters.year) cleanFilters.year = +filters.year;

        this.filterChange.emit(cleanFilters);
      });
  }

  clearFilters() {
    this.filterForm.reset();
  }
}
