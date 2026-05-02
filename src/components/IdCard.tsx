"use client";

import * as THREE from "three";
import ContactForm from "./ContactForm";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import type { RapierRigidBody } from "@react-three/rapier";

extend({ MeshLineGeometry, MeshLineMaterial });

useTexture.preload("/id/front.png");
useTexture.preload("/id/back.png");

/* ─────────────── Custom Card Mesh (front + back textures) ─────────────── */

function CardMesh() {
  const { gl } = useThree();
  const frontTexture = useTexture("/id/front.png");
  const backTexture = useTexture("/id/back.png");

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    [frontTexture, backTexture].forEach((tex) => {
      tex.anisotropy = maxAnisotropy;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [frontTexture, backTexture, gl]);

  // Card dimensions — ID card aspect ratio (~0.63)
  const cardWidth = 1.3;
  const cardHeight = 2.05;
  const cardDepth = 0.03;

  return (
    <group>
      {/* Front face */}
      <mesh position={[0, 0, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial
          map={frontTexture}
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>

      {/* Back face */}
      <mesh position={[0, 0, -(cardDepth / 2 + 0.001)]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial
          map={backTexture}
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>

      {/* Card body (thin box for edge thickness) */}
      <mesh>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Clip at top of card */}
      <mesh position={[0, cardHeight / 2 + 0.12, 0]}>
        <boxGeometry args={[0.25, 0.3, 0.06]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Clip ring */}
      <mesh position={[0, cardHeight / 2 + 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.025, 8, 16]} />
        <meshStandardMaterial color="#999" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────── Band (lanyard + card) ───────────────────────── */

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const euler = new THREE.Euler();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  };

  const { width, height } = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const shiftX = isDesktop ? -viewport.width * 0.35 : 0;
  const fixedY = isDesktop ? 5 : 11;
  const segmentLength = isDesktop ? 1 : 3.8;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 2.175, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // Fix most of the jitter when over-pulling the card
      [j1, j2].forEach((ref) => {
        if (!ref.current) return;
        const curr = ref.current as RapierRigidBody & { lerped?: THREE.Vector3 };
        if (!curr.lerped)
          curr.lerped = new THREE.Vector3().copy(curr.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, curr.lerped.distanceTo(curr.translation()))
        );
        curr.lerped.lerp(
          curr.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      // Calculate catmull curve
      curve.points[0].copy(j3.current!.translation());
      curve.points[1].copy((j2.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[2].copy((j1.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current!.geometry as unknown as { setPoints: (pts: THREE.Vector3[]) => void }).setPoints(curve.getPoints(32));

      // Tilt it back towards the screen or back
      ang.copy(card.current!.angvel());
      q.copy(card.current!.rotation() as unknown as THREE.Quaternion);
      euler.setFromQuaternion(q, 'YXZ');

      const targetRotY = flipped ? Math.PI : 0;
      let diff = euler.y - targetRotY;

      // Normalize difference to [-PI, PI]
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      // Apply angular velocity to smoothly rotate towards target
      card.current!.setAngvel({ x: ang.x, y: ang.y - diff * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      <group position={[shiftX, fixedY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[segmentLength * 0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[segmentLength, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[segmentLength * 1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[segmentLength * 2, 0, 0]} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[0.975, 1.5375, 0.03]} position={[0, 0.1575, 0]} />
          <group
            scale={1.5}
            position={[0, 0.1575, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => (
              (e.target as Element).releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => (
              (e.target as Element).setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation()))
              )
            )}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              setFlipped((prev) => !prev);
              // Give it a playful spin impulse
              card.current?.applyTorqueImpulse({ x: 0, y: flipped ? -1 : 1, z: 0 }, true);
            }}
          >
            <CardMesh />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error – meshline extended elements */}
        <meshLineGeometry />
        {/* @ts-expect-error – meshline extended elements */}
        <meshLineMaterial
          color="#fa6c2a"
          depthTest={false}
          resolution={[width, height]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

/* ───────────────────────────── Exported Section ───────────────────────────── */

export default function IdCard() {
  return (
    <section
      id="id-card"
      className="relative w-full overflow-hidden"
    >
      {/* ── Desktop Layout: side-by-side with absolute positioning ── */}
      <div className="hidden lg:block relative w-full h-screen">
        {/* 3D Background Layer */}
        <div className="absolute inset-0 z-0" style={{ touchAction: 'none' }}>
          <Canvas camera={{ position: [0, 0, 12], fov: 25 }}>
            <color attach="background" args={["#121212"]} />
            <ambientLight intensity={Math.PI} />
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
              <Band />
            </Physics>
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
        </div>

        {/* Desktop Interaction Nudge */}
        <div className="absolute bottom-[20%] left-[15%] xl:left-[20%] -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center opacity-40">
          <span className="text-white text-[10px] tracking-[0.2em] uppercase font-bold text-center leading-relaxed">Drag to move<br />Tap to flip</span>
        </div>

        {/* Form overlay — right side */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-end px-12 lg:px-16 pb-24">
          <div className="pointer-events-auto w-[70%] xl:w-[65%] flex justify-end">
            <ContactForm />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 w-full flex flex-wrap justify-center items-center gap-12 z-20 pointer-events-auto">
          <a href="https://github.com/smitj25" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#fa6c2a] transition-colors font-semibold text-sm uppercase tracking-widest">GitHub</a>
          <a href="https://linkedin.com/in/SmitPatil" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#fa6c2a] transition-colors font-semibold text-sm uppercase tracking-widest">LinkedIn</a>
          <a href="/Smit_Patil_Resume.pdf" download className="text-gray-500 hover:text-[#fa6c2a] transition-colors font-semibold text-sm uppercase tracking-widest flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Resume</a>
        </div>
      </div>

      {/* ── Mobile/Tablet Layout ── */}
      <div className="lg:hidden relative w-full min-h-[100svh] flex flex-col">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0" style={{ touchAction: 'none' }}>
          <Canvas camera={{ position: [0, 4, 30], fov: 25 }}>
            <color attach="background" args={["#121212"]} />
            <ambientLight intensity={Math.PI} />
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
              <Band />
            </Physics>
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
        </div>

        {/* Content stacked on top */}
        <div className="relative z-10 flex flex-col min-h-[100svh] pointer-events-none">
          {/* Contact Form */}
          <div className="px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-6 pointer-events-auto">
            <ContactForm />
          </div>

          {/* Spacer for where the card hangs */}
          <div className="flex-1 min-h-[80vh]"></div>

          {/* Mobile Interaction Nudge */}
          <div className="w-full flex flex-col items-center opacity-40 pb-8 pointer-events-none">
            <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-bold text-center leading-relaxed">Drag to move<br />Tap to flip</span>
          </div>

          {/* Footer */}
          <div className="w-full flex justify-center pb-12 pointer-events-auto">
            <div className="flex items-center gap-6 sm:gap-8 px-6 sm:px-8 py-3 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <a href="https://github.com/smitj25" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa6c2a] hover:scale-105 transition-all font-semibold text-[10px] sm:text-xs uppercase tracking-[0.15em]">GitHub</a>
              <span className="w-1 h-1 rounded-full bg-white/[0.15]"></span>
              <a href="https://linkedin.com/in/SmitPatil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa6c2a] hover:scale-105 transition-all font-semibold text-[10px] sm:text-xs uppercase tracking-[0.15em]">LinkedIn</a>
              <span className="w-1 h-1 rounded-full bg-white/[0.15]"></span>
              <a href="/Smit_Patil_Resume.pdf" download className="text-gray-400 hover:text-[#fa6c2a] hover:scale-105 transition-all font-semibold text-[10px] sm:text-xs uppercase tracking-[0.15em] flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Resume</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


