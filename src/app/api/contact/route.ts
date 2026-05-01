import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

// ─── Email Template Shell ───
function emailShell(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
</style>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #0a0a0a; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; line-height: 1.6; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden;">
    <tr><td style="background-color: #fa6c2a; height: 6px; width: 100%;"></td></tr>
    <tr>
      <td style="padding: 40px;">
        ${content}
        <p style="font-size: 15px; color: #d1d5db; margin-top: 40px; margin-bottom: 0;">
          Best regards,<br><strong style="color: #ffffff; font-size: 16px;">Smit Patil</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: rgba(255, 255, 255, 0.03); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 10px 0;">This is an automated response confirming we received your message.</p>
        <p style="margin: 0; font-size: 13px;">
          <a href="https://linkedin.com/in/SmitPatil" style="color: #fa6c2a; text-decoration: none; font-weight: 600;">LinkedIn</a>
          <span style="color: #4b5563; margin: 0 8px;">&bull;</span>
          <a href="https://github.com/smitj25" style="color: #fa6c2a; text-decoration: none; font-weight: 600;">GitHub</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Intent-Specific Email Content ───
function getAutoReplyContent(intent: string, name: string, company: string): { subject: string; html: string } {

  switch (intent) {
    case "job":
      return {
        subject: `Thanks for reaching out, ${name}!`,
        html: emailShell(`
          <h1 style="font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; color: #ffffff;">
            Thanks for reaching out, ${name}!
          </h1>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 20px;">
            I appreciate you considering me for an opportunity${company ? ` at <strong style="color: #ffffff;">${company}</strong>` : ""}. I'm always excited to explore new roles where I can bring my expertise in AI, Data Science, and Full-Stack Development to a team doing meaningful work.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: rgba(250, 108, 42, 0.05); border-left: 3px solid #fa6c2a; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="font-size: 12px; color: #fa6c2a; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">Resume Attached</p>
                <p style="font-size: 14px; color: #d1d5db; margin: 0;">I've attached my latest resume to this email for your convenience. Feel free to share it with your team.</p>
              </td>
            </tr>
          </table>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 0;">
            I'll review your message and respond within 24 hours. Looking forward to connecting!
          </p>
        `),
      };

    case "freelance":
      return {
        subject: `Let's build something great, ${name}!`,
        html: emailShell(`
          <h1 style="font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; color: #ffffff;">
            Let's build something great, ${name}!
          </h1>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 20px;">
            Thanks for considering me for your project${company ? ` at <strong style="color: #ffffff;">${company}</strong>` : ""}! I specialize in building intelligent systems using Gen AI, ML pipelines, and modern web technologies.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: rgba(250, 108, 42, 0.05); border-left: 3px solid #fa6c2a; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="font-size: 12px; color: #fa6c2a; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">Next Steps</p>
                <p style="font-size: 14px; color: #d1d5db; margin: 0;">I'll review your project details and get back to you within 24 hours with my thoughts, a rough scope estimate, and next steps.</p>
              </td>
            </tr>
          </table>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 0;">
            In the meantime, feel free to browse my portfolio for examples of past work!
          </p>
        `),
      };

    default: // network
      return {
        subject: `Great to connect, ${name}!`,
        html: emailShell(`
          <h1 style="font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; color: #ffffff;">
            Great to connect, ${name}!
          </h1>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 20px;">
            Thanks for reaching out! I love connecting with people who share an interest in AI, technology, and building cool things. I'll read through your message and get back to you soon.
          </p>
          <p style="font-size: 15px; color: #d1d5db; margin-bottom: 0;">
            Feel free to connect with me on LinkedIn or check out my work on GitHub—always happy to chat!
          </p>
        `),
      };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, intent, message } = body;

    if (!name || !email || !message || !intent) {
      return NextResponse.json({ error: "Name, email, message, and intent are required" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.error("Missing Gmail credentials in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const intentLabel = intent === "job" ? "Job Opportunity" : intent === "freelance" ? "Freelance Project" : "Networking";

    // 1. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // 2. Notification Email (To You)
    const notificationPromise = transporter.sendMail({
      from: `"Portfolio Alerts" <${gmailUser}>`,
      to: gmailUser,
      subject: `[${intentLabel}] New message from ${name}`,
      html: `
        <h2>New Contact — ${intentLabel}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Intent:</strong> ${intentLabel}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 3. Auto-Reply Email (To the User) — intent-aware
    const { subject: replySubject, html: replyHtml } = getAutoReplyContent(intent, name, company);

    // Attach resume for job inquiries
    const attachments: { filename: string; path: string }[] = [];
    if (intent === "job") {
      const resumePath = path.join(process.cwd(), "public", "Smit_Patil_Resume.pdf");
      if (fs.existsSync(resumePath)) {
        attachments.push({ filename: "Smit_Patil_Resume.pdf", path: resumePath });
      }
    }

    const autoReplyPromise = transporter.sendMail({
      from: `"Smit Patil" <${gmailUser}>`,
      to: email,
      subject: replySubject,
      html: replyHtml,
      attachments,
    });

    // 4. Google Sheets Logging
    const sheetPromise = (async () => {
      const sheetId = process.env.GOOGLE_SHEET_ID;
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY;

      if (sheetId && clientEmail && privateKey) {
        const formattedKey = privateKey.replace(/\\n/g, "\n");
        const auth = new google.auth.GoogleAuth({
          credentials: { client_email: clientEmail, private_key: formattedKey },
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Sheet1!A:F",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[
              new Date().toLocaleString(),
              name,
              email,
              company || "",
              intentLabel,
              message,
            ]],
          },
        });
      }
    })();

    // Run all concurrently
    await Promise.allSettled([notificationPromise, autoReplyPromise, sheetPromise]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
