uniform float opacity;
    
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uTextureResolution;
uniform float uShowAscii;

void main() {

    float size = 150.;
    
    float aspectY = min(uResolution.y/uResolution.x,1.);
    float aspectX = min(uResolution.x/uResolution.y,1.);

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
    
    float offset = floor(texel.r*(1./textureAspect));

    finalUvs.x+=offset*textureAspect;    
    vec4 char = texture2D(uTexture,finalUvs);        



    vec3 final = vec3(texel.r);
    //gl_FragColor = char;
    gl_FragColor = (1.-step(0.5,uShowAscii))*baseTexel + (step(0.5,uShowAscii))*char;

}