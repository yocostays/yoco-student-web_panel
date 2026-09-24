import { APP_LOGO_SRC } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--yoco-border)] bg-white shadow-sm lg:static lg:shrink-0">
      <div className="flex h-14 w-full items-center justify-start px-3 lg:h-16">
        <img
          src={APP_LOGO_SRC}
          alt="Yoco Stays"
          className="h-9 w-auto lg:h-10"
        />
      </div>
    </header>
  );
}
