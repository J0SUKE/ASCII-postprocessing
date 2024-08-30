import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

interface Props {
  scene: THREE.Scene
}

export default class Model {
  loader: GLTFLoader
  scene: THREE.Scene
  model: null | THREE.Group<THREE.Object3DEventMap>
  material: CustomShaderMaterial

  constructor({ scene }: Props) {
    this.scene = scene
    this.loader = new GLTFLoader()
    this.model = null
    this.createMaterial()
    this.loadModel()
  }

  createMaterial() {
    this.material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader,
      fragmentShader,
      silent: true, // Disables the default warning if true
      uniforms: {
        uTime: {
          value: 0,
        },
      },
    })
  }

  loadModel() {
    this.loader.load(
      // resource URL
      '/LeePerrySmith/LeePerrySmith.glb',
      // called when the resource is loaded
      (gltf) => {
        console.log(gltf)
        this.model = gltf.scene
        const mesh = this.model.children[0] as THREE.Mesh
        mesh.material = this.material
        this.scene.add(this.model)
      }
    )
  }

  render(time: number) {
    if (this.model) {
      this.model.rotation.y = time * 0.3
    }
  }
}
