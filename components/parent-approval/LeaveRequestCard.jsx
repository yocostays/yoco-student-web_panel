"use client";

import ActionBar from "./ActionBar";
import DownloadAppButton from "./DownloadAppButton";
import StatusBadge from "./StatusBadge";

function InfoItem({ label, value, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-[9px] font-medium uppercase tracking-wide text-[#9aa0a6] lg:text-[11px]">
        {label}
      </p>
      <p className="mt-0.5 break-words text-[12px] font-semibold leading-snug text-[#1f2937] lg:mt-1 lg:text-sm">
        {value}
      </p>
    </div>
  );
}

function TimeCard({ label, time, date }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg bg-[#f4f5f7] px-2 py-1.5 lg:rounded-xl lg:px-3 lg:py-2.5">
      <p className="text-[9px] font-medium text-[#9aa0a6] lg:text-[11px]">{label}</p>
      <p className="mt-0.5 text-[11px] font-semibold leading-snug text-[#1f2937] lg:text-sm">
        {time} · {date}
      </p>
    </div>
  );
}

export default function LeaveRequestCard({
  view,
  showActions = false,
  actionsDisabled = false,
  onReject,
  onApprove,
}) {
  if (!view) return null;

  return (
    <div className="relative z-30 flex min-h-0 w-full max-w-[480px] flex-1 basis-0 flex-col lg:h-full lg:flex-none lg:basis-auto">
      <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_8px_24px_var(--yoco-shadow)] lg:rounded-2xl">
        <header className="shrink-0 bg-[var(--yoco-primary)] px-4 py-2 text-center lg:py-3">
          <h1 className="text-xs font-bold uppercase tracking-[0.14em] text-white lg:text-sm">
            Leave Request
          </h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 lg:px-5 lg:py-4">
          <div className="flex items-start gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--yoco-primary)] text-[11px] font-bold text-white lg:h-12 lg:w-12 lg:text-sm"
              aria-hidden="true"
            >
              {view.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-[13px] font-bold leading-tight text-[#111827] lg:text-base">
                  {view.studentName}
                </h2>
                <StatusBadge status={view.leaveStatus} label={view.statusLabel} />
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--yoco-primary)] lg:text-sm">
                {view.categoryName}
              </p>
              <p className="text-[10px] text-[#6b7280] lg:text-xs">
                {view.leaveType}
                <span className="hidden lg:inline"> · {view.duration}</span>
              </p>
            </div>
          </div>

          <section className="mt-2 lg:mt-4">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9aa0a6] lg:text-[11px]">
              Leave Info
            </h3>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5 lg:mt-3 lg:gap-y-3">
              <InfoItem label="Category" value={view.categoryName} />
              <InfoItem label="Leave type" value={view.leaveType} />
              <InfoItem
                className="hidden lg:block"
                label="Duration"
                value={view.duration}
              />
              <InfoItem
                className="hidden lg:block"
                label="Applied on"
                value={view.appliedOn}
              />
            </div>
            <div className="mt-3 hidden lg:block">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#9aa0a6]">
                Description
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#1f2937]">
                {view.description}
              </p>
            </div>
          </section>

          <section className="mt-2 lg:mt-4">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9aa0a6] lg:text-[11px]">
              Leave Times
            </h3>
            <div className="mt-1.5 flex flex-row gap-1.5 lg:mt-3 lg:gap-2">
              <TimeCard
                label="Expected Out"
                time={view.expectedOut.time}
                date={view.expectedOut.date}
              />
              <TimeCard
                label="Expected In"
                time={view.expectedIn.time}
                date={view.expectedIn.date}
              />
            </div>
          </section>

          {showActions ? (
            <div className="mt-auto hidden pt-4 lg:block">
              <ActionBar
                disabled={actionsDisabled}
                onReject={onReject}
                onApprove={onApprove}
              />
            </div>
          ) : null}
        </div>
      </article>

      {showActions ? (
        <div
          className="relative z-20 shrink-0 rounded-b-2xl bg-white px-3 py-2 shadow-[0_8px_24px_var(--yoco-shadow)] lg:hidden"
        >
          <ActionBar
            disabled={actionsDisabled}
            onReject={onReject}
            onApprove={onApprove}
          />
          <DownloadAppButton className="mt-2 min-h-10 text-sm" />
        </div>
      ) : (
        <div className="relative z-[9999] shrink-0 rounded-b-2xl bg-white px-3 py-2 lg:hidden">
          <DownloadAppButton className="min-h-10 text-sm" />
        </div>
      )}
    </div>
  );
}
