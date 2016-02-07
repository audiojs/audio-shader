/**
 * @module  audio-shader
 */

var Through = require('audio-through');
var inherits = require('inherits');
var GL = require('./gl');
var glslify = require('glslify');
var Shader = require('gl-shader');
var unpackFloat = require('glsl-read-float');


//set up webgl canvas
var w = 1024;
var gl = GL(w, 1);
var shader = Shader(gl, glslify('./vertex.glsl'), glslify('./fragment.glsl'));
shader.bind();

//set up 0...N rendering vertex (default size of the block)
buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 4, 4, -1]), gl.STATIC_DRAW);
shader.attributes.position.pointer();


/**
 * @constructor
 *
 * @param {Function} fn Shader code
 * @param {Object} options Options
 */
function AudioShader (fn, options) {
	if (!(this instanceof AudioShader)) return new AudioShader(fn, options);

	Through.call(this, options);
}

inherits(AudioShader, Through);


/**
 * Send chunk to audio-shader, invoke done on return
 */
AudioShader.prototype.process = function (chunk, done) {
	//buffer rendering loop
	// var bufL = this.mBuffer.getChannelData(0);
	// var bufR = this.mBuffer.getChannelData(1);
	// var numBlocks = this.mPlaySamples / numSamples;
	// for( var j=0; j<numBlocks; j++ )
	// {
	// 	var off = j*this.mTmpBufferSamples;

	// 	this.mRenderer.SetShaderConstant1F_Pos(l2, off / this.mSampleRate);
	// 	this.mRenderer.DrawUnitQuad_XY(l1);
	// 	this.mRenderer.GetPixelData(this.mData, this.mTextureDimensions, this.mTextureDimensions);

	// 	for( var i=0; i<numSamples; i++ )
	// 	{
	// 		bufL[off+i] = -1.0 + 2.0*(this.mData[4*i+0]+256.0*this.mData[4*i+1])/65535.0;
	// 		bufR[off+i] = -1.0 + 2.0*(this.mData[4*i+2]+256.0*this.mData[4*i+3])/65535.0;
	// 	}
	// }

	//render chunk
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	//read data from the render
	//NOTE: reading floats back from drawing is not possible, need to hack
	var result = new Uint8Array(w * 4);
	gl.readPixels(0, 0, w, 1, gl.RGBA, gl.UNSIGNED_BYTE, result);
	result = new Float32Array(result.buffer);

	//transform result to buffer channels (color channel per audio channel)
	for (var channel = 0, l = Math.min(chunk.numberOfChannels, 4); channel < l; channel++) {
		var cData = chunk.getChannelData(channel);
		for (var i = 0; i < w; i++) {
			cData[i] = -1 + 2 * result[channel * w + i];
		}
	}

	setTimeout(done, 1000);
}


module.exports = AudioShader;
