"use client";

import { PARENT_DECISION } from "@/lib/constants";

export default function ActionBar({ disabled, onReject, onApprove }) {
  const shared =
    "relative z-10 flex min-h-11 flex-1 items-center justify-center rounded-xl px-3 text-center text-sm font-semibold";

  return (
    <div className="relative z-10 flex flex-row gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onReject?.(PARENT_DECISION.REJECTED)}
        className={`${shared} border-2 border-[#e74c3c] bg-white text-[#e74c3c] disabled:opacity-50`}
      >
        Reject
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onApprove?.(PARENT_DECISION.APPROVED)}
        className={`${shared} bg-[var(--yoco-primary)] text-white disabled:opacity-50`}
      >
        Approve
      </button>
    </div>
  );
}
