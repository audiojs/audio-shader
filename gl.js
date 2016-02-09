/**
 * A replacement for headless-gl.
 * TODO: replace with headless-gl.
 *
 * Provides any gl-context available, checks whether it is good for calculations.
 * Could be suitable for gl-compute as well, but we need then provide method of setting/reading floats.
 *
 * @module  audio-shader/gl
 */


var glExt = require("webglew");


function createContext(width, height, options) {
	var canvas = document.createElement("canvas")
	if (!canvas) {
		return null
	}
	canvas.width  = width
	canvas.height = height

	try {
		var gl = canvas.getContext("webgl2", options)
	} catch (e) {}
	if (!gl) {
		try {
			var gl = canvas.getContext("webgl", options)
		} catch (e) {}
	}
	if (!gl) {
		try {
			var gl = canvas.getContext("experimental-webgl", options)
		} catch (e) {
		}
	}
	if (!gl) {
		//TODO: cast to fake-gl
		// var gl = require('fake-gl')(width, height, options);
		throw 'Could not find available webgl in your environment';
	}

	//Patch in headless-gl extra methods
	gl.resize = function(w, h) {
	  canvas.width  = w
	  canvas.height = h
	}
	gl.destroy = function() {}


	// Check WebGL Extensions
	var glExtensions = glExt(gl);
	try {
		if ( !glExtensions.OES_texture_float ) throw "Available webgl does not support OES_texture_float extension."
	} catch ( error ) { console.log( error, glExtensions )}
	try {
		if ( !glExtensions.OES_texture_float_linear ) throw "Available webgl does not support OES_texture_float_linear extension."
	} catch ( error ) { console.log( error, glExtensions )}


	return gl;
}

module.exports = createContext