"use client";
import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error.digest ?? error.message); }, [error]);
  return (
    <Container className="section-y text-center">
      <h1 className="font-display text-[44px] leading-none sm:text-[64px]">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] text-mute">An unexpected error occurred. Please try again, or message us on WhatsApp if it keeps happening.</p>
      <div className="mt-8 flex justify-center gap-3"><Button onClick={reset} variant="dark">Try again</Button><Button to="/" variant="outline">Back to home</Button></div>
    </Container>
  );
}
