/**
 * @module  audio-shader
 */

var Through = require('audio-through');
var inherits = require('inherits');
var GL = require('./gl');
var Shader = require('gl-shader');
var Texture = require('gl-texture2d');
var Framebuffer = require('gl-fbo');


/**
 * @constructor
 *
 * @param {Function} fn Shader code
 * @param {Object} options Options
 */
function AudioShader (shaderCode, options) {
	if (!(this instanceof AudioShader)) return new AudioShader(shaderCode, options);

	//resolve options
	if (!options) {
		if (typeof shaderCode !== 'string') {
			options = shaderCode || {};
		}
		else {
			options = {};
		}
	}

	//create a default shaderCode, if not defined
	if (!options.shaderCode) {
		options.shaderCode = shaderCode;
	}

	Through.call(this, options);

	var w = this.inputFormat.samplesPerFrame;

	//refine number of channels - vec4 is max output
	var channels = this.inputFormat.channels = Math.min(this.inputFormat.channels, 4);

	//refine shader code, if not passed
	if (!this.shaderCode) {
		var vecType = channels === 1 ? 'float' : ('vec' + channels);
		this.shaderCode = `${vecType} mainSound( float time ){
			return ${vecType}( sin(6.2831*440.0*time)*exp(-3.0*time) );
		}`;
	}

	//set up webgl canvas
	//TODO: think of sharing canvas between instances by updating canvas width
	var gl = this.gl = GL(w, 1);

	//FIXME: find out what that does, it is for performance or what?
	gl.disable(gl.DEPTH_TEST);

	//setup shader
	this.shader = Shader(gl, `
		precision mediump float;
		attribute vec2 position;
		uniform float frameLength;
		uniform float sampleRate;
		uniform float lastTime;
		varying float time;

		void main (void) {
			gl_Position = vec4(position, 0, 1);
			time = lastTime + (position.x * 0.5 + 0.5) * frameLength / sampleRate;
		}`,
		`precision mediump float;
		varying float time;
		uniform sampler2D data;

		${shaderCode}

		void main (void) {
			vec4 result = vec4(mainSound(time)${channels === 1 ? ', 0, 0, 0);' : channels === 3 ? ', 0);' : channels === 4 ? ');' : ', 0, 0);'}
			gl_FragColor = result;
		}`);

	this.shader.bind();

	//set up 0...N rendering vertex (default size of the block)
	buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);
	this.shader.attributes.position.pointer();

	//set up audio params
	this.shader.uniforms.frameLength = w;
	this.shader.uniforms.sampleRate = this.inputFormat.sampleRate;

	//set framebuffer as a main target
	this.framebuffer = new Framebuffer(gl, [w, 1], {
		// preferFloat: true,
		float: true,
		depth: false,
		color: 1
	});
	this.framebuffer.bind();
}

inherits(AudioShader, Through);



/**
 * Send chunk to audio-shader, invoke done on return.
 * The strategy: render each audio channel to it’s own line in result
 * TODO: thing to replace with textures
 * TODO: set rendering target not drawing buffer
 * TODO: provide input channels as textures
 * TODO: provide values of previous input/output to implement filters
 */
AudioShader.prototype.process = function (chunk, done) {
	var gl = this.gl;

	//set up current chunk as a texture
	// var texture = new Texture(gl, chunk);
	// this.shader.uniforms.data = texture.bind();

	//preset new time value
	this.shader.uniforms.lastTime = this.time;

	//render chunk
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	var w = this.inputFormat.samplesPerFrame;

	//read data from the render
	//NOTE: reading floats back from drawing is not possible, need pack them as rgba
	var result = new Float32Array(w * 1 * 4);
	gl.readPixels(0, 0, w, 1, gl.RGBA, gl.FLOAT, result);

	//transform result to buffer channels (color channel per audio channel)
	for (var channel = 0, l = Math.min(chunk.numberOfChannels, 1); channel < l; channel++) {
		var cData = chunk.getChannelData(channel);
		for (var i = 0; i < w; i++) {
			cData[i] = result[i * 4 + channel];
		}
	}

	done();
}


module.exports = AudioShader;
