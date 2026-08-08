import React from "react";

/** Wordmark shown on the admin login screen. */
export function Logo() {
  return (
    <div className="gx-brand gx-brand--lg">
      <span className="gx-brand__mark">✦</span>
      <span className="gx-brand__text">
        Main<span className="gx-brand__dim">/admin</span>
      </span>
      <span className="gx-brand__sub">Rotaract Club of Coimbatore Main — website content</span>
    </div>
  );
}

export default Logo;
