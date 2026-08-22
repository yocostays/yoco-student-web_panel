import { LEAVE_STATUS } from "@/lib/constants";

const BADGE_STYLES = {
  [LEAVE_STATUS.PENDING]:
    "bg-[#fff4d6] text-[#c47d00]",
  [LEAVE_STATUS.APPROVED]:
    "bg-[#e6f7ee] text-[#1b7a45]",
  [LEAVE_STATUS.REJECTED]:
    "bg-[#fde8e8] text-[#c0392b]",
  [LEAVE_STATUS.CANCELLED]:
    "bg-[#f3f4f6] text-[#6b7280]",
};

export default function StatusBadge({ status, label }) {
  const key = String(status || LEAVE_STATUS.PENDING).toLowerCase();
  const className = BADGE_STYLES[key] || BADGE_STYLES[LEAVE_STATUS.PENDING];

  return (
    <span
      className={`inline-flex max-w-[9.5rem] shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-center text-[10px] font-semibold leading-tight tracking-wide lg:max-w-none lg:px-2.5 lg:py-1 lg:text-[11px] ${className}`}
    >
      {label || key}
    </span>
  );
}
