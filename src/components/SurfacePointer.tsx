import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SurfacePointerProps {
  /** Called every frame with the current hover position (or null if not on surface) */
  onHoverPosition: (pos: [number, number, number] | null) => void;
}

/**
 * Raycasts from the mouse onto the scene every frame during mapping mode.
 * Reports the surface position for the coordinate readout.
 */
export function SurfacePointer({ onHoverPosition }: SurfacePointerProps) {
  const { camera, scene, pointer } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const lastReported = useRef<string>("");

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera);
    const hits = raycaster.current.intersectObjects(scene.children, true);

    // Find first hit that's on a mesh (not a hotspot marker)
    const hit = hits.find((h) => {
      const obj = h.object;
      // Skip tiny spheres (hotspot markers / mapping markers)
      if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
        const params = obj.geometry.parameters;
        if (params.radius <= 0.05) return false;
      }
      return obj instanceof THREE.Mesh;
    });

    if (hit) {
      const p = hit.point;
      const key = `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`;
      if (key !== lastReported.current) {
        lastReported.current = key;
        onHoverPosition([p.x, p.y, p.z]);
      }
    } else {
      if (lastReported.current !== "") {
        lastReported.current = "";
        onHoverPosition(null);
      }
    }
  });

  return null;
}
