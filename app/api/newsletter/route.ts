import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { WelcomeEmail } from "@/components/welcome-email"

// Configuration du transporteur Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.GMAIL_USER, // Votre email Gmail
    pass: process.env.GMAIL_APP_PASSWORD, // Mot de passe d'application Gmail
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2"
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Vérifier que les variables d'environnement Gmail sont configurées
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail configuration missing: GMAIL_USER or GMAIL_APP_PASSWORD not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    // Configuration de l'email
    const mailOptions = {
      from: `"Glow by FC" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "✨ Bienvenue dans la famille Glow by FC !",
      html: WelcomeEmail({ email }),
    }

    // Envoi de l'email de bienvenue
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      emailId: info.messageId,
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    
    // Gestion des erreurs spécifiques à Nodemailer/Gmail
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        console.error("Gmail authentication failed - check GMAIL_USER and GMAIL_APP_PASSWORD")
        return NextResponse.json({ error: "Email service authentication failed" }, { status: 500 })
      }
      if (error.message.includes("Connection timeout")) {
        console.error("Gmail SMTP connection timeout")
        return NextResponse.json({ error: "Email service temporarily unavailable" }, { status: 503 })
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
