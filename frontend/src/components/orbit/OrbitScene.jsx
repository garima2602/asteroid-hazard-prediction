import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { kmToSceneRadius, velocityToAnimSpeed, diameterToSceneSize, MOON_DISTANCE_KM } from "../../lib/orbitScale.js";

const DIR = new THREE.Vector3(1, -0.12, -0.35).normalize();
const PERP = new THREE.Vector3().crossVectors(DIR, new THREE.Vector3(0, 1, 0)).normalize();
const TRAVEL = 24;

function Earth() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.75} metalness={0.05} emissive="#0b1b4a" emissiveIntensity={0.2} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.14} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function ReferenceRing({ radiusKm, color, label }) {
  const radius = kmToSceneRadius(radiusKm);
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <group>
      <Line points={points} color={color} dashed dashScale={6} gapSize={2} lineWidth={1} transparent opacity={0.45} />
      <Html position={[radius, 0, 0]} center distanceFactor={14} zIndexRange={[0, 0]}>
        <span className="whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-slate-300">{label}</span>
      </Html>
    </group>
  );
}

function Asteroid({ missDistanceKm, velocityKph, diameterKm, playing, progressRef }) {
  const meshRef = useRef();
  const closest = kmToSceneRadius(missDistanceKm);
  const size = diameterToSceneSize(diameterKm);
  const speed = velocityToAnimSpeed(velocityKph);

  const start = useMemo(
    () => DIR.clone().multiplyScalar(-TRAVEL / 2).add(PERP.clone().multiplyScalar(closest)),
    [closest],
  );

  const pathPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const p = start.clone().add(DIR.clone().multiplyScalar((i / 60) * TRAVEL));
      pts.push([p.x, p.y, p.z]);
    }
    return pts;
  }, [start]);

  const closestPoint = start.clone().add(DIR.clone().multiplyScalar(TRAVEL / 2));

  useFrame((_, delta) => {
    if (playing) {
      progressRef.current = (progressRef.current + delta * speed) % 1;
    }
    if (meshRef.current) {
      const p = start.clone().add(DIR.clone().multiplyScalar(progressRef.current * TRAVEL));
      meshRef.current.position.set(p.x, p.y, p.z);
      meshRef.current.rotation.x += delta * 0.6;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      <Line points={pathPoints} color="#f97316" lineWidth={1.5} transparent opacity={0.6} />
      <mesh position={[closestPoint.x, closestPoint.y, closestPoint.z]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

export default function OrbitScene({ missDistanceKm, velocityKph, diameterKm, playing }) {
  const progressRef = useRef(0);

  return (
    <Canvas camera={{ position: [7, 4.5, 11], fov: 48 }}>
      <color attach="background" args={["#05060f"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 6, 5]} intensity={1.6} color="#fef3c7" />
      <Stars radius={80} depth={40} count={2500} factor={2.5} fade speed={0.4} />

      <Earth />
      <ReferenceRing radiusKm={MOON_DISTANCE_KM} color="#64748b" label="Lunar distance" />
      <Asteroid
        missDistanceKm={missDistanceKm}
        velocityKph={velocityKph}
        diameterKm={diameterKm}
        playing={playing}
        progressRef={progressRef}
      />

      <OrbitControls enablePan={false} minDistance={4} maxDistance={22} />
    </Canvas>
  );
}
