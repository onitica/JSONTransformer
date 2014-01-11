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
	
	function removeComments(text) {
		//Remove single line comments and any spaces inbetween and then remove multi-line comments
		return text.replace(/[\t ]+\/\/.*\n/g,'').replace(/\/\*[\s\S]*?\*\//gm,''); 
	}
	
	//Remove empty lines and all line endings from text
	//TODO: Use for testing in future
	function removeLineEndings(text) {
		return text.replace(/[\s]+\n|\n/g,'');
	}
	
	//Generate a matrix of key value pairs from the string
	function parse(text) {
		return validateParsedVals(Utils.getBracketInner(removeComments(text)).split(',').map(function(s) { return s.split(':').map(Utils.strip); }));
	}
	
	return {
		generate : generate,
		parse : parse
	}
}();