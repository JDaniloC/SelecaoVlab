import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { SavedMarathonsComponent } from './pages/saved-marathons/saved-marathons.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: '',
    component: MovieListComponent
  },
  {
    path: 'saved-marathons',
    component: SavedMarathonsComponent
  }
];
