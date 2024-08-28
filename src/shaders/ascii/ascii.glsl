uniform float opacity;
    
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

    float size = 200.;
    vec2 newUv = floor(vUv*size)/size;
    
    vec4 texel = texture2D( tDiffuse, newUv );

    vec3 final = vec3(texel.r);

    gl_FragColor = vec4(final,1.);
}