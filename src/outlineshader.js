import * as THREE from 'three';

export const OutlineShader = (thickness = 0.002) => new THREE.ShaderMaterial({
    vertexShader: /* glsl */`
        void main() {
            vec3 newPosition = position + normal * ${thickness}; // Push along normal
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: /* glsl */`
        void main() {
            gl_FragColor = vec4(0, 0, 0, 1.0); // Black outline
        }
    `,
    side: THREE.BackSide // Render only the back faces
});
