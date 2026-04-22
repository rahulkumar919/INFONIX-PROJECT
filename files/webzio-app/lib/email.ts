import * as nodemailer from 'nodemailer'

// Email service for sending OTP
export async function sendOTPEmail(email: string, otp: string, name: string) {
  try {
    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Infonix Cloud <noreply@infonixcloud.com>',
      to: email,
      subject: 'Verify Your Email - Infonix Cloud',
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: #fff; margin: 0; font-size: 28px;">🚀 Infonix Cloud</h1>
                    </div>
                    <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Infonix Cloud!</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for signing up! Please use the following OTP to verify your email address:</p>
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 30px 0; border-radius: 8px; color: #fff;">
                            ${otp}
                        </div>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">⏰ This OTP will expire in 10 minutes.</p>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">If you didn't request this, please ignore this email.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Infonix Cloud. All rights reserved.</p>
                    </div>
                </div>
            `
    }

    await transporter.sendMail(mailOptions)

    console.log('✅ OTP email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending OTP email:', error)
    throw new Error('Failed to send OTP email. Please try again.')
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generic email sending function
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Webzio <noreply@webzio.com>',
      to,
      subject,
      html
    }

    await transporter.sendMail(mailOptions)

    console.log('✅ Email sent successfully to:', to)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw new Error('Failed to send email. Please try again.')
  }
}
