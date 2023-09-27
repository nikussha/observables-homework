import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  map,
  of,
  Observable,
  fromEvent,
  from,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-second-task',
  templateUrl: './second-task.component.html',
  styleUrls: ['./second-task.component.scss'],
})
export class SecondTaskComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') container: ElementRef | undefined;
  userArray = Array.from({ length: 60 }, (_, index) => {
    return {
      user: `user ${index + 1}`,
      id: index + 1,
    };
  });
  batchSize = 7;
  displayData$ = new BehaviorSubject(this.userArray.slice(0, this.batchSize));
  subscription?: Subscription;
  listitems = 7;

  ngAfterViewInit(): void {
    if (this.container) {
      let container = this.container.nativeElement;
      this.subscription = fromEvent(container, 'scroll')
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(
            (element: any) =>
              element.target.scrollHeight - element.target.scrollTop ===
                element.target.clientHeight &&
              this.displayData$.getValue().length < this.userArray.length
          ),
          tap(() => this.loadUsers())
        )
        .subscribe();
    }
  }

  loadUsers() {
    const currentLength = this.displayData$.getValue().length;
    const nextBatch = this.userArray.slice(
      currentLength,
      currentLength + this.batchSize
    );

    this.displayData$.next([...this.displayData$.getValue(), ...nextBatch]);
    this.listitems = this.displayData$.getValue().length;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
