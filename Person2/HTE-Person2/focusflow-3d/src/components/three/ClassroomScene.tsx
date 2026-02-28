"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useFocusFlowStore } from "@/store/useFocusFlowStore";

// ─── Mastery Color Helper ───────────────────────────────────────────────────

function getMasteryColor(mastery: number): string {
  if (mastery >= 70) return "#22c55e"; // green
  if (mastery >= 30) return "#eab308"; // yellow
  return "#ef4444"; // red
}

// ─── Interactive 3D Object ──────────────────────────────────────────────────

interface InteractiveObjectProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hoverColor?: string;
  label: string;
  panelId: string;
  mastery?: number;
  locked?: boolean;
}

function InteractiveObject({
  position,
  size,
  color,
  hoverColor,
  label,
  panelId,
  mastery,
  locked = false,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setActivePanel = useFocusFlowStore((s) => s.setActivePanel);

  const displayColor = useMemo(() => {
    if (locked) return "#6b7280"; // gray for locked
    if (hovered) return hoverColor ?? "#60a5fa";
    if (mastery !== undefined) return getMasteryColor(mastery);
    return color;
  }, [locked, hovered, hoverColor, mastery, color]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Gentle float for hovered objects
    if (hovered && !locked) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.05;
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], delta * 5);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!locked) {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!locked) setActivePanel(panelId);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={displayColor}
          emissive={hovered && !locked ? displayColor : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* Label above object */}
      <Text
        position={[position[0], position[1] + size[1] / 2 + 0.3, position[2]]}
        fontSize={0.18}
        color={locked ? "#9ca3af" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {locked ? `🔒 ${label}` : label}
      </Text>
      {/* Mastery indicator dot */}
      {mastery !== undefined && !locked && (
        <mesh position={[position[0] + size[0] / 2 + 0.15, position[1] + size[1] / 2, position[2]]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={getMasteryColor(mastery)} emissive={getMasteryColor(mastery)} emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// ─── Room Floor & Walls ─────────────────────────────────────────────────────

function Room({ dimLevel = 0 }: { dimLevel?: number }) {
  const ambientIntensity = 0.6 - dimLevel * 0.3;
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.8} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#d4c5a9" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#c9bba0" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#c9bba0" roughness={0.9} />
      </mesh>
      {/* Ambient + directional lighting */}
      <ambientLight intensity={ambientIntensity} color="#ffeedd" />
      <directionalLight position={[5, 8, 5]} intensity={0.8 - dimLevel * 0.4} castShadow shadow-mapSize={1024} />
      <pointLight position={[-3, 3, 2]} intensity={0.4} color="#ffd4a0" />
    </group>
  );
}

// ─── AI Tutor Avatar ────────────────────────────────────────────────────────

function AITutorAvatar() {
  const setActivePanel = useFocusFlowStore((s) => s.setActivePanel);
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group
        position={[4, 1.5, -2]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); setActivePanel("tutor"); }}
      >
        {/* Head */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? "#60a5fa" : "#a78bfa"}
            emissive={hovered ? "#60a5fa" : "#a78bfa"}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
          <meshStandardMaterial
            color={hovered ? "#818cf8" : "#7c3aed"}
            emissive={hovered ? "#818cf8" : "#7c3aed"}
            emissiveIntensity={hovered ? 0.4 : 0.15}
          />
        </mesh>
        {/* Label */}
        <Text
          position={[0, 1.0, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          AI Tutor
        </Text>
      </group>
    </Float>
  );
}

// ─── Main Classroom Scene ───────────────────────────────────────────────────

function ClassroomContent() {
  const cogState = useFocusFlowStore((s) => s.learnerState.cognitive_state);
  const learnerState = useFocusFlowStore((s) => s.learnerState);

  const dimLevel = cogState === "focused" ? 0.4 : cogState === "drifting" ? -0.1 : 0;

  // Average mastery for objects that represent concept areas
  const avgMastery = useMemo(() => {
    const vals = Object.values(learnerState.concepts);
    if (vals.length === 0) return 50;
    return vals.reduce((sum, c) => sum + c.mastery, 0) / vals.length;
  }, [learnerState.concepts]);

  return (
    <>
      <Room dimLevel={dimLevel} />

      {/* Whiteboard — back wall center */}
      <InteractiveObject
        position={[0, 1.5, -4.9]}
        size={[3, 1.8, 0.1]}
        color="#f5f5f5"
        hoverColor="#dbeafe"
        label="Whiteboard"
        panelId="whiteboard"
        mastery={avgMastery}
      />

      {/* Desk — center of room */}
      <InteractiveObject
        position={[0, 0.1, 0]}
        size={[2, 0.6, 1.2]}
        color="#8b6f47"
        hoverColor="#a0845c"
        label="Desk"
        panelId="study"
      />

      {/* Bookshelf — right wall */}
      <InteractiveObject
        position={[5.5, 1, -2]}
        size={[0.6, 2, 1.5]}
        color="#654321"
        hoverColor="#7a5630"
        label="Bookshelf"
        panelId="bookshelf"
      />

      {/* Lab Bench — left side */}
      <InteractiveObject
        position={[-4, 0.1, -1]}
        size={[2, 0.7, 1]}
        color="#4a7c59"
        hoverColor="#5a9c6d"
        label="Lab Bench"
        panelId="challenge"
      />

      {/* Quiz Board — left wall */}
      <InteractiveObject
        position={[-5.5, 1.5, 1]}
        size={[0.1, 1.5, 1.5]}
        color="#1e40af"
        hoverColor="#3b82f6"
        label="Quiz Board"
        panelId="quiz"
      />

      {/* Window — right wall */}
      <InteractiveObject
        position={[5.5, 2, 2]}
        size={[0.1, 1.5, 2]}
        color="#87ceeb"
        hoverColor="#bae6fd"
        label="Progress"
        panelId="progress"
      />

      {/* AI Tutor — floating avatar */}
      <AITutorAvatar />

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={10}
        target={[0, 1, 0]}
      />
    </>
  );
}

export default function ClassroomScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 6], fov: 60 }}
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e)" }}
    >
      <ClassroomContent />
    </Canvas>
  );
}
