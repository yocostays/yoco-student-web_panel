/**
 * Sample leave documents matching the hostel leave collection.
 * `userId` / `categoryId` are populated the way GET-details should return them.
 */

const baseLeave = {
  _id: "6a2ce93dd8d9045df5e1f843",
  ticketId: "000001",
  gatepassNumber: "003",
  userId: {
    _id: "6a2be7101d78b5c3315dac89",
    name: "Mayur Tekale",
  },
  hostelId: "6a0fe18120b6a27f372e6258",
  categoryId: {
    _id: "670377b880b708f279abc9cf",
    name: "Home Visit",
  },
  startDate: "2026-08-22T10:30:00.000Z",
  endDate: "2026-08-24T15:30:00.000Z",
  days: 2,
  hours: 5,
  description: "Visiting family for a wedding. Will return Sunday evening.",
  visitorName: null,
  visitorNumber: null,
  approvedDate: null,
  cancelledDate: null,
  updateLogs: [
    {
      leaveStatus: "pending",
      approvalStatus: "parent",
      date: null,
      remark: null,
      updatedBy: null,
      _id: "6a2ce93dd8d9045df5e1f844",
    },
  ],
  leaveType: "leave",
  status: true,
  createdBy: "6a2be7101d78b5c3315dac89",
  updatedBy: "6a2be7101d78b5c3315dac89",
  createdAt: "2026-08-20T09:05:00.000Z",
  updatedAt: "2026-08-20T09:05:00.000Z",
  __v: 0,
};

export const mockLeavePending = {
  ...baseLeave,
  leaveStatus: "pending",
  approvalStatus: "parent",
};

export const mockLeaveApproved = {
  ...baseLeave,
  leaveStatus: "approved",
  approvalStatus: "warden",
  approvedDate: "2026-08-20T10:08:56.107Z",
  updatedAt: "2026-08-20T10:08:56.107Z",
};

export const mockLeaveRejected = {
  ...baseLeave,
  leaveStatus: "rejected",
  approvalStatus: "parent",
  updatedAt: "2026-08-20T10:08:56.107Z",
};

export const mockLeave = mockLeavePending;
