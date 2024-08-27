import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import asciiFragment from '../../src/shaders/ascii/ascii.glsl'

export default class AsciiEffect {
  composer: EffectComposer
  asciiPass: ShaderPass
  shader: {
    name: string
    uniforms: { [name: string]: { value: any } }
    vertexShader: string
    fragmentShader: string
  }

  constructor() {
    this.createShader()

    this.asciiPass = new ShaderPass(this.shader)
  }

  createShader() {
    this.shader = {
      name: 'CopyShader',

      uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
      },

      vertexShader: /* glsl */ `
    
            varying vec2 vUv;
    
            void main() {
    
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
            }`,

      fragmentShader: asciiFragment,
    }
  }
}
