/* global module */
// # jsStatistics - StatUtils
//
// A statistics StatUtils library translated from http://commons.apache.org/. 
//  StatUtils provides static methods for computing statistics based on data
// stored in arrays. 
// more info : http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/stat/StatUtils.html
//
// The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `StatUtils` in browsers or the `exports` object for node.js

if (typeof module !== 'undefined') {
	var FastMath = require('./JsStatistics.fastmath.js');
}

(function() {
    var StatUtils = {};
	
	if (typeof module !== 'undefined') {
        // Assign the `gamma` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = StatUtils;
    } else {
        // Otherwise, in a browser, we assign `StatUtils` to the window object,
        // so you can simply refer to it as `StatUtils`.
        this.StatUtils = StatUtils;
    }
	
	// constants
	
	
	
	// functions
	
	StatUtils.mean = mean;
	StatUtils.variance = variance;
	
	// functions implementations

	
	function mean(fArray) {
		var total=0.0;
		
		for(var j=0;j<fArray.length;j++){
			fArray[j]=parseFloat(fArray[j]);
			total+=fArray[j];
		}

		return total/fArray.length;
	}
	
	
	function variance(fArray,mean) {
		var xm=0.0;
 
		  for(var j=0;j<fArray.length;j++){
				xm+=FastMath.pow((fArray[j]-mean),2);
		  }
	
		return xm/(fArray.length-1);
  
	}
	
		
	 
})(this);