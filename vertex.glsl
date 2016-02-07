precision mediump float;
attribute vec2 position;
void main (void) {
	gl_Position = vec4(position, 0, 1);
}