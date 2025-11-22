import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = ((currentPage - 1) * limit) + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {total} notes
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="flex items-center px-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}