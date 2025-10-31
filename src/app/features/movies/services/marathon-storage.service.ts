import { Injectable } from '@angular/core';
import { SavedMarathon, Movie } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MarathonStorageService {
  private readonly STORAGE_KEY = 'saved_marathons';

  saveMarathon(name: string, movies: Movie[]): SavedMarathon {
    const marathons = this.getSavedMarathons();
    
    const totalDuration = movies.reduce((sum, movie) => sum + (movie.runtime || 0), 0);
    
    const newMarathon: SavedMarathon = {
      id: this.generateId(),
      name,
      movies,
      createdAt: new Date(),
      totalDuration
    };
    
    marathons.push(newMarathon);
    this.saveToLocalStorage(marathons);
    
    return newMarathon;
  }

  getSavedMarathons(): SavedMarathon[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      
      const marathons = JSON.parse(data);
      // Convert date strings back to Date objects
      return marathons.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
    } catch (error) {
      console.error('Error loading saved marathons:', error);
      return [];
    }
  }

  deleteMarathon(id: string): void {
    const marathons = this.getSavedMarathons();
    const filtered = marathons.filter(m => m.id !== id);
    this.saveToLocalStorage(filtered);
  }

  private saveToLocalStorage(marathons: SavedMarathon[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(marathons));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save marathon. Storage might be full.');
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
