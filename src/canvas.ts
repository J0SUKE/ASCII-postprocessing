import * as THREE from 'three'
import { Dimensions } from './types/types'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Model from './components/model'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import AsciiEffect from './utils/ascii-effect'

export default class Canvas {
  element: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  dimensions: Dimensions
  time: number
  clock: THREE.Clock
  orbitControls: OrbitControls
  debug: GUI
  model: Model
  composer: EffectComposer

  constructor() {
    this.element = document.getElementById('webgl') as HTMLCanvasElement
    this.time = 0
    this.createClock()
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createOrbitControls()
    this.addEventListeners()
    this.createLight()
    this.createDebug()
    this.createModel()
    this.createPostProcessing()
    this.render()
  }

  createScene() {
    this.scene = new THREE.Scene()
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    this.scene.add(this.camera)
    this.camera.position.z = 10
  }

  createOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  createRenderer() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    }

    this.renderer = new THREE.WebGLRenderer({ canvas: this.element, alpha: true })
    this.renderer.setSize(this.dimensions.width, this.dimensions.height)
    this.renderer.render(this.scene, this.camera)

    this.renderer.setPixelRatio(this.dimensions.pixelRatio)
  }

  createPostProcessing() {
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const customPass = new AsciiEffect()
    this.composer.addPass(customPass.asciiPass)

    const outputPass = new OutputPass()
    this.composer.addPass(outputPass)
  }

  createDebug() {
    this.debug = new GUI()
  }

  createClock() {
    this.clock = new THREE.Clock()
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  onResize() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    }

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(this.dimensions.pixelRatio)
    this.renderer.setSize(this.dimensions.width, this.dimensions.height)
  }

  createLight() {
    const directionalLight = new THREE.DirectionalLight('white', 0.5)
    directionalLight.position.x = 10
    directionalLight.position.z = 10
    directionalLight.position.y = 5

    this.scene.add(directionalLight)

    const helper = new THREE.DirectionalLightHelper(directionalLight, 1)
    this.scene.add(helper)
  }

  createModel() {
    this.model = new Model({ scene: this.scene })
  }

  render() {
    this.time = this.clock.getElapsedTime()

    this.orbitControls.update()

    this.model.render(this.time)

    //this.renderer.render(this.scene, this.camera)
    this.composer.render()
  }
}
