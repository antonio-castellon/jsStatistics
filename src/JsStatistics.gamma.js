/* global module */
// # jsStatistics - Gamma
//
// A statistics Gamma library translated from http://commons.apache.org/. 
// This is a utility class that provides computation methods related to the
// &Gamma; (Gamma) family of functions. 
// More info in : http://commons.apache.org/proper/commons-math/apidocs/org/apache/commons/math3/special/Gamma.html
//
// The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `Gamma` in browsers or the `exports` object for node.js
if (typeof module !== 'undefined') {
	var FastMath = require('./JsStatistics.fastmath.js');
}

(function() {
    var Gamma = {};

    if (typeof module !== 'undefined') {
        // Assign the `Gamma` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = Gamma;
    } else {
        // Otherwise, in a browser, we assign `Gamma` to the window object,
        // so you can simply refer to it as `Gamma`.
        this.Gamma = Gamma;
    }
	
	// -------------------------------------------------------
	// constants
	// -------------------------------------------------------
	
	
	 /**
     * <a href="http://en.wikipedia.org/wiki/Euler-Mascheroni_constant">Euler-Mascheroni constant</a>
     */
    const GAMMA = 0.577215664901532860606512090082;

    /**
     * The value of the {@code g} constant in the Lanczos approximation
     */
    const LANCZOS_G = 607.0 / 128.0;

    /** Maximum allowed numerical error. */
    const DEFAULT_EPSILON = 10e-15;

    /** Lanczos coefficients */
    const LANCZOS = [
        0.99999999999999709182,
        57.156235665862923517,
        -59.597960355475491248,
        14.136097974741747174,
        -0.49191381609762019978,
        .33994649984811888699e-4,
        .46523628927048575665e-4,
        -.98374475304879564677e-4,
        .15808870322491248884e-3,
        -.21026444172410488319e-3,
        .21743961811521264320e-3,
        -.16431810653676389022e-3,
        .84418223983852743293e-4,
        -.26190838401581408670e-4,
        .36899182659531622704e-5,
    ];

    /** Avoid repeated computation of log of 2 PI in logGamma */
    const HALF_LOG_2_PI = 0.5 * FastMath.log(2.0 * FastMath.PI);

    /** The constant value of &radic;(2&pi;). */
    const SQRT_TWO_PI = 2.506628274631000502;

    // limits for switching algorithm in digamma
    /** C limit. */
    const C_LIMIT = 49;

    /** S limit. */
    const S_LIMIT = 1e-5;

    /*
     * Constants for the computation of double invGamma1pm1(double).
     * Copied from DGAM1 in the NSWC library.
     */
   
    const INV_GAMMA1P_M1_A0 = .611609510448141581788E-08;
    const INV_GAMMA1P_M1_A1 = .624730830116465516210E-08;
    const INV_GAMMA1P_M1_B1 = .203610414066806987300E+00;
    const INV_GAMMA1P_M1_B2 = .266205348428949217746E-01;
    const INV_GAMMA1P_M1_B3 = .493944979382446875238E-03;
    const INV_GAMMA1P_M1_B4 = -.851419432440314906588E-05;
    const INV_GAMMA1P_M1_B5 = -.643045481779353022248E-05;
    const INV_GAMMA1P_M1_B6 = .992641840672773722196E-06;
    const INV_GAMMA1P_M1_B7 = -.607761895722825260739E-07;
    const INV_GAMMA1P_M1_B8 = .195755836614639731882E-09;
    const INV_GAMMA1P_M1_P0 = .6116095104481415817861E-08;
    const INV_GAMMA1P_M1_P1 = .6871674113067198736152E-08;
    const INV_GAMMA1P_M1_P2 = .6820161668496170657918E-09;
    const INV_GAMMA1P_M1_P3 = .4686843322948848031080E-10;
    const INV_GAMMA1P_M1_P4 = .1572833027710446286995E-11;
    const INV_GAMMA1P_M1_P5 = -.1249441572276366213222E-12;
    const INV_GAMMA1P_M1_P6 = .4343529937408594255178E-14;
    const INV_GAMMA1P_M1_Q1 = .3056961078365221025009E+00;
    const INV_GAMMA1P_M1_Q2 = .5464213086042296536016E-01;
    const INV_GAMMA1P_M1_Q3 = .4956830093825887312020E-02;
    const INV_GAMMA1P_M1_Q4 = .2692369466186361192876E-03;
    const INV_GAMMA1P_M1_C = -.422784335098467139393487909917598E+00;
    const INV_GAMMA1P_M1_C0 = .577215664901532860606512090082402E+00;
    const INV_GAMMA1P_M1_C1 = -.655878071520253881077019515145390E+00;
    const INV_GAMMA1P_M1_C2 = -.420026350340952355290039348754298E-01;
    const INV_GAMMA1P_M1_C3 = .166538611382291489501700795102105E+00;
	const INV_GAMMA1P_M1_C4 = -.421977345555443367482083012891874E-01;
    const INV_GAMMA1P_M1_C5 = -.962197152787697356211492167234820E-02;
    const INV_GAMMA1P_M1_C6 = .721894324666309954239501034044657E-02;
    const INV_GAMMA1P_M1_C7 = -.116516759185906511211397108401839E-02;
    const INV_GAMMA1P_M1_C8 = -.215241674114950972815729963053648E-03;
    const INV_GAMMA1P_M1_C9 = .128050282388116186153198626328164E-03;
    const INV_GAMMA1P_M1_C10 = -.201348547807882386556893914210218E-04;
	const INV_GAMMA1P_M1_C11 = -.125049348214267065734535947383309E-05;
	const INV_GAMMA1P_M1_C12 = .113302723198169588237412962033074E-05;
    const INV_GAMMA1P_M1_C13 = -.205633841697760710345015413002057E-06;
 
	// -------------------------------------------------------
	// functions
	// -------------------------------------------------------
	
	Gamma.gamma = gamma;
	Gamma.logGamma =  logGamma;
	Gamma.logGamma1p = logGamma1p;
	Gamma.invGamma1pm1 = invGamma1pm1;
	Gamma.lanczos = lanczos;
	
	// -------------------------------------------------------
	// function implementation
	// -------------------------------------------------------
	
	function gamma(x) {
	
		var ret = 0.0;
		var absX = FastMath.abs(x);
		
        if (absX <= 20.0) 
		{
				if (x >= 1.0) 
				{
					 /*
					 * From the recurrence relation
					 * Gamma(x) = (x - 1) * ... * (x - n) * Gamma(x - n),
					 * then
					 * Gamma(t) = 1 / [1 + invGamma1pm1(t - 1)],
					 * where t = x - n. This means that t must satisfy
					 * -0.5 <= t - 1 <= 1.5.
					 */
					var prod = 1.0;
					var t = x;
					while (t > 2.5) {
						t -= 1.0;
						prod *= t;
					}
					ret = prod / (1.0 + invGamma1pm1(t - 1.0));
				}
				else
				{
					 /*
					 * From the recurrence relation
					 * Gamma(x) = Gamma(x + n + 1) / [x * (x + 1) * ... * (x + n)]
					 * then
					 * Gamma(x + n + 1) = 1 / [1 + invGamma1pm1(x + n)],
					 * which requires -0.5 <= x + n <= 1.5.
					 */
					var prod = x;
					var t = x;
				
					while (t < -0.5) {
										t += 1.0;
										prod *= t;
									}
					ret = 1.0 / (prod * (1.0 + invGamma1pm1(t)));
				}
		}
		else{
			var y = absX + LANCZOS_G + 0.5;
            var gammaAbs = SQRT_TWO_PI / x *
                                    FastMath.pow(y, absX + 0.5) *
                                    FastMath.exp(-y) * lanczos(absX);
            if (x > 0.0) 
			{
                ret = gammaAbs;
            } else {
                /*
                 * From the reflection formula
                 * Gamma(x) * Gamma(1 - x) * sin(pi * x) = pi,
                 * and the recurrence relation
                 * Gamma(1 - x) = -x * Gamma(-x),
                 * it is found
                 * Gamma(x) = -pi / [x * sin(pi * x) * Gamma(-x)].
                 */
                ret = -Math.PI / (x * FastMath.sin(Math.PI * x) * gammaAbs);
            }
		}
		
		return ret;
	}
	
	function logGamma(x) {
        var ret;
		
        if (x < 0.5) {
            return logGamma1p(x) - FastMath.log(x);
        } else if (x <= 2.5) {
            return logGamma1p((x - 0.5) - 0.5);
        } else if (x <= 8.0) {
            var n = FastMath.floor(x - 1.5);
            var prod = 1.0;
            for (var i = 1; i <= n; i++) {
                prod *= x - i;
            }
            return logGamma1p(x - (n + 1)) + FastMath.log(prod);
        } else {
            var sum = lanczos(x);
            var tmp = x + LANCZOS_G + .5;
            ret = ((x + .5) * FastMath.log(tmp)) - tmp +
                HALF_LOG_2_PI + FastMath.log(sum / x);
        }

        return ret;
    }
	
	
	function logGamma1p(x) {
        return -FastMath.log1p(invGamma1pm1(x));
    }
	
	function invGamma1pm1(x) {
		var ret = 0.0;	
		var t = x <= 0.5 ? x : (x - 0.5) - 0.5;
		 if (t < 0.0) {
			var a = INV_GAMMA1P_M1_A0 + t * INV_GAMMA1P_M1_A1;
            var b = INV_GAMMA1P_M1_B8;
            b = INV_GAMMA1P_M1_B7 + t * b;
            b = INV_GAMMA1P_M1_B6 + t * b;
            b = INV_GAMMA1P_M1_B5 + t * b;
            b = INV_GAMMA1P_M1_B4 + t * b;
            b = INV_GAMMA1P_M1_B3 + t * b;
            b = INV_GAMMA1P_M1_B2 + t * b;
            b = INV_GAMMA1P_M1_B1 + t * b;
            b = 1.0 + t * b;

            var c = INV_GAMMA1P_M1_C13 + t * (a / b);
            c = INV_GAMMA1P_M1_C12 + t * c;
            c = INV_GAMMA1P_M1_C11 + t * c;
            c = INV_GAMMA1P_M1_C10 + t * c;
            c = INV_GAMMA1P_M1_C9 + t * c;
            c = INV_GAMMA1P_M1_C8 + t * c;
            c = INV_GAMMA1P_M1_C7 + t * c;
            c = INV_GAMMA1P_M1_C6 + t * c;
            c = INV_GAMMA1P_M1_C5 + t * c;
            c = INV_GAMMA1P_M1_C4 + t * c;
            c = INV_GAMMA1P_M1_C3 + t * c;
            c = INV_GAMMA1P_M1_C2 + t * c;
            c = INV_GAMMA1P_M1_C1 + t * c;
            c = INV_GAMMA1P_M1_C + t * c;
            if (x > 0.5) {
                ret = t * c / x;
            } else {
                ret = x * ((c + 0.5) + 0.5);
            }
		 }
		 else{
		   var p = INV_GAMMA1P_M1_P6;
            p = INV_GAMMA1P_M1_P5 + t * p;
            p = INV_GAMMA1P_M1_P4 + t * p;
            p = INV_GAMMA1P_M1_P3 + t * p;
            p = INV_GAMMA1P_M1_P2 + t * p;
            p = INV_GAMMA1P_M1_P1 + t * p;
            p = INV_GAMMA1P_M1_P0 + t * p;

            var q = INV_GAMMA1P_M1_Q4;
            q = INV_GAMMA1P_M1_Q3 + t * q;
            q = INV_GAMMA1P_M1_Q2 + t * q;
            q = INV_GAMMA1P_M1_Q1 + t * q;
            q = 1.0 + t * q;

            var c = INV_GAMMA1P_M1_C13 + (p / q) * t;
            c = INV_GAMMA1P_M1_C12 + t * c;
            c = INV_GAMMA1P_M1_C11 + t * c;
            c = INV_GAMMA1P_M1_C10 + t * c;
            c = INV_GAMMA1P_M1_C9 + t * c;
            c = INV_GAMMA1P_M1_C8 + t * c;
            c = INV_GAMMA1P_M1_C7 + t * c;
            c = INV_GAMMA1P_M1_C6 + t * c;
            c = INV_GAMMA1P_M1_C5 + t * c;
            c = INV_GAMMA1P_M1_C4 + t * c;
            c = INV_GAMMA1P_M1_C3 + t * c;
            c = INV_GAMMA1P_M1_C2 + t * c;
            c = INV_GAMMA1P_M1_C1 + t * c;
            c = INV_GAMMA1P_M1_C0 + t * c;

            if (x > 0.5) {
                ret = (t / x) * ((c - 0.5) - 0.5);
            } else {
                ret = x * c;
            }
		 }
		 
		 return ret;
	}
	
	function lanczos(x) {
        var sum = 0.0;
        for (var i = LANCZOS.length - 1; i > 0; --i) {
            sum += LANCZOS[i] / (x + i);
        }
        return sum + LANCZOS[0];
    }
 
})(this);

