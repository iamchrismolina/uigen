import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay, getToolLabel } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

// Label logic tests
test("getToolLabel: str_replace_editor create", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/App.jsx" })).toBe("Creating App.jsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/components/Button.tsx" })).toBe("Editing Button.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/utils.ts" })).toBe("Editing utils.ts");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "src/index.ts" })).toBe("Reading index.ts");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "src/App.jsx" })).toBe("Undoing edit in App.jsx");
});

test("getToolLabel: file_manager rename", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "src/old.tsx", new_path: "src/new.tsx" })).toBe("Renaming old.tsx to new.tsx");
});

test("getToolLabel: file_manager delete", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/Card.tsx" })).toBe("Deleting Card.tsx");
});

test("getToolLabel: unknown tool falls back to tool name", () => {
  expect(getToolLabel("some_other_tool", { command: "do_thing" })).toBe("some_other_tool");
});

// Rendering tests
test("ToolCallDisplay shows spinner when pending", () => {
  const { container } = render(
    <ToolCallDisplay toolName="str_replace_editor" args={{ command: "create", path: "App.jsx" }} state="call" />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  // Spinner should be present (animate-spin class)
  expect(container.querySelector(".animate-spin")).toBeDefined();
  // Green dot should not be present
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallDisplay shows green dot when done", () => {
  const { container } = render(
    <ToolCallDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
