import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { sleep } from './../helpers';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api.

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap( _ => this.log(`fetched hero id=${id}`)),
      catchError(this.handlerError<Hero>(`getHero id=${id}`))
    );
  }

  getHeroes(): Observable<Hero[]> {
    this.log('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(heroes => this.log('fetched heroes')),
          catchError(this.handlerError('getHeroes', []))
        );
  }

  addHero(hero: Hero): Observable<Hero> {
      return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
        .pipe(
          tap((hero: Hero) => this.log(`added new hero name=${hero.name}`)),
          catchError(this.handlerError<Hero>('addHero'))
        );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handlerError<any>('updateHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handlerError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return an empty array.
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching '${term}'`)),
      catchError(this.handlerError<Hero[]>('searchHeroes', []))
    );
  }

  async getHeroesAsync(): Promise<Hero[]> {
    await sleep(2000);
   // return HEROES;
    return null;
  }

  private handlerError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);
        this.log(`${operation} failed: ${error.message}`);
        return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(message);
  }
}
