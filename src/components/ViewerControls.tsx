import { useCallback } from "react";

interface ViewerControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleAutoRotate: () => void;
  autoRotate: boolean;
  onToggleSettings: () => void;
  settingsOpen: boolean;
  focusOnSelect: boolean;
  onToggleFocusOnSelect: () => void;
  onSaveDefaultView: () => void;
}

const btnStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  transition: "all 0.15s ease",
  lineHeight: 1,
  padding: 0,
  userSelect: "none",
};

const btnHoverStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.25)",
};

function ToolbarButton({
  title,
  onClick,
  children,
  active,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    Object.assign(e.currentTarget.style, btnHoverStyle);
  }, []);
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.background = active
        ? "rgba(255,255,255,0.25)"
        : "rgba(255,255,255,0.12)";
    },
    [active]
  );

  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...btnStyle,
        ...(active ? { background: "rgba(255,255,255,0.25)", borderColor: "rgba(255,255,255,0.3)" } : {}),
      }}
    >
      {children}
    </button>
  );
}

export function ViewerControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleAutoRotate,
  autoRotate,
  onToggleSettings,
  settingsOpen,
  focusOnSelect,
  onToggleFocusOnSelect,
  onSaveDefaultView,
}: ViewerControlsProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        zIndex: 10,
      }}
    >
      {/* Zoom in */}
      <ToolbarButton title="Zoom in" onClick={onZoomIn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </ToolbarButton>

      {/* Zoom out */}
      <ToolbarButton title="Zoom out" onClick={onZoomOut}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </ToolbarButton>

      {/* Divider */}
      <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.15)", margin: "2px auto" }} />

      {/* Reset view */}
      <ToolbarButton title="Reset view" onClick={onResetView}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </ToolbarButton>

      {/* Save current view as default */}
      <ToolbarButton title="Save current view as default" onClick={onSaveDefaultView}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </ToolbarButton>

      {/* Toggle auto-rotate */}
      <ToolbarButton title={autoRotate ? "Stop rotation" : "Auto-rotate"} onClick={onToggleAutoRotate} active={autoRotate}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6" />
          <path d="M2.5 22v-6h6" />
          <path d="M2.5 11.5a10 10 0 0 1 18.8-4.3L21.5 8" />
          <path d="M21.5 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
        </svg>
      </ToolbarButton>

      {/* Focus on select toggle */}
      <ToolbarButton title={focusOnSelect ? "Auto-focus on select: ON" : "Auto-focus on select: OFF"} onClick={onToggleFocusOnSelect} active={focusOnSelect}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
        </svg>
      </ToolbarButton>

      {/* Divider */}
      <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.15)", margin: "2px auto" }} />

      {/* Settings */}
      <ToolbarButton title="Display settings" onClick={onToggleSettings} active={settingsOpen}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </ToolbarButton>
    </div>
  );
}
