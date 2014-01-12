//Hard dependency on Utils
//Only parses one level deep, written mainly because I was bored
;var JSONParser = function() {
	"use strict";
	
	//Constants used for parsing
	var startDelimMap = '{[';
	var endDelimMap = { '}' : '{', ']' : '[' };
	var symmetricDelimMap = '\'"';
	var escapeChar = "\\";
	
	//Generate JSON from an array of key-value pairs (ex: [[key1,val1],[key2,val2]] )
	//Can pass an optional indent level (default is 1)
	function generate(vals) {
		var json = '{\n';
		json += Utils.join(',\n', vals.map(function(x) { return '\t' + x[0] + ' : ' + generateObjectIndentation(x[1].replace(/\n(\s+)/g,'\n')); }));
		json += '\n' + '}';
		return json;
	}
	
	//Generate proper inner indentation for JSON objects
	function generateObjectIndentation(text) {
		var stack = [];
		var res = '';
		var idx = 0;
		var c = text[idx];
		while(c) {
			if(c == '{') {
				stack.push('{');
			} else if(c == '}') {
				stack.pop();
				if(Utils.last(res) == '\t') {
					res = res.substring(0, res.length - 1); //remove extra tab at end
				}
			} 
			
			if(c == '\n') {
				res += '\n' + Utils.repeat('\t', stack.length + 1);				
			} else {
				res += c;				
			}
			
			idx += 1;
			c = text[idx];
		}
		
		return res;
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
	function splitCommas(text) {
		text = Utils.getBracketInner(removeComments(text));
		var res = [];
		var stack = [];
		var idx = 0;
		var currentKVPair = '';
		var c = text[idx];
		var foundEscape = false;
		while(c) {
			if(foundEscape) {
				foundEscape = false;
			} else if(c == escapeChar) {
				foundEscape = true;		
			} else if(symmetricDelimMap.indexOf(c) != -1) {
				if(Utils.last(stack) == c) {
					stack.pop();
				} else {
					stack.push(c);
				}
			} else if(endDelimMap[c]) {
				var token = endDelimMap[c];
				var tokenMatch = stack.pop();
				if(token != tokenMatch) {
					throw 'Error: Unmatched delimeters: ' + token + ' ' + tokenMatch;					
				}
			} else if(startDelimMap.indexOf(c) != -1) {
				stack.push(c);
			} 
			
			if(c == ',' && stack.length == 0) {
				res.push(currentKVPair);
				currentKVPair = '';
			} else {
				currentKVPair += c;
			}
			
			idx += 1;
			c = text[idx];
		}
		
		if(stack.length != 0) {
			throw 'Error: Unmatched delims left! ' + stack;
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