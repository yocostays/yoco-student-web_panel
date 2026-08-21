"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { PARENT_DECISION, REMARK_MAX_LENGTH } from "@/lib/constants";
import {
  getRemarkBlockReason,
  getRemarkError,
  isRemarkValid,
  sanitizeRemark,
} from "@/lib/remark";

export default function RemarkDialog({
  open,
  studentName,
  decision,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const textareaId = useId();
  const errorId = useId();
  const counterId = useId();
  const [remark, setRemark] = useState("");
  const [touched, setTouched] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setReady(false);
      return undefined;
    }

    setReady(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setReady(true), 350);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, decision]);

  if (!open || !mounted) return null;

  const isReject = decision === PARENT_DECISION.REJECTED;
  const prompt = isReject
    ? "Reject this leave request?"
    : "Approve this leave request?";
  const confirmLabel = isReject ? "Reject" : "Approve";
  const valid = isRemarkValid(remark);
  const error =
    touched || blockReason
      ? blockReason || getRemarkError(remark)
      : "";

  function applyValue(next) {
    setRemark(sanitizeRemark(next));
    setBlockReason(getRemarkBlockReason(next));
  }

  function handleChange(event) {
    applyValue(event.target.value);
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");
    applyValue(`${remark}${pasted}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    const clean = sanitizeRemark(remark).trim();
    if (!isRemarkValid(clean) || busy) return;
    onConfirm?.(clean);
  }

  function handleCancel() {
    if (!ready || busy) return;
    onCancel?.();
  }

  const confirmClass =
    valid && !busy
      ? isReject
        ? "bg-[#c0392b] text-white hover:bg-[#a93226]"
        : "bg-[var(--yoco-primary)] text-white hover:bg-[var(--yoco-primary-dark)]"
      : "cursor-not-allowed bg-[#d1d5db] text-white";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remark-title"
      className={ready ? "" : "pointer-events-none"}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 2147483000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "16px",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      <button
        type="button"
        aria-label="Close"
        disabled={busy || !ready}
        onClick={handleCancel}
        className="absolute inset-0 border-0 bg-black/45 p-0"
      />
      <form
        onSubmit={handleSubmit}
        onKeyDown={(event) => {
          if (event.key === "Escape") handleCancel();
        }}
        className="relative z-10 mb-[env(safe-area-inset-bottom)] w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:mb-0 sm:self-center"
      >
        <h2
          id="remark-title"
          className="text-xl font-bold text-[var(--yoco-text)]"
        >
          Remark
        </h2>
        <p className="mt-1 text-base font-bold text-[#1f2937]">
          {studentName || "Student"}
        </p>
        <p className="mt-0.5 text-sm text-[#6b7280]">{prompt}</p>

        <label htmlFor={textareaId} className="sr-only">
          Enter your remark
        </label>
        <textarea
          id={textareaId}
          rows={4}
          value={remark}
          maxLength={REMARK_MAX_LENGTH}
          disabled={busy}
          placeholder="Enter your remark"
          autoComplete="off"
          spellCheck="true"
          aria-invalid={Boolean(error)}
          aria-describedby={`${counterId}${error ? ` ${errorId}` : ""}`}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={() => setTouched(true)}
          className={`mt-4 w-full resize-none rounded-xl border bg-white px-3 py-3 text-base text-[#1f2937] outline-none placeholder:text-[#9aa0a6] disabled:opacity-60 ${
            error
              ? "border-[#e74c3c] focus:border-[#e74c3c] focus:ring-2 focus:ring-[#e74c3c]/20"
              : "border-[#d1d5db] focus:border-[var(--yoco-primary)] focus:ring-2 focus:ring-[var(--yoco-primary)]/20"
          }`}
        />

        <div className="mt-1.5 flex items-start justify-between gap-3">
          <p
            id={errorId}
            className="min-h-5 text-xs text-[#c0392b]"
            role={error ? "alert" : undefined}
          >
            {error || "\u00a0"}
          </p>
          <p
            id={counterId}
            className={`shrink-0 text-xs ${
              remark.length >= REMARK_MAX_LENGTH
                ? "font-semibold text-[#c0392b]"
                : "text-[#9aa0a6]"
            }`}
          >
            {remark.length}/{REMARK_MAX_LENGTH}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={busy || !ready}
            onClick={handleCancel}
            className="min-h-11 flex-1 rounded-xl border border-[var(--yoco-primary)] bg-white px-4 text-sm font-semibold text-[var(--yoco-primary)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || busy || !ready}
            className={`min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold ${confirmClass}`}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
