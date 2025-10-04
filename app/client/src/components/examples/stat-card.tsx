import { StatCard } from "../stat-card";
import { DollarSign, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Expenses"
        value="$45,231"
        icon={DollarSign}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Pending Approval"
        value="23"
        icon={Clock}
        subtitle="Requires action"
      />
      <StatCard
        title="Approved This Month"
        value="156"
        icon={CheckCircle2}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Average Processing Time"
        value="2.4 days"
        icon={TrendingUp}
        trend={{ value: -15.3, isPositive: true }}
      />
    </div>
  );
}
