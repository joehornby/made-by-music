'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import { cn } from "@/lib/utils";

interface AudioVisualiserProps {
  audio?: HTMLAudioElement | MediaElementAudioSourceNode | null;
  className?: string;
}

const Sphere = ({
  position,
  index,
  audioData,
  baseSize,
}: {
  position: [number, number, number];
  index: number;
  audioData?: number[];
  baseSize: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Get audio data for this sphere (frequency band)
      const audioIntensity = audioData ? audioData[index] || 0 : 0;

      // Create smooth random size animation using multiple sine waves
      const time = state.clock.elapsedTime;
      const randomOffset1 = index * 1.3;
      const randomOffset2 = index * 2.1;
      const randomOffset3 = index * 0.7;

      // Combine multiple sine waves for smooth random-like movement
      const randomScale1 = Math.sin(time * 0.4 + randomOffset1) * 0.15;
      const randomScale2 = Math.sin(time * 0.6 + randomOffset2) * 0.1;
      const randomScale3 = Math.sin(time * 0.3 + randomOffset3) * 0.08;

      const randomScale = randomScale1 + randomScale2 + randomScale3;

      // Scale animation: base size + random animation + audio enhancement
      const baseScale = baseSize + randomScale + audioIntensity * 0.3;
      meshRef.current.scale.setScalar(Math.max(0.3, baseScale)); // Prevent too small sizes

      // Subtle rotation based on audio and time
      const rotationIntensity = audioIntensity * 0.2 + 0.05;
      meshRef.current.rotation.y =
        Math.sin(time * 0.3 + index) * rotationIntensity;

      // Floating animation enhanced by audio and random movement
      const floatIntensity = audioIntensity * 0.15 + 0.02;
      const randomFloat = Math.sin(time * 0.5 + index * 1.5) * 0.05;
      meshRef.current.position.y =
        position[1] +
        Math.sin(time * 0.6 + index) * floatIntensity +
        randomFloat;

      // Update shader uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = time;
        materialRef.current.uniforms.audioIntensity.value = audioIntensity;
      }
    }
  });

  const vertexShader = `
    uniform vec3 uLightPos;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec2 vUv;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      
      // Calculate surface to light direction for diffuse lighting
      vec3 surfaceToLightDirection = vec3(modelViewMatrix * vec4(position, 1.0));
      vec3 worldLightPos = vec3(viewMatrix * vec4(uLightPos, 1.0));
      vSurfaceToLight = normalize(worldLightPos - surfaceToLightDirection);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float audioIntensity;
    uniform vec3 uLightPos;
    uniform vec3 uLightColor;
    uniform vec3 uColor;
    uniform float uLightIntensity;
    uniform float uNoiseScale;
    uniform float uNoiseCoef;
    
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec2 vUv;
    
    // Simplex noise function (simplified version)
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    vec3 light_reflection(vec3 lightColor) {
      // Ambient light
      float ambient = 0.3;
      
      // Diffuse light calculation
      float diffuse = max(dot(vNormal, vSurfaceToLight), 0.0);
      
      // Combine ambient and diffuse
      float lightValue = ambient + diffuse;
      
      return lightColor * lightValue * uLightIntensity;
    }
    
    void main() {
      // Base colors for each sphere - bright peach and yellow tones
      vec3 baseColors[5] = vec3[5](
        vec3(1.0, 0.8, 0.6), // Bright peach
        vec3(1.0, 0.9, 0.4), // Bright yellow
        vec3(1.0, 0.7, 0.5), // Bright coral
        vec3(1.0, 0.85, 0.3), // Bright golden yellow
        vec3(1.0, 0.75, 0.4)  // Bright orange
      );
      
      vec3 baseColor = baseColors[${index}];
      
      // Calculate lighting
      vec3 lightValue = light_reflection(uLightColor);
      
      // Create risograph grain effect
      vec2 uv = gl_FragCoord.xy;
      uv /= uNoiseScale;
      
      vec3 colorNoise = vec3(smoothNoise(uv) * 0.5 + 0.5);
      
      // Apply grain based on light intensity (more grain in shadows) - more extreme
      colorNoise *= pow(lightValue.r, uNoiseCoef);
      colorNoise *= 1.5; // Boost grain intensity
      
      // Mix base color with grain effect
      vec3 finalColor = vec3(
        max(colorNoise.r, baseColor.r * lightValue.r),
        max(colorNoise.g, baseColor.g * lightValue.g),
        max(colorNoise.b, baseColor.b * lightValue.b)
      );
      
      // Add audio-reactive brightness
      finalColor += audioIntensity * 0.2;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          audioIntensity: { value: 0 },
          uLightPos: { value: [3, 2, 3] },
          uLightColor: { value: [1, 1, 1] },
          uColor: { value: [1, 0.8, 0.6] },
          uLightIntensity: { value: 2.5 },
          uNoiseScale: { value: 0.4 },
          uNoiseCoef: { value: 1.2 },
        }}
        side={2} // Double-sided
      />
    </mesh>
  );
};

const Background = () => {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    
    // Noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      vec2 p = vUv * 3.0;
      
      // Create swirling pattern
      float angle = atan(p.y - 1.5, p.x - 1.5) + time * 0.3;
      float radius = length(p - vec2(1.5));
      
      vec2 swirl = vec2(
        cos(angle) * radius + 1.5,
        sin(angle) * radius + 1.5
      );
      
      float noise1 = smoothNoise(swirl + time * 0.1);
      float noise2 = smoothNoise(p * 2.0 - time * 0.2);
      
      // Dark background colors to contrast with bright spheres
      vec3 color1 = vec3(0.1, 0.12, 0.15); // Dark blue-gray
      vec3 color2 = vec3(0.08, 0.1, 0.12); // Darker blue-gray
      vec3 color3 = vec3(0.12, 0.1, 0.08); // Dark brown-gray
      
      vec3 finalColor = mix(
        mix(color1, color2, noise1),
        color3,
        noise2 * 0.5
      );
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
      />
    </mesh>
  );
};

const Scene = ({
  audio,
}: {
  audio?: HTMLAudioElement | MediaElementAudioSourceNode | null;
}) => {
  const { camera } = useThree();
  const [audioData, setAudioData] = useState<number[]>(new Array(5).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    camera.position.set(-2, 3, -3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    if (!audio) return;

    // Create audio context and analyser
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    analyserRef.current = analyser;

    // Connect audio source to analyser
    if (audio instanceof HTMLAudioElement) {
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    } else if (audio) {
      audio.connect(analyser);
    }

    // Start audio analysis
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const analyzeAudio = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Split frequency data into 5 bands for the circles
        const bandSize = Math.floor(dataArray.length / 5);
        const bands = [];

        for (let i = 0; i < 5; i++) {
          let sum = 0;
          for (let j = 0; j < bandSize; j++) {
            sum += dataArray[i * bandSize + j];
          }
          bands.push(sum / (bandSize * 255)); // Normalize to 0-1
        }

        setAudioData(bands);
      }

      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    };

    analyzeAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [audio]);

  // Sphere positions spaced out more to avoid overlapping
  const spherePositions: [number, number, number][] = [
    [3, 0, 3], // Front right
    [1.5, 0, 1.5], // Mid right
    [0, 0, 0], // Center
    [-1.5, 0, -1.5], // Mid left
    [-3, 0, -3], // Back left
  ];

  const sphereSizes = [1.2, 0.8, 1.5, 0.9, 1.1]; // Random sizes for each sphere

  return (
    <>
      <Background />
      {spherePositions.map((position, index) => (
        <Sphere
          key={index}
          position={position}
          index={index}
          audioData={audioData}
          baseSize={sphereSizes[index]}
        />
      ))}
      <ambientLight intensity={1.2} />
      <directionalLight position={[-2, 1, 3]} intensity={3.0} />
      <pointLight position={[-1, 0.5, 2]} intensity={2.5} color="#ff6b35" />
      <pointLight position={[-3, 0.5, 1]} intensity={2.0} color="#ffd700" />
    </>
  );
};

export const AudioVisualiser = ({ audio, className }: AudioVisualiserProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Canvas
        camera={{ position: [-2, 3, -3], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Scene audio={audio} />
      </Canvas>
    </div>
  );
};
