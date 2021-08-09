import { Component, OnInit } from '@angular/core';
import { combineLatest, fromEvent, interval, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-imperative-time',
  templateUrl: './imperative-time.component.html',
  styleUrls: ['./imperative-time.component.css']
})
export class ImperativeTimeComponent  {
  format = new FormControl('24h');
  interval: any;

  formattedTime$ = combineLatest(
    this.format.valueChanges.pipe( startWith('24h') ),
    interval(900).pipe( map(() => new Date()) )
  ).pipe(
    map(([recFormat, date]) => {
     return this.formatTime(date, recFormat);   
    })
  );

  private formatTime(date:Date,format:string){
    if(format === 'ampm') return 'AM:PM: ' + date.toString();
    else return '24h: ' + date.toString();
  }
}
