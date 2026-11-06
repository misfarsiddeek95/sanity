"use client";
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-LK"><body style={{ fontFamily: "system-ui", padding: 40, textAlign: "center" }}>
      <h1>Something went wrong</h1><p>Please reload the page.</p><button onClick={reset}>Try again</button>
    </body></html>
  );
}
