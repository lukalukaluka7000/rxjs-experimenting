import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SubjectsService } from './core/subjects.service';
import { Subscription, Observable, fromEvent, identity } from 'rxjs';
import { tap, exhaustMap, debounceTime, distinctUntilChanged, take, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { RxjsOperators, AvailableObservables } from './models/enum-types.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  rxjsOp : RxjsOperators = RxjsOperators.switchMap;
  rxjsOpString : string;
  rxjsObservable : AvailableObservables = AvailableObservables.Subject;
  rxjsObservableString : string;

  oibone : string;
  tipProizvoda:string;
  subscription0Data = [];
  subscription1Data = [];
  subscription2Data = [];
  subscription3Data = [];

  sub0: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  @ViewChild('button',{static:true}) button; //moze bit i 'input' event
  clicks$:Observable<any>;
  count : number=0;

  @ViewChild('inputTipProizvoda', {static: true}) inputTipProizvodaField;
  changesTipProiz$:Observable<any>;

  observableChosen : boolean = false;
  constructor(private subjectsService: SubjectsService) {}

  ngOnInit() {
    //want to listen for subject0 change
    //this.subscribe0(); dodaj subscribe1

    //src i inner
    //this.subscribeSrcInner();
    
    //na klikove button
    this.clicks$ = fromEvent(this.button.nativeElement, 'click');
    this.subscribeExhaustMapClickExample();

    //na input field change
    this.TryDifferentOperatorsOnInputChange();
    
  }
  TryDifferentOperatorsOnInputChange() {
    this.rxjsOpString = String(RxjsOperators[ this.rxjsOp.valueOf() ]).toUpperCase();
    console.log("Testing rxjs operator " + this.rxjsOpString  + " na input Change Eventu");
    this.changesTipProiz$ = fromEvent(this.inputTipProizvodaField.nativeElement, 'input');
    this.subscribeVariousRxjsOperatorsOnInputExample();
  }
  subscribeVariousRxjsOperatorsOnInputExample() {
    this.changesTipProiz$.pipe(
      this.rxjsOp === RxjsOperators.exhaustMap ? exhaustMap(data => this.JobInOperator(data)) : identity,
      this.rxjsOp === RxjsOperators.concatMap ?  concatMap(data => this.JobInOperator(data)) : identity,
      this.rxjsOp === RxjsOperators.mergeMap ? mergeMap(data => this.JobInOperator(data)) : identity,
      this.rxjsOp === RxjsOperators.switchMap ? switchMap(data => this.JobInOperator(data)) : identity,
    
    ).subscribe(data => {
      if(this.rxjsOp === RxjsOperators.exhaustMap || this.rxjsOp === RxjsOperators.concatMap) {
        console.log("ovde je data nakon sta je inner obs zavrsio sa SVAKIM od svojih timeoutova");
      }
      if(this.rxjsOp === RxjsOperators.mergeMap) {
        console.log("ovde u subscribeu smom, prvo su izvrseni kodovi unutar rxjsOperaotrJob(...) pa onda poslovi u innerObservabelu , brze je, tocno je, ali nema cekanja na odradivanje inner observabla do kraja");
      }
      if(this.rxjsOp === RxjsOperators.switchMap) {
        console.log("switchmapa boli pena, testirat tako da ukucas brzo nesto, i onda sekund nakon opet nesto, moze se vidjeti da on ne ude u ispis data je jer nikad nije ni dokrajcen. Naprotiv, on uzme samo zadnji dospjeli i zavrseni podatak");
      }
      //console.log("u subscribe se ulazi onoliko puta koliko je inner Observable nextao (to provjeri po logovima)");
      console.log("data je: ", data);
    })
  }
  subscribeVariousRxjsObservables() {
    this.sub0 = this.subjectsService.observable$.subscribe(data => {
      if(this.rxjsObservable === AvailableObservables.Subject ) {
        console.log("Subject");
      }
      if(this.rxjsObservable === AvailableObservables.BehaviourSubject) {
        console.log("behaviour");
      }
      if(this.rxjsObservable === AvailableObservables.ReplaySubject) {
        console.log("replay");
      }
      if(this.rxjsObservable === AvailableObservables.AsyncSubject) {
        console.log("async");
      }
      console.log("data je: ", data);
    })
  }
  TryDifferentObservables() {
    this.rxjsObservableString = String(AvailableObservables[ this.rxjsObservable.valueOf() ]).toUpperCase();
    console.log("Testing observable " + this.rxjsObservableString  + " na svim emitovima");

    this.subjectsService.init(this.rxjsObservable);
  }
  switchObs(obsSelected : string) {
    this.observableChosen = true;
    this.resetToInitialState();
    switch (obsSelected) {
      case "su":
        this.rxjsObservable = AvailableObservables.Subject;
        break;
      case "be":
        this.rxjsObservable = AvailableObservables.BehaviourSubject;
        break;
      case "re":
        this.rxjsObservable = AvailableObservables.ReplaySubject;
        break;
      case "as":
       this.rxjsObservable = AvailableObservables.AsyncSubject;
        break;
      default:
        break;
    }
    this.TryDifferentObservables();
  }
  switchOperator(operSelected: string) {
    
    this.resetToInitialState();
    switch (operSelected) {
      case "ex":
        this.rxjsOp = RxjsOperators.exhaustMap;
        break;
      case "co":
        this.rxjsOp = RxjsOperators.concatMap;
        break;
      case "me":
        this.rxjsOp = RxjsOperators.mergeMap;
        break;
      case "sw":
        this.rxjsOp = RxjsOperators.switchMap;
        break;
      default:
        break;
    }
    this.TryDifferentOperatorsOnInputChange();
  }
  resetToInitialState() {
    this.count = 0;
    this.tipProizvoda = "";
    this.oibone = "";
    this.subjectsService.resetObs();
    if(this.sub0 !== undefined)
      this.sub0.unsubscribe();
    if(this.sub1 !== undefined)
      this.sub1.unsubscribe();
    if(this.sub2 !== undefined)
      this.sub2.unsubscribe();
    if(this.sub3 !== undefined)
      this.sub3.unsubscribe();
    this.subscription0Data = [];
    this.subscription1Data = [];
    this.subscription2Data = [];
    this.subscription3Data = [];

    console.clear();
  }
  oibChanged(newOib : string) {
    //if(this.sub0.closed) {
      this.subscribe0();
    //}
    console.log("oib changed: ", newOib);
    this.subjectsService.UpdateOib(newOib);
  }
  JobInOperator(data) {
    //: typoesafety 'InputEvent' from npm install --save @types/dom-inputevent
    this.count+=1;
    console.log("count je : ", this.count);
    let currinputValueField = data.srcElement.value;
    console.log("input field je: ", currinputValueField);
    //npr return this.http.get() : Observable<any>
    return this.delayedObs(currinputValueField);
  }
  
  delayedObs(currInputValueField : string = '') {
    return new Observable((observer) => {
      setTimeout(() => { 
        observer.next(this.count + " A: " + currInputValueField); 
      }, 1000);

      setTimeout(() => {
        observer.next(this.count + " B: " + currInputValueField);
        observer.complete();
      }, 2000);
      // moras imat complete da bi se znalo da je zavrsio;
      
    });
  }
  subscribeExhaustMapClickExample() {
    this.clicks$.pipe(
      exhaustMap(() => {// on ne primi nista jer je button click event glup sam po sebi
        console.log("botun je kliknut, idemo u delyed Observable i ceka se da se on izvrsi koliko god trajao i tek onda prihvacam naknadne klikove");
        this.count += 1;
        console.log("count je : ", this.count);
        return this.delayedObs();
      }) 
    ).subscribe(data => {
      console.log("ovde je data nakon sta je inner obs zavrsio sa SVAKIM od svojih timeoutova");
      console.log("u subscribe se ulazi onoliko puta koliko je inner Observable nextao (to provjeri po logovima)");
      console.log("data je: ");
      console.log(data);
    });
  }
  subscribeSrcInner() {
    this.subjectsService.srcObservable$.pipe(
      exhaustMap(val => {
        console.log("source value" + val);
        // console.log("starting new obs");
        console.log("ceka se inner observable prije nego sta se krene dalje");
        console.log("vracam inner observable i on se u subscribeau manifestira");
        return this.subjectsService.innerObservable$;
      })
    ).subscribe(data => {
      console.log("iz subscribea (length(innerobservable)):", data);
    })
  }
  subscribe0() {
    let obs = this.subjectsService.observable$.pipe(
      tap(data => {
        if(data) {
          console.log("usa");
          this.subscription0Data.push(data);
        }
      })
    );
    this.sub0 = obs.subscribe();  
  }

  subscribe1() {
    this.sub1 =this.subjectsService.observable$.subscribe(data => this.subscription1Data.push(data));
  }

  subscribe2() {
    this.sub2 =this.subjectsService.observable$.subscribe(data => this.subscription2Data.push(data));
  }

  subscribe3() {
    this.sub3 =this.subjectsService.observable$.subscribe(data => this.subscription3Data.push(data));
  }

  ngOnDestroy() {
    this.sub0.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

}
