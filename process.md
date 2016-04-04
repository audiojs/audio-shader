## Questions

* Can we readPixels data per rendered channel?
	* There is a difficulty with that. As far we want to return vec2, vec3 or vec4, our fragshader should encode valuw
* How to walk the audio chunk within the shader?
	* Shadertoy interpolates chunk from the vertex shader by a fragment shader so that it goes for each time value for 2 channels. Just as you would walk the triangle.
	* It passes chunk data as a 2d texture of a size 512
* How to get the calculated "color" (in fact - sound) value back to audio shader?
	* readPixels gets the data from the canvas (current framebuffer) - that is done in shadertoy
	* but we should try passing by reference, or modifying texture, or something else
* How to control pressure?
	* No need. Shader is always sync-style coded, so each audio-through callback fetches data from the framebuffer, sets new framebuffer processing and sends the fetched data. It causes delay, but it ensures data is processed in a flow with no delays. Pressure is controlled by audio-speaker.

* What are the principles, the difference audio-shadertoy and audio-shader?
	* Audio-shader can take any input shader, the only contract is that the output is treated as audiobuffer. Shadertoy takes only source code.
	* Audio-shader processes rect chunks - triangles, shadertoy processes fragments.
	* Channel should not be represented by lines, as vec/mat form is easier to manipulate cross-channels.
