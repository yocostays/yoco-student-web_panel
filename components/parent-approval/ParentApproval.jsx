"use client";

import { useEffect, useMemo, useState } from "react";
import { getLeaveDetails, updateParentStatus, USE_MOCK } from "@/lib/api";
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

function readQuery() {
  if (typeof window === "undefined") {
    return { token: "", preview: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    token: params.get("token") || "",
    preview: String(params.get("preview") || "").toLowerCase(),
  };
}

function applyDecisionToView(view, decision) {
  const leaveStatus = String(decision || "").toLowerCase();
  return {
    ...view,
    leaveStatus,
    statusLabel: leaveStatus.toUpperCase(),
    canAct: false,
  };
}

function PendingRequest({
  view,
  token,
  onError,
}) {
  const [pendingDecision, setPendingDecision] = useState(null);
  const [decision, setDecision] = useState(null);
  const [resultView, setResultView] = useState(view);
  const [showInfo, setShowInfo] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm(remark) {
    if (!pendingDecision || busy) return;
    setBusy(true);
    try {
      const result = await updateParentStatus(token, pendingDecision, remark);
      if (!result.ok) {
        onError(result.message || "Unable to update leave status.");
        return;
      }
      setResultView(applyDecisionToView(view, pendingDecision));
      setDecision(pendingDecision);
      setPendingDecision(null);
    } catch {
      onError("Something went wrong while updating this leave request.");
    } finally {
      setBusy(false);
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
  const mockView = useMemo(() => mapLeaveToView(mockLeavePending), []);
  const [view, setView] = useState(USE_MOCK ? mockView : null);
  const [errorMessage, setErrorMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(USE_MOCK);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (USE_MOCK) return undefined;

    let cancelled = false;
    setLoaded(false);

    (async () => {
      try {
        const result = await getLeaveDetails(token);
        if (cancelled) return;

        if (!result.ok || !result.data) {
          setErrorMessage(result.message || "Unable to load this leave request.");
          setFailed(true);
          setLoaded(true);
          return;
        }

        setView(mapLeaveToView(result.data));
        setFailed(false);
        setLoaded(true);
      } catch {
        if (cancelled) return;
        setErrorMessage("Something went wrong while loading this leave request.");
        setFailed(true);
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, retryCount]);

  if (!loaded) return <LoadingState />;

  if (failed) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => {
          setLoaded(false);
          setFailed(false);
          setErrorMessage("");
          setView(null);
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
      onError={(message) => {
        setErrorMessage(message);
        setFailed(true);
      }}
    />
  );
}

export default function ParentApproval() {
  const [query, setQuery] = useState({ token: "", preview: "" });
  const [previewBackToInfo, setPreviewBackToInfo] = useState(false);

  useEffect(() => {
    setQuery(readQuery());
  }, []);

  const { token, preview } = query;

  const previewPending = useMemo(
    () => mapLeaveToView(mockLeavePending),
    []
  );
  const previewProcessed = useMemo(
    () => mapLeaveToView(mockLeaveApproved),
    []
  );

  if (preview === UI_PREVIEW.LOADING) return <LoadingState />;

  if (preview === UI_PREVIEW.ERROR) {
    return (
      <ErrorState message="This link is invalid, expired, or the leave request could not be loaded." />
    );
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

  return <LeaveLoader key={token} token={token} />;
}
