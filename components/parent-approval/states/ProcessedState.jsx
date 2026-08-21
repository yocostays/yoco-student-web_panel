import LeaveRequestCard from "../LeaveRequestCard";
import PageShell from "../PageShell";
import PlayStoreCta from "../PlayStoreCta";

export default function ProcessedState({ view }) {
  return (
    <PageShell>
      <LeaveRequestCard view={view} showActions={false} />
      <PlayStoreCta firstName={view?.firstName} />
    </PageShell>
  );
}
