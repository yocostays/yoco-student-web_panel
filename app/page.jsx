import { getLeaveDetailsSSR } from "@/lib/api";

export default function Home() {
  return (
    <p className="p-6 text-center text-sm font-semibold text-[#1f2937]">
      Please use the link sent to you to view this leave request.
    </p>
  );
}