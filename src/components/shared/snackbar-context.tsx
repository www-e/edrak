"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import { Snackbar } from "./snackbar";

type SnackbarVariant = "default" | "success" | "warning" | "error";

interface SnackbarState {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

type SnackbarAction =
  | { type: "ADD_SNACKBAR"; payload: Omit<SnackbarState, "id"> }
  | { type: "REMOVE_SNACKBAR"; payload: string };

interface SnackbarContextType {
  showSnackbar: (message: string, variant?: SnackbarVariant, duration?: number, position?: "top-right" | "top-left" | "bottom-right" | "bottom-left") => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

const snackbarReducer = (state: SnackbarState[], action: SnackbarAction): SnackbarState[] => {
  switch (action.type) {
    case "ADD_SNACKBAR":
      return [...state, { ...action.payload, id: Math.random().toString(36).substr(2, 9) }];
    case "REMOVE_SNACKBAR":
      return state.filter(snackbar => snackbar.id !== action.payload);
    default:
      return state;
  }
};

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, dispatch] = useReducer(snackbarReducer, []);

  const showSnackbar = useCallback((
    message: string, 
    variant: SnackbarVariant = "default", 
    duration: number = 3000,
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right"
  ) => {
    dispatch({ type: "ADD_SNACKBAR", payload: { message, variant, duration, position } });
  }, []);

  const removeSnackbar = useCallback((id: string) => {
    dispatch({ type: "REMOVE_SNACKBAR", payload: id });
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        {snackbars.map((snackbar) => (
          <div 
            key={snackbar.id} 
            className={`
              absolute m-4
              ${snackbar.position === "top-right" ? "top-0 right-0" : ""}
              ${snackbar.position === "top-left" ? "top-0 left-0" : ""}
              ${snackbar.position === "bottom-right" ? "bottom-0 right-0" : ""}
              ${snackbar.position === "bottom-left" ? "bottom-0 left-0" : ""}
            `}
          >
            <Snackbar
              message={snackbar.message}
              variant={snackbar.variant}
              open={true}
              duration={snackbar.duration}
              onClose={() => removeSnackbar(snackbar.id)}
            />
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}