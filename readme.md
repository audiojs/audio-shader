Webgl-based audio processing stream.

[![npm install audio-shader](https://nodei.co/npm/audio-shader.png?mini=true)](https://npmjs.org/package/audio-shader/)

```js
var ShaderSound = require('audio-shader');
var Speker = require('audio-speaker');

//Create shader stream based on sound processing function
ShaderSound(`
	vec2 mainSound( float time ){
		return vec2( sin(6.2831*880.0*time)*exp(-3.0*time) );
	}
`)

//Send generated sound to speaker
.pipe(Speaker());
```

### API

API is fully compatible with [shadertoy](https://www.shadertoy.com/) sound to safely copy-paste and run it’s code locally. Note that shadertoy limits output sound to `60s`, whereas _audio-shader_ runs till it is stoped.

It also might be found helpful to use [glslify](https://www.npmjs.com/package/glslify) to get code inserted neatly:

```js
//index.js
var Shader = require('audio-shader');
var Speaker = require('speaker');
var glslify = require('glslify');

Shader(glslity('./sound.glsl')).pipe(Speaker());
```

```glsl
//sound.glsl
vec2 mainSound( float time ){
	return vec2( sin(6.2831*440.0*time)*exp(-3.0*time) );
}
```

Audio-shader can also be used as a processing stream. It has interface of [audio-through](https://github.com/audio-lab/audio-through), which is basically a [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform), so it can be safely used with other node streams.

```js
var MusicXML = require('musicxml-to-pcm');
var Processor = require('audio-shader');
var Speaker = require('speaker');

MusicXML()
.pipe(Processor(`
	vec2 main (float time) {
		//TODO test this example and document it, shadertoy is down
		return vec2();
	}
`))
.pipe(Speaker());
```


### Related

> [shadertoy](https://www.shadertoy.com) — sound playground online.<br/>
> [glslify](https://www.npmjs.com/package/glslify) — require glsl-packages in browserify fashion.<br/>
> [stack-gl](http://stack.gl) — set of components reducing complexity of working with webgl.<br/>
> [audio-through](https://github.com/audio-lab/audio-through) — audio processing stream for node/browser.<br/>
> [gl-compute](https://www.npmjs.com/package/gl-compute) — computations on shaders.<br/>