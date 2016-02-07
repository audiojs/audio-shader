/**
 * A replacement for headless-gl.
 * TODO: replace with headless-gl.
 *
 * @module  audio-shader/gl
 */

'use strict'

function createContext(width, height, options) {
    var canvas = document.createElement("canvas")
    if (!canvas) {
        return null
    }
    canvas.width  = width
    canvas.height = height
    try {
        var gl = canvas.getContext("experimental-webgl", options)
        if (gl) {
            return gl
        }
    } catch (e) {}
    try {
        var gl = canvas.getContext("webgl", options)
        if (gl) {
            return gl
        }
    } catch (e) {}

    //Patch in headless-gl extra methods
    gl.resize = function(w, h) {
      canvas.width  = w
      canvas.height = h
    }
    gl.destroy = function() {}

    return null
}

module.exports = createContext