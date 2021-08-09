import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { merge, fromEvent, Observable, of } from 'rxjs';
import { mapTo, map, startWith, tap, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggling-state',
  templateUrl: './toggling-state.component.html',
  styleUrls: ['./toggling-state.component.css']
})
export class TogglingStateComponent implements AfterViewInit {
  tekst = new FormControl(['']);
  @ViewChild('btn') buttonRef: ElementRef<HTMLInputElement>;
  
  isSearchInputVisible$ : Observable<boolean> = of(false);
  
  ngAfterViewInit(): void {
    //merge vs CombineLatest return Operators which is not useful in this siutation
    this.isSearchInputVisible$ = merge(
      fromEvent(this.buttonRef.nativeElement, 'click').pipe( tap(e=>e.stopPropagation()), mapTo(true) ),
      fromEvent(document.body, 'click').pipe( filter(() => this.tekst.value === '' ), mapTo(false) )
    ).pipe(
      startWith(false),
      tap(() => console.log(this.tekst.value))
    ); 
  }
}
