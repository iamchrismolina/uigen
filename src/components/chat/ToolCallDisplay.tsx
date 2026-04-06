"use client";

import { Loader2 } from "lucide-react";

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

function basename(filePath: string): string {
  return filePath.split("/").pop() ?? filePath;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const command = args.command;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${basename(path)}`;
      case "str_replace":
      case "insert":
        return `Editing ${basename(path)}`;
      case "view":
        return `Reading ${basename(path)}`;
      case "undo_edit":
        return `Undoing edit in ${basename(path)}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": {
        const newPath = typeof args.new_path === "string" ? args.new_path : "";
        return `Renaming ${basename(path)} to ${basename(newPath)}`;
      }
      case "delete":
        return `Deleting ${basename(path)}`;
    }
  }

  return toolName;
}

export function ToolCallDisplay({ toolName, args, state, result }: ToolCallDisplayProps) {
  const label = getToolLabel(toolName, args);
  const isDone = state === "result" && result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
