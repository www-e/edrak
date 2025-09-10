"use client";

import { useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const snackbarVariants = cva(
  "z-50 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-black",
        error: "bg-red-500 text-white",
      },
      state: {
        entering: "translate-x-full opacity-0",
        entered: "translate-x-0 opacity-100",
        exiting: "translate-x-full opacity-0",
        exited: "translate-x-full opacity-0",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "entered",
    },
  }
);

interface SnackbarProps extends VariantProps<typeof snackbarVariants> {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export function Snackbar({
  message,
  open,
  onClose,
  variant,
  duration = 3000,
}: SnackbarProps) {
  const [state, setState] = useState<"entering" | "entered" | "exiting" | "exited">("entering");

  useEffect(() => {
    if (open) {
      setState("entering");
      const enterTimer = setTimeout(() => setState("entered"), 10);
      const autoCloseTimer = setTimeout(() => {
        setState("exiting");
        setTimeout(onClose, 300);
      }, duration);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(autoCloseTimer);
      };
    } else {
      setState("exiting");
      const exitTimer = setTimeout(() => setState("exited"), 300);
      return () => clearTimeout(exitTimer);
    }
  }, [open, duration, onClose]);

  if (state === "exited") return null;

  return (
    <div className={cn(snackbarVariants({ variant, state }))}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => {
            setState("exiting");
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}