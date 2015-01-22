/**
 * 
 * @author : Antonio Castellon ; antonio.castellon@gmail.com
 * 
 * http://en.wikipedia.org/wiki/Welch's_t_test
 * http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/stat/inference/TTest.html
**/
var fs = require('fs');


var FastMath = require('../src/JsStatistics.fastmath.js');
var StatUtils = require('../src/JsStatistics.statutils.js');
var Gamma = require('../src/JsStatistics.gamma.js');
var Beta = require('../src/JsStatistics.beta.js');
var T_Test = require('../src/JsStatistics.ttest.js');

var XLSX = require('xlsx');

// positive values = [ 1 .. 184 ] 
// negative values = [ 185 ... 252 ]	
var workbook = XLSX.readFile('./test.xlsx');

var sheet_name_list = workbook.SheetNames;
var sheetIndex = 0;
var name = 0;
var p1values, p2values;

  function run() {
	
		var stream = fs.createWriteStream("p-values.txt");
		var p_value = 0;
		var WARNING = "     ";
		var line = "";
		
		
		for (var index=1; index <= 252; index++) 
		{
		
				name = workbook.Sheets[sheet_name_list[sheetIndex]]['A' + index].v;
				
				p1values = [ workbook.Sheets[sheet_name_list[sheetIndex]]['B' +  index].v,
							 workbook.Sheets[sheet_name_list[sheetIndex]]['C' +  index].v,
							 workbook.Sheets[sheet_name_list[sheetIndex]]['D' +  index].v 
							];

				p2values = [
							workbook.Sheets[sheet_name_list[sheetIndex]]['F' +  index].v
							,workbook.Sheets[sheet_name_list[sheetIndex]]['G' +  index].v
							,workbook.Sheets[sheet_name_list[sheetIndex]]['H' +  index].v
						  ];
						  
				
				p_value = T_Test.ttest(p1values,p2values);
			
				if ((p_value >= 0.05 && index < 184) || (p_value < 0.05 && index >= 184))  WARNING = "-WARN-"; //"-WARN-[" + p1values + " | " + p2values + "]";
				else WARNING = "     ";
				
				line = "[" + index + "] \t " + WARNING + "\t" + p_value+ "\t" + name + "\n";
				
				stream.write(line);
				console.log(line);
		
		}
		
		stream.end();
	}
	
// ttest([0.958,1.545,2.121],[9.603,11.265,7.845]);
run();



  
