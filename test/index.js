var Shader = require('../');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var glslify = require('glslify');
var test = require('tst');


test('Inline code', function (done) {
	Shader(`
		vec2 mainSound( float time ){
			return vec2( sin(6.2831*880.0*time)*exp(-3.0*time) );
		}
	`)
	.pipe(Speaker());

	setTimeout(done, 500);
});

test('No-params', function (done) {
	Shader()
	.pipe(Speaker());

	setTimeout(done, 500);
});

test('Glslify', function (done) {
	Shader(glslify('./sounds/sine'))
	.pipe(Speaker());

	setTimeout(done, 500);
});


test('Shadertoy env', function (done) {
// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iGlobalTime;           // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)
});

test('Moving average filter');

// test('Transform');

// test('Mono channel');

// test('4 channels');

// test('Different format');

// test('Being a destination');

test('Noisy', function (done) {
	this.timeout(Infinity);

	Shader(glslify('./sounds/noisy'))
	.pipe(Speaker());


	setTimeout(done, 5000);
});