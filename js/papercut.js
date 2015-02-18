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

//---------------------------------------------------------------------------------------- log
function log(msg) {	
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth() + 1;
	var time = now.toLocaleTimeString();
	
	console.log("%s/%s-%s[%s] %s", month,day,time,PGM,msg);
}

//---------------------------------------------------------------------------------------- listCustomers
function listCustomers(filepath) {
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

//---------------------------------------------------------------------------------------- listCustomerDataGroups
function listCustomerDataGroups() {
	log(format("Performing listCustomerDataGroups for Custno = %s", custno));
}

//---------------------------------------------------------------------------------------- listCustomerAttributes
function listCustomerAttributes() {
	log(format("Performing listCustomerAttributes for Custno = %s", custno));
}

//---------------------------------------------------------------------------------------- listDataGroupBoxes
function listDataGroupBoxes() {
	log(format("Performing listDataGroupBoxes for Custno = %s and Datagroup = %s", custno, datagroup));
}

//---------------------------------------------------------------------------------------- Main
var argv = parseArgs(process.argv.slice(2));
//console.dir(argv);

var cmd = false;
var custno = false;
var datagroup = false;
var attr = false;
// Parse input parameters
for (parm in argv) {
	switch (parm.toLowerCase()) {
		case "_":
			cmd = argv[parm];
			if (cmd.length != 1) {
				log("ERROR: Command not specified or multiple commands found.")
				process.exit(1);
			}
			log(format("Cmd = %s", cmd[0]));
			break;
		case "c":
		case "customer":
			custno = argv[parm];
			if (typeof custno != "number") {
				custno = false;
			}
			log(format("Customer Num = %s", custno));
			break;
		case "d":
		case "datagroup":
			datagroup = argv[parm];
			//log(datagroup);
			if (typeof datagroup != "number") {
				datagroup = false;
			}
			log(format("Data Group = %s", datagroup));
			break;
		case "attributes":
		case "a":
			attr = true;
			log("Show customer attributes = true");
			break;
		default:
			log(format("WARN: Unknown input parm => %s, Skipping", parm));
			break;
	}
}

// Act on command
switch (cmd[0].toLowerCase()) {
	case "ls":
	case "list":
		if (custno == false) {
			listCustomers(CUSTOMERS);
		} else if (attr == true) {
			listCustomerAttributes();
		} else if (datagroup == false) {
			listCustomerDataGroups();
		} else {
			listDataGroupBoxes();
		}
		
		break;
	case "ex":
	case "extract":
		log("Extract Boxes and create CSV command");
		break;
	case "ct":
	case "count":
		log("Count Boxes, but CSV creation commmand");
		break;
	default:
		log(format("ERROR: Unknown command => %s", cmd[0]));	
		process.exit(2);
};




