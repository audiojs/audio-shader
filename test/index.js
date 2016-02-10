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
	Shader(`
	`).pipe(Speaker());

	setTimeout(done, 1000);
});

test('Moving average filter');

test('Transform');

test('Mono channel');

test('4 channels');

test('Different format');

test('Being a destination');

test.skip('Node-speaker', function () {

});

test('Noisy', function (done) {
	this.timeout(Infinity);

	Shader(glslify('./sounds/noisy'))
	.pipe(Speaker());


	setTimeout(done, 5000);
});

test('audio-shader vs audio-through')