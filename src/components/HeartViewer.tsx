import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { HeartModel } from "./HeartModel";
import { Hotspot } from "./Hotspot";
import { ViewerControls } from "./ViewerControls";
import { VisualSettingsPanel, DEFAULT_VISUAL_SETTINGS } from "./VisualSettings";
import type { VisualSettingsState } from "./VisualSettings";
import { CameraController } from "./CameraController";
import type { CameraControllerHandle } from "./CameraController";
import { SurfacePointer } from "./SurfacePointer";
import { pvcOrigins } from "../data/pvcOrigins";
import { listModelConfigs, getModelConfig, activeModelId as defaultModelId } from "../data/modelConfigs";

interface HeartViewerProps {
  selectedId: string | null;
  onSelectRegion: (id: string) => void;
  mappingMode?: boolean;
  onMappingClick?: (position: [number, number, number]) => void;
  mappedPositions?: Record<string, [number, number, number] | null>;
  /** The last clicked pending position in mapping mode */
  pendingPosition?: [number, number, number] | null;
  /** Current model ID — parent controls this for mapping mode */
  modelId?: string;
  onModelChange?: (id: string) => void;
}

export function HeartViewer({
  selectedId,
  onSelectRegion,
  mappingMode = false,
  onMappingClick,
  mappedPositions,
  pendingPosition,
  modelId,
  onModelChange,
}: HeartViewerProps) {
  const cameraRef = useRef<CameraControllerHandle>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([0, 0, 0]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visualSettings, setVisualSettings] = useState<VisualSettingsState>(DEFAULT_VISUAL_SETTINGS);

  const [focusOnSelect, setFocusOnSelect] = useState(true);
  const [hoverPosition, setHoverPosition] = useState<[number, number, number] | null>(null);

  const [internalModelId, setInternalModelId] = useState(defaultModelId);
  const currentModelId = modelId ?? internalModelId;
  const handleModelChange = useCallback((id: string) => {
    if (onModelChange) onModelChange(id);
    else setInternalModelId(id);
  }, [onModelChange]);

  // Fly camera to selected hotspot position
  useEffect(() => {
    if (!selectedId || !focusOnSelect || mappingMode) return;

    const positions = getModelConfig(currentModelId)?.hotspotPositions ?? {};
    const origin = pvcOrigins.find((o) => o.id === selectedId);
    if (!origin) return;

    const pos = positions[origin.id] ?? origin.hotspotPosition;
    cameraRef.current?.flyTo(pos);
  }, [selectedId, focusOnSelect, mappingMode, currentModelId, mappedPositions]);

  const handleZoomIn = useCallback(() => cameraRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => cameraRef.current?.zoomOut(), []);
  const handleResetView = useCallback(() => cameraRef.current?.resetView(), []);
  const handleSaveDefaultView = useCallback(() => cameraRef.current?.saveAsDefault(), []);
  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      cameraRef.current?.setAutoRotate(next);
      return next;
    });
  }, []);

  const handleModelClick = useCallback(
    (position: [number, number, number]) => {
      if (mappingMode && onMappingClick) {
        onMappingClick(position);
      }
    },
    [mappingMode, onMappingClick]
  );

  const { brightness, envMapIntensity, exposure } = visualSettings;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a1a", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        shadows
        gl={{ toneMapping: 3, toneMappingExposure: exposure }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.15 * brightness} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.35 * brightness}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 3, -3]} intensity={0.15 * brightness} />
        <pointLight position={[0, 2, 0]} intensity={0.1 * brightness} color="#ff8888" />

        {/* Environment for reflections */}
        <Environment preset="studio" environmentIntensity={envMapIntensity * brightness} />

        {/* Heart model */}
        <HeartModel
          modelId={currentModelId}
          onCentered={setModelCenter}
          onSurfaceClick={handleModelClick}
          visualSettings={visualSettings}
        />

        {/* PVC origin hotspots — use config positions, fall back to pvcOrigins defaults */}
        {!mappingMode &&
          (() => {
            const positions = getModelConfig(currentModelId)?.hotspotPositions ?? {};
            return pvcOrigins.map((origin) => {
              const pos = positions[origin.id] ?? origin.hotspotPosition;
              return (
                <Hotspot
                  key={`${currentModelId}-${origin.id}`}
                  origin={{ ...origin, hotspotPosition: pos }}
                  isSelected={selectedId === origin.id}
                  onClick={onSelectRegion}
                />
              );
            });
          })()}

        {/* Mapping mode: surface pointer tracker, markers, pending click */}
        {mappingMode && (
          <>
            <SurfacePointer onHoverPosition={setHoverPosition} />

            {/* Assigned mapping markers (green) — always visible on top */}
            {mappedPositions &&
              Object.entries(mappedPositions).map(([id, pos]) => {
                if (!pos) return null;
                return (
                  <group key={id} position={pos} raycast={() => null}>
                    {/* Outer glow ring */}
                    <mesh raycast={() => null}>
                      <sphereGeometry args={[0.05, 16, 16]} />
                      <meshBasicMaterial
                        color="#44cc88"
                        transparent
                        opacity={0.3}
                        depthTest={false}
                      />
                    </mesh>
                    {/* Inner solid dot */}
                    <mesh raycast={() => null}>
                      <sphereGeometry args={[0.025, 12, 12]} />
                      <meshBasicMaterial
                        color="#44cc88"
                        depthTest={false}
                      />
                    </mesh>
                  </group>
                );
              })}

            {/* Pending click marker (orange) — large, always on top */}
            {pendingPosition && (
              <group position={pendingPosition} raycast={() => null}>
                {/* Outer pulse ring */}
                <mesh raycast={() => null}>
                  <ringGeometry args={[0.06, 0.09, 32]} />
                  <meshBasicMaterial
                    color="#ffaa22"
                    transparent
                    opacity={0.6}
                    depthTest={false}
                    side={2}
                  />
                </mesh>
                {/* Inner solid dot */}
                <mesh raycast={() => null}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial
                    color="#ffaa22"
                    depthTest={false}
                  />
                </mesh>
              </group>
            )}
          </>
        )}

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={5}
          blur={2}
        />

        {/* Camera controls */}
        <CameraController ref={cameraRef} autoRotate={autoRotate} orbitTarget={modelCenter} />
      </Canvas>

      {/* Overlay toolbar */}
      <ViewerControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onToggleAutoRotate={handleToggleAutoRotate}
        autoRotate={autoRotate}
        onToggleSettings={() => setSettingsOpen((p) => !p)}
        settingsOpen={settingsOpen}
        focusOnSelect={focusOnSelect}
        onToggleFocusOnSelect={() => setFocusOnSelect((p) => !p)}
        onSaveDefaultView={handleSaveDefaultView}
      />

      {/* Settings panel */}
      {settingsOpen && (
        <VisualSettingsPanel
          settings={visualSettings}
          onChange={setVisualSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Model selector — top right, offset to avoid collapse button */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "36px",
          zIndex: 10,
        }}
      >
        <select
          value={currentModelId}
          onChange={(e) => handleModelChange(e.target.value)}
          style={{
            padding: "6px 10px",
            fontSize: "11px",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(20, 20, 35, 0.85)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {listModelConfigs().map((m) => (
            <option key={m.id} value={m.id} style={{ background: "#1a1a2e" }}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mode indicator */}
      {mappingMode && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(68, 136, 255, 0.9)",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          MAPPING MODE — Click on heart to place marker
        </div>
      )}

      {/* Coordinate readout — bottom left, mapping mode only */}
      {mappingMode && hoverPosition && (
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "12px",
            fontSize: "11px",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.5)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          [{hoverPosition.map((n) => n.toFixed(3)).join(", ")}]
        </div>
      )}

      {/* Keyboard hint */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.35)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Drag to rotate · Scroll to zoom · Right-click to pan · Middle-click to pan
      </div>
    </div>
  );
}
