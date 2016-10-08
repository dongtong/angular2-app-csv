import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.css']
})
export class CsvReaderComponent {
  private _file: File;
  private _fileName: string;

  fileContent: string[][];
  waiting: boolean = false;

  @Output() csvFileChanged: EventEmitter<string[][]> = new EventEmitter<string[][]>();
  csvParser: CsvParser = new CsvParser();

  public fileChangeListener($event: any): void {
    //console.log("Attached file changed:"+this.fileInput.dir);

    let toBeValidated: any = event.srcElement.files[0];

    // Validate the file
    if (toBeValidated.type != "application/vnd.ms-excel"
      || !toBeValidated.name.endsWith(".csv")) {
      console.error("Invalid file type");
      return;
    }
    this.waiting = true;
    this._file = toBeValidated;
    this._fileName = this._file.name;
    console.log("Attached file changed:" + this._fileName);
    this.loadFile(this._file);
  }

  loadFile(inputFile: File) {
    if (!inputFile) {
      alert("Invalid file!");
      return;
    }

    var data = null;
    var file: File = inputFile;
    var reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function (e) {

      var data = e.target.result;

      this.fileContent = CsvParser.CsvToArray(data);
      this.csvFileChanged.emit(this.fileContent);
      console.log("Fired parse complete event");
      
      this.waiting = false;

      if (data && data.length > 0) {
        console.log("Imported -" + data.length + "- bytes successfully!,rows:" + this.fileContent.length);
      } else {
        console.log("No data to import!");
      }
    }.bind(this);

    reader.onerror = function () {
      alert("Unable to read " + file);
    };
  }
}


class CsvParser {

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  public static CsvToArray(strData, strDelimiter?): string[][] {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);

      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];

      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
  }
}