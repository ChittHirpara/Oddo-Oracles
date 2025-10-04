import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="pending" />
        <StatusBadge status="approved" />
        <StatusBadge status="rejected" />
        <StatusBadge status="in-review" />
      </div>
    </div>
  );
}
