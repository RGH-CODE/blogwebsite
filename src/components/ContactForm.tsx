"use client";

import { type FormEvent, useState } from "react";

const blogOptions = [
  "Writing",
  "Travel",
  "Lifestyle",
  "Technology",
  "Business",
  "Personal growth",
  "Productivity",
  "Creative work",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    interest: blogOptions[0],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setMessage("Please fill in your name, phone, email, and message.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your message right now.");
      }

      setStatus("success");
      setMessage("Thanks. Your message has been sent.");
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        interest: blogOptions[0],
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-grid">
        <label>
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </label>

        <label>
          <span>Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>

        <label>
          <span>Interest</span>
          <select
            value={form.interest}
            onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))}
          >
            {blogOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>Feedback/Message</span>
        <textarea
          value={form.message}
          rows={5}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        />
      </label>

      <button type="submit" disabled={status === "loading"} className="button button-dark contact-submit">
        {status === "loading" ? "Sending..." : "Send message"}
      </button>

      {message ? (
        <p className={`contact-status ${status}`} aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
