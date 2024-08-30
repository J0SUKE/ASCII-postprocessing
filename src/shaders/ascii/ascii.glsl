uniform float opacity;
    
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
varying vec2 vUv;


void main() {

    float size = 100.;
    
    float aspectY = min(uResolution.y/uResolution.x,1.);
    float aspectX = min(uResolution.x/uResolution.y,1.);

    vec2 newUv = vec2(
        floor(vUv.x * size*aspectX)/(size*aspectX),
        floor(vUv.y * size*aspectY)/(size*aspectY)
    );    


    vec2 finalUvs = newUv;

    
    vec4 texel = texture2D( tDiffuse, finalUvs );

    vec3 final = vec3(texel.r);
    gl_FragColor = vec4(final,1.);

}