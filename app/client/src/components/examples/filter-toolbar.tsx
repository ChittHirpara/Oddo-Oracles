import { FilterToolbar } from "../filter-toolbar";
import { useState } from "react";

export default function FilterToolbarExample() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  return (
    <div className="p-6">
      <FilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={status as any}
        onStatusChange={setStatus as any}
        categoryFilter={category}
        onCategoryChange={setCategory}
        onExport={() => console.log("Exporting...")}
      />
    </div>
  );
}
