//Hard dependency on Utils
//Only parses one level deep, written mainly because I was bored
;var JSONParser = function() {
	"use strict";
	
	//Generate JSON from an array of key-value pairs (ex: [[key1,val1],[key2,val2]] )
	//Can pass an optional indent level (default is 1)
	function generate(vals, indentLevel) {
		if(!indentLevel) indentLevel = 1;
		var json = '{\n';
		json += Utils.join(',\n', vals.map(function(x) { return Utils.repeat('\t',indentLevel) + x[0] + ' : ' + x[1]; }));
		json += '\n' + Utils.repeat('\t',indentLevel-1) + '}';
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
		return text.replace(/([\s]+)?\n/g,'');
	}
	
	//Split a JSON string into key value pairs, but not prematurely splitting values
	//Strips indentation on arrays
	var delimMap = { '{' : '}', '[' : ']' };
	var reverseDelimMap = { '}' : '{', ']' : '[' };
	var symmetricDelimMap = '\'"';
	function splitCommas(text) {
		text = Utils.getBracketInner(removeComments(text));
		var res = [];
		var stack = [];
		var idx = 0;
		var currentKVPair = '';
		var c = text[idx];
		while(c) {
			if(symmetricDelimMap.indexOf(c) != -1) {
				if(Utils.last(stack) == c) {
					stack.pop();
				} else {
					stack.push(c);
				}
				currentKVPair += c;
			} else if(reverseDelimMap[c]) {
				var token = reverseDelimMap[c];
				var tokenMatch = stack.pop();
				if(token == tokenMatch) {
					currentKVPair += c;
				} else {
					throw 'Error: Unmatched delimeters: ' + token + ' ' + tokenMatch;					
				}
			} else if(delimMap[c]) {
				stack.push(c);
				currentKVPair += c;
			} else if(c == ',' && stack.length == 0) {
				res.push(currentKVPair);
				currentKVPair = '';
			} else {
				currentKVPair += c;
			}
			
			idx += 1;
			c = text[idx];
		}
		
		if(currentKVPair.length > 0) {
			res.push(currentKVPair);
		}
		return res;
	}
	
	function splitJSONVal(val) {
		var parsed = val.split(/:([\s\S]+)?/m);
		return [Utils.strip(parsed[0]),Utils.strip(parsed[1])];
	}
	
	//Generate a matrix of key value pairs from the string
	function parse(text) {
		return validateParsedVals(splitCommas(text).map(function(s) { return splitJSONVal(s) }));
	}
	
	return {
		generate : generate,
		parse : parse,
		splitCommas : splitCommas,
		splitJSONVal : splitJSONVal
	}
}();