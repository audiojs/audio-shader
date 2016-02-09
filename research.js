var glBuffer = require('gl-buffer');
var glslify = require('glslify');
var Texture = require('gl-texture2d');
var Framebuffer = require('gl-fbo');
var Shader = require('gl-shader');
var mat4     = require('gl-mat4');
var wa = require('audio-context');
//TODO replace with ./gl req, without raf-component
var gl = require('gl-context')(canvas, render);
var clear = require('gl-clear')({ color: [0, 0, 0, 1] })





var canvas = document.body.appendChild(document.createElement('canvas'));


//init waa
var mSampleRate = 44100;
var mPlayTime = 60;
var mPlaySamples = mPlayTime * mSampleRate;
var mBuffer = wa.createBuffer( 2, mPlaySamples, mSampleRate );

//init texture for shader
//TODO: replace with gl-texture
var mTextureDimensions = 512;
var mRenderTexture = createTexture(mRenderer.TEXTYPE.T2D,
									mTextureDimensions, mTextureDimensions,
									mRenderer.TEXFMT.C4I8,
									mRenderer.FILTER.NONE,
									mRenderer.TEXWRP.CLAMP, null);

//create framebuffer as a rendering target
//TODO: replace with gl-fbo
var mRenderFBO = mRenderer.CreateRenderTarget(mRenderTexture, null, null, null, null, false);
var id = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, id);
gl.bindRenderbuffer(gl.RENDERBUFFER, null);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);


// ArrayBufferView pixels;
var mTmpBufferSamples = mTextureDimensions*mTextureDimensions;
var mData = new Uint8Array( mTmpBufferSamples*4 );

var mPlayNode = null;




//gl-related stuff
//TODO: move sources out
var shader = Shader(gl,
	glslify([
		'precision mediump float;',

		// 'attribute vec3 aPosition;',
		// 'varying vec3 vColor;',
		// 'attribute vec3 aColor;',

		// 'uniform mat4 uModelView;',
		// 'uniform mat4 uProjection;',

		'uniform float iChannelTime[4];',
		'uniform float iBlockOffset;',
		'uniform vec4  iDate;',
		'uniform float iSampleRate;',
		'uniform vec3  iChannelResolution[4];',
		'uniform sampler2D iChannel1',

		'void main() {',
		// '	gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);',
		// '	vColor = aColor;',
		'}',
	].join('\n'), {inline: true}),
	glslify([
		'precision mediump float;',
		// 'varying vec3 vColor;',
		'vec2 mainSound( float time )',
		'{',
		'	return vec2( sin(6.2831*440.0*time)*exp(-3.0*time) );',
		'}',
		'',
		'void main() {',
		'	float t = iBlockOffset + ((gl_FragCoord.x-0.5) + (gl_FragCoord.y-0.5)*512.0)/iSampleRate;',
		'	vec2 y = mainSound( t );',
		'	vec2 v  = floor((0.5+0.5*y)*65536.0);',
		'	vec2 vl = mod(v,256.0)/255.0;',
		'	vec2 vh = floor(v/256.0)/255.0;',
		'	gl_FragColor = vec4(vl.x,vh.x,vl.y,vh.y);',
		'}'
	].join('\n'), {inline: true})
);

// shader.attributes.aPosition.location = 0;
// shader.attributes.aColor.location = 1;




/**
 * Rendering fn
 */
function render () {
	var width = gl.drawingBufferWidth;
	var height = gl.drawingBufferHeight;

	// Clear the screen and set the viewport before
	// drawing anything
	clear(gl);
	gl.viewport(0, 0, width, height);

	//TODO: why those are here?
	// Calculate projection matrix
	// mat4.perspective(projectionMatrix, Math.PI / 4, width / height, 0.1, 100)
	// Calculate triangle's modelView matrix
	// mat4.identity(triangleMatrix, triangleMatrix)
	// mat4.translate(triangleMatrix, triangleMatrix, [-1.5, 0, -7])
	// Calculate squares's modelView matrix
	// mat4.copy(squareMatrix, triangleMatrix)
	// mat4.translate(squareMatrix, squareMatrix, [3, 0, 0])

	// Bind the shader
	shader.bind()
	// shader.uniforms.uProjection = projectionMatrix


	// Draw the triangle
	// shader.uniforms.uModelView = triangleMatrix
	// triangle.vertices.bind()
	// shader.attributes.aPosition.pointer()
	// triangle.colors.bind()
	// shader.attributes.aColor.pointer()

	//render one vertex
	gl.drawArrays(gl.TRIANGLES, 0, 1)
}


