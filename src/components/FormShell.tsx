"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import type { FormChrome, FormFieldData } from "@/lib/types";
import { cssColor } from "@/lib/theme";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Posts FormData to a Google Apps Script endpoint, preserves the legacy _honeypot
 * spam trap, and renders whichever questions the CMS defines.
 */
export default function FormShell({
  action,
  fields,
  chrome,
  consentLabel,
}: {
  action: string;
  fields: FormFieldData[];
  chrome: FormChrome;
  consentLabel?: string;
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

  const accent = cssColor(chrome.accent, "var(--color-starlight)");
  const accentText = cssColor(chrome.accentText, "var(--color-starlight-ink)");
  const style = { "--form-accent": accent } as CSSProperties;

  return (
    <form onSubmit={onSubmit} className="grid gap-5" style={style}>
      {groupRows(fields).map((row, i) =>
        row.length === 1 ? (
          <Field key={`${row[0].key}-${i}`} field={row[0]} accent={accent} />
        ) : (
          <div key={`row-${i}`} className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {row.map((f) => (
              <Field key={f.key} field={f} accent={accent} />
            ))}
          </div>
        ),
      )}

      {consentLabel && (
        <label className="flex items-start gap-3 text-[15px] font-medium text-ink/70">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4"
            style={{ accentColor: accent }}
          />
          {consentLabel}
        </label>
      )}

      <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <button
        type="submit"
        disabled={status === "sending"}
        className="jelly mt-2 h-14 items-center justify-center rounded-full px-8 text-[17px] font-bold disabled:opacity-60"
        style={{ backgroundColor: accent, color: accentText }}
      >
        {status === "sending" ? chrome.sendingLabel : chrome.submitLabel}
      </button>

      {status === "sent" && (
        <p className="text-[16px] font-bold text-ink" role="status">
          {chrome.successMessage}
        </p>
      )}
      {status === "error" && (
        <p className="text-[16px] font-bold text-cranberry" role="alert">
          {chrome.errorMessage}
        </p>
      )}
    </form>
  );
}

/** Pack consecutive half-width fields into two-column rows. */
function groupRows(fields: FormFieldData[]): FormFieldData[][] {
  const rows: FormFieldData[][] = [];
  let pending: FormFieldData | null = null;

  for (const field of fields) {
    if (field.width === "half" && field.kind !== "textarea") {
      if (pending) {
        rows.push([pending, field]);
        pending = null;
      } else {
        pending = field;
      }
    } else {
      if (pending) {
        rows.push([pending]);
        pending = null;
      }
      rows.push([field]);
    }
  }
  if (pending) rows.push([pending]);
  return rows;
}

function Field({ field, accent }: { field: FormFieldData; accent?: string }) {
  const base =
    "w-full rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-[16px] font-medium text-ink outline-none transition-shadow focus:ring-2";
  const focusStyle = { "--tw-ring-color": accent } as CSSProperties;

  if (field.kind === "checkbox") {
    return (
      <label className="flex items-start gap-3 text-[15px] font-medium text-ink/70">
        <input
          type="checkbox"
          name={field.key}
          required={field.required}
          className="mt-1 h-4 w-4"
          style={{ accentColor: accent }}
        />
        {field.label}
      </label>
    );
  }

  return (
    <label className="grid gap-1.5">
      <span className="text-[14px] font-bold text-ink/70">
        {field.label}
        {field.required && <span className="text-cranberry"> *</span>}
      </span>
      {field.kind === "textarea" ? (
        <textarea
          name={field.key}
          required={field.required}
          placeholder={field.placeholder}
          rows={5}
          className={base}
          style={focusStyle}
        />
      ) : field.kind === "select" ? (
        <select name={field.key} required={field.required} defaultValue="" className={base} style={focusStyle}>
          <option value="" disabled>
            {field.placeholder ?? "Select"}
          </option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field.key}
          type={field.kind}
          required={field.required}
          placeholder={field.placeholder}
          className={base}
          style={focusStyle}
        />
      )}
    </label>
  );
}
