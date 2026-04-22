const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function createAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webzio'
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get admin details
    console.log('\n📝 Create Admin User\n')
    const name = await question('Enter admin name: ')
    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password: ')
    const role = await question('Enter role (admin/superadmin) [admin]: ') || 'admin'

    if (!name || !email || !password) {
      console.log('❌ All fields are required!')
      process.exit(1)
    }

    // Check if user already exists
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean,
      isActive: Boolean,
      createdAt: Date,
      lastLogin: Date,
      loginCount: Number
    }))

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      console.log('\n⚠️  User already exists!')
      const update = await question('Do you want to update this user to admin? (yes/no): ')
      
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              name,
              password: hashedPassword,
              role,
              isVerified: true,
              isActive: true
            }
          }
        )
        console.log('✅ User updated to admin successfully!')
      } else {
        console.log('❌ Operation cancelled')
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create admin user
      const admin = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        loginCount: 0
      })

      await admin.save()
      console.log('\n✅ Admin user created successfully!')
    }

    console.log('\n📋 Admin Details:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Name:     ${name}`)
    console.log(`Email:    ${email}`)
    console.log(`Role:     ${role}`)
    console.log(`Password: ${password}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🔐 You can now login at: http://localhost:3000/admin/login')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
    await mongoose.disconnect()
    process.exit(0)
  }
}

createAdmin()
