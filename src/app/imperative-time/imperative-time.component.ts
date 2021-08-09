import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imperative-time',
  templateUrl: './imperative-time.component.html',
  styleUrls: ['./imperative-time.component.css']
})
export class ImperativeTimeComponent implements OnInit {

  format: 'ampm' | '24h' = '24h';
  formattedTime: string;
  interval: any;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.formattedTime = this.formatTime(new Date(), this.format);
    }, 900)
  }
  
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  private formatTime(date:Date,format:string){
    if(format === 'ampm') return 'AM:PM: ' + date.toString();
    else return '24h: ' + date.toString();
  }
}
