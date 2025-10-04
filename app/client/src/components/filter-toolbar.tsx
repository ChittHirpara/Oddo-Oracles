import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { ExpenseStatus } from "./status-badge";

interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: ExpenseStatus | "all";
  onStatusChange?: (status: ExpenseStatus | "all") => void;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  onExport?: () => void;
}

export function FilterToolbar({
  searchValue = "",
  onSearchChange,
  statusFilter = "all",
  onStatusChange,
  categoryFilter = "all",
  onCategoryChange,
  onExport,
}: FilterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9"
          data-testid="input-search-expenses"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="in-review">In Review</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[140px]" data-testid="select-category-filter">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="travel">Travel</SelectItem>
          <SelectItem value="meals">Meals</SelectItem>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="equipment">Equipment</SelectItem>
          <SelectItem value="office">Office</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" data-testid="button-advanced-filters">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>

      {onExport && (
        <Button variant="outline" onClick={onExport} data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      )}
    </div>
  );
}
