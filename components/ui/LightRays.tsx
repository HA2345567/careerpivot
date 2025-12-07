import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2, Color } from 'ogl';

interface LightRaysProps {
    raysOrigin?: 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'center';
    raysColor?: string;
    raysSpeed?: number;
    lightSpread?: number;
    rayLength?: number;
    followMouse?: boolean;
    mouseInfluence?: number;
    noiseAmount?: number;
    distortion?: number;
    className?: string;
    style?: React.CSSProperties;
}

const LightRays: React.FC<LightRaysProps> = ({
    raysOrigin = 'top-center',
    raysColor = '#ffffff',
    raysSpeed = 1.0,
    lightSpread = 1.0,
    rayLength = 1.0,
    followMouse = true,
    mouseInfluence = 0.5,
    noiseAmount = 0.1,
    distortion = 0.5,
    className,
    style
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const programRef = useRef<Program | null>(null);
    const mouseRef = useRef(new Vec2(0.5, 0.5));
    const timeRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: true, depth: false });
        rendererRef.current = renderer;
        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        const geometry = new Triangle(gl);

        const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

        const fragment = `
      precision highp float;
      varying vec2 vUv;
      
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec2 uOrigin;
      uniform float uSpread;
      uniform float uLength;
      uniform float uNoiseAmount;
      uniform float uDistortion;

      // 2D Random
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // 2D Noise based on Morgan McGuire @morgan3d
      float noise (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);

          // Four corners in 2D of a tile
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          // Smooth Interpolation
          vec2 u = f * f * (3.0 - 2.0 * f);

          // Mix 4 coorners percentages
          return mix(a, b, u.x) +
                  (c - a)* u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
      }

      void main() {
          vec2 center = uOrigin;
          
          // Distance from center
          vec2 dist = vUv - center;
          
          // Angle for rays
          float angle = atan(dist.y, dist.x);
          
          // Distance magnitude
          float d = length(dist);
          
          // Generate Ray Noise
          // We map angle to 1D noise strip, animating with time
          float rayNoise = noise(vec2(angle * 10.0 + uTime * 0.5, d * uDistortion - uTime * 0.2));
          
          // Secondary layer for complexity
          rayNoise += noise(vec2(angle * 20.0 - uTime * 0.3, d * 2.0)) * 0.5;
          
          // Falloff based on settings
          // Spread controls how tight the beam is (requires some creative interpretation if strictly radial)
          // For a point source 'spread' might mean angular falloff if directional, 
          // or just general intensity decay for a radial source.
          // Let's make 'Spread' control the noise contrast/tightness.
          
          float beams = smoothstep(0.0, uSpread * 2.0, rayNoise);
          
          // Length falloff
          float fade = 1.0 - smoothstep(0.0, uLength, d);
          
          // Combine
          float alpha = beams * fade;
          
          // Add extra noise texture if requested
          float grain = random(vUv * uTime) * uNoiseAmount;
          
          gl_FragColor = vec4(uColor, alpha + grain);
      }
    `;

        // Initial Origin
        const getOrigin = () => {
            switch (raysOrigin) {
                case 'top-center': return new Vec2(0.5, 1.0); // In OGL/GL UVs, 1.0 is top (if quad is standard). Correction: Triangle usually maps 0,0 to bottom left, 1,1 top right.
                case 'top-left': return new Vec2(0.0, 1.0);
                case 'top-right': return new Vec2(1.0, 1.0);
                case 'center': return new Vec2(0.5, 0.5);
                // ... support others if needed
                default: return new Vec2(0.5, 1.0);
            }
        };

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color(raysColor) },
                uOrigin: { value: getOrigin() },
                uSpread: { value: lightSpread },
                uLength: { value: rayLength },
                uNoiseAmount: { value: noiseAmount },
                uDistortion: { value: distortion }
            },
            transparent: true
        });
        programRef.current = program;

        const mesh = new Mesh(gl, { geometry, program });

        // Render Loop
        let animationId: number;
        const update = (t: number) => {
            animationId = requestAnimationFrame(update);
            timeRef.current += 0.01 * raysSpeed;
            program.uniforms.uTime.value = timeRef.current;

            // Update Uniforms that might change (or mouse interactive)
            if (followMouse) {
                // Softly lerp origin towards mouse if influential
                // Actually user 'followMouse' usually means the source MOVES with mouse or aims at it.
                // Given the component name 'LightRays', usually source moves.
                // But strict top-center origin implies source is fixed.
                // Maybe mouse influences the 'distortion' or 'angle'. 
                // Let's make mouse offset the origin slightly based on 'mouseInfluence'
                const baseOrigin = getOrigin();
                const targetX = baseOrigin.x + (mouseRef.current.x - 0.5) * mouseInfluence;
                const targetY = baseOrigin.y - (mouseRef.current.y - 0.5) * mouseInfluence;
                // Note: UV y is inverted relative to typical screen coords if needed, sticking to 0-1

                program.uniforms.uOrigin.value.set(targetX, targetY);
            }

            renderer.render({ scene: mesh });
        };
        animationId = requestAnimationFrame(update);

        // Resize Handler
        const handleResize = () => {
            renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // Mouse Handler
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL Y is up
            mouseRef.current.set(x, y);
        };
        if (followMouse) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
            if (containerRef.current && gl.canvas) {
                containerRef.current.removeChild(gl.canvas);
            }
        };
    }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, followMouse, mouseInfluence, noiseAmount, distortion]);

    return <div ref={containerRef} className={className} style={style} />;
};

export default LightRays;
