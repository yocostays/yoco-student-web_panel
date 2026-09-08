/**
 * Parent approval APIs. Token-in-body only — no JWT / Authorization header.
 */


function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

export async function getLeaveDetailsSSR(token) {
  if (!token) return { ok: false, message: "Missing token." };
  try {
    const res = await fetch(`${getBaseUrl()}/api/leave-management/parent/approval/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, message: body?.message || "Unable to load this leave request." };
    return { ok: true, data: body?.data };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function submitDecision({ token, action, remark }) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/leave-management/parent/approval/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action, remark }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, message: body?.message || "Unable to update leave status." };
    return { ok: true };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}