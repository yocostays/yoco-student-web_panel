/**
 * Parent leave APIs — stubs only (Phase 1).
 *
 * When backend shares endpoints, set NEXT_PUBLIC_API_BASE_URL and
 * replace the mock branches below. The UI already calls these functions.
 *
 * Assumed contract (swap paths/payloads in this file only):
 *   GET  {BASE}/parent/leave?token=
 *   PATCH {BASE}/parent/leave/status  body { token, decision: "approved" | "rejected", remark }
 */

import { mockLeavePending } from "./mockLeave";

export const USE_MOCK = true;

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function unwrapLeave(payload) {
  if (!payload) return null;
  if (payload.data) return payload.data;
  if (payload.leave) return payload.leave;
  return payload;
}

export async function getLeaveDetails(token) {
  if (USE_MOCK || !getBaseUrl()) {
    return { ok: true, data: mockLeavePending, mock: true };
  }

  const url = `${getBaseUrl()}/parent/leave?token=${encodeURIComponent(token)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: payload?.message || "Unable to load this leave request.",
    };
  }

  return { ok: true, data: unwrapLeave(payload) };
}

export async function updateParentStatus(token, decision, remark) {
  if (USE_MOCK || !getBaseUrl()) {
    return { ok: true, data: { leaveStatus: decision, remark }, mock: true };
  }

  const url = `${getBaseUrl()}/parent/leave/status`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, decision, remark }),
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: payload?.message || "Unable to update leave status.",
    };
  }

  return { ok: true, data: unwrapLeave(payload) || payload };
}
