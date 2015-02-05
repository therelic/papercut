// Modules
var fs = require('fs');
var path = require('path');
var format = require('util').format;
var csv = require('fast-csv');
var parseArgs = require('minimist');
var dbconfig = require('../conf/dbconfig.json');

// Constants
var PGM = path.basename(__filename, ".js");
var CUSTOMERS = "./conf/customers.csv";

// Variables
var customers = [];
var csvIn = null;
var csvOut = null;

//------------------------------------------------------- log
function log(msg) {
	var d = new Date();
	console.log("%s[%s] %s", d.toLocaleTimeString(), PGM, msg);
}

//------------------------------------------------------- Parse CSV File
function parseCSVFile(filepath) {
	log(format("Parsing File = %s", filepath));
	csvIn = csv.fromPath(filepath, {headers: true});

	//------------------- Callback ----------------- data
	csvIn.on("data", function(data) {
		customers.push(data);
		log(format("%s - %s - %s", data["CUST_NO"],data["CUST_NAME"],data["BOX"]));
	});
	//------------------- Callback ----------------- end
	csvIn.on("end", function() {
		log("Input CSV file loaded....");
	//------------------------------------------------------- CSV output File
	//    csvOut = csv.createWriteStream({headers: true});
	 //   fileOut = fs.createWriteStream(CSVOUTFILE); 
	//	csvOut.pipe(fileOut);
		
		//------------------- Callback ----------------- finish
	//	fileOut.on("finish", function() {
	//		console.log(CSVFILE + " is closed.");	
	//	});
	});
}

//------------------------------------------------------- Main
var argv = parseArgs(process.argv.slice(2));
//console.dir(argv);

var cmd = argv["_"];
if (cmd.length != 1) {
	log("ERROR: Command not specified or multiple commands found.")
	process.exit(1);
}

switch (cmd[0].toLowerCase()) {
	case "ls":
	case "list":
		log("list command");
		parseCSVFile(CUSTOMERS);
		break;
	case "ex":
	case "extract":
		log("Extract command");
		break;
	default:
		log(format("ERROR: Unknown command => %s", cmd[0]));	
		process.exit(2);
};




