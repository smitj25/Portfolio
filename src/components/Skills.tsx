"use client";

import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

// ── Images mapping ──
const techImages = [
  "/tech/react2.webp",
  "/tech/next2.webp",
  "/tech/node2.webp",
  "/tech/express.webp",
  "/tech/mongo.webp",
  "/tech/mysql.webp",
  "/tech/typescript.webp",
  "/tech/javascript.webp",
  "/tech/python.webp",
  "/tech/pytorch.webp",
  "/tech/langchain.webp",
  "/tech/fastapi.webp",
  "/tech/firebase.webp",
  "/tech/chromadb.webp",
  "/tech/langgraph.webp",
];

// Reusable geometry to save memory
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Generate random sphere sizes to add variety
const generateSpheres = (count: number) => {
  return [...Array(count)].map(() => ({
    scale: [0.7, 0.85, 1, 1.15][Math.floor(Math.random() * 4)],
  }));
};

const spheres = generateSpheres(30);

// ── Individual Sphere Component ──
type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function BouncingSphere({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    
    delta = Math.min(0.1, delta);
    
    // Calculate an impulse that pulls the spheres towards the center (0,0,0)
    // Reduced multipliers to make them float more gently and jitter less
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -25 * delta * scale,
          -75 * delta * scale,
          -25 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      // Increased damping makes them feel heavier and stops them from jittering endlessly
      linearDamping={0.95}
      angularDamping={0.8}
      friction={0.5}
      position={[r(20), r(20) - 10, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      {/* Invisible cylinder collider adds interesting wobble to the bounce */}
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
      />
    </RigidBody>
  );
}

// ── Mouse Pointer Collider ──
type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    
    // Move the invisible pointer collider towards the mouse
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.15 // Slower lerp for smoother mouse following
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      {/* Smaller invisible ball so it doesn't violently shove the others */}
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
}

// ── Main Skills Component ──
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  // Load textures only on the client
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures = techImages.map((url) => loader.load(url));
    setTextures(loadedTextures);
  }, []);

  const materials = useMemo(() => {
    if (textures.length === 0) return [];
    
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.2, // Subtle glow
          metalness: 0.4,
          roughness: 0.8,
          clearcoat: 0.2, // Slight premium reflection
        })
    );
  }, [textures]);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative w-full h-[80vh] md:h-[90vh] lg:h-screen pt-28 md:pt-36 pb-24 px-4 md:px-12 lg:px-24 flex flex-col overflow-hidden z-20 bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            Skills.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 font-light max-w-xl">
            My technical toolkit. <br className="hidden md:block"/>
            <span className="text-[#fa6c2a]/80 text-sm italic">Hover to interact with the stack.</span>
          </p>
        </motion.div>
      </div>

      {/* 3D Canvas Background Layer */}
      <div className="absolute inset-0 top-[20%] md:top-[15%] w-full h-full cursor-grab active:cursor-grabbing">
        {textures.length > 0 && (
          <Canvas
            shadows
            camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.5} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.2}
              color="white"
              castShadow
              intensity={2}
            />
            <directionalLight position={[0, 5, -4]} intensity={1.5} />
            
            {/* Physics Engine */}
            <Physics gravity={[0, 0, 0]}>
              <Pointer isActive={isInView} />
              
              {spheres.map((props, i) => (
                <BouncingSphere
                  key={i}
                  {...props}
                  material={materials[i % materials.length]}
                  isActive={isInView}
                />
              ))}
            </Physics>

            {/* Subtle Environment reflections */}
            <Environment preset="city" />
          </Canvas>
        )}
      </div>
    </section>
  );
}
