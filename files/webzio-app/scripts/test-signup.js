// Test signup API directly
async function testSignup() {
  try {
    console.log('🧪 Testing signup API...\n');

    const testData = {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'test123'
    };

    console.log('📝 Sending signup request with:', testData);

    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📊 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Signup successful!');
      if (data.devOtp) {
        console.log('🔢 OTP for testing:', data.devOtp);
      }
    } else {
      console.log('\n❌ Signup failed:', data.message);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testSignup();
