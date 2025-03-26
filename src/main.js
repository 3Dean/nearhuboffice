import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineShader } from './outlineshader.js';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x666666); // Change to any color
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 2, 15);

// Set a target point
controls.target.set(5, 5, 0); // Look at point

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Enable shadow maps
renderer.shadowMap.type = THREE.PCFShadowMap;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Higher quality shadows
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 5, 5);
light.castShadow = true;  // Enable shadow casting
// Make the light explicitly target the center of your scene
light.target.position.set(0, 0, 0); 


// Add this after setting up your directional light
light.shadow.bias = -0.0005; // Prevent shadow acne
light.shadow.normalBias = 0.02; // Helps with self-shadowing artifacts

// Configure shadow properties
light.shadow.mapSize.width = 2048;  // Higher resolution shadows
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 1;
light.shadow.camera.far = 20;
light.shadow.camera.left = -7;
light.shadow.camera.right = 7;
light.shadow.camera.top = 7;
light.shadow.camera.bottom = -7;

scene.add(light);
scene.add(light.target); // Don't forget this line
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

// Add a ground plane to receive shadows
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
ground.position.y = -1; // Position slightly below objects
ground.receiveShadow = true; // Enable shadow receiving
scene.add(ground);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Solidify function (From tutorial)
const solidify = (mesh) => {
    const THICKNESS = 0.01;
    const geometry = mesh.geometry.clone(); // Clone to avoid modifying original

    const material = OutlineShader(THICKNESS); // Use shader from outlineShader.js

    const outline = new THREE.Mesh(geometry, material);
    outline.position.copy(mesh.position);
    outline.rotation.copy(mesh.rotation);
    outline.scale.copy(mesh.scale);

    scene.add(outline);
};

// Define an array of models to load
const models = [
    { 
        path: './models/cubicle03.glb', 
        position: { x: 0, y: -0.2, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: true
    },

    { 
        path: './models/desk04.glb', 
        position: { x: 5, y: 0, z: 5 }, 
		rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: true
    },
	
	    { 
        path: './models/computer.glb', 
        position: { x: 5, y: 0.98, z: 5 }, 
		rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: false
    },
	
    { 
        path: './models/cabinet.glb', 
        position: { x: 2, y: 0, z: 8 }, 
		rotation: { x: 0, y: Math.PI/2, z: 0 }, // 90 degrees around Y axis
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: true
    },
	    { 
        path: './models/cabinetobjects.glb', 
        position: { x: 2, y: 0, z: 8 }, 
		rotation: { x: 0, y: Math.PI/2, z: 0 }, // 90 degrees around Y axis
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: false
    },
	
		{ 
        path: './models/printer.glb', 
        position: { x: 2, y: 0.98, z: 8 }, 
		rotation: { x: 0, y: Math.PI/2, z: 0 }, // 90 degrees around Y axis
        scale: { x: 1, y: 1, z: 1 },
        applyOutline: true
    }
];

// Function to load a single model
function loadModel(modelData) {
    const loader = new GLTFLoader();
    loader.load(modelData.path, (gltf) => {
        console.log(`Model Loaded: ${modelData.path}`, gltf);
        
        const model = gltf.scene.children[0]; // Get first child
        
        // Apply position from model data
        model.position.set(
            modelData.position.x, 
            modelData.position.y, 
            modelData.position.z
        );
		
		model.rotation.set(
    		modelData.rotation.x,
    		modelData.rotation.y,
    		modelData.rotation.z
		);
        
        // Apply scale from model data
        model.scale.set(
            modelData.scale.x,
            modelData.scale.y,
            modelData.scale.z
        );
        
        // Enable shadows for the model and all its children
        model.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        scene.add(model);
        
        // Apply outline if specified
        if (modelData.applyOutline) {
            solidify(model);
        }
        
    }, undefined, (error) => {
        console.error(`Error loading model ${modelData.path}:`, error);
    });
}

// Load all models
models.forEach(modelData => {
    loadModel(modelData);
});


// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});