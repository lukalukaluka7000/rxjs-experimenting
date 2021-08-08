import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent implements OnInit {
  users = [
    {name: 'John', id: 1},
    {name: 'Andrew', id: 2},
    {name: 'Anna', id: 3},
    {name: 'Iris', id: 4},
  ];

  blackListedUsers = [];

  selectedUserId = null;
  isUserBlackListed = false;
  allowBlackListedUsers = false;

  changeUser() {
    this.isUserBlackListed = !!this.blackListedUsers.find(blackListedUserId =>
      +this.selectedUserId === blackListedUserId
    );
  }
  constructor() { }

  ngOnInit(): void {
  }

}
