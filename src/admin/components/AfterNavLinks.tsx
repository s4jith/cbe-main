import React from "react";

/** "View live site" shortcut pinned under the admin navigation. */
export function AfterNavLinks() {
  return (
    <a className="gx-nav-cta" href="/" target="_blank" rel="noopener noreferrer">
      <span>View live site</span>
      <span aria-hidden>↗</span>
    </a>
  );
}

export default AfterNavLinks;
