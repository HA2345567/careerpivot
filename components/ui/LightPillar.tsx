import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  pillarRotation?: number;
  interactive?: boolean;
  mixBlendMode?: string;
}

const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform float uTime;
uniform vec3 uColorTop;
uniform vec3 uColorBottom;
uniform float uIntensity;
uniform float uGlow;
uniform float uNoiseIntensity;
uniform float uPillarHeight;

varying vec2 vUv;
varying vec3 vPosition;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Upward moving noise
  float noise = snoise(vec2(vUv.x * 3.0, vUv.y * 1.5 - uTime * 0.5));
  
  // Base alpha from noise (ensure it stays positive)
  float alpha = 0.5 + 0.5 * noise; 
  
  // Intensify vertically based on noise intensity
  alpha = mix(1.0, alpha, uNoiseIntensity);

  // Vertical Falloff (soft edges at top and bottom)
  float verticalFade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.85, 1.0, vUv.y));
  alpha *= verticalFade;
  
  // Horizontal/Cylindrical fade to create volume look
  // (Brightest in center of the UV strip, simulating looking through the center of the beam)
  // Since UV wraps 0-1, we simulate a "front" face
  float viewFade = sin(vUv.x * 3.14159);
  alpha *= viewFade;

  // Glow power adjustment
  // Higher uGlow makes the falloff softer/wider
  // We use max to prevent pow(negative)
  alpha = pow(max(0.0, alpha), 1.0 / max(0.01, uGlow + 0.5));

  // Color gradient
  vec3 color = mix(uColorBottom, uColorTop, vUv.y);
  
  // Final composite
  gl_FragColor = vec4(color, alpha * uIntensity);
}
`;

const LightPillar: React.FC<LightPillarProps> = ({
  topColor = "#5227FF",
  bottomColor = "#FF9FFC",
  intensity = 1.0,
  rotationSpeed = 0.3,
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  pillarRotation = 0,
  interactive = false,
  mixBlendMode = "normal"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // GEOMETRY
    // Large cylinder to act as the pillar. 
    // We make it tall so it covers screen height easily.
    const geometry = new THREE.CylinderGeometry(pillarWidth, pillarWidth, 20, 64, 1, true);

    // MATERIAL
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color(topColor) },
        uColorBottom: { value: new THREE.Color(bottomColor) },
        uIntensity: { value: intensity },
        uGlow: { value: glowAmount },
        uNoiseIntensity: { value: noiseIntensity },
        uPillarHeight: { value: pillarHeight }
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    materialRef.current = material;

    // MESH
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = pillarRotation;
    // Tilt slightly to look dynamic if desired, but 0 is requested default.
    // We center it.
    mesh.position.set(0, 0, 0);
    
    scene.add(mesh);
    meshRef.current = mesh;

    // ANIMATION
    const clock = new THREE.Clock();
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time * rotationSpeed;
      }
      
      if (meshRef.current && rotationSpeed > 0) {
        // Subtle rotation to show volume
        meshRef.current.rotation.y = pillarRotation + (time * rotationSpeed * 0.1);
      }

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []); // Mount only

  // Update Uniforms on Prop Change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColorTop.value.set(topColor);
      materialRef.current.uniforms.uColorBottom.value.set(bottomColor);
      materialRef.current.uniforms.uIntensity.value = intensity;
      materialRef.current.uniforms.uGlow.value = glowAmount;
      materialRef.current.uniforms.uNoiseIntensity.value = noiseIntensity;
      materialRef.current.uniforms.uPillarHeight.value = pillarHeight;
    }
  }, [topColor, bottomColor, intensity, glowAmount, noiseIntensity, pillarHeight]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        mixBlendMode: mixBlendMode as any,
        pointerEvents: interactive ? 'auto' : 'none'
      }} 
      className="absolute inset-0"
    />
  );
};

export default LightPillar;
