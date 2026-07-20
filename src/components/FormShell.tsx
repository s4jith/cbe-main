"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Shared form wrapper: posts FormData to a Google Apps Script endpoint,
 * preserves the legacy _honeypot spam trap, renders status states.
 */
export default function FormShell({
  action,
  children,
  submitLabel,
  accent = "starlight",
}: {
  action: string;
  children: ReactNode;
  submitLabel: string;
  accent?: "starlight" | "cranberry";
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_honeypot")) return;
    data.delete("_honeypot");
    setStatus("sending");
    try {
      await fetch(action, { method: "POST", body: data });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const btnSkin =
    accent === "starlight" ? "bg-starlight text-starlight-ink" : "bg-cranberry text-white";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {children}
      <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button
        type="submit"
        disabled={status === "sending"}
        className={`jelly mt-2 h-14 items-center justify-center rounded-full px-8 text-[17px] font-bold disabled:opacity-60 ${btnSkin}`}
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
      {status === "sent" && (
        <p className="text-[16px] font-bold text-ink" role="status">
          ✦ Sent successfully — we&apos;ll be in touch.
        </p>
      )}
      {status === "error" && (
        <p className="text-[16px] font-bold text-cranberry" role="alert">
          Failed to send. Please try again.
        </p>
      )}
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  as = "input",
  options,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  const base =
    "w-full rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-[16px] font-medium text-ink outline-none transition-shadow focus:ring-2 focus:ring-starlight";
  return (
    <label className="grid gap-1.5">
      <span className="text-[14px] font-bold text-ink/70">
        {label}
        {required && <span className="text-cranberry"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea name={name} required={required} placeholder={placeholder} rows={5} className={base} />
      ) : as === "select" ? (
        <select name={name} required={required} defaultValue="" className={base}>
          <option value="" disabled>
            {placeholder ?? "Select"}
          </option>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} className={base} />
      )}
    </label>
  );
}
