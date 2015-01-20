/* global module */
// # jsStatistics - Beta
//
// A statistics Gamma library translated from http://commons.apache.org/. 
// This is a utility class that provides computation methods related to the
// (Beta) family of functions. 
// More info in : http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/special/Gamma.html
//
// The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `Beta` in browsers or the `exports` object for node.js

if (typeof module !== 'undefined') {
	var FastMath = require('./JsStatistics.fastmath.js');
	var Gamma = require('./JsStatistics.gamma.js');
}

(function() {
    var Beta = {};

    if (typeof module !== 'undefined') {
        // Assign the `Beta` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = Beta;
    } else {
        // Otherwise, in a browser, we assign `Beta` to the window object,
        // so you can simply refer to it as `Beta`.
        this.Beta = Beta;
    }
	
	// -------------------------------------------------------
	// constants
	// -------------------------------------------------------
	
	/** Maximum allowed numerical error. */
    const DEFAULT_EPSILON = 1E-14;
	const INTEGER_MAX_VALUE = 2147483647;

    /** The constant value of ½log 2π. */
    const HALF_LOG_TWO_PI = .9189385332046727;
	
		
	/**
     * <p>
     * The coefficients of the series expansion of the Δ function. This function
     * is defined as follows
     * </p>
     * <center>Δ(x) = log Γ(x) - (x - 0.5) log a + a - 0.5 log 2π,</center>
     * <p>
     * see equation (23) in Didonato and Morris (1992). The series expansion,
     * which applies for x ≥ 10, reads
     * </p>
     * <pre>
     *                 14
     *                ====
     *             1  \                2 n
     *     Δ(x) = ---  >    d  (10 / x)
     *             x  /      n
     *                ====
     *                n = 0
     * <pre>
     */
    const DELTA = [
        .833333333333333333333333333333E-01,
        -.277777777777777777777777752282E-04,
        .793650793650793650791732130419E-07,
        -.595238095238095232389839236182E-09,
        .841750841750832853294451671990E-11,
        -.191752691751854612334149171243E-12,
        .641025640510325475730918472625E-14,
        -.295506514125338232839867823991E-15,
        .179643716359402238723287696452E-16,
        -.139228964661627791231203060395E-17,
        .133802855014020915603275339093E-18,
        -.154246009867966094273710216533E-19,
        .197701992980957427278370133333E-20,
        -.234065664793997056856992426667E-21,
        .171348014966398575409015466667E-22
    ];
	
	// -------------------------------------------------------
	// functions
	// -------------------------------------------------------
	
	Beta.regularizedBeta = regularizedBeta;
	Beta.evaluate = evaluate;
	Beta.logBeta = logBeta;
	Beta.sumDeltaMinusDeltaSum = sumDeltaMinusDeltaSum;
	Beta.deltaMinusDeltaSum = deltaMinusDeltaSum;
	Beta.logGammaMinusLogGammaSum = logGammaMinusLogGammaSum;
	Beta.logGammaSum = logGammaSum;
	
	// -------------------------------------------------------
	// function implementation
	// -------------------------------------------------------
	
		
	function getB(a,b, n,x) {
		var m, ret = 0.0;
                    
        if (n % 2 == 0) { // even
                        m = n / 2.0;
                        ret = (m * (b - m) * x) /
                            ((a + (2 * m) - 1) * (a + (2 * m)));
        } else {
                        m = (n - 1.0) / 2.0;
                        ret = -((a + m) * (a + b + m) * x) /
                                ((a + (2 * m)) * (a + (2 * m) + 1.0));
        }
		
		return ret;
    }
	
	function getA(n, x) { return 1.0; };
	
	function precision_equals(x, y, eps) {
        return /*precision_equals(x, y, 1) || */Math.abs(y - x) <= eps;
    }
	
	function regularizedBeta(x,a,b) {

		var ret = 0.0;
		
		if (x > (a + 1) / (2 + b + a) && 1 - x <= (b + 1) / (2 + b + a)) 
		{
            ret = 1 - regularizedBeta(1 - x, b, a, DEFAULT_EPSILON, INTEGER_MAX_VALUE);
        } 
		else 
		{
			
			var nominator = FastMath.exp((a * FastMath.log(x)) + (b * FastMath.log1p(-x)) - FastMath.log(a) - logBeta(a,b)) * 1.0 ;
			var denominator = evaluate(a,b, x, DEFAULT_EPSILON, INTEGER_MAX_VALUE);
			
			ret = ( nominator / denominator);
		}
			
		return ret;
	}
	
	function evaluate(a, b, x) {
	
		var small = 1e-50;
        var hPrev = getA(0, x);
		
        // use the value of small as epsilon criteria for zero checks
        if (precision_equals(hPrev, 0.0, small)) {
            hPrev = small;
        }

        var n = 1;
        var dPrev = 0.0;
        var cPrev = hPrev;
        var hN = hPrev;

		
        while (n < INTEGER_MAX_VALUE) {
            var a_ = getA(n, x);
            var b_ = getB(a,b, n, x);

            var dN = a_ + b_ * dPrev;
			
            if (precision_equals(dN, 0.0, small)) {
                dN = small;
            }
            var cN = a_ + b_ / cPrev;
            if (precision_equals(cN, 0.0, small)) {
                cN = small;
            }

            dN = 1 / dN;
            var deltaN = cN * dN;
            hN = hPrev * deltaN;

            if (!isFinite(hN)) {
				console.log('exception infinite ' + hN);
				break;
            }

            if (isNaN(hN)) {
				console.log('exception NaN' + hN);
                break;
            }

            if (FastMath.abs(deltaN - 1.0) < DEFAULT_EPSILON) {
                break;
            }

            dPrev = dN;
            cPrev = cN;
            hPrev = hN;
            n++;
        }

        return hN;
	}
	
	
	function logBeta(p, q) {
        
		
        var a = FastMath.min(p, q);
        var b = FastMath.max(p, q);
		
		
        if (a >= 10.0) {
            var w = sumDeltaMinusDeltaSum(a, b);
            var h = a / b;
            var c = h / (1.0 + h);
            var u = -(a - 0.5) * FastMath.log(c);
            var v = b * log1p(h);
            if (u <= v) {
                return (((-0.5 * FastMath.log(b) + HALF_LOG_TWO_PI) + w) - u) - v;
            } else {
                return (((-0.5 * FastMath.log(b) + HALF_LOG_TWO_PI) + w) - v) - u;
            }
        } else if (a > 2.0) {
            if (b > 1000.0) {
                var n =  FastMath.floor(a - 1.0);
                var prod = 1.0;
                var ared = a;
                for (var i = 0; i < n; i++) {
                    ared -= 1.0;
                    prod *= ared / (1.0 + ared / b);
                }
                return (FastMath.log(prod) - n * FastMath.log(b)) +
                        (Gamma.logGamma(ared) +
                         logGammaMinusLogGammaSum(ared, b));
            } else {
                var prod1 = 1.0;
                var ared = a;
                while (ared > 2.0) {
                    ared -= 1.0;
                    var h = ared / b;
                    prod1 *= h / (1.0 + h);
                }
                if (b < 10.0) {
                    var prod2 = 1.0;
                    var bred = b;
                    while (bred > 2.0) {
                        bred -= 1.0;
                        prod2 *= bred / (ared + bred);
                    }
                    return FastMath.log(prod1) +
                           FastMath.log(prod2) +
                           (Gamma.logGamma(ared) +
                           (Gamma.logGamma(bred) -
                            logGammaSum(ared, bred)));
                } else {
                    return FastMath.log(prod1) +
                           logGamma(ared) +
                           logGammaMinusLogGammaSum(ared, b);
                }
            }
        } else if (a >= 1.0) {
            if (b > 2.0) {
                if (b < 10.0) {
                    var prod = 1.0;
                    var bred = b;
                    while (bred > 2.0) {
                        bred -= 1.0;
                        prod *= bred / (a + bred);
                    }
                    return FastMath.log(prod) +
                           (Gamma.logGamma(a) +
                            (Gamma.logGamma(bred) -
                             logGammaSum(a, bred)));
                } else {
                    return logGamma(a) +
                           logGammaMinusLogGammaSum(a, b);
                }
            } else {
                return Gamma.logGamma(a) +
                       Gamma.logGamma(b) -
                       logGammaSum(a, b);
            }
        } else {
            if (b >= 10.0) {
                return Gamma.logGamma(a) +
                       logGammaMinusLogGammaSum(a, b);
            } else {
                // The following command is the original NSWC implementation.
                // return Gamma.logGamma(a) +
                // (Gamma.logGamma(b) - Gamma.logGamma(a + b));
                // The following command turns out to be more accurate.
			
				
                return FastMath.log(Gamma.gamma(a) * Gamma.gamma(b) / Gamma.gamma(a + b));
            }
        }
    }
	
	
	function sumDeltaMinusDeltaSum( p, q) {

        var a = FastMath.min(p, q);
        var b = FastMath.max(p, q);
        var sqrtT = 10.0 / a;
        var t = sqrtT * sqrtT;
        var z = DELTA[DELTA.length - 1];
        for (var i = DELTA.length - 2; i >= 0; i--) {
            z = t * z + DELTA[i];
        }
        return z / a + deltaMinusDeltaSum(a, b);
    }
	
	function deltaMinusDeltaSum( a, b) {

        var h = a / b;
        var p = h / (1.0 + h);
        var q = 1.0 / (1.0 + h);
        var q2 = q * q;
        /*
         * s[i] = 1 + q + ... - q**(2 * i)
         */
        var s = new Array(DELTA.length);
        s[0] = 1.0;
        for (var i = 1; i < s.length; i++) {
            s[i] = 1.0 + (q + q2 * s[i - 1]);
        }
        /*
         * w = Delta(b) - Delta(a + b)
         */
        var sqrtT = 10.0 / b;
        var t = sqrtT * sqrtT;
        var w = DELTA[DELTA.length - 1] * s[s.length - 1];
        for (var i = DELTA.length - 2; i >= 0; i--) {
            w = t * w + DELTA[i] * s[i];
        }
        return w * p / b;
    }
	
	function logGammaMinusLogGammaSum( a, b) {
        /*
         * d = a + b - 0.5
         */
        var d;
        var w;
        if (a <= b) {
            d = b + (a - 0.5);
            w = deltaMinusDeltaSum(a, b);
        } else {
            d = a + (b - 0.5);
            w = deltaMinusDeltaSum(b, a);
        }

        var u = d * log1p(a / b);
        var v = a * (Math.log(b) - 1.0);

        return u <= v ? (w - u) - v : (w - v) - u;
    }
	
	function logGammaSum(a, b)    {

        var x = (a - 1.0) + (b - 1.0);
        if (x <= 0.5) {
            return Gamma.logGamma1p(1.0 + x);
        } else if (x <= 1.5) {
            return Gamma.logGamma1p(x) + Math.log1p(x);
        } else {
            return Gamma.logGamma1p(x - 1.0) + Math.log(x * (1.0 + x));
        }
    }
		

	
	
})(this);

