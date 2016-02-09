var Shader = require('../');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
// var test = require('tst').only();


// test.only('No-params', function (done) {
	Shader()
	.pipe(Speaker());

	// setTimeout(done, 1000);
// });

// test('Inline code', function (done) {
// 	Shader(`
// 		vec2 mainSound( float time ){
// 			return vec2( sin(6.2831*440.0*time)*exp(-3.0*time) );
// 		}
// 	`)
// 	.pipe(Speaker());

// 	setTimeout(done, 1000);
// });

// test('Glslify');

// test('Transform');

// test('Mono channel');

// test('4 channels');

// test('Different format');

// test('Being a destination');