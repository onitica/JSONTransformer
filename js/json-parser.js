//Hard dependency on Utils
//Only parses one level deep, written mainly because I was bored
;var JSONParser = function() {
	"use strict";
	
	//Generate JSON from an array of key-value pairs (ex: [[key1,val1],[key2,val2]] )
	function generate(vals) {
		var json = '{\n';
		json += Utils.join(',\n', vals.map(function(x) { return '\t' + x[0] + ' : ' + x[1]; }));
		json += '\n}';
		return json;
	}
	
	//Validate that we have parsed valid JSON
	//Checks to see each parsed val is an array of 2, and that none of the elements are empty
	function validateParsedVals(parsedVals) {
		parsedVals.filter(function(val) {
			if(val.length != 2 || val[0] === '' || val[1] === '') {
				throw 'Invalid JSON: ' + val;
			} else if(val[0].indexOf('\n') != -1) {
				throw 'Invalid JSON! Unexecpted newline: ' + val;
			}
		});
		return parsedVals;
	}
	
	//Generate a matrix of key value pairs from the string
	function parse(text) {
		return validateParsedVals(Utils.getBracketInner(text).split(',').map(function(s) { return s.split(':').map(Utils.strip); }));
	}
	
	return {
		generate : generate,
		parse : parse
	}
}();