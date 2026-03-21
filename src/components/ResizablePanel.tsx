import { useState, useCallback, useRef, useEffect } from "react";

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultRightWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
}

const collapseBtn: React.CSSProperties = {
  position: "absolute",
  top: "8px",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#e0e0e0",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "11px",
  color: "#666",
  padding: 0,
  zIndex: 20,
  transition: "background 0.15s",
};

export function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultRightWidth = 380,
  minRightWidth = 280,
  maxRightWidth = 600,
}: ResizablePanelProps) {
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const savedRightWidth = useRef(defaultRightWidth);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleRightCollapse = useCallback(() => {
    setRightCollapsed((prev) => {
      if (!prev) {
        savedRightWidth.current = rightWidth;
      } else {
        setRightWidth(savedRightWidth.current);
      }
      return !prev;
    });
  }, [rightWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current || rightCollapsed) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newRightWidth = containerRect.right - e.clientX;
      setRightWidth(
        Math.max(minRightWidth, Math.min(maxRightWidth, newRightWidth))
      );
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minRightWidth, maxRightWidth, rightCollapsed]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {leftPanel}
      </div>

      {/* Resize handle + collapse toggle */}
      <div
        style={{
          width: "6px",
          cursor: rightCollapsed ? "pointer" : "col-resize",
          background: "#e0e0e0",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
          transition: "background 0.15s",
        }}
        onMouseDown={rightCollapsed ? undefined : handleMouseDown}
        onDoubleClick={toggleRightCollapse}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#4488ff"; }}
        onMouseLeave={(e) => {
          if (!isDragging.current) e.currentTarget.style.background = "#e0e0e0";
        }}
      >
        {/* Collapse/expand button — positioned left of the handle so it's always visible */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleRightCollapse(); }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            ...collapseBtn,
            left: "-22px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#4488ff"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#e0e0e0"; e.currentTarget.style.color = "#666"; }}
          title={rightCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {rightCollapsed ? "\u25C0" : "\u25B6"}
        </button>

        {/* Drag indicator dots */}
        {!rightCollapsed && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              pointerEvents: "none",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#999" }} />
            ))}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div
        style={{
          width: rightCollapsed ? "0px" : `${rightWidth}px`,
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: rightCollapsed ? "width 0.2s ease" : undefined,
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
