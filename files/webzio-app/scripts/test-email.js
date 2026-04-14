const nodemailer = require('nodemailer');

// Manually set credentials for testing
const EMAIL_USER = 'rahulkumar9508548671@gmail.com';
const EMAIL_PASS = 'trwofbnadfbnahzw'; // Your NEW password

async function testEmail() {
  console.log('🧪 Testing Gmail SMTP Configuration...\n');
  
  console.log('📧 Email User:', EMAIL_USER);
  console.log('🔑 Email Pass:', '***' + EMAIL_PASS.slice(-4));
  console.log('');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  console.log('📤 Sending test email...\n');

  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_USER, // Send to yourself
      subject: ' Email Verification  - Infonix Cloud',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 10px; color: white; text-align: center;">
            <h1>🎉 Email Configuration Working!</h1>
            <p style="font-size: 18px; margin-top: 10px;">Your Gmail SMTP is configured correctly.</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2>Test Successful</h2>
            <p>If you're reading this, your email configuration is working perfectly!</p>
            <p><strong>Email User:</strong> ${EMAIL_USER}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Check your inbox:', EMAIL_USER);
    console.log('\n🎉 Gmail SMTP is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Failed to send email\n');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\n📝 This means:');
    
    if (error.code === 'EAUTH') {
      console.error('❌ AUTHENTICATION FAILED');
      console.error('\n🔧 Your Gmail App Password is INVALID or EXPIRED');
      console.error('\n✅ Solution:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Generate NEW App Password');
      console.error('3. Copy it (remove spaces)');
      console.error('4. Update .env.local with new password');
      console.error('5. Restart server and try again');
    } else {
      console.error('Unknown error. Check your internet connection.');
    }
  }
}

testEmail();
