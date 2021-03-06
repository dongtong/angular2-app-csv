import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CsvReaderComponent } from './csv-reader/csv-reader.component';
import { CsvResultComponent } from './csv-result/csv-result.component';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    CsvReaderComponent,
    CsvResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
