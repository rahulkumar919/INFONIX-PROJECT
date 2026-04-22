const testEmail = 'rahulkumar9508548671@gmail.com'
const baseURL = 'http://localhost:3001'

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Flow\n')
  
  try {
    // Step 1: Request OTP
    console.log('📧 Step 1: Requesting OTP for:', testEmail)
    const forgotRes = await fetch(`${baseURL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    })
    
    const forgotData = await forgotRes.json()
    console.log('Response:', forgotData)
    
    if (forgotData.success) {
      console.log('✅ OTP request successful!')
      console.log('📬 Check your email for the OTP code\n')
      
      console.log('📝 Next steps:')
      console.log('1. Check email:', testEmail)
      console.log('2. Copy the 6-digit OTP')
      console.log('3. Go to: http://localhost:3001/reset-password')
      console.log('4. Enter email, OTP, and new password')
      console.log('5. Click "Reset Password"')
    } else {
      console.log('❌ OTP request failed:', forgotData.message)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testForgotPassword()
