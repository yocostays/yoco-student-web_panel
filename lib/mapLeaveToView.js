import { LEAVE_STATUS } from "./constants";
import {
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
    populatedName(leave.userId) || leave.studentName || "Student";
  const categoryName =
    populatedName(leave.categoryId) || leave.categoryName || "—";
  const leaveStatus = String(leave.leaveStatus || LEAVE_STATUS.PENDING).toLowerCase();
  const approvalStatus = String(leave.approvalStatus || "").toLowerCase();

  return {
    id: leave._id,
    studentName,
    firstName: getFirstName(studentName),
    initials: getInitials(studentName),
    categoryName,
    leaveType: titleCase(leave.leaveType),
    duration: formatDuration(leave.days, leave.hours),
    appliedOn: formatDateTime(leave.createdAt),
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
    statusLabel: leaveStatus.toUpperCase(),
    canAct: leaveStatus === LEAVE_STATUS.PENDING,
  };
}
