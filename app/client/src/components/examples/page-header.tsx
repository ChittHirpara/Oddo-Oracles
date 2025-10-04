import { PageHeader } from "../page-header";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export default function PageHeaderExample() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Manage expenses, team members, and approval workflows"
        role="admin"
        actions={
          <>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button>Configure Rules</Button>
          </>
        }
        stats={[
          { label: "Total Expenses", value: "$45.2K", icon: DollarSign },
          { label: "Pending", value: "23", icon: Clock },
          { label: "Approved", value: "156", icon: CheckCircle2 },
        ]}
      />
    </div>
  );
}
