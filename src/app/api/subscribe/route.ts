import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { appendSubscriber } from "@/lib/googleSheets";

const defaultRecipients = (process.env.EMAIL_TO || "rajesh.ghimire200@gmail.com")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

function buildTransport() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const sheetResult = await appendSubscriber(email, "website");

    if (!sheetResult.ok) {
      return NextResponse.json({ error: sheetResult.reason || "Could not save subscriber." }, { status: 500 });
    }

    const transporter = buildTransport();
    const recipients = defaultRecipients.length ? defaultRecipients : ["rajesh.ghimire200@gmail.com"];
    const unsubscribeLink = `${process.env.APP_URL || "http://localhost:3000"}/api/unsubscribe?email=${encodeURIComponent(email)}`;

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipients,
        replyTo: email,
        subject: "New newsletter signup",
        text: `A new subscriber joined the list:\n\nEmail: ${email}`,
        html: `<p><strong>New subscriber:</strong> ${email}</p>`,
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Welcome to Field Notes",
        text: `Thanks for joining Field Notes.\n\nYou will receive thoughtful notes once a week.\n\nTo unsubscribe at any time, visit: ${unsubscribeLink}`,
        html: `
          <p>Thanks for joining Field Notes.</p>
          <p>You will receive thoughtful notes once a week.</p>
          <p>To unsubscribe at any time, visit: <a href="${unsubscribeLink}">${unsubscribeLink}</a></p>
        `,
      });
    }

    return NextResponse.json({ ok: true, email, sentTo: recipients, unsubscribeLink });
  } catch (error) {
    console.error("Newsletter signup email failed:", error);
    return NextResponse.json({ error: "Could not process the signup." }, { status: 500 });
  }
}
