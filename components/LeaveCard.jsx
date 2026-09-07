"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
// import { submitDecision } from "@/lib/api";
import { androidIntentUrl, isAndroidUserAgent, PLAY_STORE_URL } from "@/lib/app-links";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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

function OpenAppCta() {
  const [href, setHref] = useState(PLAY_STORE_URL);
  const [label, setLabel] = useState("Download the Yoco Stays app");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (!isAndroidUserAgent(navigator.userAgent)) return;

    setHref(
      androidIntentUrl({
        host: window.location.host,
        pathname: window.location.pathname,
        search: window.location.search,
      }),
    );
    setLabel("Open in Yoco Stays app");
    setOpenInNewTab(false);
  }, []);

  return (
    <a
      href={href}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="mx-auto flex w-fit animate-pulse items-center gap-2 rounded-full bg-gradient-to-r from-[var(--yoco-primary)] to-[#8b5cf6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-300/50 transition-transform hover:scale-105 active:scale-95"
    >
      {label}
    </a>
  );
}

function Card({ title, children }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg lg:h-full lg:min-h-0">
      {title && (
        <header className="shrink-0 bg-[var(--yoco-primary)] py-3 text-center text-sm font-semibold text-white">
          {title}
        </header>
      )}
      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-7">{children}</div>
    </article>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#9aa0a6]">
      {children}
    </h3>
  );
}

