import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private http = inject(HttpClient);
  private readonly apiKey = process.env["NG_APP_API_KEY"];
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  getPopularMovies(page = 1): Observable<MovieResponse> {
    console.log(this.apiKey)
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`);
  }

  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`);
  }
}
