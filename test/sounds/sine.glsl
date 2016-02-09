vec2 mainSound( float time ){
	return vec2( sin(6.2831*660.0*time)*exp(-3.0*time) );
}