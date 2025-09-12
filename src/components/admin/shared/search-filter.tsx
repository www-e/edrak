"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className 
}: SearchFilterProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(internalValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-10"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
        />
        {internalValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}