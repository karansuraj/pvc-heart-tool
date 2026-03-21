import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PVCOrigin } from "../data/pvcOrigins";

interface HotspotProps {
  origin: PVCOrigin;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function Hotspot({ origin, isSelected, onClick }: HotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulsing animation for hotspots
  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
      const scale = isSelected ? 1.6 : hovered ? 1.3 : pulse;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={origin.hotspotPosition}>
      {/* Inner solid sphere — small so it doesn't block navigation */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(origin.id);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        // Raycast against a slightly larger invisible sphere for easier clicking
        // but keep the visual small
      >
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : origin.hotspotColor}
          emissive={isSelected ? origin.hotspotColor : hovered ? origin.hotspotColor : "#000000"}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Outer glow ring — visual only, no pointer events */}
      <mesh ref={glowRef} raycast={() => null}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={origin.hotspotColor}
          transparent
          opacity={isSelected ? 0.5 : hovered ? 0.35 : 0.12}
          emissive={origin.hotspotColor}
          emissiveIntensity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Label on hover or selected */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.12, 0]}
          center
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              background: isSelected
                ? "rgba(20, 20, 40, 0.95)"
                : "rgba(20, 20, 40, 0.85)",
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "system-ui, sans-serif",
              fontWeight: isSelected ? 600 : 400,
              border: `1px solid ${origin.hotspotColor}`,
              boxShadow: isSelected
                ? `0 0 12px ${origin.hotspotColor}40`
                : "none",
            }}
          >
            {origin.name}
          </div>
        </Html>
      )}
    </group>
  );
}
