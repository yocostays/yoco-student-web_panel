import PageShell from "../PageShell";

function SkeletonBlock({ className }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#eceff3] ${className}`} />
  );
}

export default function LoadingState() {
  return (
    <PageShell>
      <article className="flex min-h-0 w-full max-w-[480px] flex-1 basis-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_var(--yoco-shadow)] lg:h-full lg:flex-none lg:basis-auto">
        <div className="h-12 bg-[var(--yoco-primary)]" />
        <div className="px-4 py-5 sm:px-5">
          <div className="flex gap-3">
            <SkeletonBlock className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-32" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
          </div>
          <SkeletonBlock className="mt-4 h-12 w-full" />
          <div className="mt-5 flex gap-2">
            <SkeletonBlock className="h-16 flex-1" />
            <SkeletonBlock className="h-16 flex-1" />
          </div>
          <div className="mt-5 flex gap-3">
            <SkeletonBlock className="h-11 flex-1" />
            <SkeletonBlock className="h-11 flex-1" />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
