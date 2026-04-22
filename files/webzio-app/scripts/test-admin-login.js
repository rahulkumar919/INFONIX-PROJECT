const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Admin Login System\n')

// Read .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    line = line.trim()
    if (line.startsWith('#') || !line) return
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      env[match[1].trim()] = match[2].trim()
    }
  })
  
  return env
}

const env = loadEnv()

console.log('📋 Configuration Check:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`✓ Admin Email: ${env.ADMIN_EMAIL}`)
console.log(`✓ Admin Password: ${'*'.repeat(env.ADMIN_PASSWORD?.length || 0)}`)
console.log(`✓ JWT Secret: ${env.JWT_SECRET ? '✓ Set' : '✗ Missing'}`)
console.log(`✓ MongoDB URI: ${env.MONGODB_URI ? '✓ Set' : '✗ Missing'}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('🔐 Admin Login URLs:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Login Page:  http://localhost:3000/admin/login')
console.log('Dashboard:   http://localhost:3000/admin')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('📝 Login Steps:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Open: http://localhost:3000/admin/login')
console.log(`2. Email: ${env.ADMIN_EMAIL}`)
console.log(`3. Password: ${env.ADMIN_PASSWORD}`)
console.log('4. Click: "⚡ Access Control Panel"')
console.log('5. Should redirect to: /admin')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('🔍 Debugging Checklist:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('□ Admin user exists in database')
console.log('  → Run: node scripts/setup-admin.js')
console.log('')
console.log('□ Browser console shows no errors')
console.log('  → Press F12 and check Console tab')
console.log('')
console.log('□ Cookie is set after login')
console.log('  → DevTools > Application > Cookies > token')
console.log('')
console.log('□ Middleware logs show token verification')
console.log('  → Check terminal where dev server is running')
console.log('')
console.log('□ Using correct login URL')
console.log('  → /admin/login (NOT /login)')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('🚀 Quick Fix:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('If login not working:')
console.log('1. Clear browser cookies (Ctrl+Shift+Delete)')
console.log('2. Run: node scripts/setup-admin.js')
console.log('3. Restart dev server: npm run dev')
console.log('4. Try login again')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('✅ Test script complete!\n')
