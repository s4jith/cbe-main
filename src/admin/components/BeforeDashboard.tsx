import React from "react";

type Card = { title: string; desc: string; href: string };

const CARDS: Card[] = [
  { title: "Team", desc: "Board and general members with photos — also shown on the home page.", href: "/admin/collections/members" },
  { title: "Projects", desc: "Every project card on the projects page, grouped by avenue.", href: "/admin/collections/projects" },
  { title: "Flagship Projects", desc: "The spotlight tabs on the home page.", href: "/admin/collections/flagship-projects" },
  { title: "Legacy Photos", desc: "The archive gallery on the Legacy page — hosted on Cloudinary.", href: "/admin/collections/legacy-photos" },
  { title: "Media", desc: "All uploaded photos and PDFs.", href: "/admin/collections/media" },
];

/** Task-oriented landing panel — the default Payload dashboard is just a list of slugs. */
export function BeforeDashboard() {
  return (
    <div className="gx-dash">
      <div className="gx-dash__hero">
        <h1 className="gx-dash__title">
          Welcome back <span aria-hidden>✦</span>
        </h1>
        <p className="gx-dash__lede">
          Edit the team, projects and flagship spotlights here. Changes go live within a few
          seconds of saving.
        </p>
        <div className="gx-dash__actions">
          <a className="gx-dash__btn" href="/admin/collections/members">
            Edit Team
          </a>
          <a className="gx-dash__btn gx-dash__btn--quiet" href="/admin/collections/projects">
            Edit Projects
          </a>
          <a className="gx-dash__btn gx-dash__btn--quiet" href="/" target="_blank" rel="noopener noreferrer">
            View live site ↗
          </a>
        </div>
      </div>

      <section className="gx-dash__group">
        <div className="gx-dash__grid">
          {CARDS.map((card) => (
            <a key={card.href} className="gx-dash__card" href={card.href}>
              <span className="gx-dash__cardtitle">{card.title}</span>
              <span className="gx-dash__carddesc">{card.desc}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BeforeDashboard;
