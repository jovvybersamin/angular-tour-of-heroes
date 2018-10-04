import { MessageService } from './../message.service';
import { HeroService } from './../hero.service';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private messageService: MessageService) {
    console.log('constructor!');
  }

  async ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void{
    this.messageService.add('HeroesComponent: Requesting to fetch heroes.');
    // using rxjs
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);

    // using async and await =D
    // await this.heroService.getHeroesAsync().then(heroes => this.heroes = heroes);
    this.messageService.add(`HeroesComponent: Heroes are fetched. Total of ${this.heroes.length}`);
  }

  add(name: string): void {
    this.heroService.addHero( {name: name} as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}






