import { REMARK_MAX_LENGTH } from "./constants";

const DISALLOWED_CHAR = /[^\p{L}\p{N} ]/u;

export function sanitizeRemark(value) {
  return String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .replace(/ {2,}/g, " ")
    .replace(/^ +/, "")
    .slice(0, REMARK_MAX_LENGTH);
}

export function hasDisallowedChars(value) {
  return DISALLOWED_CHAR.test(String(value || ""));
}

export function hasExtraSpaces(value) {
  return / {2,}/.test(String(value || ""));
}

export function getRemarkBlockReason(rawValue) {
  if (hasDisallowedChars(rawValue)) {
    return "Only letters and numbers are allowed.";
  }
  if (hasExtraSpaces(rawValue)) {
    return "Only one space is allowed between words.";
  }
  return "";
}

export function getRemarkError(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "Please enter a remark.";
  }

  const blockReason = getRemarkBlockReason(value);
  if (blockReason) return blockReason;

  if (trimmed.length > REMARK_MAX_LENGTH) {
    return `Remark cannot exceed ${REMARK_MAX_LENGTH} characters.`;
  }

  return "";
}

export function isRemarkValid(value) {
  return getRemarkError(value) === "";
}