function Field({ label, value, full, capitalize }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[12px] uppercase tracking-wide text-[#4b5563]">
        {label}
      </p>
      <p
        className={`text-[14px] font-semibold text-[#1f2937] break-words ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="flex-1 rounded-lg bg-[#f4f5f7] px-3 py-2.5 lg:px-4 lg:py-3">
      <p className="text-[13px] text-[#4b5563] lg:text-[13.5px]">{label}</p>
      <p className="text-[12.5px] font-semibold text-[#1f2937] lg:text-[14px]">
        {value}
      </p>
    </div>
  );
}

function PromoPanel({ blur = true }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[var(--yoco-primary)] to-[#a78bda] p-8 text-center">
      {blur && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-left blur-sm"
          aria-hidden="true"
        >
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

function ExpiredLeaveBody({ message }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-4 flex w-full items-start justify-end">
        <span className="rounded-lg bg-red-50 px-3 py-1.5 text-[12px] font-semibold capitalize text-red-500 shadow-sm">
          Expired
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3eefb]">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-[var(--yoco-primary)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {message || "Link invalid or expired"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            This leave approval link is no longer valid. Ask the hostel to send
            a new link, or open the Yoco Stays app to check your child&apos;s
            leave, mess, and hostel status.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 text-left">
          <div className="rounded-lg bg-[#f4f5f7] px-3 py-3">
            <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">
              What happened
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1f2937]">
              Link expired or already used
            </p>
          </div>
          <div className="rounded-lg bg-[#f4f5f7] px-3 py-3">
            <p className="text-[12px] uppercase tracking-wide text-[#6b7280]">
              Next step
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1f2937]">
              Use the app or a new link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeaveCard({ token, data, submitApproval, errorMessage }) {
  const studentSchema = yup.object({
    remark: yup
      .string()
      .transform((value) =>
        String(value || "")
          .replace(/[^A-Za-z0-9\s]/g, "")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .required("Remark is required.")
      .max(100, "Remark cannot exceed 100 characters.")
      .matches(
        /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
        "Remark can only contain letters, numbers, and single spaces.",
      ),
  });

  const defaultValues = {
    remark: "",
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(studentSchema),
  });
  const [status, setStatus] = useState(true);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  const isUnavailable = Boolean(errorMessage) || !data;
  const initials = data?.studentName?.slice(0, 2).toUpperCase() || "?";
  const canAct =
    !isUnavailable &&
    data?.leaveStatus === "pending" &&
    data.approvalStatus === "parent";
  const duration =
    `${data?.days ? `${data.days} Days ` : ""}${data?.hours ? `${data.hours} Hrs` : ""}`.trim() ||
    "—";
  const statusLabel = isUnavailable
    ? "expired"
    : getStatusLabel(data?.leaveStatus, data.approvalStatus);
  const statusClass = isUnavailable
    ? "bg-red-50 text-red-500"
    : getStatusColor(data?.leaveStatus, data.approvalStatus);
  const appliedOn = data?.appliedOn
    ? dayjs(data.appliedOn).format("DD MMM YYYY, hh:mm A")
    : "—";
  const expectedOut = data?.startDate
    ? dayjs(data.startDate).format("hh:mm A · DD MMM YYYY")
    : "—";
  const expectedIn = data?.endDate
    ? dayjs(data.endDate).format("hh:mm A · DD MMM YYYY")
    : "—";



  const onSubmit = async (value) => {
    const payload = {
      action: pending,
      remark: value?.remark,
    };
    setBusy(true);
    try {
      const res = await submitApproval(payload);
      if (res?.ok) {
        toast.success(
          pending === "approved"
            ? "Leave approved successfully."
            : "Leave rejected successfully.",
        );
        handleClose();
      } else {
        toast.error(res?.message || "Unable to update leave status.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleClose=()=>{
    setPending(null);
    reset({...defaultValues})
  }

  return (
    <div className="mx-auto grid w-full max-w-250 grid-cols-1 gap-4 p-4 lg:h-full lg:min-h-0 lg:grid-cols-2">
      <Card title="Leave Request">
        {isUnavailable ? (
          <ExpiredLeaveBody message={errorMessage} />
        ) : (
          <>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--yoco-primary)] text-sm font-medium text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-[15px] font-semibold leading-6 text-[#111827]">
                {data?.studentName}
              </h2>
              <p className="mt-0.5 break-words text-sm font-semibold leading-6 text-green-500">
                {data?.category?.toUpperCase()}
              </p>
              <p className="mt-0.5 text-xs font-semibold capitalize leading-5 text-[#6b7280]">
                {data?.leaveType} - {duration}
              </p>
            </div>
          </div>
          <span
            className={`mt-0.5 shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize leading-none shadow-sm ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-3  text-sm">
          <Field label="Description" value={data?.description || "—"} />
          <Field label="Applied On" value={appliedOn} />
        </dl>

        <div className="flex gap-3">
          <TimeBox label="Expected Out" value={expectedOut} />
          <TimeBox label="Expected In" value={expectedIn} />
        </div>

        {canAct && (
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => setPending("rejected")}
              className="flex-1 rounded-lg border border-red-200 py-3 text-sm font-semibold text-red-600"
            >
              Reject
            </button>
            <button
              onClick={() => setPending("approved")}
              className="flex-1 rounded-lg bg-[var(--yoco-primary)] py-3 text-sm font-semibold text-white"
            >
              Approve
            </button>
          </div>
        )}
          </>
        )}
      </Card>

      <Card>
        <OpenAppCta />
        <PromoPanel />

        <div className="text-center">
          <p className="text-base font-bold text-[#1f2937]">
            Want to check {data?.studentName ? `${data.studentName}'s` : "your child's"}{" "}
            Leave, Mess, and hostel status?
          </p>
          <p className="mt-2 text-sm text-[#6b7280]">
            Download the Yoco Stays app to stay connected with your child&apos;s
            hostel life — track leave requests, mess attendance, and daily
            in/out status, all in one place.
          </p>
        </div>
      </Card>

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-base font-semibold text-[#1f2937]">
              {pending === "approved" ? "Approve" : "Reject"} leave for{" "}
              {data.studentName}?
            </p>
            <label className="mt-4 block text-sm font-semibold text-[#1f2937]">
              Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              value={watch("remark")}
              onChange={(e) => {
                const value = String(e?.target?.value || "")
                  .replace(/^\s+/, "")
                  .replace(/[^A-Za-z0-9\s]/g, "")
                  .replace(/\s{2,}/g, " ")
                  .slice(0, 100);
                setValue("remark", value, { shouldValidate: true });
              }}
              placeholder="Add a remark"
              className="mt-2 w-full resize-none overflow-y-auto rounded-lg border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:border-[var(--yoco-primary)] focus:outline-none"
              rows={4}
            />
            {errors && (
              <p className="mt-2 text-xs text-red-600">
                {errors?.remark?.message}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                // onClick={() => setPending(null)}
                // onClick={()=> reset({...defaultValues})}.
                onClick={()=>{
                  handleClose()
                }}
                disabled={busy}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-[#1f2937]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
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

