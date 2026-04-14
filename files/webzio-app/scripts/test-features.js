const BASE_URL = 'http://localhost:3001'
let authToken = ''
let storeId = ''
let pageId = ''
let imageId = ''

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

async function testLogin() {
  log('\n📝 Testing Login...', 'blue')
  
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
      logTest('Login API', true, `Token: ${authToken.substring(0, 20)}...`)
      return true
    } else {
      logTest('Login API', false, data.error || 'No token received')
      return false
    }
  } catch (error) {
    logTest('Login API', false, error.message)
    return false
  }
}

async function testGetStores() {
  log('\n🏪 Testing Get Stores...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/websites`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success && Array.isArray(data.websites)) {
      if (data.websites.length > 0) {
        storeId = data.websites[0]._id
        logTest('Get Stores API', true, `Found ${data.websites.length} stores, Using: ${storeId}`)
        return true
      } else {
        logTest('Get Stores API', true, 'No stores found - will create one')
        // Create a test store
        return await testCreateStore()
      }
    } else {
      logTest('Get Stores API', false, JSON.stringify(data))
      return false
    }
  } catch (error) {
    logTest('Get Stores API', false, error.message)
    return false
  }
}

async function testCreateStore() {
  log('\n🏗️  Testing Create Store...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/websites`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({
        siteName: 'Test Store ' + Date.now(),
        templateId: 1
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.website) {
      storeId = data.website._id
      logTest('Create Store API', true, `Store ID: ${storeId}`)
      return true
    } else {
      logTest('Create Store API', false, data.message || 'Failed to create store')
      return false
    }
  } catch (error) {
    logTest('Create Store API', false, error.message)
    return false
  }
}

async function testGetDashboardStats() {
  if (!storeId) {
    log('\n⚠️  Skipping Dashboard Stats (no store)', 'yellow')
    return true
  }
  
  log('\n📊 Testing Dashboard Stats...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/dashboard?storeId=${storeId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success && data.stats) {
      logTest('Dashboard Stats API', true, 
        `Visitors: ${data.stats.visitors}, Leads: ${data.stats.leads}, Pages: ${data.stats.pages}, Images: ${data.stats.images}`)
      return true
    } else {
      logTest('Dashboard Stats API', false, data.error || 'Invalid response')
      return false
    }
  } catch (error) {
    logTest('Dashboard Stats API', false, error.message)
    return false
  }
}

async function testCreatePage() {
  if (!storeId) {
    log('\n⚠️  Skipping Create Page (no store)', 'yellow')
    return true
  }
  
  log('\n📄 Testing Create Page...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/pages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({
        title: 'Test Page',
        slug: 'test-page-' + Date.now(),
        content: 'This is a test page content',
        metaTitle: 'Test Page - Meta Title',
        metaDescription: 'Test page meta description',
        isPublished: true
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.page) {
      pageId = data.page._id
      logTest('Create Page API', true, `Page ID: ${pageId}`)
      return true
    } else {
      logTest('Create Page API', false, data.error || 'Failed to create page')
      return false
    }
  } catch (error) {
    logTest('Create Page API', false, error.message)
    return false
  }
}

async function testGetPages() {
  if (!storeId) {
    log('\n⚠️  Skipping Get Pages (no store)', 'yellow')
    return true
  }
  
  log('\n📄 Testing Get Pages...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/pages`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success && Array.isArray(data.pages)) {
      logTest('Get Pages API', true, `Found ${data.pages.length} pages`)
      return true
    } else {
      logTest('Get Pages API', false, data.error || 'Invalid response')
      return false
    }
  } catch (error) {
    logTest('Get Pages API', false, error.message)
    return false
  }
}

async function testUpdatePage() {
  if (!storeId || !pageId) {
    log('\n⚠️  Skipping Update Page (no store or page)', 'yellow')
    return true
  }
  
  log('\n📝 Testing Update Page...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/pages/${pageId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({
        title: 'Updated Test Page',
        content: 'Updated content'
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.page) {
      logTest('Update Page API', true, `Updated: ${data.page.title}`)
      return true
    } else {
      logTest('Update Page API', false, data.error || 'Failed to update page')
      return false
    }
  } catch (error) {
    logTest('Update Page API', false, error.message)
    return false
  }
}

