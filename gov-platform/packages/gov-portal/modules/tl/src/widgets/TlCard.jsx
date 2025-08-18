import React from "react";
import { getAction } from "@gov/core";   // <-- pull from registry

export default function TlCard({ title = "BPA" }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ opacity: 0.75 }}>Trade License</p>
      <button onClick={() => getAction("tl.start")?.()}>
        Start Application
      </button>
    </div>
  );
}
