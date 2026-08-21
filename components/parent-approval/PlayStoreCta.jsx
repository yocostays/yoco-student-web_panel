import { APP_LOGO_SRC, APP_PREVIEW_SRC } from "@/lib/constants";
import DownloadAppButton from "./DownloadAppButton";

export default function PlayStoreCta({ firstName }) {
  const name = firstName || "your child";

  return (
    <section className="relative z-0 flex min-h-0 w-full max-w-[480px] flex-1 basis-0 flex-col lg:h-full lg:flex-none lg:basis-auto">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border-[4px] border-[#2a1f40] bg-[#2a1f40] shadow-[0_12px_32px_rgba(42,31,64,0.22)] lg:rounded-[1.75rem] lg:border-[5px]">
        <div className="relative isolate min-h-0 flex-1 overflow-hidden rounded-[0.9rem] bg-[#f3eef8] lg:rounded-[1.25rem]">
          <img
            src={APP_PREVIEW_SRC}
            alt=""
            width={559}
            height={836}
            decoding="async"
            className="pointer-events-none block h-full w-full scale-105 object-cover object-top blur-[3px] lg:blur-[5px]"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 via-white/35 to-white/50 lg:from-white/70"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 top-0 z-10 hidden px-4 pt-4 lg:block">
            <DownloadAppButton />
          </div>

          <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center px-3 text-center lg:px-4">
            <img
              src={APP_LOGO_SRC}
              alt="YOCO"
              width={123}
              height={83}
              className="mx-auto h-7 w-auto lg:h-10"
            />
            <p className="mt-1 text-xs font-bold leading-snug text-[var(--yoco-text)] lg:mt-2 lg:text-sm">
              Want to check {name}&apos;s Leave, Mess, and hostel status?
            </p>
            <p className="mt-1 max-w-[20rem] text-[10px] font-bold leading-snug text-[var(--yoco-text-muted)] lg:text-xs lg:leading-relaxed">
              Download the Yoco Stays app to stay connected with your child&apos;s
              hostel life — track leave requests, mess attendance, and daily
              in/out status, all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
