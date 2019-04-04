# Bulk Scanner - Barcodes Generator
Generates various barcodes (of type
[Code 128 B](https://en.wikipedia.org/wiki/Code_128)) to be used as front sheets
for bulk scanners.

Available parameters:
---------------------

* patientID
The HTML page needs to be called with at least this parameters

* visitID
If applicable, pass the ID of the visit this scan is related to

Examples:
--------

* https://e2jk.github.io/bulkscanbarcodesgen/index.html?patientID=AB123CDE
* https://e2jk.github.io/bulkscanbarcodesgen/index.html?patientID=AB123CDE&visitID=1234567890
* https://e2jk.github.io/bulkscanbarcodesgen/index.html (this will display an error message)
