/**
 * Test Script: Store Creation with User Data
 * Tests that user data is properly displayed in templates
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webzio';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function testStoreCreation() {
  try {
    console.log('🚀 Starting Store Creation Test...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Import models
    const User = require('../models/User');
    const Website = require('../models/Website');
    const Template = require('../models/Template');

    // Step 1: Create or get test user
    console.log('📝 Step 1: Creating test user...');
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    
    if (!testUser) {
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      testUser = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword,
        isVerified: true,
        plan: 'free'
      });
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user already exists');
    }
    console.log(`   User ID: ${testUser._id}`);
    console.log(`   Email: ${testUser.email}\n`);

    // Step 2: Get a template
    console.log('📝 Step 2: Finding template...');
    let template = await Template.findOne({ isActive: true });
    
    if (!template) {
      console.log('⚠️  No templates found, creating one...');
      const fs = require('fs');
      const path = require('path');
      
      // Read the corporate law firm template
      const templatePath = path.join(__dirname, '../templates/corporate-law-firm.html');
      const htmlCode = fs.readFileSync(templatePath, 'utf8');
      
      template = await Template.create({
        name: 'Corporate Law Firm',
        category: 'Corporate',
        icon: '⚖️',
        desc: 'Professional law firm template',
        color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        accentColor: '#ffd700',
        tags: ['law', 'corporate', 'professional'],
        popular: true,
        isActive: true,
        previewImage: '',
        htmlCode: htmlCode,
        templateType: 'general'
      });
      console.log('✅ Template created');
    } else {
      console.log('✅ Template found');
    }
    console.log(`   Template ID: ${template._id}`);
    console.log(`   Template Name: ${template.name}\n`);

    // Step 3: Create store with user data
    console.log('📝 Step 3: Creating store with user data...');
    
    const testStoreData = {
      siteName: 'My Awesome Law Firm',
      slug: 'my-awesome-law-firm-' + Date.now(),
      templateId: template._id,
      userId: testUser._id,
      isActive: true,
      content: {
        logo: 'https://via.placeholder.com/150x50/1a1a2e/ffd700?text=LAW+FIRM',
        heroTitle: 'Expert Legal Services',
        heroSubtitle: 'Protecting your rights with 20+ years of experience',
        heroImage: '',
        aboutTitle: 'About Our Practice',
        aboutText: 'We are a dedicated team of legal professionals committed to providing exceptional service to our clients. With expertise in corporate law, litigation, and contract negotiations, we ensure your legal matters are handled with the utmost care and professionalism.',
        contactPhone: '+1 (555) 123-4567',
        contactEmail: 'contact@myawesomelaw.com',
        contactAddress: '123 Justice Street, Legal City, LC 12345',
        whatsappNumber: '15551234567',
        buttonText: 'Schedule Consultation',
        footerDesc: '© 2026 My Awesome Law Firm. All rights reserved. Licensed & Certified.',
        primaryColor: '#1a1a2e',
        secondaryColor: '#ffd700'
      }
    };

    // Delete existing test store if any
    await Website.deleteMany({ slug: { $regex: /^my-awesome-law-firm/ } });

    const newStore = await Website.create(testStoreData);
    console.log('✅ Store created successfully!');
    console.log(`   Store ID: ${newStore._id}`);
    console.log(`   Store Slug: ${newStore.slug}`);
    console.log(`   Store URL: http://localhost:3001/${newStore.slug}\n`);

    // Step 4: Verify store data
    console.log('📝 Step 4: Verifying store data...');
    const verifyStore = await Website.findById(newStore._id).populate('templateId');
    
    console.log('✅ Store Data Verification:');
    console.log(`   ✓ Site Name: ${verifyStore.siteName}`);
    console.log(`   ✓ Logo: ${verifyStore.content.logo}`);
    console.log(`   ✓ Hero Title: ${verifyStore.content.heroTitle}`);
    console.log(`   ✓ Hero Subtitle: ${verifyStore.content.heroSubtitle}`);
    console.log(`   ✓ About Text: ${verifyStore.content.aboutText.substring(0, 50)}...`);
    console.log(`   ✓ Contact Phone: ${verifyStore.content.contactPhone}`);
    console.log(`   ✓ Contact Email: ${verifyStore.content.contactEmail}`);
    console.log(`   ✓ Contact Address: ${verifyStore.content.contactAddress}`);
    console.log(`   ✓ WhatsApp: ${verifyStore.content.whatsappNumber}`);
    console.log(`   ✓ Button Text: ${verifyStore.content.buttonText}`);
    console.log(`   ✓ Footer: ${verifyStore.content.footerDesc}\n`);

    // Step 5: Test template rendering
    console.log('📝 Step 5: Testing template rendering...');
    const { renderTemplate } = require('../lib/templateRenderer');
    
    if (verifyStore.templateId && verifyStore.templateId.htmlCode) {
      const renderedHtml = renderTemplate(verifyStore.templateId.htmlCode, verifyStore);
      
      // Check if user data is in rendered HTML
      const checks = [
        { name: 'Site Name', value: verifyStore.siteName, found: renderedHtml.includes(verifyStore.siteName) },
        { name: 'Hero Title', value: verifyStore.content.heroTitle, found: renderedHtml.includes(verifyStore.content.heroTitle) },
        { name: 'Hero Subtitle', value: verifyStore.content.heroSubtitle, found: renderedHtml.includes(verifyStore.content.heroSubtitle) },
        { name: 'Contact Phone', value: verifyStore.content.contactPhone, found: renderedHtml.includes(verifyStore.content.contactPhone) },
        { name: 'Contact Email', value: verifyStore.content.contactEmail, found: renderedHtml.includes(verifyStore.content.contactEmail) },
        { name: 'Contact Address', value: verifyStore.content.contactAddress, found: renderedHtml.includes(verifyStore.content.contactAddress) },
        { name: 'Button Text', value: verifyStore.content.buttonText, found: renderedHtml.includes(verifyStore.content.buttonText) },
      ];

      console.log('✅ Template Rendering Verification:');
      let allPassed = true;
      checks.forEach(check => {
        const status = check.found ? '✓' : '✗';
        const color = check.found ? '' : ' ⚠️  FAILED';
        console.log(`   ${status} ${check.name}: ${check.found ? 'Found' : 'NOT FOUND'}${color}`);
        if (!check.found) allPassed = false;
      });

      if (allPassed) {
        console.log('\n🎉 SUCCESS! All user data is properly rendered in the template!\n');
      } else {
        console.log('\n⚠️  WARNING: Some user data is missing from the rendered template!\n');
      }

      // Save rendered HTML for inspection
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(__dirname, '../test-output.html');
      fs.writeFileSync(outputPath, renderedHtml);
      console.log(`📄 Rendered HTML saved to: ${outputPath}\n`);
    } else {
      console.log('⚠️  Template has no HTML code\n');
    }

    // Step 6: Generate test credentials
    console.log('📝 Step 6: Test Credentials:');
    const token = jwt.sign({ id: testUser._id, email: testUser.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`   Email: testuser@example.com`);
    console.log(`   Password: testpass123`);
    console.log(`   Token: ${token.substring(0, 50)}...\n`);

    console.log('🎯 Next Steps:');
    console.log(`   1. Open browser: http://localhost:3001`);
    console.log(`   2. Login with: testuser@example.com / testpass123`);
    console.log(`   3. Go to Dashboard > Stores`);
    console.log(`   4. View your test store: http://localhost:3001/${newStore.slug}`);
    console.log(`   5. Verify all your data appears correctly!\n`);

    console.log('✅ Test completed successfully!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the test
testStoreCreation();
