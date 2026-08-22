import { APPROVAL_STATUS, LEAVE_STATUS } from "./constants";
import {
  formatApprover,
  formatDate,
  formatDateTime,
  formatDuration,
  formatTime,
  getFirstName,
  getInitials,
  titleCase,
} from "./format";

function populatedName(value, fallbackKeys = ["name", "fullName"]) {
  if (value && typeof value === "object") {
    for (const key of fallbackKeys) {
      if (value[key]) return value[key];
    }
  }
  return null;
}

export function mapLeaveToView(leave) {
  if (!leave) return null;

  const studentName =
    populatedName(leave.userId) ||
    leave.studentName ||
    leave.name ||
    "Student";
  const categoryName =
    populatedName(leave.categoryId) ||
    leave.categoryName ||
    leave.category ||
    "—";
  const leaveStatus = String(leave.leaveStatus || LEAVE_STATUS.PENDING).toLowerCase();
  const approvalStatus = String(leave.approvalStatus || "").toLowerCase();
  const pendingFrom =
    leaveStatus === LEAVE_STATUS.PENDING ? formatApprover(approvalStatus) : "";

  return {
    id: leave._id,
    studentName,
    firstName: getFirstName(studentName),
    initials: getInitials(studentName),
    categoryName,
    leaveType: titleCase(leave.leaveType),
    duration: formatDuration(leave.days, leave.hours),
    appliedOn: formatDateTime(leave.appliedOn || leave.createdAt),
    description: leave.description?.trim() || "—",
    expectedOut: {
      time: formatTime(leave.startDate),
      date: formatDate(leave.startDate),
    },
    expectedIn: {
      time: formatTime(leave.endDate),
      date: formatDate(leave.endDate),
    },
    leaveStatus,
    approvalStatus,
    pendingFrom,
    statusLabel: pendingFrom
      ? `Pending from ${pendingFrom}`
      : leaveStatus.toUpperCase(),
    canAct:
      leaveStatus === LEAVE_STATUS.PENDING &&
      approvalStatus === APPROVAL_STATUS.PARENT,
  };
}
