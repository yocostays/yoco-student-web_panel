export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-blue-600">
          Next.js + Tailwind
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
          Student Panel
        </h1>
        <p className="text-base leading-7 text-foreground/70">
          JavaScript setup is ready. Edit{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10">
            app/page.jsx
          </code>{" "}
          and save to see changes.
        </p>
      </section>
    </main>
  );
}
