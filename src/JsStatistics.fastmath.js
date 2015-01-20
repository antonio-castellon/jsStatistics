/* global module */
// # jsStatistics - FastMath
//
// A statistics FastMath library translated from http://commons.apache.org/. 
// Faster, more accurate, portable alternative to {@link Math} and
// {@link StrictMath} for large scale computation. 
// more info : http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/util/FastMath.html
//
// The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `FastMath` in browsers or the `exports` object for node.js
(function() {
    var FastMath = {};

    if (typeof module !== 'undefined') {
        // Assign the `gamma` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = FastMath;
    } else {
        // Otherwise, in a browser, we assign `FastMath` to the window object,
        // so you can simply refer to it as `FastMath`.
        this.FastMath = FastMath;
    }
	
	// constants
	
	const PI = Math.PI; // PI = 105414357.0 / 33554432.0 + 1.984187159361080883e-9;
	
	// functions
	
	FastMath.log = log;
	FastMath.log1p = log1p;
	FastMath.floor = floor;
	FastMath.abs = abs;
	FastMath.pow = pow;
	FastMath.exp = exp;
	FastMath.sin = sin;
	FastMath.min = min;
	FastMath.max = max;
	FastMath.sqrt = sqrt;
	
	
	// functions implementations

	function log(x) {	
		return Math.log(x);
	}
	
	function log1p(x) {
	  return Math.log(1 + x);; // Math.log1p(x); ... to be compatible with NodeJS Math library implementation
	}
	
	function floor(x) {
		return Math.floor(x);
	}
	
	function abs(x) {
		return Math.abs(x);
	}
	
	function pow(x,y) {
		return Math.pow(x,y);
	}
	
	function exp(x) {
		return Math.exp(x);
	}
	
	function sin(x) {
		return Math.sin(x);
	}
	
	function max(x,y) {
		return Math.max(x,y);
	}
	
	function min(x,y) {
		return Math.min(x,y);
	}
	
	
	function sqrt(x) {
		return Math.sqrt(x);
	}
	
	//return FastMath;
	 
})(this);