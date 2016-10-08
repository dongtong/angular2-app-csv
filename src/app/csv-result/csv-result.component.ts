import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csv-result',
  templateUrl: './csv-result.component.html',
  styleUrls: ['./csv-result.component.css']
})
export class CsvResultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onHearingChanges(payload: string[][]): void {
    console.log("changes heared, length in Parent:" + payload.length);
  }
}
