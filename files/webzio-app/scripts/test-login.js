const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite'

async function testLogin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean,
      isActive: Boolean,
    }))

    // Test email from screenshot (CORRECTED)
    const testEmail = 'rahulkumar9508548671@gmail.com'
    const testPassword = 'rahul@123'

    console.log('\n🔍 Searching for user:', testEmail)
    const user = await User.findOne({ email: testEmail.toLowerCase().trim() })

    if (!user) {
      console.log('❌ User not found!')
      console.log('\n📋 Let me check all users in database...')
      const allUsers = await User.find({}).select('name email role isVerified')
      console.log('Total users:', allUsers.length)
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) - Verified: ${u.isVerified}`)
      })
    } else {
      console.log('✅ User found!')
      console.log('User details:')
      console.log('  - ID:', user._id)
      console.log('  - Name:', user.name)
      console.log('  - Email:', user.email)
      console.log('  - Role:', user.role)
      console.log('  - Verified:', user.isVerified)
      console.log('  - Active:', user.isActive)
      console.log('  - Password hash:', user.password ? user.password.substring(0, 20) + '...' : 'NULL')

      // Test password
      console.log('\n🔐 Testing password:', testPassword)
      const isMatch = await bcrypt.compare(testPassword, user.password)
      console.log('Password match:', isMatch ? '✅ YES' : '❌ NO')

      if (!isMatch) {
        console.log('\n💡 Let me try common passwords...')
        const commonPasswords = ['rahul123', 'rahul@123', 'Rahul123', 'Rahul@123', 'password', '123456']
        for (const pwd of commonPasswords) {
          const match = await bcrypt.compare(pwd, user.password)
          if (match) {
            console.log(`✅ Found matching password: "${pwd}"`)
            break
          }
        }
      }
    }

    await mongoose.disconnect()
    console.log('\n✅ Test complete')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testLogin()
