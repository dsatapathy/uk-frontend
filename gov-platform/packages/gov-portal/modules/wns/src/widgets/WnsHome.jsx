import React from "react";
import { getAction } from "@gov/core";

export default function WnsHome({ title = "Water & Sewerage" }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ opacity: 0.8 }}>Welcome to the Water & Sewerage module.</p>
      <button onClick={() => getAction("wns.goto")?.()}>Open Water & Sewerage</button>
    </div>
  );
}
