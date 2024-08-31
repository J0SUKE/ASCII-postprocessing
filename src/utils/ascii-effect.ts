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
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  characters: string

  constructor() {
    //provide a power of 2 number of characters
    //8
    //16
    //32
    //64

    //this.characters = " .`-,:;'_~^=+<>i!lI?/|()1{}[]rcvuxzjftnLYJCVoZUwXhkmOa*#MW&8%B@$" //64
    this.characters = " .-:'~=<il?|){[rxjtLJVZwhma#W8%@" //32

    this.createShader()

    this.asciiPass = new ShaderPass(this.shader)

    window.addEventListener('resize', this.onResize.bind(this))

    this.createCanvas()
  }

  onResize() {
    this.asciiPass.material.uniforms.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
    this.asciiPass.material.uniforms.uSize.value = Math.floor(Math.min(window.innerHeight, window.innerWidth) / 9)
  }

  createShader() {
    this.shader = {
      name: 'CopyShader',

      uniforms: {
        tDiffuse: { value: null },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTexture: {
          value: new THREE.Vector4(),
        },
        uTextureResolution: {
          value: new THREE.Vector2(this.characters.length * 128, 128),
        },
        opacity: { value: 1.0 },
        uShowAscii: { value: 1 },
        uSize: { value: Math.floor(Math.min(window.innerHeight, window.innerWidth) / 9) },
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

  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.shader.uniforms.uTextureResolution.value.x
    this.canvas.height = this.shader.uniforms.uTextureResolution.value.y

    this.canvas.style.position = 'fixed'
    this.canvas.style.top = '0px'
    this.canvas.style.left = '0px'
    this.canvas.style.zIndex = '1000' // Ensure it's above other elements

    //document.body.appendChild(this.canvas)

    // Get the 2D rendering context
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    // Example: Draw something on the canvas
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.font = '92px monospace' // Adjust size if needed
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = 'white'

    // Draw each character
    for (let i = 0; i < this.characters.length; i++) {
      const char = this.characters[i]
      const x = i * this.canvas.height + this.canvas.height / 2
      const y = this.canvas.height / 2
      this.ctx.fillText(char, x, y)
    }

    const texture = new THREE.CanvasTexture(this.canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearFilter

    this.asciiPass.material.uniforms.uTexture.value = texture
  }
}
