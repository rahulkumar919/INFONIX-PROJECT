const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Hardcoded credentials - easy to use
const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite'
const ADMIN_EMAIL = 'admin@test.com'
const ADMIN_PASSWORD = 'admin123'

async function createQuickAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected!')

    const User = mongoose.connection.collection('users')

    // Delete existing admin if exists
    await User.deleteOne({ email: ADMIN_EMAIL })
    console.log('🗑️  Cleared old admin (if any)')

    // Create fresh admin
    console.log('📝 Creating admin...')
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    await User.insertOne({
      name: 'Super Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'superadmin',
      isVerified: true,
      isActive: true,
      plan: 'business',
      createdAt: new Date(),
      updatedAt: new Date(),
      loginCount: 0
    })

    console.log('\n✅ ADMIN CREATED SUCCESSFULLY!')
    console.log('\n╔════════════════════════════════════╗')
    console.log('║     ADMIN LOGIN CREDENTIALS        ║')
    console.log('╠════════════════════════════════════╣')
    console.log('║ Email:    admin@test.com           ║')
    console.log('║ Password: admin123                 ║')
    console.log('║ URL:      /admin/login             ║')
    console.log('╚════════════════════════════════════╝')
    console.log('\n🚀 Go to: http://localhost:3000/admin/login')
    console.log('📧 Enter: admin@test.com')
    console.log('🔑 Enter: admin123')
    console.log('\n✨ Ready to use!')

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createQuickAdmin()
