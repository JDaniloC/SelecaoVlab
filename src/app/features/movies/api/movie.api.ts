import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse, Genre, MovieFilters, SortBy } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private http = inject(HttpClient);
  private readonly apiKey = process.env["NG_APP_API_KEY"];
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  getPopularMovies(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`);
  }

  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`);
  }

  discoverMovies(filters: MovieFilters, sortBy?: SortBy, page = 1): Observable<MovieResponse> {
    let params = `api_key=${this.apiKey}&page=${page}`;

    if (sortBy) {
      params += `&sort_by=${sortBy}`;
    }

    if (filters.genreId) {
      params += `&with_genres=${filters.genreId}`;
    }

    if (filters.year) {
      params += `&primary_release_year=${filters.year}`;
    }

    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie?${params}`);
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    return this.http.get<{ genres: Genre[] }>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}`);
  }
}
