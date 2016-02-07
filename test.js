var Shader = require('./');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');


Generator(function (time) {
	return 0;
	// return [
	// 	Math.sin(time * Math.PI * 2 * 438),
	// 	Math.sin(time * Math.PI * 2 * 442)
	// ]
}, {
	duration: 1
})
.pipe(Shader('\
	vec2 mainSound( float time ){\
		return vec2( sin(6.2831*440.0*time)*exp(-3.0*time) );\
	}\
'))
.pipe(Speaker());


setTimeout(function () {}, 1000);