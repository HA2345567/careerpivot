import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import React, { useEffect, useRef } from 'react';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform vec2 uMouse;

out vec4 fragColor;

// Simplex noise and FBM functions
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

// Domain Warping for "Smoke" look
float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 3; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Correct aspect ratio
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    // Mouse influence
    vec2 mouse = uMouse;
    mouse.x *= aspect;
    float mouseDist = length(p - mouse);
    float mouseInteraction = smoothstep(0.5, 0.0, mouseDist) * 0.1;

    // Time scaling
    float t = uTime * 0.2;
    
    // Domain warping pattern
    vec2 q = vec2(0.);
    q.x = fbm( p + 0.00 * t );
    q.y = fbm( p + vec2(1.0) );

    vec2 r = vec2(0.);
    r.x = fbm( p + 1.0 * q + vec2(1.7,9.2) + 0.15 * t );
    r.y = fbm( p + 1.0 * q + vec2(8.3,2.8) + 0.126 * t);

    float f = fbm(p + r + mouseInteraction);

    // Color mixing based on noise value 'f'
    vec3 color = mix(uColorStops[0], uColorStops[1], clamp((f*f)*4.0, 0.0, 1.0));
    color = mix(color, uColorStops[2], clamp(length(q), 0.0, 1.0));
    color = mix(color, uColorStops[2], clamp(length(r.x), 0.0, 1.0));

    // Contrast boost
    color = (f * f * f + 0.6 * f * f + 0.5 * f) * color;
    
    // Vignette for soft edges (crucial for "placement")
    float vignette = 1.0 - smoothstep(0.2, 1.2, length(uv - 0.5) * 1.5);
    
    // Output
    fragColor = vec4(color, vignette * 0.8); // 0.8 max opacity
}
`;

interface AuroraProps {
  colorStops?: string[];
  speed?: number;
  className?: string;
}

export default function Aurora(props: AuroraProps) {
  const { colorStops = ['#3A29FF', '#FF9FFC', '#FF2957'], speed = 1.0 } = props;
  const ctnDom = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      dpr: Math.min(window.devicePixelRatio, 1.5), // Optimization
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // Additive-ish blend
    
    ctn.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    
    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uMouse: { value: [0.5, 0.5] }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    }
    window.addEventListener('resize', resize);
    resize();

    function onMouseMove(e: MouseEvent) {
      if (!ctn) return;
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    }
    window.addEventListener('mousemove', onMouseMove);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      timeRef.current += 0.005 * speed;
      
      program.uniforms.uTime.value = timeRef.current;
      program.uniforms.uMouse.value = [
         mouseRef.current.x,
         mouseRef.current.y
      ];
      
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colorStops, speed]);

  return <div ref={ctnDom} className={`w-full h-full ${props.className || ''}`} />;
}
