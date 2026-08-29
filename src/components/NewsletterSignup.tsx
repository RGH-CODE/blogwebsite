"use client";

import { type FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while joining the list.");
      }

      setEmail("");
      setStatus("success");
      setMessage("You’re on the list — the next Sunday letter is on its way.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="email">
        Your email address
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-invalid={status === "error"}
        aria-describedby={message ? "newsletter-status" : undefined}
      />
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining..." : "Join the list"}
        <span aria-hidden="true">→</span>
      </button>
      {message ? (
        <p id="newsletter-status" className={`newsletter-status ${status}`} aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
