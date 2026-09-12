"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    window.location.replace("/aerodrome.html");
  }, []);
  return (
    <main className="flex h-dvh items-center justify-center bg-bg text-muted">
      Opening simulator…
    </main>
  );
}
