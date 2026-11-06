"use client";
import type { ReactNode } from "react";
import { usePath } from "../lib/router";

/** Re-mounts on every navigation: replays the page-enter animation (home has no bottom gap before the footer). */
export default function Template({ children }: { children: ReactNode }) {
  return <div className={usePath() === "/" ? "page-enter" : "page-enter pb-16"}>{children}</div>;
}
