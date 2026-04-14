const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite'
const ADMIN_EMAIL = 'rahulkumar9508548671@gmail.com'
const ADMIN_PASSWORD = 'rahul123'

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean,
      isActive: Boolean,
      avatar: String,
      loginCount: Number,
      loginAttempts: Number,
      lastLogin: Date,
      createdAt: Date
    }))

    const adminEmail = ADMIN_EMAIL
    const adminPassword = ADMIN_PASSWORD

    // Check if super admin already exists
    const existing = await User.findOne({ email: adminEmail })
    
    if (existing) {
      console.log('✅ Super admin already exists:', existing.email)
      console.log('   ID:', existing._id)
      console.log('   Role:', existing.role)
      
      // Update to ensure correct role
      if (existing.role !== 'superadmin') {
        existing.role = 'superadmin'
        await existing.save()
        console.log('✅ Updated role to superadmin')
      }
      
      mongoose.connection.close()
      return
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'superadmin',
      isVerified: true,
      isActive: true,
      avatar: '',
      loginCount: 0,
      loginAttempts: 0,
      createdAt: new Date()
    })

    console.log('✅ Super admin created successfully!')
    console.log('   ID:', superAdmin._id)
    console.log('   Email:', superAdmin.email)
    console.log('   Role:', superAdmin.role)

    mongoose.connection.close()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createSuperAdmin()
