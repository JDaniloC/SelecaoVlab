import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filmography-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filmography-search.component.html',
  styleUrls: ['./filmography-search.component.scss']
})
export class FilmographySearchComponent {
  private _loading = false;
  @Input() selectedPersonName: string | null = null;

  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  readonly searchControl = new FormControl<string>('');

  @Input()
  set loading(value: boolean) {
    this._loading = value;
    if (value) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  get loading(): boolean {
    return this._loading;
  }

  onSubmit() {
    if (this.loading) {
      return;
    }

    const value = this.searchControl.value?.trim();
    if (!value) {
      return;
    }

    this.search.emit(value);
  }

  onClear() {
    if (this.loading) {
      return;
    }

    this.searchControl.setValue('', { emitEvent: false });
    this.clear.emit();
  }
}
