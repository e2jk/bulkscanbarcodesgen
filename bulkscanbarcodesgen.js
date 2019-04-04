/*jslint browser: true, white: true, long: true */
/*global DrawHTMLBarcode_Code128B, Departments, DocumentTypes */

/*
Copyright 2019 Emilien Klein

This file is part of bulkscanbarcodesgen.

bulkscanbarcodesgen is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

bulkscanbarcodesgen is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with bulkscanbarcodesgen.  If not, see <https://www.gnu.org/licenses/>.
*/

// Shorthand for document.getElementById
var $ = function(id) { return document.getElementById(id); };

// Inspired from https://stackoverflow.com/a/11582513/185053 , modified for JSLint
function getURLParameter(name) {
  "use strict";
  // This function will return null if this specific parameter is not found
  var parameterValue = null;
  // Perform a regex match to find the value of the parameter from the query string
  var parameterRegex = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search);
  if (parameterRegex) {
    // If the regex found a match, replace any occurrence of + by %20
    parameterValue = parameterRegex[1].replace(/\+/g, "%20");
    // and perform proper decoding of the URI
    parameterValue = decodeURIComponent(parameterValue);
  }
  // Return either null or the value of that parameter
  return parameterValue;
}

// Use the lists from data.js to populate the dropdowns
function populateSelects(list, selectElement){
  "use strict";
  var select = $(selectElement);
  list.forEach(function (opt) {
    var el = document.createElement("option");
    el.textContent = opt.name;
    el.value = opt.id;
    select.appendChild(el);
  });
}

// Draw a single barcode
function drawBarcode(elementID, preText) {
  "use strict";
  var value = $(elementID).value;
  var bc = DrawHTMLBarcode_Code128B(value,      // data
                                    "yes",      // humanReadable
                                    "in",       // units
                                    0,          // minBarWidth
                                    2.5,        // width
                                    1,          // height
                                    "bottom",   // textLocation
                                    "center",   // textAlignment
                                    "",         // textStyle
                                    "black",    // foreColor
                                    "white"     // backColor
  );
  $(elementID + "_barcode").innerHTML = preText + bc;
}

// Draw the Patient and Visit ID barcodes
function drawStaticBarcodes() {
  "use strict";
  drawBarcode("patientID", "Patient: ");
  drawBarcode("visitID", "Visit: ");
}

// Draw the Department and Document Type barcodes
function drawDynamicBarcodes() {
  "use strict";
  drawBarcode("departmentID", "Department: ");
  drawBarcode("documentType", "Document Type: ");
}

// Validate the parameters passed by URL and populate the page accordingly
function processParameters(){
  "use strict";
  var patientID = getURLParameter("patientID");
  var visitID = getURLParameter("visitID");

  // Check validity of the patient ID
  //TODO: use Regex to validate the expected format of the patient ID
  if(!patientID){
    $("parameters").style.display = "none";
    $("barcodes").innerHTML = "NO VALID PATIENT ID PASSED";
    return false;
  }

  // Hide the Visit ID if not provided
  if(!visitID){
    $("visitID_barcode").style.display = "none";
  }

  // Set the values passed by the parameters
  $("patientID").value = patientID;
  $("visitID").value = visitID;
  return true;
}

// Prints the page (unneeded elements are hidden using pring.css)
function printBarcodes(){
  window.print();
}

// The main function
function main(){
  // Populate the dropdowns
  populateSelects(Departments, "departmentID");
  populateSelects(DocumentTypes, "documentType");

  // Create event listeners (changing dropdown values or print request)
  $("departmentID").addEventListener("change", drawDynamicBarcodes, false);
  $("documentType").addEventListener("change", drawDynamicBarcodes, false);
  $("printButton").addEventListener("click", printBarcodes, false);

  // Read patient and visit IDs from parameters passed to the page
  if(true === processParameters()){
    // Only draw the initial barcodes if a valid patient ID was passed
    drawStaticBarcodes();
    drawDynamicBarcodes();

    // Give the focus to the departmentID dropdown
    $("departmentID").focus();
  }
}

main();
