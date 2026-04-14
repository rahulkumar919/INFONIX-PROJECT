// Test admin login API directly
async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login API...\n');

    const credentials = {
      email: 'rahulkumar9508548671@gmail.com',
      password: 'rahul123'
    };

    console.log('📝 Sending login request with:', credentials);

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    console.log('\n📊 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Login successful!');
      console.log('👤 User:', data.user);
      console.log('🔑 Token:', data.token ? 'Generated' : 'Missing');
    } else {
      console.log('\n❌ Login failed:', data.message);
      if (data.locked) {
        console.log('🔒 Account is locked for', data.remainingTime, 'minutes');
      }
      if (data.attemptsLeft !== undefined) {
        console.log('⚠️ Attempts left:', data.attemptsLeft);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testAdminLogin();
