/**
 * Create Test User Script
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function createTestUser() {
  try {
    console.log('🚀 Creating test user...\n');

    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpass123'
    };

    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (data.success) {
      console.log('✅ Test user created successfully!');
      console.log(`   Name: ${userData.name}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}\n`);
      console.log('🎯 You can now login with these credentials\n');
    } else {
      if (data.message && data.message.includes('already exists')) {
        console.log('✅ Test user already exists');
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: ${userData.password}\n`);
      } else {
        console.log('❌ Failed to create user:', data.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
