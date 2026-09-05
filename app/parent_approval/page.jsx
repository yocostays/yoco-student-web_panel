// app/parent_approval/page.jsx
export const dynamic = "force-dynamic";

import { getLeaveDetailsSSR } from "@/lib/api";
import LeaveCard from "@/components/LeaveCard";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const token = String(params?.token || "").trim();

  const result = await getLeaveDetailsSSR(token);

  if (!result.ok) {
    return <p className="p-6 text-center text-sm font-semibold text-[#1f2937]">{result.message}</p>;
  }

  return <LeaveCard token={token} data={result.data} />;
}