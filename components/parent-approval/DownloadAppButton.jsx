import { PLAY_STORE_URL } from "@/lib/constants";

export default function DownloadAppButton({ className = "" }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      className={`cta-blink flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--yoco-primary)] px-4 text-center text-sm font-bold text-white [touch-action:manipulation] ${className}`}
    >
      Download the Yoco Stays app
    </a>
  );
}
