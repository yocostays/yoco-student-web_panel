import { TIMEZONE } from "./constants";

export function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getFirstName(name) {
  if (!name || typeof name !== "string") return "the student";
  return name.trim().split(/\s+/).filter(Boolean)[0] || "the student";
}

export function formatDuration(days, hours) {
  const d = Number(days) || 0;
  const h = Number(hours) || 0;
  const dayLabel = d === 1 ? "Day" : "Days";
  const hourLabel = h === 1 ? "Hr" : "Hrs";
  if (d && h) return `${d} ${dayLabel} ${h} ${hourLabel}`;
  if (d) return `${d} ${dayLabel}`;
  if (h) return `${h} ${hourLabel}`;
  return "—";
}

export function titleCase(value) {
  if (!value || typeof value !== "string") return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatClock(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = (parts.find((part) => part.type === "hour")?.value || "0").padStart(
    2,
    "0"
  );
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  const dayPeriod = (
    parts.find((part) => part.type === "dayPeriod")?.value || ""
  ).toUpperCase();

  return `${hour}:${minute} ${dayPeriod}`;
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  const datePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  return `${datePart}, ${formatClock(date)}`;
}

export function formatTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  return formatClock(date);
}

export function formatDate(value) {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
