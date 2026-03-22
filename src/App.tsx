import { useState, useCallback } from "react";
import { HeartViewer } from "./components/HeartViewer";
import { ECGPanel } from "./components/ECGPanel";
import { ClinicalInfoPanel } from "./components/ClinicalInfoPanel";
import { RegionList } from "./components/RegionList";
import { MappingPanel } from "./components/MappingPanel";
import { ResizablePanel } from "./components/ResizablePanel";
import { getOriginById } from "./data/pvcOrigins";
import { getModelConfig, blankHotspots, activeModelId as defaultModelId } from "./data/modelConfigs";

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailOrigin = detailId ? getOriginById(detailId) : null;

  // Mapping mode state — session only, export via "Copy as JSON" then paste into modelConfigs.ts
  const [mappingMode, setMappingMode] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<[number, number, number] | null>(null);
  const [mappedPositions, setMappedPositions] = useState<Record<string, [number, number, number] | null>>(
    () => ({ ...getModelConfig(defaultModelId)?.hotspotPositions ?? blankHotspots() })
  );

  const handleMappingClick = useCallback((position: [number, number, number]) => {
    setPendingPosition(position);
  }, []);

  const handleAssign = useCallback((originId: string, position: [number, number, number]) => {
    setMappedPositions((prev) => ({ ...prev, [originId]: position }));
    setPendingPosition(null);
  }, []);

  const handleClear = useCallback((originId: string) => {
    setMappedPositions((prev) => ({ ...prev, [originId]: null }));
  }, []);

  const handleExitMapping = useCallback(() => {
    setMappingMode(false);
    setPendingPosition(null);
  }, []);

  const leftContent = (
    <div style={{ width: "100%", height: "100%" }}>
      <HeartViewer
        selectedId={selectedId}
        onSelectRegion={(id) => { setSelectedId(id); setDetailId(id); }}
        onHoverRegion={setHoveredId}
        mappingMode={mappingMode}
        onMappingClick={handleMappingClick}
        mappedPositions={mappedPositions}
        pendingPosition={pendingPosition}
        modelId={defaultModelId}
      />
    </div>
  );

  const rightContent = mappingMode ? (
    <MappingPanel
      pendingPosition={pendingPosition}
      mappedPositions={mappedPositions}
      onAssign={handleAssign}
      onClear={handleClear}
      onExit={handleExitMapping}
    />
  ) : (
    <div
      style={{
        background: "#fff",
        overflowY: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {detailOrigin ? (
        <>
          {/* Back to list button */}
          <button
            onClick={() => setDetailId(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px",
              background: "none",
              border: "none",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
              fontSize: "12px",
              color: "#4488ff",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#2266dd"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#4488ff"; }}
          >
            &#9664; All PVC Origins
          </button>

          {/* Region header */}
          <div
            style={{
              padding: "12px 16px 10px",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: detailOrigin.hotspotColor,
                  boxShadow: `0 0 8px ${detailOrigin.hotspotColor}60`,
                }}
              />
              <h2 style={{ margin: 0, fontSize: "16px", color: "#1a1a2e" }}>
                {detailOrigin.fullName}
              </h2>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#888",
                marginTop: "2px",
                display: "block",
              }}
            >
              Category: {detailOrigin.category}
            </span>
          </div>

          {/* ECG Display */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
          >
            <ECGPanel origin={detailOrigin} />
          </div>

          {/* Clinical Info */}
          <div
            style={{
              padding: "12px 16px",
              flex: 1,
            }}
          >
            <ClinicalInfoPanel origin={detailOrigin} />
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header with mapping mode button */}
          <div
            style={{
              padding: "16px 16px 12px",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#1a1a2e" }}>
                PVC Origin Locations
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>
                Click to highlight · Double-click or arrow for details
              </p>
            </div>
            <button
              onClick={() => setMappingMode(true)}
              style={{
                background: "#4488ff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "11px",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#2266dd"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#4488ff"; }}
            >
              Edit Mappings
            </button>
          </div>

          {/* Region list */}
          <div
            style={{
              padding: "8px 16px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            <RegionList
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelectRegion={setSelectedId}
              onOpenDetail={(id) => { setSelectedId(id); setDetailId(id); }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f5f5f7",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            PVC Localization Tool
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#888",
            }}
          >
            Interactive cardiac anatomy to ECG correlation for electrophysiology education
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#c00",
              background: "#fff5f5",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid #fdd",
            }}
          >
            Educational prototype — Clinical content pending EP physician review
          </div>
          <a
            href="https://github.com/karansuraj/pvc-heart-tool"
            target="_blank"
            rel="noopener noreferrer"
            title="View source on GitHub"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#666",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a2e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main content area - resizable split */}
      <ResizablePanel
        leftPanel={leftContent}
        rightPanel={rightContent}
        defaultRightWidth={380}
        minRightWidth={280}
        maxRightWidth={700}
      />
    </div>
  );
}

export default App;
