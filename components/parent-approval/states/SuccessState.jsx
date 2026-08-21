import { PARENT_DECISION } from "@/lib/constants";
import DownloadAppButton from "../DownloadAppButton";
import PageShell from "../PageShell";
import PlayStoreCta from "../PlayStoreCta";

export default function SuccessState({
  decision,
  studentName,
  firstName,
  onBack,
}) {
  const approved = decision === PARENT_DECISION.APPROVED;

  return (
    <PageShell>
      <section className="flex min-h-0 w-full max-w-[480px] flex-1 basis-0 flex-col justify-center overflow-y-auto rounded-2xl bg-white px-5 py-4 text-center shadow-[0_8px_24px_var(--yoco-shadow)] lg:h-full lg:flex-none lg:basis-auto lg:py-8">
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
            approved
              ? "bg-[#e6f7ee] text-[#1b7a45]"
              : "bg-[#fde8e8] text-[#c0392b]"
          }`}
        >
          {approved ? "✓" : "✕"}
        </div>
        <h1 className="mt-4 text-lg font-bold text-[var(--yoco-text)]">
          {approved ? "Leave approved" : "Leave rejected"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--yoco-text-muted)]">
          {studentName
            ? `${studentName}'s leave request has been ${approved ? "approved" : "rejected"}.`
            : `The leave request has been ${approved ? "approved" : "rejected"}.`}
        </p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mt-6 flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--yoco-primary)] bg-white px-4 text-sm font-semibold text-[var(--yoco-primary)]"
          >
            Back
          </button>
        ) : null}
        <DownloadAppButton className="mt-3 lg:hidden" />
      </section>
      <PlayStoreCta firstName={firstName} />
    </PageShell>
  );
}
