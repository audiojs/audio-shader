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

	//set of global variables
	var globals = `
		precision mediump float;
		precision mediump int;

		uniform vec3      iResolution;           // viewport resolution (in pixels)
		uniform float     iGlobalTime;           // shader playback time (in seconds)
		uniform float     iTimeDelta;            // render time (in seconds)
		uniform int       iFrame;                // shader playback frame
		uniform float     iChannelTime[4];       // channel playback time (in seconds)
		uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
		uniform sampler2D iChannel0;             // input channel1
		uniform sampler2D iChannel1;             // input channel2
		uniform sampler2D iChannel2;             // input channel3
		uniform sampler2D iChannel3;             // input channel4
		uniform vec4      iDate;                 // (year, month, day, time in seconds)
		uniform float     iSampleRate;           // sound sample rate (i.e., 44100)
	`;

	//setup shader
	this.shader = Shader(gl, `
		${globals}

		attribute vec2 position;
		varying float time;

		void main (void) {
			gl_Position = vec4(position, 0, 1);
			time = iGlobalTime + (position.x * 0.5 + 0.5) * iResolution.x / iSampleRate;
		}`,	`
		${globals}

		varying float time;

		${this.shaderCode}

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
	this.shader.uniforms.iResolution = [w, channels, 1];
	this.shader.uniforms.iSampleRate = this.inputFormat.sampleRate;

	//set framebuffer as a main target
	this.framebuffer = new Framebuffer(gl, [w, 1], {
		// preferFloat: true,
		float: true,
		depth: false,
		color: 1
	});
	this.framebuffer.bind();

	//clean on end
	this.on('end', function () {
		throw 'Unimplemented';
	});
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
	this.shader.uniforms.iGlobalTime = this.time;

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
