import { useState } from "react";
import { ORIGIN_IDS } from "../data/modelConfigs";
import { pvcOrigins } from "../data/pvcOrigins";

interface MappingPanelProps {
  /** The last clicked position on the heart surface */
  pendingPosition: [number, number, number] | null;
  /** All currently mapped positions */
  mappedPositions: Record<string, [number, number, number] | null>;
  /** Called when user assigns a position to an origin */
  onAssign: (originId: string, position: [number, number, number]) => void;
  /** Called when user clears a mapping */
  onClear: (originId: string) => void;
  /** Called to exit mapping mode */
  onExit: () => void;
}

/** Get the display name for an origin ID */
function getOriginName(id: string): string {
  const origin = pvcOrigins.find((o) => o.id === id);
  return origin?.name ?? id;
}

export function MappingPanel({
  pendingPosition,
  mappedPositions,
  onAssign,
  onClear,
  onExit,
}: MappingPanelProps) {
  const [copiedJson, setCopiedJson] = useState(false);

  const mappedCount = Object.values(mappedPositions).filter((v) => v !== null).length;
  const totalCount = ORIGIN_IDS.length;

  // Build JSON for pasting into modelConfigs.ts
  const exportJson = () => {
    const lines = Object.entries(mappedPositions)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => `    "${k}": [${v!.map((n) => n.toFixed(3)).join(", ")}]`)
      .join(",\n");
    const json = `{\n${lines}\n}`;
    navigator.clipboard.writeText(json).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#1a1a2e" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          background: "#2a2a4e",
          borderBottom: "1px solid #3a3a5e",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: "14px", color: "#fff" }}>
            Mapping Mode
          </h3>
          <button
            onClick={onExit}
            style={{
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#aaa" }}>
          Click on the heart to place a marker, then assign it to a PVC origin below.
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#7a7aaa" }}>
          {mappedCount} / {totalCount} origins mapped
        </p>
      </div>

      {/* Pending position */}
      {pendingPosition && (
        <div
          style={{
            padding: "10px 16px",
            background: "#2a3a2e",
            borderBottom: "1px solid #3a4a3e",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: "11px", color: "#8c8", marginBottom: "6px", fontWeight: 600 }}>
            Last clicked position
          </div>
          <div style={{ fontSize: "12px", color: "#cfc", fontFamily: "monospace", marginBottom: "8px" }}>
            [{pendingPosition.map((n) => n.toFixed(3)).join(", ")}]
          </div>
          <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "4px" }}>
            Assign to:
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onAssign(e.target.value, pendingPosition);
                e.target.value = "";
              }
            }}
            defaultValue=""
            style={{
              width: "100%",
              padding: "6px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #3a3a5e",
              background: "#1a1a2e",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="" disabled>
              Select PVC origin...
            </option>
            {ORIGIN_IDS.map((id) => (
              <option key={id} value={id}>
                {getOriginName(id)} {mappedPositions[id] ? "(remapping)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mapped origins list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {ORIGIN_IDS.map((id) => {
          const pos = mappedPositions[id];
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 16px",
                fontSize: "12px",
                color: pos ? "#ccc" : "#666",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: pos ? "#4c8" : "#444",
                    flexShrink: 0,
                  }}
                />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {getOriginName(id)}
                </span>
              </div>
              {pos ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", color: "#888", fontFamily: "monospace" }}>
                    [{pos.map((n) => n.toFixed(2)).join(", ")}]
                  </span>
                  <button
                    onClick={() => onClear(id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#a66",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "0 2px",
                      lineHeight: 1,
                    }}
                    title="Clear mapping"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: "10px", color: "#555" }}>unmapped</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Export */}
      {mappedCount > 0 && (
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #3a3a5e",
            flexShrink: 0,
          }}
        >
          <button
            onClick={exportJson}
            style={{
              width: "100%",
              padding: "8px",
              background: copiedJson ? "#2a4a2e" : "#4488ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {copiedJson ? "Copied to clipboard!" : "Copy mappings as JSON"}
          </button>
        </div>
      )}
    </div>
  );
}
