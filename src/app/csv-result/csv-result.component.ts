import { TableCell } from './../interfaces/table-cell';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-csv-result',
  templateUrl: './csv-result.component.html',
  styleUrls: ['./csv-result.component.css']
})
export class CsvResultComponent implements OnChanges {

  constructor() { }

  _csvProcessor: CsvProcessor;
  ngOnChanges() {
    console.log("Things changed");
  }
  processedVals: TableCell[][];
  csvValues: string[][]
  csvHeaders: string[]

  onHearingChanges(payload: string[][]): void {
    console.log("changes heared, length in Parent:" + payload.length);
    this._csvProcessor = new CsvProcessor();

    //this.csvHeaders = payload.shift();
    // Remove the last element so it doesn't stay as an empty array
    //payload.pop();
    // Process the file here
    this._csvProcessor.prepareInput(payload);
    this.csvHeaders = this._csvProcessor.headers;
    this.csvValues = this._csvProcessor.originalVals;
    this.processedVals = this._csvProcessor.createHeatMap();
  }
}

class CsvProcessor {

  minVals: string[];
  maxVals: string[];

  headers: string[];
  rotatedVals: string[][];
  originalVals: string[][];


  static colors = [
    [0x00, 0x00, 0xFF],  // Blue
    [0x00, 0x80, 0x00],  // Green
    [0xFF, 0xFF, 0x00],  // Yellow
    [0xFF, 0xA5, 0x00],  // Orange
    [0xFF, 0x00, 0x00],  // Red
  ];


  prepareInput(input: string[][]) {
    this.headers = input.shift();
    input.pop();

    // Rows
    let entryCountForColumn: number = input.length;
    let columnCount: number = input[0].length;

    var rotated: any = [];
    // Init the values of the min & max vals
    this.minVals = [];
    this.maxVals = [];
    for (let i = 0; i < columnCount; i++) {
      // Col values
      //rotated[i] = [];

      //Set min and max to first element in col
      // a col can't contain numbers and a string
      this.minVals[i] = input[0][i];
      this.maxVals[i] = input[0][i];

      let numericMax: number = Number(this.maxVals[i]);
      let numericMin: number = Number(this.minVals[i]);

      if (isNaN(numericMax) || isNaN(numericMin)) {

        console.info("String value:" + this.minVals[i]);
        continue;
      }

      // Use sort? no, this is linear
      for (let j = 0; j < entryCountForColumn; j++) {
        let val: number = Number(input[j][i]);
        //rotated[i].push(val);

        // Update min and max
        // If the value is a string, don't consider it.
        // The value was originally initialized to the first element of the array
        // So >> 
        // if the whole col. is strings, we don't care
        // if the col conatined strings and numbers, strings aren't taken into 
        // consideration
        if (val <= numericMin) {
          numericMin = val;
          this.minVals[i] = val.toString();
        }
        else if (val > numericMax) {
          numericMax = val;
          this.maxVals[i] = val.toString();
        }
      }
    }

    this.originalVals = input;
    this.rotatedVals = rotated;
  }

  createHeatMap(): TableCell[][] {
    console.log("Creating heatmap");
    let entryCountForColumn: number = this.originalVals.length;
    let columnCount: number = this.originalVals[0].length;
    let result: TableCell[][] = [];

    for (let i = 0; i < columnCount; i++) {


      let colMinString = this.minVals[i];
      let colMaxString = this.maxVals[i];

      // Skip non numeric cols
      let valid: boolean = true;

      if (isNaN(Number(colMinString)) || isNaN(Number(colMaxString))) valid = false;
      let min: number = Number(colMinString);
      let max: number = Number(colMaxString);

      if (max == 0 || max == min) {
        valid = false;
        console.log("failed to validate col," + "min: " + min + " max: " + max);
      }

      for (let j = 0; j < entryCountForColumn; j++) {
        if (i == 0) {
          result[j] = [];
        }
        let stringVal: string = this.originalVals[j][i];
        let val: number = Number(stringVal);
        let cell: TableCell = new TableCell();

        cell.textValue = stringVal;
        cell.colorValue = "#ffffff";  // White is default

        if (valid && !isNaN(val)) {
          // Calculate the color
          let norm = (val - min) / (max - min);

          cell.colorValue = this.interpolateColor(norm);

          console.log(
            "color:" + cell.colorValue + " - val:" + val +
            " - min:" + min + " - max:" + max);
        }
        result[j].push(cell);
      }
    }
    return result;
  }
  colorsLength: number = CsvProcessor.colors.length;

  private interpolateColor(value: number): string {

    let left: number = Math.floor(value * (this.colorsLength - 1));
    let right: number = Math.ceil(value * (this.colorsLength - 1));

    let colorLeft: number[] = CsvProcessor.colors[left];
    let colorRight: number[] = CsvProcessor.colors[right];

    let step: number = 1.0 / (this.colorsLength - 1);
    let percentRight: number = (value - (left * step)) / step;
    let percentLeft: number = 1.0 - percentRight;

    let r: number = colorLeft[0] * percentLeft + colorRight[0] * percentRight;
    let g: number = colorLeft[1] * percentLeft + colorRight[1] * percentRight;
    let b: number = colorLeft[2] * percentLeft + colorRight[2] * percentRight;
    let finalR: string, finalG: string, finalB: string;

    finalR = this.toHexString(Math.floor(r));
    finalG = this.toHexString(Math.floor(g));
    finalB = this.toHexString(Math.floor(b));

    return "#" + finalR + finalG + finalB;
  }

  private toHexString(val: number): string {
    let result: string;
    if (val <= 0xF) {
      result = "0" + val.toString(16);  // 0f
    }
    else {
      result = val.toString(16);
    }
    return result;
  }
}