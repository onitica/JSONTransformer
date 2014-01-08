;var Utils = function() { 
	"use strict";
	
	//Strip starting and ending whitespace from a string
	function strip(s) {
		return s.replace(/^\s+|\s+$/g,'');
	}

	//Similar functionality to python's join
	function join(s, arr) {
		var str = arr[0];
		for(var i = 1; i < arr.length; i++) {
			str += s + arr[i];
		}
		return str;
	}
	
	//Return the text inside the brackets
	function getBracketInner(text) {
		return strip(text.substring(text.indexOf('{') + 1,text.lastIndexOf('}')));
	}
	
	//Shamelessly stolen from Prototype lib
	function argumentNames(fn) {
	  var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
	    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
	    .replace(/\s+/g, '').split(',');
	  return names.length == 1 && !names[0] ? [] : names;
	}
	
	//Generic Constructor function (stolen from http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible)
	function construct(constructor, args) {
	    function F() {
	        return constructor.apply(this, args);
	    }
	    F.prototype = constructor.prototype;
	    return new F();
	}
	
	//Creates a function from a function string
	//Could use eval instead, mostly just messing around to see if I can destruct and recreate function properly
	function createFunction(fn) {
		var args = argumentNames(fn);
		args.push(getBracketInner(fn));
		return construct(Function.constructor, args);
	}
	
	return {
		argumentNames : argumentNames,
		createFunction : createFunction,
		construct : construct,
		getBracketInner : getBracketInner,
		join : join,
		strip : strip
	}
}();