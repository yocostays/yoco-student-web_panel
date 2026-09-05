"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { submitDecision } from "@/lib/api";



const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=com.colladome.yoco";

function getStatusLabel(leaveStatus, approvalStatus) {
  const status = String(leaveStatus || "").toLowerCase();
  const approval = String(approvalStatus || "").toLowerCase();

  if (status === "pending") {
    return "pending";
  }
  if (status === "approved") {
    return approval === "parent" ? "pending from warden" : "approved";
  }
  if (status === "rejected") {
    return approval === "warden" ? "rejected by warden" : "rejected";
  }
  if (status.startsWith("cancel")) return "cancelled";

  return status || "—";
}

function getStatusColor(leaveStatus, approvalStatus) {
  const status = String(leaveStatus || "").toLowerCase();
  const approval = String(approvalStatus || "").toLowerCase();

  if (status === "approved" && approval !== "parent") return "bg-emerald-50 text-emerald-700";
  if (status === "rejected") return "bg-red-50 text-red-500";
  if (status.startsWith("cancel")) return "bg-gray-100 text-gray-600";
  return "bg-amber-50 text-amber-700"; // pending / pending-from-warden (default)
}

export default function LeaveCard({ token, data }) {
  const [status, setStatus] = useState(data.leaveStatus);
  const [pending, setPending] = useState(null);
  const [remark, setRemark] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const initials = data.studentName?.slice(0, 2).toUpperCase() || "?";
  const canAct = status === "pending" && data.approvalStatus === "parent";
  const duration = `${data.days ? `${data.days} Days ` : ""}${data.hours ? `${data.hours} Hrs` : ""}`.trim() || "—";
  const statusLabel = getStatusLabel(status, data.approvalStatus);

  async function confirm() {
    setBusy(true);
    setError("");
    const res = await submitDecision({ token, action: pending, remark });
    setBusy(false);
    if (!res.ok) return setError(res.message);
    setStatus(pending);
    setPending(null);
  }

  return (
    <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 p-4 lg:grid-cols-2">
      <Card title="Leave Request">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--yoco-primary)] text-sm font-medium text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-[14.5px] font-semibold text-[#111827]">{data.studentName}</h2>
              <p className="text-sm font-medium text-[var(--yoco-primary)]">{data.category}</p>
              <p className="text-xs font-semibold capitalize text-[#6b7280]">{data.leaveType} · {duration}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize shadow-sm ${getStatusColor(status, data.approvalStatus)}`}>
            {statusLabel}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Description" value={data.description || "—"} />
            <Field label="Applied On" value={dayjs(data.appliedOn).format("DD MMM YYYY, hh:mm A")} />
        </dl>

        <div className="flex gap-3">
          <TimeBox label="Expected Out" value={dayjs(data.startDate).format("hh:mm A · DD MMM YYYY")} />
          <TimeBox label="Expected In" value={dayjs(data.endDate).format("hh:mm A · DD MMM YYYY")} />
        </div>

        {canAct && (
          <div className="mt-2 flex gap-3">
            <button onClick={() => setPending("rejected")} className="flex-1 rounded-lg border border-red-200 py-3 text-sm font-semibold text-red-600">
              Reject
            </button>
            <button onClick={() => setPending("approved")} className="flex-1 rounded-lg bg-[var(--yoco-primary)] py-3 text-sm font-semibold text-white">
              Approve
            </button>
          </div>
        )}
      </Card>

      <Card>
        <a
            href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex w-fit animate-pulse items-center gap-2 rounded-full bg-gradient-to-r from-[var(--yoco-primary)] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-300/50 transition-transform hover:scale-105 active:scale-95"
        >
            Download the Yoco Stays app
        </a>
        <PromoPanel />

        <div className="text-center">
            <p className="text-base font-bold text-[#1f2937]">
            Want to check {data.studentName}&apos;s Leave, Mess, and hostel status?
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">
            Download the Yoco Stays app to stay connected with your child&apos;s hostel life — track leave requests, mess attendance, and daily in/out status, all in one place.
            </p>
        </div>

        
        </Card>

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-base font-semibold text-[#1f2937]">
                {pending === "approved" ? "Approve" : "Reject"} leave for {data.studentName}?
            </p>
            <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add a remark (optional)"
                className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:border-[var(--yoco-primary)] focus:outline-none"
                rows={4}
            />
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <div className="mt-5 flex gap-3">
                <button
                onClick={() => setPending(null)}
                disabled={busy}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-[#1f2937]"
                >
                Cancel
                </button>
                <button
                onClick={confirm}
                disabled={busy}
                className="flex-1 rounded-lg bg-[var(--yoco-primary)] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                {busy ? "Submitting…" : "Confirm"}
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg lg:h-[540px]">
      {title && (
        <header className="bg-[var(--yoco-primary)] py-3 text-center text-sm font-semibold text-white">
          {title}
        </header>
      )}
      <div className="flex flex-col gap-4 p-5 lg:p-7">{children}</div>
    </article>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#9aa0a6]">{children}</h3>;
}

function Field({ label, value, full, capitalize }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[12px] uppercase tracking-wide text-[#4b5563]">{label}</p>
      <p className={`text-[14px] font-semibold text-[#1f2937] ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="flex-1 rounded-lg bg-[#f4f5f7] px-2 py-1 lg:px-4 lg:py-2">
      <p className="text-[13px] text-[#4b5563] lg:text-[13.5px]">{label}</p>
      <p className="text-[12.5px] font-semibold text-[#1f2937] lg:text-[14px]">{value}</p>
    </div>
  );
}

function PromoPanel({ blur = true }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[var(--yoco-primary)] to-[#a78bda] p-8 text-center">
      {blur && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-left blur-sm" aria-hidden="true">
          <div className="h-3 w-3/4 rounded bg-white/50" />
          <div className="h-3 w-2/3 rounded bg-white/50" />
          <div className="h-3 w-1/2 rounded bg-white/50" />
        </div>
      )}
      <img
        src="/brand/logo.svg"
        alt="Yoco Stays"
        className="relative mx-auto h-10 w-auto"
        />
    </div>
  );
}