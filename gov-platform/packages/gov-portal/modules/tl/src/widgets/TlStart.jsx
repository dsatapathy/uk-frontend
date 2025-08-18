import React from "react";

export default function TlStart({ context }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Start Tl Application</h2>
      <p>Collect basic details and proceed to the next step.</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => context?.actions?.["tl.next"]?.()}>
          Continue
        </button>
        <button onClick={() => context?.actions?.["tl.back"]?.()}>
          Back
        </button>
      </div>
    </div>
  );
}
