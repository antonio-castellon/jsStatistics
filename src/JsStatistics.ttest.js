/* global module */
// # jsStatistics - T_Test
//
// A statistics StatUtils library translated from http://commons.apache.org/. 
// An implementation for Student's t-tests.. 
// more info : http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/stat/inference/TTest.html
//
// The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `T_Test` in browsers or the `exports` object for node.js
//
// NOTE: at the moment Only implement the  http://en.wikipedia.org/wiki/Welch's_t_test
//
// TODO : To implement the complet  ttest -> 
/*
	TTEST
	
		array1	-	The first data set
		array2	-	The second data set (must have the same length as array1)
		tails	-	The number of tails for the distribution. This must be either :
					1	-	uses the one-tailed distribution
					2	-	uses the two-tailed distribution
		type	-	An integer that represents the type of t-test. This can be either :
					1	-	Paired T-Test
					2	-	Two-sample equal variance T-Test
					3	-	Two-sample unequal variance T-Test

	WE ARE USING TAILS = 2 + TYPE = 3
	
	return value = 0.00888664
*/

if (typeof module !== 'undefined') {
	var FastMath = require('./JsStatistics.fastmath.js');
	var StatUtils = require('./JsStatistics.statutils.js');
	var Beta = require('./JsStatistics.beta.js');
}

(function() {
    var T_Test = {};
	
	if (typeof module !== 'undefined') {
        // Assign the `gamma` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = T_Test;
    } else {
        // Otherwise, in a browser, we assign `T_Test` to the window object,
        // so you can simply refer to it as `T_Test`.
        this.T_Test = T_Test;
    }
	
	// constants
	
	
	
	// functions
	
	T_Test.ttest = ttest;
	T_Test.df = df;
	
	
	// functions implementations
	
	// Computes p-value for 2-sided, 2-sample t-test.
	function ttest(fArray1,fArray2) {
  
		var mean1=StatUtils.mean(fArray1);
		var mean2=StatUtils.mean(fArray2);
		 
		var sd1= StatUtils.variance(fArray1,mean1);
		var sd2= StatUtils.variance(fArray2,mean2);
	  
		var t = FastMath.abs(((mean1-mean2)/FastMath.sqrt((sd1/fArray1.length+sd2/fArray2.length))*10000)/10000);
		var degreesOfFreedom = df(sd1,sd2,fArray1.length, fArray2.length);
	  
		var x = degreesOfFreedom / (degreesOfFreedom + (t * t)); // 0.03978879649292954;
		var a = 0.5 * degreesOfFreedom; // 1.2281758316015892;
		var b = 0.5;
		  
		return Beta.regularizedBeta(x,a,b);
	}
	
	/**
     * Computes approximate degrees of freedom for 2-sample t-test.
     *
     * @param v1 first sample variance
     * @param v2 second sample variance
     * @param n1 first sample n
     * @param n2 second sample n
     * @return approximate degrees of freedom
     */
	function  df( v1,  v2,  n1,  n2) {
        return (((v1 / n1) + (v2 / n2)) * ((v1 / n1) + (v2 / n2))) /
        ((v1 * v1) / (n1 * n1 * (n1 - 1.0)) + (v2 * v2) /
                (n2 * n2 * (n2 - 1.0)));
    }

	  
	 
})(this);