import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const FALLBACK_CAM_OFFSET = new THREE.Vector3(0, 1, 4);
const ZOOM_STEP = 0.8;
const MIN_DISTANCE = 0;
const MAX_DISTANCE = 12;
const STORAGE_KEY_VIEW = "pvc-default-camera-view";

interface SavedView {
  position: [number, number, number];
  target: [number, number, number];
}

function loadDefaultView(): SavedView | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIEW);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDefaultView(view: SavedView) {
  localStorage.setItem(STORAGE_KEY_VIEW, JSON.stringify(view));
}

export interface CameraControllerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setAutoRotate: (v: boolean) => void;
  flyTo: (point: [number, number, number]) => void;
  /** Save current camera position/target as the default view */
  saveAsDefault: () => void;
}

interface Props {
  autoRotate: boolean;
  orbitTarget?: [number, number, number];
}

export const CameraController = forwardRef<CameraControllerHandle, Props>(
  function CameraController({ autoRotate, orbitTarget = [0, 0, 0] }, ref) {
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();
    const orbitTargetVec = new THREE.Vector3(...orbitTarget);

    const zoomTarget = useRef<number | null>(null);
    const flyTarget = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
    /** Target horizontal angle for spin-to — null = no active spin */
    const spinTarget = useRef<number | null>(null);

    // Apply saved default view on mount
    useEffect(() => {
      const saved = loadDefaultView();
      if (saved) {
        camera.position.set(...saved.position);
        if (controlsRef.current) {
          controlsRef.current.target.set(...saved.target);
          controlsRef.current.update();
        }
      }
    }, []);

    useImperativeHandle(ref, () => ({
      zoomIn() {
        const controls = controlsRef.current;
        if (!controls) return;
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
        const newDist = Math.max(MIN_DISTANCE, dir.length() - ZOOM_STEP);
        zoomTarget.current = newDist;
      },
      zoomOut() {
        const controls = controlsRef.current;
        if (!controls) return;
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
        const newDist = Math.min(MAX_DISTANCE, dir.length() + ZOOM_STEP);
        zoomTarget.current = newDist;
      },
      resetView() {
        const saved = loadDefaultView();
        if (saved) {
          flyTarget.current = {
            pos: new THREE.Vector3(...saved.position),
            target: new THREE.Vector3(...saved.target),
          };
        } else {
          flyTarget.current = {
            pos: orbitTargetVec.clone().add(FALLBACK_CAM_OFFSET),
            target: orbitTargetVec.clone(),
          };
        }
      },
      setAutoRotate(v: boolean) {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = v;
        }
      },
      flyTo(point: [number, number, number]) {
        const controls = controlsRef.current;
        if (!controls) return;

        // Just compute the horizontal angle from orbit center to the hotspot
        // and spin the camera to that angle — nothing else changes
        const dx = point[0] - controls.target.x;
        const dz = point[2] - controls.target.z;
        spinTarget.current = Math.atan2(dx, dz);
      },
      saveAsDefault() {
        const controls = controlsRef.current;
        if (!controls) return;
        const pos: [number, number, number] = [camera.position.x, camera.position.y, camera.position.z];
        const tgt: [number, number, number] = [controls.target.x, controls.target.y, controls.target.z];
        saveDefaultView({ position: pos, target: tgt });
      },
    }));

    useFrame((_, delta) => {
      const controls = controlsRef.current;
      if (!controls) return;

      if (zoomTarget.current !== null) {
        const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
        const currentDist = dir.length();
        const targetDist = zoomTarget.current;
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, Math.min(1, delta * 12));

        if (Math.abs(newDist - targetDist) < 0.01) {
          dir.normalize().multiplyScalar(targetDist);
          zoomTarget.current = null;
        } else {
          dir.normalize().multiplyScalar(newDist);
        }
        camera.position.copy(controls.target).add(dir);
        controls.update();
      }

      // Smooth fly-to (used for resetView)
      if (flyTarget.current) {
        const { pos, target } = flyTarget.current;
        const speed = Math.min(1, delta * 5);
        camera.position.lerp(pos, speed);
        controls.target.lerp(target, speed);

        if (camera.position.distanceTo(pos) < 0.02 && controls.target.distanceTo(target) < 0.02) {
          camera.position.copy(pos);
          controls.target.copy(target);
          flyTarget.current = null;
        }
        controls.update();
      }

      // Spin to face hotspot — only changes horizontal angle, nothing else
      if (spinTarget.current !== null) {
        const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
        const horizDist = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
        const currentAngle = Math.atan2(offset.x, offset.z);
        const targetAngle = spinTarget.current;

        // Shortest path rotation
        let angleDiff = targetAngle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        if (Math.abs(angleDiff) < 0.005) {
          // Snap to final angle
          offset.x = Math.sin(targetAngle) * horizDist;
          offset.z = Math.cos(targetAngle) * horizDist;
          spinTarget.current = null;
        } else {
          const newAngle = currentAngle + angleDiff * Math.min(1, delta * 5);
          offset.x = Math.sin(newAngle) * horizDist;
          offset.z = Math.cos(newAngle) * horizDist;
        }
        // Y stays exactly the same
        camera.position.copy(controls.target).add(offset);
        controls.update();
      }
    });

    useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.target.copy(orbitTargetVec);
        controlsRef.current.update();
      }
    }, [orbitTarget[0], orbitTarget[1], orbitTarget[2]]);

    useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 1.0;
      }
    }, [autoRotate]);

    return (
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        target={orbitTarget}
        enableDamping={true}
        dampingFactor={0.12}
        rotateSpeed={0.7}
        panSpeed={0.7}
        zoomSpeed={0.35}
      />
    );
  }
);
