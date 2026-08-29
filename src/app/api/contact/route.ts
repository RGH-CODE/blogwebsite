import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { appendContactForm } from "@/lib/googleSheets";

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
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const interest = typeof body?.interest === "string" ? body.interest.trim() : "";

    if (!name ||!email || !message || !interest) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }

    const sheetResult = await appendContactForm({ name, phone, email, message, interest });

    if (!sheetResult.ok) {
      return NextResponse.json({ error: sheetResult.reason || "Could not save your message." }, { status: 500 });
    }

    const transporter = buildTransport();

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.EMAIL_TO || "rajesh.ghimire200@gmail.com",
        replyTo: email,
        subject: "New website blog inquiry",
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form failed:", error);
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }
}
