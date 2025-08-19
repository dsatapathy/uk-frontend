import React from "react";
import { getAction } from "@gov/core";   // <-- pull from registry
import s from "@gov/styles/modules/bpa/BpaHome.module.scss";
export default function BpaCard({ title = "BPA" }) {
  return (
    <div className={`mod-bpa ${s.page}`}>
      <h3 className="header"><h2 className={s.title}>{title}</h2></h3>
      <p className="grid">Building Plan Approval</p>
      <button onClick={() => getAction("bpa.start")?.()}>
        Start Application
      </button>
    </div>
  );
}
