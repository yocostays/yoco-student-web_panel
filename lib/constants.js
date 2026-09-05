export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const APPROVAL_STATUS = {
  PARENT: "parent",
  WARDEN: "warden",
};

export const PARENT_DECISION = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const UI_PREVIEW = {
  PENDING: "pending",
  LOADING: "loading",
  ERROR: "error",
  PROCESSED: "processed",
  SUCCESS: "success",
  };

  export const TIMEZONE = "Asia/Kolkata";

  export const PLAY_STORE_URL =
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
    "https://play.google.com/store/apps/details?id=com.colladome.yoco";

  export const REMARK_MAX_LENGTH = 100;

  export const APP_LOGO_SRC = "/brand/logo.svg";
  export const APP_PREVIEW_SRC = "/brand/app-preview.png";
