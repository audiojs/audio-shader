Shader-based audio processing stream.

```js
var Processor = require('audio-shader');
var Generator = require('audio-generator');
var Speker = require('audio-speaker');

Generator(function (time) {
	return Math.random() * 2 - 1;
})
.pipe(Processor(
	shaderCode,
	{
		inline: false,
		precision: 'medium',
		channels: 2,
		//inputs, copied from shadertoy
	}))
.pipe(Speaker());
```