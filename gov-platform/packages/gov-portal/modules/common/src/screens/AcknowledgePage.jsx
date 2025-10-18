import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getComponent } from "@gov/core";

const AcknowledgePage = () => {
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const AppButton = getComponent("AppButton");

  const pageTitle =
    params.get("pageTitle") ||
    params.get("title") ||
    params.get("heading") ||
    params.get("form") ||
    "Application";
  const applicationNo =
    params.get("applicationNo") ||
    params.get("appNo") ||
    params.get("application") ||
    params.get("reference") ||
    "XXX-XXX-XXX";

  const status = params.get("status") || "success";
  const heading =
    params.get("heading") ||
    (status === "success" ? "Form submitted/updated Successfully" : "Operation Completed");
  const body =
    params.get("body") ||
    (status === "success"
      ? "Form has been submitted/updated successfully"
      : "Your request has been processed.");

  const iconColor = status === "success" ? "#16a34a" : "#ef4444";
  const iconSvg = status === "success" ? (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill={iconColor} />
      <path d="M7 13l3 3 7-8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="12" fill={iconColor} />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const handleBackHome = () => history.push("/landing");

  return (
    <div className="ack-root">
      <style>{`
        .ack-root { min-height:100vh; background:#f3f6f9; padding:24px; box-sizing:border-box; }
        .ack-inner { max-width:1200px; margin:0 auto; width:100%; padding:0 12px; box-sizing:border-box; }
        .ack-header { display:flex; align-items:center; gap:16px; margin-bottom:20px; flex-wrap:wrap; }
        .ack-title { margin:0; font-size:clamp(18px,2.6vw,28px); font-weight:500; color:rgba(0,0,0,0.87); line-height:1.1; }
        .ack-pill { margin-left:auto; background:#4b5563; color:#fff; padding:8px 14px; border-radius:6px; font-size:clamp(12px,1.6vw,13px); display:inline-flex; align-items:center; gap:8px; }
        .ack-card { display:flex; gap:24px; align-items:center; padding:22px; background:#fff; border-radius:8px; box-shadow:0 6px 18px rgba(3,27,50,0.06); border:1px solid rgba(0,0,0,0.05); box-sizing:border-box; flex-wrap:wrap; }
        .ack-left { display:flex; align-items:center; gap:18px; flex:1; min-width:0; }
        .ack-icon { flex:0 0 96px; display:flex; align-items:center; justify-content:center; }
        .ack-text { flex:1; min-width:0; }
        .ack-heading { margin:0; font-size:clamp(18px,1.8vw,24px); font-weight:500; color:rgba(0,0,0,0.85); }
        .ack-body { margin-top:8px; margin-bottom:0; color:rgba(0,0,0,0.6); word-break:break-word; }
        .ack-right { text-align:right; min-width:260px; box-sizing:border-box; }
        .ack-right .label { color:rgba(0,0,0,0.55); font-size:14px; margin-bottom:8px; }
        .ack-right .number { font-size:clamp(18px,2.4vw,32px); font-weight:700; color:rgba(0,0,0,0.9); line-height:1.1; word-break:break-word; }

        /* Floating action */
        .ack-float { position:fixed; right:24px; bottom:18px; z-index:1400; }

        /* Responsive adjustments */
        @media (max-width: 880px) {
          .ack-right { min-width:220px; }
          .ack-icon { flex:0 0 72px; }
        }
        @media (max-width: 640px) {
          .ack-header { align-items:flex-start; }
          .ack-pill { margin-left:0; order:2; }
          .ack-card { flex-direction:column; align-items:flex-start; gap:16px; padding:16px; }
          .ack-left { width:100%; }
          .ack-icon { flex:0 0 64px; }
          .ack-text { width:100%; }
          .ack-right { width:100%; text-align:left; min-width:0; margin-top:4px; }
          .ack-right .number { font-size:clamp(16px,4vw,22px); }
          .ack-float { right:12px; left:12px; bottom:12px; }
        }
      `}</style>

      <div className="ack-inner">
        <div className="ack-header">
          <h1 className="ack-title">{pageTitle}</h1>

          {applicationNo && (
            <div className="ack-pill" role="status" aria-label="Application reference">
              <span style={{ opacity: 0.9, fontSize: 13 }}>Reference No.</span>
              <strong style={{ fontSize: 13 }}>{applicationNo}</strong>
            </div>
          )}
        </div>

        <div className="ack-card" role="region" aria-labelledby="ack-heading">
          <div className="ack-left">
            <div className="ack-icon" aria-hidden>
              {iconSvg}
            </div>

            <div className="ack-text">
              <h2 id="ack-heading" className="ack-heading">{heading}</h2>
              <p className="ack-body">{body}</p>
            </div>
          </div>

          <div className="ack-right" aria-label="application number block">
            <div className="label">Reference number</div>
            <div className="number">{applicationNo || "—"}</div>
          </div>
        </div>
      </div>

      <div className="ack-float">
        <AppButton onClick={handleBackHome} style={{ padding: "10px 18px", width: "100%" }}>
          GO TO HOME
        </AppButton>
      </div>
    </div>
  );
};

export default AcknowledgePage;