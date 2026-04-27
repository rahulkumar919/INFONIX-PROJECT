/**
 * Test Script: Store Creation via API
 * Tests that user data is properly displayed in templates
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testStoreCreationAPI() {
  try {
    console.log('🚀 Starting Store Creation API Test...\n');

    // Step 1: Login as test user
    console.log('📝 Step 1: Logging in as test user...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpass123'
      })
    });

    if (!loginRes.ok) {
      console.log('⚠️  Test user not found, you need to create one first');
      console.log('   Run: node scripts/create-test-user.js\n');
      return;
    }

    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.token;
    console.log('✅ Logged in successfully\n');

    // Step 2: Get templates
    console.log('📝 Step 2: Fetching templates...');
    const templatesRes = await fetch(`${BASE_URL}/api/templates`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const templatesData = await templatesRes.json();
    if (!templatesData.success || templatesData.templates.length === 0) {
      console.log('❌ No templates found');
      return;
    }

    const template = templatesData.templates[0];
    console.log(`✅ Found template: ${template.name}`);
    console.log(`   Template ID: ${template._id}\n`);

    // Step 3: Create store with user data
    console.log('📝 Step 3: Creating store with custom user data...');
    
    const storeData = {
      siteName: 'My Test Business',
      templateId: template._id,
      logo: 'https://via.placeholder.com/150x50/4a90e2/ffffff?text=MY+BUSINESS',
      contactEmail: 'hello@mytestbusiness.com',
      contactPhone: '+1 (555) 987-6543',
      contactAddress: '456 Business Ave, Commerce City, CC 54321',
      whatsappNumber: '15559876543',
      aboutText: 'We are a passionate team dedicated to providing excellent service. Our mission is to deliver quality products and exceptional customer experiences. With years of expertise, we have built a reputation for reliability and innovation.',
      buttonText: 'Contact Us Now'
    };

    const createRes = await fetch(`${BASE_URL}/api/websites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storeData)
    });

    const createData = await createRes.json();
    if (!createData.success) {
      console.log('❌ Store creation failed:', createData.message);
      return;
    }

    const store = createData.website;
    console.log('✅ Store created successfully!');
    console.log(`   Store ID: ${store._id}`);
    console.log(`   Store Slug: ${store.slug}`);
    console.log(`   Store URL: ${BASE_URL}/${store.slug}\n`);

    // Step 4: Fetch the store page
    console.log('📝 Step 4: Fetching store page...');
    const storePageRes = await fetch(`${BASE_URL}/api/store/slug/${store.slug}`);
    const storePageData = await storePageRes.json();

    if (!storePageData.success) {
      console.log('❌ Failed to fetch store page');
      return;
    }

    console.log('✅ Store page fetched successfully\n');

    // Step 5: Verify user data
    console.log('📝 Step 5: Verifying user data in store...');
    const fetchedStore = storePageData.store;
    
    const checks = [
      { field: 'Site Name', expected: storeData.siteName, actual: fetchedStore.siteName },
      { field: 'Logo', expected: storeData.logo, actual: fetchedStore.content.logo },
      { field: 'Contact Email', expected: storeData.contactEmail, actual: fetchedStore.content.contactEmail },
      { field: 'Contact Phone', expected: storeData.contactPhone, actual: fetchedStore.content.contactPhone },
      { field: 'Contact Address', expected: storeData.contactAddress, actual: fetchedStore.content.contactAddress },
      { field: 'WhatsApp', expected: storeData.whatsappNumber, actual: fetchedStore.content.whatsappNumber },
      { field: 'About Text', expected: storeData.aboutText, actual: fetchedStore.content.aboutText },
      { field: 'Button Text', expected: storeData.buttonText, actual: fetchedStore.content.buttonText }
    ];

    console.log('✅ Data Verification:');
    let allPassed = true;
    checks.forEach(check => {
      const matches = check.expected === check.actual;
      const status = matches ? '✓' : '✗';
      const result = matches ? 'MATCH' : 'MISMATCH';
      console.log(`   ${status} ${check.field}: ${result}`);
      if (!matches) {
        console.log(`      Expected: ${check.expected}`);
        console.log(`      Got: ${check.actual}`);
        allPassed = false;
      }
    });

    if (allPassed) {
      console.log('\n🎉 SUCCESS! All user data is correctly saved!\n');
    } else {
      console.log('\n⚠️  WARNING: Some data mismatches found!\n');
    }

    // Step 6: Instructions
    console.log('🎯 Manual Testing:');
    console.log(`   1. Open browser: ${BASE_URL}`);
    console.log(`   2. Login with: testuser@example.com / testpass123`);
    console.log(`   3. View your store: ${BASE_URL}/${store.slug}`);
    console.log(`   4. Verify the following appears on the page:`);
    console.log(`      - Logo: ${storeData.logo}`);
    console.log(`      - Site Name: ${storeData.siteName}`);
    console.log(`      - Contact Email: ${storeData.contactEmail}`);
    console.log(`      - Contact Phone: ${storeData.contactPhone}`);
    console.log(`      - Contact Address: ${storeData.contactAddress}`);
    console.log(`      - About Text: ${storeData.aboutText.substring(0, 50)}...`);
    console.log(`      - Button Text: ${storeData.buttonText}`);
    console.log(`      - WhatsApp Button (if number provided)\n`);

    console.log('✅ Test completed successfully!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testStoreCreationAPI();
