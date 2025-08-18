import React from "react";

/**
 * A small, stateless widget.
 * Receives `props` from config and `context` from runtime.
 */
export default function TlCard({ title = "TL", context }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ opacity: 0.75 }}>Trade License</p>
      <button onClick={() => context?.actions?.["bpa.start"]?.()}>
        Start Application
      </button>
    </div>
  );
}
