import React from "react";
import { getAction } from "@gov/core";   // <-- pull from registry

export default function BpaCard({ title = "BPA" }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ opacity: 0.75 }}>Building Plan Approval</p>
      <button onClick={() => getAction("bpa.start")?.()}>
        Start Application
      </button>
    </div>
  );
}
