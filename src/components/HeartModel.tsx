import { Suspense, useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
import type { VisualSettingsState } from "./VisualSettings";

// Patch Three.js with BVH acceleration for faster raycasting
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

import { getModelConfig, activeModelId as defaultModelId } from "../data/modelConfigs";

/** Callback to notify parent of the model's world-space center */
export type OnModelCentered = (center: [number, number, number]) => void;

interface GLBHeartProps {
  modelId: string;
  onCentered?: OnModelCentered;
  onSurfaceClick?: (position: [number, number, number]) => void;
  visualSettings?: VisualSettingsState;
}

/**
 * Loads a heart GLB model, auto-centers/scales it,
 * hides flagged meshes, and applies visual settings to materials.
 */
function GLBHeart({ modelId, onCentered, onSurfaceClick, visualSettings }: GLBHeartProps) {
  const config = getModelConfig(modelId)!;
  const gltf = useGLTF(`/${config.file}`);
  const groupRef = useRef<THREE.Group>(null);
  const [ready, setReady] = useState(false);

  // Initial setup: hide meshes, compute BVH, center model
  useEffect(() => {
    if (!gltf.scene) return;

    const hiddenSet = new Set(config.hiddenMeshes);
    let meshIndex = 0;

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const idx = meshIndex++;

        if (hiddenSet.has(idx) || hiddenSet.has(mesh.name)) {
          mesh.visible = false;
          return;
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          mesh.geometry.computeBoundsTree();
        }
      }
    });

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = config.scale ?? 2.2 / maxDim;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);

      let worldCenter: [number, number, number];
      if (config.positionOffset) {
        groupRef.current.position.set(...config.positionOffset);
        worldCenter = config.positionOffset;
      } else {
        groupRef.current.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale
        );
        worldCenter = [0, 0, 0];
      }

      onCentered?.(worldCenter);
    }

    setReady(true);
  }, [gltf.scene, config]);

  // Cache original material colors so we can restore them
  const originalColors = useRef<Map<THREE.Material, THREE.Color>>(new Map());

  // Capture original colors once on load
  useEffect(() => {
    if (!gltf.scene || !ready) return;
    const map = new Map<THREE.Material, THREE.Color>();
    gltf.scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        if (!map.has(mat) && (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) {
          map.set(mat, mat.color.clone());
        }
      }
    });
    originalColors.current = map;
  }, [gltf.scene, ready]);

  // Apply visual settings to all materials whenever they change
  useEffect(() => {
    if (!gltf.scene || !visualSettings) return;

    gltf.scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      if (!mesh.visible) return;

      const applyToMaterial = (mat: THREE.Material) => {
        if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
          mat.roughness = visualSettings.roughness;
          mat.metalness = visualSettings.metalness;
          mat.envMapIntensity = visualSettings.envMapIntensity;
          mat.wireframe = visualSettings.wireframe;
          mat.side = visualSettings.doubleSided ? THREE.DoubleSide : THREE.FrontSide;

          if (visualSettings.opacity < 1) {
            mat.transparent = true;
            mat.opacity = visualSettings.opacity;
            mat.depthWrite = visualSettings.opacity > 0.9;
          } else {
            mat.transparent = false;
            mat.opacity = 1;
            mat.depthWrite = true;
          }

          // Apply color tint or restore original
          if (visualSettings.colorTint) {
            mat.color.set(visualSettings.colorTint);
          } else {
            const orig = originalColors.current.get(mat);
            if (orig) mat.color.copy(orig);
          }

          mat.needsUpdate = true;
        }
      };

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(applyToMaterial);
      } else {
        applyToMaterial(mesh.material);
      }
    });
  }, [gltf.scene, visualSettings]);

  const handleClick = (e: THREE.Event & { point?: THREE.Vector3 }) => {
    if (e.point) {
      const p = e.point;
      console.log(
        `[HeartModel] Clicked position: [${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)}]`
      );
      onSurfaceClick?.([p.x, p.y, p.z]);
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Preload ALL registered models so switching is instant
import { listModelConfigs } from "../data/modelConfigs";
for (const cfg of listModelConfigs()) {
  useGLTF.preload(`/${cfg.file}`);
}

export function HeartModel({
  modelId = defaultModelId,
  onCentered,
  onSurfaceClick,
  visualSettings,
}: {
  modelId?: string;
  onCentered?: OnModelCentered;
  onSurfaceClick?: (position: [number, number, number]) => void;
  visualSettings?: VisualSettingsState;
}) {
  return (
    <Suspense fallback={null}>
      <GLBHeart
        key={modelId}
        modelId={modelId}
        onCentered={onCentered}
        onSurfaceClick={onSurfaceClick}
        visualSettings={visualSettings}
      />
    </Suspense>
  );
}
