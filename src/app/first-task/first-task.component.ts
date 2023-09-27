import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../hero-interface';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-first-task',
  templateUrl: './first-task.component.html',
  styleUrls: ['./first-task.component.scss'],
})
export class FirstTaskComponent implements OnInit {
  search = new FormControl();
  displayArray: Observable<Hero[]> | undefined;

  heroesArr: Hero[] = [
    {
      name: 'Uchiha Madara',
      id: 1,
    },
    {
      name: 'Uchiha Obito',
      id: 2,
    },
    {
      name: 'Naroto Uzumaki',
      id: 3,
    },
    {
      name: 'Sasuke Uchiha',
      id: 4,
    },
    {
      name: 'Hashirama Senju',
      id: 5,
    },
    {
      name: 'Shikamaru',
      id: 6,
    },
  ];

  observableArray = [
    this.search.valueChanges.pipe(debounceTime(500), distinctUntilChanged()),
    of(this.heroesArr),
  ];

  constructor() {}
  ngOnInit() {
    this.displayArray = combineLatest(this.observableArray).pipe(
      map(([text, array]) => {
        if (text) {
          return array.filter((hero: Hero) =>
            hero.name.toLowerCase().trim().includes(text.toLowerCase().trim())
          );
        }
      })
    );
  }
}
