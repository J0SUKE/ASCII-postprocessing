uniform float opacity;
    
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

    vec4 texel = texture2D( tDiffuse, vUv );

    vec3 final = vec3(step(0.1,texel.r));

    gl_FragColor = vec4(final,1.);
}