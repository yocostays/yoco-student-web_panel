// app/parent_approval/page.jsx

import axios from "axios";
import LeaveCard from "@/components/LeaveCard";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  return "https://yocoapi.evdtechnology.com".replace(/\/$/, "");
}

async function getLeaveDetails(token) {
  const payload = { token };
  try {
    const res = await axios.post(
      `${getBaseUrl()}/api/leave-management/parent/approval/details`,
      payload,
    );
    return { ok: true, data: res?.data?.data };
  } catch (error) {
    return {
      ok: false,
      message:
        error?.response?.data?.message || "Unable to fetch leave details.",
    };
  }
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const token = String(params?.token || "").trim();

  // Server Action — defined inside Page so it closes over `token`
  async function submitApproval(data) {
    "use server";
    try {
      const payload = { token, action: data?.action, remark : data?.remark };
      const res = await axios.post(
        `${getBaseUrl()}/api/leave-management/parent/approval/decide`,
        payload,
      );
      // revalidate so the page re-runs getLeaveDetails with fresh data
      revalidatePath(`/parent_approval`);

      return { ok: true, data: res.data };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message || "Unable to update leave status.",
      };
    }
  }

  const result = await getLeaveDetails(token);

  return (
    <LeaveCard
      token={token}
      data={result.ok ? result.data : null}
      errorMessage={result.ok ? "" : result.message}
      submitApproval={submitApproval}
    />
  );
}
