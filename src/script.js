import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'


//Debug
const gui = new lil.GUI({ width: 500, });
gui.close();


// Canvas
const canvas = document.querySelector('canvas.light')

// Scene
const scene = new THREE.Scene()

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.137) //(kleur van light, intensity)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x000ffc, 0.3)
scene.add(directionalLight)
directionalLight.position.set(1, 0.25, 0)

const hemisphereLight = new THREE.HemisphereLight(0x4e00ff, 0x00f0ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x5f0000, 2, 1, 1)
scene.add(rectAreaLight)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())

const spotLight = new THREE.SpotLight(0x78f000, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)


// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75), material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)


//resize code gehaald van https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

// Base camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Animate
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()