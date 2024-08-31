uniform float opacity;
    
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uTextureResolution;
uniform float uShowAscii;
uniform float uSize;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {

    float size = uSize;
    
    float aspectY = max(uResolution.y/uResolution.x,1.);
    float aspectX = max(uResolution.x/uResolution.y,1.);

    vec2 sceneUvs = vec2(
        floor(vUv.x * size*aspectX)/(size*aspectX),
        floor(vUv.y * size*aspectY)/(size*aspectY)
    );    
    vec2 newUv = vec2(
        mod(vUv.x * size*aspectX,1.),
        mod(vUv.y * size*aspectY,1.)
    );    


    vec2 finalUvs = newUv;


    vec4 baseTexel = texture2D(tDiffuse,vUv);
    vec4 texel = texture2D( tDiffuse, sceneUvs );

    float textureAspect = uTextureResolution.y/uTextureResolution.x;        
    finalUvs.x*=textureAspect;
    
    //float offset = floor(texel.r*(1./textureAspect));
    float offset = floor(clamp(texel.r,0.,1.)*((1./textureAspect)-1.));

    finalUvs.x+=offset*textureAspect;    
    vec4 char = texture2D(uTexture,finalUvs);        



    vec3 final = vec3(texel.r);
    //gl_FragColor = char;
    gl_FragColor = (1.-step(0.5,uShowAscii))*baseTexel + (step(0.5,uShowAscii))*char;

    //gl_FragColor=vec4(vec3(random(sceneUvs)),1.);

}