import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-csv-result',
  templateUrl: './csv-result.component.html',
  styleUrls: ['./csv-result.component.css']
})
export class CsvResultComponent implements OnChanges {

  constructor() { }

  ngOnChanges() {
    console.log("Things changed");
  }
  @Input() csvValues: string[][]
  onHearingChanges(payload: string[][]): void {
    console.log("changes heared, length in Parent:" + payload.length);
    this.csvValues = payload;
    
  }
}
