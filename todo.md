* think of providing input channels as multiple connections, where each channel is represented by a texture with N height. It is logical at least.
* think of providing output as a texture of a height N, where each row is for separate channel.
* facilitate interconnected audio-shaders so that they just pass textures one to another instead of converting/unconverting audio buffers. So to let us process sound in GPU with minimal possible delays.
* ensure timeDelta is delta between chunks, not the rendering time
* add destructors, destruct & clean memory on stream end
* detect output type from shader code automatically
* benchmark comparison with native js, e.g. filter node
* pass input chunk data
* shadertoy tests
* frequency shader, where not time but f-domain data passed