import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import "@fontsource/inter";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import { useGameProgress } from "./lib/stores/useGameProgress";
import MainMenu from "./components/MainMenu";
import GameScene from "./components/GameScene";
import SoundManager from "./components/common/SoundManager";

function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  if (!showCanvas) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#87CEEB',
        fontSize: '24px',
        color: '#fff',
        fontFamily: 'Inter'
      }}>
        Loading Fun Games...
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)'
    }}>
      {/* Background Canvas for visual effects */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        <Suspense fallback={null}>
          {/* Floating shapes for background decoration */}
          <FloatingShapes />
        </Suspense>
      </Canvas>

      {/* Game UI Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 10 
      }}>
        {phase === 'ready' && <MainMenu />}
        {phase === 'playing' && <GameScene />}
      </div>

      {/* Sound Manager */}
      <SoundManager />
    </div>
  );
}

// Background decorative floating shapes
function FloatingShapes() {
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      -2 - Math.random() * 3
    ] as [number, number, number],
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i % 6],
    shape: ['box', 'sphere', 'cylinder'][i % 3] as 'box' | 'sphere' | 'cylinder',
    scale: 0.3 + Math.random() * 0.4,
    rotationSpeed: 0.01 + Math.random() * 0.02
  }));

  return (
    <>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </>
  );
}

function FloatingShape({ 
  position, 
  color, 
  shape, 
  scale, 
  rotationSpeed 
}: {
  position: [number, number, number];
  color: string;
  shape: 'box' | 'sphere' | 'cylinder';
  scale: number;
  rotationSpeed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  const geometry = shape === 'box' ? (
    <boxGeometry args={[1, 1, 1]} />
  ) : shape === 'sphere' ? (
    <sphereGeometry args={[0.5, 16, 16]} />
  ) : (
    <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
  );

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshLambertMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

export default App;
