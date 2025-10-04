import { RoleBadge } from "../role-badge";

export default function RoleBadgeExample() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <RoleBadge role="admin" />
        <RoleBadge role="manager" />
        <RoleBadge role="employee" />
      </div>
    </div>
  );
}
