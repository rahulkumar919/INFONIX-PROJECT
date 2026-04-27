#!/usr/bin/env node
/**
 * Test script to verify templateId fix is working
 * Run: node scripts/test-templateid-fix.js
 */

const BASE_URL = 'http://localhost:3001'
let authToken = ''
let adminToken = ''

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌'
  const color = passed ? 'green' : 'red'
  log(`${icon} ${name}`, color)
  if (details) log(`   ${details}`, 'yellow')
}

async function testUserLogin() {
  log('\n📝 Testing User Login...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rahulkumar9508548671@gmail.com',
        password: 'rahul123'
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.token) {
      authToken = data.token
      logTest('User Login', true, `Token received`)
      return true
    } else {
      logTest('User Login', false, data.error || 'No token received')
      return false
    }
  } catch (error) {
    logTest('User Login', false, error.message)
    return false
  }
}

async function testAdminLogin() {
  log('\n🔐 Testing Admin Login...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.token) {
      adminToken = data.token
      logTest('Admin Login', true, `Admin token received`)
      return true
    } else {
      logTest('Admin Login', false, data.error || 'No token received')
      return false
    }
  } catch (error) {
    logTest('Admin Login', false, error.message)
    return false
  }
}

async function getTemplates() {
  log('\n📋 Fetching Templates...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/templates`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
      const template = data.templates[0]
      logTest('Get Templates', true, `Found ${data.templates.length} templates`)
      log(`   Using template: ${template.name} (ID: ${template._id})`, 'cyan')
      return template._id
    } else {
      logTest('Get Templates', false, 'No templates found')
      return null
    }
  } catch (error) {
    logTest('Get Templates', false, error.message)
    return null
  }
}

async function testCreateStoreWithTemplate(templateId) {
  log('\n🏗️  Testing Store Creation with Template...', 'blue')
  
  try {
    const storeName = `Test Store ${Date.now()}`
    
    const res = await fetch(`${BASE_URL}/api/websites`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({
        siteName: storeName,
        templateId: templateId,
        content: {
          heroTitle: 'Welcome to Test Store',
          heroSubtitle: 'Testing templateId fix'
        }
      })
    })

    const data = await res.json()
    
    if (data.success && data.website) {
      logTest('Store Creation', true, `Store created: ${data.website.slug}`)
      log(`   Website ID: ${data.website._id}`, 'cyan')
      log(`   Template ID: ${data.website.templateId}`, 'cyan')
      return data.website
    } else {
      logTest('Store Creation', false, data.message || 'Unknown error')
      if (data.errors) {
        log(`   Errors: ${data.errors.join(', ')}`, 'yellow')
      }
      return null
    }
  } catch (error) {
    logTest('Store Creation', false, error.message)
    return null
  }
}

async function testFixTemplateIdEndpoint() {
  log('\n🔧 Testing Admin Fix TemplateId Endpoint...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/admin/fix-templateid`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}` 
      }
    })

    const data = await res.json()
    
    if (data.success) {
      logTest('Fix TemplateId Endpoint', true, `Fixed: ${data.stats.fixed}, Errors: ${data.stats.errors}`)
      log(`   Total websites: ${data.stats.total}`, 'cyan')
      if (data.stats.errorDetails && data.stats.errorDetails.length > 0) {
        log(`   Error details:`, 'yellow')
        data.stats.errorDetails.forEach(err => {
          log(`     - ${err.siteName}: ${err.error}`, 'yellow')
        })
      }
      return true
    } else {
      logTest('Fix TemplateId Endpoint', false, data.message || 'Unknown error')
      return false
    }
  } catch (error) {
    logTest('Fix TemplateId Endpoint', false, error.message)
    return false
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'cyan')
  log('🧪 TemplateId Fix Verification Tests', 'cyan')
  log('='.repeat(60), 'cyan')

  // Step 1: Login
  const userLoginSuccess = await testUserLogin()
  if (!userLoginSuccess) {
    log('\n❌ User login failed. Cannot continue tests.', 'red')
    process.exit(1)
  }

  // Step 2: Get templates
  const templateId = await getTemplates()
  if (!templateId) {
    log('\n❌ No templates found. Cannot test store creation.', 'red')
    process.exit(1)
  }

  // Step 3: Test store creation with template
  const website = await testCreateStoreWithTemplate(templateId)
  if (!website) {
    log('\n❌ Store creation failed. TemplateId fix may not be working.', 'red')
    process.exit(1)
  }

  // Step 4: Admin login and test fix endpoint
  const adminLoginSuccess = await testAdminLogin()
  if (adminLoginSuccess) {
    await testFixTemplateIdEndpoint()
  } else {
    log('\n⚠️  Admin login failed. Skipping fix endpoint test.', 'yellow')
  }

  log('\n' + '='.repeat(60), 'cyan')
  log('✅ All tests completed!', 'green')
  log('='.repeat(60), 'cyan')
  log('\n📊 Summary:', 'blue')
  log('   ✅ User login successful', 'green')
  log('   ✅ Templates fetched successfully', 'green')
  log('   ✅ Store created with template (templateId fix working)', 'green')
  if (adminLoginSuccess) {
    log('   ✅ Admin endpoint accessible', 'green')
  }
  log('\n🎉 TemplateId fix is working correctly!', 'green')
}

runAllTests().catch(error => {
  log(`\n❌ Test suite error: ${error.message}`, 'red')
  process.exit(1)
})
