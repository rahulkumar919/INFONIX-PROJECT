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

// Send store creation success email
export async function sendStoreCreationEmail(email: string, storeName: string, storeSlug: string, userName: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/store/${storeSlug}`

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Webzio <noreply@webzio.com>',
      to: email,
      subject: '🎉 Your Website is Successfully Created!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          </div>
          <div style="background: #fff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Your Website is Live!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Great news! Your website <strong>${storeName}</strong> has been successfully created and is now live.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;"><strong>Website Name:</strong> ${storeName}</p>
              <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;"><strong>Website URL:</strong></p>
              <a href="${storeUrl}" style="color: #6366f1; font-size: 14px; word-break: break-all; text-decoration: none;">${storeUrl}</a>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${storeUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                🌐 View Your Website
              </a>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>💡 Next Steps:</strong><br>
                • Customize your website design<br>
                • Add your products and content<br>
                • Configure your domain settings<br>
                • Share your website with the world!
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">If you have any questions or need help, feel free to reach out to our support team.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Webzio. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Store creation email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ Error sending store creation email:', error)
    // Don't throw error - we don't want to fail store creation if email fails
    return false
  }
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
