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

  subClicks: Subscription;
  subInputChanges : Subscription;
  sub0: Subscription;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  @ViewChild('button',{static:true}) button; //moze bit i 'input' event
  clicks$ : Observable<any>;
  count : number=0;

  @ViewChild('inputTipProizvoda', {static: true}) inputTipProizvodaField;
  changesTipProiz$:Observable<any>;

  observableChosen : boolean = false;
  operatorChosen : boolean = false;
  constructor(public subjectsService: SubjectsService) {}

  ngOnInit() {
    this.subjectsService.initSimpleObservable();

    this.clicks$ = fromEvent(this.button.nativeElement, 'click');
    this.subscribeExhaustMapClickExample();
  }
  //pozivan
  TryDifferentOperatorsOnInputChange() {
    this.rxjsOpString = String(RxjsOperators[ this.rxjsOp.valueOf() ]).toUpperCase();
    console.log("Testing rxjs operator " + this.rxjsOpString  + " na input Change Eventu");
    this.changesTipProiz$ = fromEvent(this.inputTipProizvodaField.nativeElement, 'input');
    this.subscribeVariousRxjsOperatorsOnInputExample();
  }
  TryDifferentObservables(obsSelectedValue : number) {
    this.rxjsObservableString = AvailableObservables[obsSelectedValue];
    console.log("Testing observable " + this.rxjsObservableString  + " na svim emitovima");
  
    //getting key: observable by ordinal, dont care how it works
    this.rxjsObservable = Object.keys(AvailableObservables).indexOf(AvailableObservables[obsSelectedValue]) - 
      (Object.keys(AvailableObservables).length / 2);
      
    this.subjectsService.init(this.rxjsObservable);
  }
  subscribeVariousRxjsOperatorsOnInputExample() {
    this.subInputChanges = this.changesTipProiz$.pipe(
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
    });
  }

  
  switchObs(obsSelectedValue : number) {
    this.resetToInitialState();
    this.observableChosen = true;
    
    this.TryDifferentObservables(obsSelectedValue);
  }
  switchOperator(operSelected: string = 'sw') {
    this.resetToInitialState();
    this.operatorChosen = true;
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
    if(this.subInputChanges !== undefined)
      this.subInputChanges.unsubscribe();

    this.subscription0Data = [];
    this.subscription1Data = [];
    this.subscription2Data = [];
    this.subscription3Data = [];

    this.subjectsService.initSimpleObservable();
    this.operatorChosen = false;
    this.observableChosen = false;
    console.clear();
  }
  oibChanged(newOib : string) {
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
    });
  }
  subscribeExhaustMapClickExample() {
    this.subClicks = this.clicks$.pipe(
      exhaustMap(() => {
        console.log("printam iz exhaustMapa samo za jedan klik, idem u delayed inner Observable i ceka se da se on izvrsi koliko god trajao i tek onda prihvacam naknadne klikove");
        this.count += 1;
        console.log("count je : ", this.count);
        return this.delayedObs();
      }) 
    ).subscribe(data => {
      console.log("data je: ", data);
    });
  }


  subscribe0() {
    this.sub0 = this.subjectsService.observable$.subscribe(data => this.subscription0Data.push(data));
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
    this.subClicks.unsubscribe();
    this.subInputChanges.unsubscribe();
  }

}
