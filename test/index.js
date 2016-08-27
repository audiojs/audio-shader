var Shader = require('../');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var glslify = require('glslify');
var test = require('tst');
var Slice = require('audio-slice');
var fs = require('fs');
var isBrowser = require('is-browser');


test('Inline code', function (done) {
	Shader(`
		vec2 mainSound( float time ){
			return vec2( sin(6.2831*880.0*time)*exp(-3.0*time) );
		}
	`)
	.pipe(Slice(1))
	.pipe(Speaker());

	setTimeout(done, 500);
});

test('No-params', function (done) {
	Shader()
	.pipe(Speaker());

	setTimeout(done, 500);
});

test('Glslify', function (done) {
	var src = fs.readFileSync(__dirname + '/sounds/sine.glsl', 'utf-8');

	// Shader(glslify('./sounds/sine'))
	Shader(src)
	.pipe(Speaker());

	setTimeout(done, 500);
});

test.skip('Shadertoy env', function (done) {
	Shader(`
		vec2 mainSound (float time) {
			return vec2(texture2D(), texture2D());
		}
	`)
	.pipe(Speaker());

	setTimeout(done, 1000);
});

test('Moving average filter');

test.skip('Transform', function (done) {
	Shader(`
		vec2 mainSound (float time) {
			return vec2(texture2D(), texture2D());
		}
	`)
	.pipe(Speaker());

	setTimeout(done, 1000);
});

test.skip('Multiple inputs', function () {
	var mixer = Shader(`

	`)
});

test('Mono channel');

test('4 channels');

test('Different format');

test('Being a destination');

test.skip('Node-speaker', function () {

});

test('Noisy', function (done) {
	//FIXME: this example does not work in node, guess the compiler is guilty
	if (!isBrowser) return;

	this.timeout(Infinity);

	var src = fs.readFileSync(__dirname + '/sounds/noisy.glsl', 'utf-8');

	var s = Shader(src)

	.pipe(Speaker());
	// setTimeout(done, 5000);
	// s.process([], function () {});
});

test('audio-shader vs audio-through')
