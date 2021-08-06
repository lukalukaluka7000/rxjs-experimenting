import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, ReplaySubject, AsyncSubject, of } from 'rxjs';
import { AvailableObservables } from '../models/enum-types.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {  
  private subject$ : Subject<string>;
  // BehaviorSubject Example
  private subjectBehavioral$ : BehaviorSubject<string>;
  // ReplaySubject Example
  private subjectReplay$: ReplaySubject<string>;
  // AsyncSubject Example
  private subjectAsync$: AsyncSubject<string>;

  observable$: Observable<string>;
  srcObservable$: Observable<number>;
  innerObservable$ : Observable<string>;
  refreshIntervalId : any;

  constructor() {
  }
  
  init(rxjsObservable : AvailableObservables = AvailableObservables.Subject) {
    this.srcObservable$ = of(1,2,3,4);
    this.innerObservable$=of("a","b","c");
    console.log("usa u init");
    console.log(rxjsObservable);
    // Create Subject and Observable Here 
    switch (rxjsObservable) {
      case AvailableObservables.Subject:
          this.subject$ = new Subject<string>();
          this.observable$ = this.subject$.asObservable();
        break;
      case AvailableObservables.BehaviourSubject:
          this.subject$ = new BehaviorSubject(null);
          this.observable$ = this.subject$.asObservable();
        break;
      case AvailableObservables.ReplaySubject:
          this.subject$ = new ReplaySubject(2);
          this.observable$ = this.subject$.asObservable();
        break;
      case AvailableObservables.AsyncSubject:
          this.subject$ = new AsyncSubject();
          this.observable$ = this.subject$.asObservable();
        break;
      default:
        break;
      
    }
    console.log(this.subject$);
    // if(this.subject$)
    this.refreshIntervalId = setInterval(() => {
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      this.subject$.next(time);
    }, 3000)

  }
  UpdateOib(newOib: string) {
    this.subject$.next(newOib);
  }
  resetObs() {
    clearInterval(this.refreshIntervalId);
    if(this.subject$ !== undefined)
      this.subject$ = null;
  }
  
}
