import DownloadAppButton from "../DownloadAppButton";
import PageShell from "../PageShell";
import PlayStoreCta from "../PlayStoreCta";

export default function ErrorState({
  title = "Unable to open this request",
  message = "This link is invalid, expired, or the leave request could not be loaded. Ask the hostel to send a new SMS.",
  onRetry,
}) {
  return (
    <PageShell>
      <section className="flex min-h-0 w-full max-w-[480px] flex-1 basis-0 flex-col justify-center overflow-y-auto rounded-2xl bg-white px-5 py-4 text-center shadow-[0_8px_24px_var(--yoco-shadow)] lg:h-full lg:flex-none lg:basis-auto lg:py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fde8e8] text-lg font-bold text-[#c0392b]">
          !
        </div>
        <h1 className="mt-4 text-lg font-bold text-[var(--yoco-text)]">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--yoco-text-muted)]">
          {message}
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 min-h-11 rounded-xl bg-[var(--yoco-primary)] px-5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        ) : null}
        <DownloadAppButton className="mt-5 lg:hidden" />
      </section>
      <PlayStoreCta />
    </PageShell>
  );
}
