/**
 * Parent approval APIs. Token-in-body only — no JWT / Authorization header.
 */

import { PARENT_DECISION } from "./constants";

export const ERROR_KIND = {
  INVALID_LINK: "invalid_link",
  ALREADY_DECIDED: "already_decided",
  GENERIC: "generic",
};

const GENERIC_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR = "Could not reach the server. Please try again.";
const REQUEST_TIMEOUT_MS = 20000;
const ALLOWED_ACTIONS = new Set([
  PARENT_DECISION.APPROVED,
  PARENT_DECISION.REJECTED,
]);

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://yocoapi.evdtechnology.com"
  ).replace(/\/$/, "");
}

function apiUrl(path) {
  const origin = getBaseUrl().replace(/\/api$/i, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${origin}/api${suffix}`;
}

function mergeSignals(signal) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, timeout]);
  }
  return signal;
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function readMessage(payload) {
  const message = payload?.message;
  if (Array.isArray(message)) {
    return message.filter(Boolean).join(" ").trim();
  }
  if (message && typeof message === "object") {
    return String(message.message || "").trim();
  }
  return String(message || "").trim();
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function classifyApprovalError(message, statusCode) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  const code = Number(statusCode) || 0;

  if (code >= 500 || code === 0) {
    return { kind: ERROR_KIND.GENERIC, message: GENERIC_ERROR };
  }

  if (lower.includes("not awaiting your approval")) {
    return { kind: ERROR_KIND.ALREADY_DECIDED, message: text };
  }

  if (
    code === 400 ||
    lower.includes("invalid") ||
    lower.includes("expired") ||
    lower.includes("token is required") ||
    lower.includes("token must")
  ) {
    return {
      kind: ERROR_KIND.INVALID_LINK,
      message: text || "This link is invalid or expired.",
    };
  }

  return { kind: ERROR_KIND.GENERIC, message: text || GENERIC_ERROR };
}

function abortedResult() {
  return {
    ok: false,
    aborted: true,
    status: 0,
    kind: ERROR_KIND.GENERIC,
    message: "",
  };
}

async function postJson(path, body, signal) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    credentials: "omit",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: mergeSignals(signal),
  });

  const payload = await parseJson(response);
  const statusCode = Number(payload?.statusCode) || response.status;
  const message = readMessage(payload);

  if (!response.ok || statusCode !== 200) {
    const classified = classifyApprovalError(message, statusCode);
    return { ok: false, aborted: false, status: statusCode, ...classified };
  }

  return {
    ok: true,
    aborted: false,
    status: statusCode,
    message: message || "",
    data: payload?.data ?? null,
  };
}

export async function getParentApprovalDetails(token, signal) {
  const value = String(token || "").trim();
  if (!value) {
    return {
      ok: false,
      aborted: false,
      status: 400,
      kind: ERROR_KIND.INVALID_LINK,
      message: "This link is invalid or expired.",
    };
  }

  try {
    return await postJson(
      "/leave-management/parent/approval/details",
      { token: value },
      signal
    );
  } catch (error) {
    if (isAbortError(error)) return abortedResult();
    return {
      ok: false,
      aborted: false,
      status: 0,
      kind: ERROR_KIND.GENERIC,
      message: NETWORK_ERROR,
    };
  }
}

export async function decideParentApproval({ token, action, remark = "" }, signal) {
  const value = String(token || "").trim();
  const nextAction = String(action || "").toLowerCase();

  if (!value) {
    return {
      ok: false,
      aborted: false,
      status: 400,
      kind: ERROR_KIND.INVALID_LINK,
      message: "This link is invalid or expired.",
    };
  }

  if (!ALLOWED_ACTIONS.has(nextAction)) {
    return {
      ok: false,
      aborted: false,
      status: 400,
      kind: ERROR_KIND.GENERIC,
      message: GENERIC_ERROR,
    };
  }

  try {
    return await postJson(
      "/leave-management/parent/approval/decide",
      {
        token: value,
        action: nextAction,
        remark: remark ?? "",
      },
      signal
    );
  } catch (error) {
    if (isAbortError(error)) return abortedResult();
    return {
      ok: false,
      aborted: false,
      status: 0,
      kind: ERROR_KIND.GENERIC,
      message: NETWORK_ERROR,
    };
  }
}
