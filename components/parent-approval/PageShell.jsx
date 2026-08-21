export default function PageShell({ children }) {
  return (
    <main
      className="box-border h-dvh overflow-hidden bg-[var(--yoco-page-bg)] px-3 py-2 sm:px-4 lg:px-6 lg:py-4"
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
        paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[480px] flex-col justify-center gap-2.5 lg:max-w-none lg:flex-row lg:items-stretch lg:justify-center lg:gap-6">
        {children}
      </div>
    </main>
  );
}
