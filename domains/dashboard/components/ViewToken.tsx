"use client";

import useJwt from "@/hooks/useJwt";
import { CheckCircle, Trash2, XCircle } from "lucide-react";

export default function ViewToken() {
  const { jwt, setToken } = useJwt();

  const hasToken = !!jwt;

  return (
    <div className="p-6 max-w-md surface-1 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasToken ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <XCircle className="text-error" size={24} />
          )}
          <span className="font-semibold text-main">
            {hasToken ? "Token Found" : "No Token"}
          </span>
        </div>

        {hasToken && (
          <button
            onClick={() => setToken(null)}
            className="flex items-center gap-1 px-3 py-1 bg-error/20 text-error hover:bg-error hover:text-deep rounded-md transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="bg-surface-2 p-3 rounded border font-mono text-xs break-all min-h-15 flex items-center justify-center text-else">
        {jwt || "Storage is empty"}
      </div>
    </div>
  );
}
