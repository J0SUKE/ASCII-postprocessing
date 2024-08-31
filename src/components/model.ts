import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface Props {
  scene: THREE.Scene
}

export default class Model {
  loader: GLTFLoader
  scene: THREE.Scene
  model: null | THREE.Group<THREE.Object3DEventMap>
  //material: CustomShaderMaterial
  material: THREE.MeshStandardMaterial

  constructor({ scene }: Props) {
    this.scene = scene
    this.loader = new GLTFLoader()
    this.model = null
    this.createMaterial()
    this.loadModel()
  }

  createMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      color: 'white',
    })
  }

  loadModel() {
    this.loader.load(
      // resource URL
      '/LeePerrySmith/LeePerrySmith.glb',
      //'/david_head/scene.gltf',
      (gltf) => {
        console.log(gltf)
        this.model = gltf.scene
        //this.model.scale.set(0.05, 0.05, 0.05)
        //this.model.position.y -= 5
        const mesh = this.model.children[0] as THREE.Mesh
        mesh.material = this.material
        this.scene.add(this.model)
      }
    )
  }

  render(time: number) {
    if (this.model) {
      //this.model.rotation.y = time * 0.3
    }
  }
}
