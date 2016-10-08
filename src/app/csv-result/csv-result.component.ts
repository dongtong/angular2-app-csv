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
  @Input() csvHeaders: string[]
  onHearingChanges(payload: string[][]): void {
    console.log("changes heared, length in Parent:" + payload.length);
    this.csvHeaders = payload.shift();
    // Remove the last element so it doesn't stay as an empty array
    payload.pop();
    // Process the file here
    this.csvValues = payload;
    CsvProcessor.createHeatMap(this.csvValues);
  }
}

class CsvProcessor {

  static createHeatMap(input: string[][]) {
    /*
        j
        |
        |
        V
        col   col   col   col   col   col ---> i
        val   val   val   val   val   val   
    */

    // Rows
    let entryCountForColumn: number = input.length;
    let columnCount: number = input[0].length;

    var rotated: any = [];
    var minVals: string[] = [];
    var maxVals: string[] = [];
    for (let i = 0; i < columnCount; i++) {
      // Col values
      rotated[i] = [];

      //Set min and max to first element in col
      minVals[i] = input[0][i];
      maxVals[i] = input[0][i];

      for (let j = 0; j < entryCountForColumn; j++) {
        let val: string = input[j][i];

        // Update min and max
        // If the value is a string, don't consider it.
        // The value was originally initialized to the first element of the array
        // So >> 
        // if the whole col. is strings, we don't care
        // if the col conatined strings and numbers, strings aren't taken into 
        // consideration
        if (val < minVals[i]) {
          if (isNaN(Number(val))) continue;

          minVals[i] = val;
        }
        else if (val > maxVals[i]) {
          if (isNaN(Number(val))) continue;

          maxVals[i] = val;
        }
      }
    }

    console.log("Sorting")
    //rotated[0].sort();
    for (let i = 0; i < columnCount; i++) {
      console.log("Col Index:" + i + " Min:" + minVals[i]
        + " Max:" + maxVals[i]);
    }
  }
}