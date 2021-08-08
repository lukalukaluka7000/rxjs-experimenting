import { Component, OnInit } from '@angular/core';
import { Observable,combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent {
  users = [
    {name: 'John', id: 1},
    {name: 'Andrew', id: 2},
    {name: 'Anna', id: 3},
    {name: 'Iris', id: 4},
  ];

  selectUserId = new FormControl('');
  blackListedUsers = new FormControl([]);
  blackAllowed = new FormControl(false);

  isDisabled$ : Observable<boolean> = combineLatest(
    this.selectUserId.valueChanges.pipe( startWith('') ),
    this.blackListedUsers.valueChanges.pipe( startWith([]) ),
    this.blackAllowed.valueChanges.pipe( startWith(false) )
  ).pipe(
    map( ([selId, blacklist, blackallowed]) => {
        console.log(selId, blacklist, blackallowed);
        return !blackallowed && blacklist.includes(+selId);
      }
    )
  );

}
