import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectFilterComponent } from './from-articles/select-filter/select-filter.component';
import { TogglingStateComponent } from './from-articles/toggling-state/toggling-state.component';
@NgModule({
  declarations: [
    AppComponent,
    SelectFilterComponent,
    TogglingStateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
