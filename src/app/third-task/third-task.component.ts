import { Component, OnInit } from '@angular/core';
import { Persons, Jobs } from './data';
import {
  bufferTime,
  filter,
  from,
  map,
  mergeMap,
  of,
  reduce,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { Job, Person } from './models';

@Component({
  selector: 'app-third-task',
  templateUrl: './third-task.component.html',
  styleUrls: ['./third-task.component.scss'],
})
export class ThirdTaskComponent implements OnInit {
  constructor() {}

  displayData: string[] = [];

  ngOnInit(): void {
    this.getPeople(['actor', 'writer', 'goat']).subscribe();
    this.firstLetter({ name: 'adsa', id: 2 });
  }

  getPeople(job: string[]) {
    return from(job).pipe(
      mergeMap((val) => {
        return from(Jobs).pipe(
          filter((job) => job.name.toLowerCase() === val.toLowerCase())
        );
      }),
      mergeMap((val) => {
        return from(Persons).pipe(
          filter((person: Person) => person.id === val.id),
          map(
            (person: Person) =>
              `${person.name} ${person.lastname} is ${this.firstLetter(val)}  ${
                val.name
              }`
          )
        );
      }),
      reduce((acc, curr: any) => acc.concat(curr), []),
      tap((val) => (this.displayData = val))
    );
  }

  firstLetter(val: Job) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(val.name[0].toLowerCase()) ? 'an' : 'a';
  }
}
