import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-toggling-state',
  templateUrl: './toggling-state.component.html',
  styleUrls: ['./toggling-state.component.css']
})
export class TogglingStateComponent implements OnInit {
  query = '';
  isSearchInputVisible = false;

  showSearchInput(event: MouseEvent) {
    event.stopPropagation();
    this.isSearchInputVisible = true;
  }

  @HostListener('document:click')
  hideSearchInput() {
    if (this.query === '') {
      this.isSearchInputVisible = false;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
