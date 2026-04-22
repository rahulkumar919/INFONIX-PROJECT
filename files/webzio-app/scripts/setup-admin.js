const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

async function setupAdmin() {
  try {
    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('❌ Missing environment variables!')
      console.log('Please set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local')
      process.exit(1)
    }

    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const User = mongoose.connection.collection('users')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })

    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!')
      console.log('📧 Email:', existingAdmin.email)
      console.log('👤 Name:', existingAdmin.name)
      console.log('🔑 Role:', existingAdmin.role)

      // Update to superadmin and reset password
      console.log('\n🔄 Updating admin user...')
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
      
      await User.updateOne(
        { email: ADMIN_EMAIL.toLowerCase() },
        { 
          $set: { 
            password: hashedPassword,
            role: 'superadmin',
            isVerified: true,
            isActive: true,
            plan: 'business'
          } 
        }
      )
      console.log('✅ Admin user updated!')
    } else {
      console.log('\n📝 Creating new admin user...')
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
      
      const adminUser = {
        name: 'Super Admin',
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        role: 'superadmin',
        isVerified: true,
        isActive: true,
        plan: 'business',
        createdAt: new Date(),
        updatedAt: new Date(),
        loginCount: 0
      }

      await User.insertOne(adminUser)
      console.log('✅ Admin user created successfully!')
    }

    console.log('\n📋 Admin Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', ADMIN_EMAIL)
    console.log('🔑 Password:', ADMIN_PASSWORD)
    console.log('🔗 Login URL: http://localhost:3000/admin/login')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✅ Setup complete! You can now login.')

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupAdmin()