async function testDeletePage() {
  if (!storeId || !pageId) {
    log('\n⚠️  Skipping Delete Page (no store or page)', 'yellow')
    return true
  }
  
  log('\n🗑️  Testing Delete Page...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/pages/${pageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success) {
      logTest('Delete Page API', true, 'Page deleted successfully')
      return true
    } else {
      logTest('Delete Page API', false, data.error || 'Failed to delete page')
      return false
    }
  } catch (error) {
    logTest('Delete Page API', false, error.message)
    return false
  }
}

async function testGetGallery() {
  if (!storeId) {
    log('\n⚠️  Skipping Get Gallery (no store)', 'yellow')
    return true
  }
  
  log('\n🖼️  Testing Get Gallery...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/gallery`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success && Array.isArray(data.images)) {
      logTest('Get Gallery API', true, `Found ${data.images.length} images`)
      return true
    } else {
      logTest('Get Gallery API', false, data.error || 'Invalid response')
      return false
    }
  } catch (error) {
    logTest('Get Gallery API', false, error.message)
    return false
  }
}

async function testAddImage() {
  if (!storeId) {
    log('\n⚠️  Skipping Add Image (no store)', 'yellow')
    return true
  }
  
  log('\n📸 Testing Add Image...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/gallery`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({
        imageUrl: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Test+Image',
        title: 'Test Image',
        description: 'This is a test image'
      })
    })
    
    const data = await res.json()
    
    if (data.success && data.image) {
      imageId = data.image._id
      logTest('Add Image API', true, `Image ID: ${imageId}`)
      return true
    } else {
      logTest('Add Image API', false, data.error || 'Failed to add image')
      return false
    }
  } catch (error) {
    logTest('Add Image API', false, error.message)
    return false
  }
}

async function testDeleteImage() {
  if (!storeId || !imageId) {
    log('\n⚠️  Skipping Delete Image (no store or image)', 'yellow')
    return true
  }
  
  log('\n🗑️  Testing Delete Image...', 'blue')
  
  try {
    const res = await fetch(`${BASE_URL}/api/store/${storeId}/gallery/${imageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
    
    const data = await res.json()
    
    if (data.success) {
      logTest('Delete Image API', true, 'Image deleted successfully')
      return true
    } else {
      logTest('Delete Image API', false, data.error || 'Failed to delete image')
      return false
    }
  } catch (error) {
    logTest('Delete Image API', false, error.message)
    return false
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue')
  log('🧪 STORE ADMIN PANEL - API TESTING', 'blue')
  log('='.repeat(60) + '\n', 'blue')
  
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0
  }
  
  // Run tests in sequence
  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Get Stores', fn: testGetStores },
    { name: 'Dashboard Stats', fn: testGetDashboardStats },
    { name: 'Create Page', fn: testCreatePage },
    { name: 'Get Pages', fn: testGetPages },
    { name: 'Update Page', fn: testUpdatePage },
    { name: 'Delete Page', fn: testDeletePage },
    { name: 'Get Gallery', fn: testGetGallery },
    { name: 'Add Image', fn: testAddImage },
    { name: 'Delete Image', fn: testDeleteImage }
  ]
  
  for (const test of tests) {
    const result = await test.fn()
    if (result) results.passed++
    else results.failed++
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'blue')
  log('📊 TEST SUMMARY', 'blue')
  log('='.repeat(60), 'blue')
  log(`✅ Passed: ${results.passed}`, 'green')
  log(`❌ Failed: ${results.failed}`, 'red')
  log(`⚠️  Skipped: ${results.skipped}`, 'yellow')
  log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`, 'blue')
  log('='.repeat(60) + '\n', 'blue')
  
  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!', 'green')
  } else {
    log('⚠️  SOME TESTS FAILED - CHECK LOGS ABOVE', 'red')
  }
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red')
  process.exit(1)
})
