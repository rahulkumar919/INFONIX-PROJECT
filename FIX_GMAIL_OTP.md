# 🔧 Fix Gmail OTP - Step by Step Guide

## ❌ Current Problem

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Reason**: Gmail App Password is invalid or expired.

---

## ✅ Solution: Generate New Gmail App Password

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. If not enabled, click "Get Started" and enable it
4. Follow the steps to set up 2-Step Verification

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **Infonix Cloud**
6. Click **Generate**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`

### Step 3: Update .env.local

Copy the 16-character password (remove spaces):

```env
EMAIL_USER=rahulkumar9508548671@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=rahulkumar9508548671@gmail.com
```

**Important**: Remove ALL spaces from the password!

### Step 4: Restart Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Test Signup

1. Go to: http://localhost:3001/signup
2. Fill form and submit
3. Check Gmail inbox
4. OTP should arrive within 10 seconds

---

## 🔍 Troubleshooting

### Issue 1: "App Passwords" option not visible

**Solution**: 
- Make sure 2-Step Verification is enabled
- Wait 5-10 minutes after enabling 2-Step Verification
- Try accessing from: https://myaccount.google.com/apppasswords

### Issue 2: Still getting "Invalid login" error

**Possible causes**:
1. Spaces in password - Remove all spaces
2. Wrong email - Verify EMAIL_USER matches your Gmail
3. Old password - Generate new App Password
4. Gmail security - Check if Gmail blocked the login attempt

**Check Gmail security**:
- Go to: https://myaccount.google.com/notifications
- Look for "Blocked sign-in attempt"
- If found, allow the app and try again

### Issue 3: "Less secure app access" message

**Solution**:
- Google removed "Less secure apps" option
- You MUST use App Password now
- Regular Gmail password won't work

---

## 🧪 Test Email Configuration

Create a test script to verify email works:

```javascript
// test-email.js
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rahulkumar9508548671@gmail.com',
      pass: 'YOUR_APP_PASSWORD_HERE' // 16 chars, no spaces
    }
  });

  try {
    await transporter.sendMail({
      from: 'rahulkumar9508548671@gmail.com',
      to: 'rahulkumar9508548671@gmail.com',
      subject: 'Test Email',
      text: 'If you receive this, email is working!'
    });
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();
```

Run:
```bash
node test-email.js
```

---

## 🔄 Alternative: Use Different SMTP

If Gmail doesn't work, try these alternatives:

### Option 1: SendGrid (Free 100 emails/day)

1. Sign up: https://sendgrid.com/
2. Get API key
3. Update email.ts:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Option 2: Mailgun (Free 5000 emails/month)

1. Sign up: https://www.mailgun.com/
2. Get SMTP credentials
3. Update email.ts:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

### Option 3: Mailtrap (For Testing Only)

1. Sign up: https://mailtrap.io/
2. Get test inbox credentials
3. Update email.ts:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});
```

---

## 📝 Current Configuration

### Your .env.local:
```env
EMAIL_USER=rahulkumar9508548671@gmail.com
EMAIL_PASS=mwcxyjcavynmjelx  ❌ INVALID
EMAIL_FROM=rahulkumar9508548671@gmail.com
```

### What you need:
```env
EMAIL_USER=rahulkumar9508548671@gmail.com
EMAIL_PASS=YOUR_NEW_16_CHAR_APP_PASSWORD  ✅ NEW
EMAIL_FROM=rahulkumar9508548671@gmail.com
```

---

## ✅ Quick Fix Steps

1. **Generate App Password**: https://myaccount.google.com/apppasswords
2. **Copy password** (remove spaces)
3. **Update .env.local** with new password
4. **Restart server**: `npm run dev`
5. **Test signup**: http://localhost:3001/signup
6. **Check Gmail**: OTP should arrive

---

## 🎯 Expected Result

After fixing:

```
📝 Signup request received
✅ Database connected
📧 Signup data: { name: 'Test', email: 'test@gmail.com', passwordLength: 7 }
🔍 Checking existing user...
👤 Existing user: Not found
🔢 Generating OTP...
✅ OTP generated: 123456
➕ Creating new user...
✅ User created
📧 Sending OTP email...
✅ OTP email sent successfully to: test@gmail.com  ✅ SUCCESS!
POST /api/auth/signup 200 in 2500ms
```

---

## 🔐 Security Notes

1. **Never commit .env.local** to GitHub
2. **App Password is like a password** - keep it secret
3. **Revoke old App Passwords** you're not using
4. **Use different App Password** for each app
5. **Monitor Gmail activity**: https://myaccount.google.com/device-activity

---

## 📞 Still Not Working?

### Check these:

1. ✅ 2-Step Verification enabled?
2. ✅ App Password generated correctly?
3. ✅ No spaces in password?
4. ✅ Correct email address?
5. ✅ Server restarted after .env change?
6. ✅ Gmail not blocking the app?

### Get detailed error:

Check server logs after signup attempt:
```bash
# Look for this in terminal
❌ Error sending OTP email: Error: ...
```

---

## 🎉 Success Checklist

After fixing, you should see:

- [ ] No error in server logs
- [ ] "✅ OTP email sent successfully" message
- [ ] Email arrives in Gmail inbox within 10 seconds
- [ ] Email has professional template
- [ ] OTP is 6 digits
- [ ] Can verify OTP and login

---

**Follow these steps carefully and OTP will work!** 🚀

**Most Important**: Generate NEW App Password from Google!
