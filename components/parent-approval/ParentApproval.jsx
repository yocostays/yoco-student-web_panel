"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  decideParentApproval,
  ERROR_KIND,
  getParentApprovalDetails,
} from "@/lib/api";
import { PARENT_DECISION, UI_PREVIEW } from "@/lib/constants";
import { mapLeaveToView } from "@/lib/mapLeaveToView";
import { mockLeaveApproved, mockLeavePending } from "@/lib/mockLeave";
import LeaveRequestCard from "./LeaveRequestCard";
import PageShell from "./PageShell";
import PlayStoreCta from "./PlayStoreCta";
import RemarkDialog from "./RemarkDialog";
import ErrorState from "./states/ErrorState";
import LoadingState from "./states/LoadingState";
import ProcessedState from "./states/ProcessedState";
import SuccessState from "./states/SuccessState";

const IS_DEV = process.env.NODE_ENV !== "production";

const INVALID_LINK_MESSAGE =
  "This link is invalid, expired, or the leave request could not be loaded. Ask the hostel to send a new SMS.";

function readQuery() {
  if (typeof window === "undefined") {
    return { token: "", preview: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    token: (params.get("token") || "").trim(),
    preview: IS_DEV ? String(params.get("preview") || "").toLowerCase() : "",
  };
}

function applyDecisionToView(view, decision) {
  const leaveStatus = String(decision || "").toLowerCase();
  return {
    ...view,
    leaveStatus,
    pendingFrom: "",
    statusLabel: leaveStatus.toUpperCase(),
    canAct: false,
  };
}

function ApprovalError({ kind, message, onRetry }) {
  const canRetry = kind === ERROR_KIND.GENERIC;
  return (
    <ErrorState
      message={message || INVALID_LINK_MESSAGE}
      onRetry={canRetry ? onRetry : undefined}
    />
  );
}

function PendingRequest({ view, token, onError }) {
  const [pendingDecision, setPendingDecision] = useState(null);
  const [decision, setDecision] = useState(null);
  const [resultView, setResultView] = useState(view);
  const [showInfo, setShowInfo] = useState(false);
  const [busy, setBusy] = useState(false);
  const submittingRef = useRef(false);

  async function handleConfirm(remark) {
    if (!pendingDecision || busy || submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    try {
      const result = await decideParentApproval({
        token,
        action: pendingDecision,
        remark: remark || "",
      });
      if (result.aborted) return;
      if (!result.ok) {
        submittingRef.current = false;
        setBusy(false);
        onError(
          result.kind || ERROR_KIND.GENERIC,
          result.message || "Unable to update leave status."
        );
        return;
      }
      setResultView(applyDecisionToView(view, pendingDecision));
      setDecision(pendingDecision);
      setPendingDecision(null);
    } catch {
      submittingRef.current = false;
      setBusy(false);
      onError(
        ERROR_KIND.GENERIC,
        "Something went wrong while updating this leave request."
      );
    }
  }

  if (decision && showInfo) {
    return <ProcessedState view={resultView} />;
  }

  if (decision) {
    return (
      <SuccessState
        decision={decision}
        studentName={view?.studentName}
        firstName={view?.firstName}
        onBack={() => setShowInfo(true)}
      />
    );
  }

  return (
    <>
      <PageShell>
        <LeaveRequestCard
          view={view}
          showActions={Boolean(view?.canAct)}
          actionsDisabled={busy}
          onReject={setPendingDecision}
          onApprove={setPendingDecision}
        />
        <PlayStoreCta firstName={view?.firstName} />
      </PageShell>
      <RemarkDialog
        key={pendingDecision || "closed"}
        open={Boolean(pendingDecision)}
        studentName={view?.studentName}
        decision={pendingDecision}
        busy={busy}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!busy) setPendingDecision(null);
        }}
      />
    </>
  );
}

function LeaveLoader({ token }) {
  const [phase, setPhase] = useState("loading");
  const [view, setView] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKind, setErrorKind] = useState(ERROR_KIND.GENERIC);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const trimmed = String(token || "").trim();
    if (!trimmed) {
      setErrorKind(ERROR_KIND.INVALID_LINK);
      setErrorMessage(INVALID_LINK_MESSAGE);
      setView(null);
      setPhase("error");
      return undefined;
    }

    const controller = new AbortController();
    setPhase("loading");

    (async () => {
      const result = await getParentApprovalDetails(trimmed, controller.signal);
      if (controller.signal.aborted || result.aborted) return;

      if (!result.ok || !result.data) {
        setErrorKind(result.kind || ERROR_KIND.GENERIC);
        setErrorMessage(result.message || "Unable to load this leave request.");
        setView(null);
        setPhase("error");
        return;
      }

      setView(mapLeaveToView(result.data));
      setPhase("ready");
    })();

    return () => {
      controller.abort();
    };
  }, [token, retryCount]);

  if (phase === "loading") return <LoadingState />;

  if (phase === "error") {
    return (
      <ApprovalError
        kind={errorKind}
        message={errorMessage}
        onRetry={() => {
          setPhase("loading");
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

  if (!view?.canAct) {
    return <ProcessedState view={view} />;
  }

  return (
    <PendingRequest
      view={view}
      token={token}
      onError={(kind, message) => {
        setErrorKind(kind);
        setErrorMessage(message);
        setPhase("error");
      }}
    />
  );
}

function PreviewMode({ preview, token }) {
  const [previewBackToInfo, setPreviewBackToInfo] = useState(false);
  const previewPending = useMemo(() => mapLeaveToView(mockLeavePending), []);
  const previewProcessed = useMemo(() => mapLeaveToView(mockLeaveApproved), []);

  if (preview === UI_PREVIEW.LOADING) return <LoadingState />;

  if (preview === UI_PREVIEW.ERROR) {
    return <ErrorState message={INVALID_LINK_MESSAGE} />;
  }

  if (preview === UI_PREVIEW.SUCCESS && previewBackToInfo) {
    return <ProcessedState view={previewProcessed} />;
  }

  if (preview === UI_PREVIEW.SUCCESS) {
    return (
      <SuccessState
        decision={PARENT_DECISION.APPROVED}
        studentName={previewProcessed.studentName}
        firstName={previewProcessed.firstName}
        onBack={() => setPreviewBackToInfo(true)}
      />
    );
  }

  if (preview === UI_PREVIEW.PROCESSED) {
    return <ProcessedState view={previewProcessed} />;
  }

  if (preview === UI_PREVIEW.PENDING) {
    return (
      <PendingRequest view={previewPending} token={token} onError={() => {}} />
    );
  }

  return null;
}

export default function ParentApproval() {
  const [query, setQuery] = useState({ token: "", preview: "", ready: false });

  useEffect(() => {
    setQuery({ ...readQuery(), ready: true });
  }, []);

  const { token, preview, ready } = query;

  if (!ready) return <LoadingState />;

  if (IS_DEV && Object.values(UI_PREVIEW).includes(preview)) {
    return <PreviewMode preview={preview} token={token} />;
  }

  return <LeaveLoader key={token} token={token} />;
}
