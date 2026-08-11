"use client";

import { useState, type InputHTMLAttributes } from "react";

import { Input, cn } from "@/components/ui";

/**
 * Password field with a reveal toggle.
 *
 * The button is `tabIndex={-1}` on purpose: tabbing from the password field
 * should land on the submit button, not on a visibility toggle. It is still
 * reachable by pointer and announced to screen readers via aria-label, and it
 * reports state with aria-pressed.
 */
export function PasswordInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  const [shown, setShown] = useState(false);

  return (
    <div className="relative">
      <Input
        {...rest}
        type={shown ? "text" : "password"}
        className={cn("pr-11", className)}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
      >
        {shown ? (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9.4 5.3A9.5 9.5 0 0 1 12 5c5 0 9 5 9 7a12 12 0 0 1-2.4 3.1M6.2 6.7C3.9 8.2 3 10.6 3 12c0 2 4 7 9 7a9 9 0 0 0 3.3-.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
            <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
  );
}
