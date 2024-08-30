import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import asciiFragment from '../../src/shaders/ascii/ascii.glsl'
import * as THREE from 'three'

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

    window.addEventListener('resize', this.onResize.bind(this))
  }

  onResize() {
    this.shader.uniforms.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
  }

  createShader() {
    this.shader = {
      name: 'CopyShader',

      uniforms: {
        tDiffuse: { value: null },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
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
