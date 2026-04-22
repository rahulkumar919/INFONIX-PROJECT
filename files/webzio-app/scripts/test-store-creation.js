const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite'

async function testStoreCreation() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if websites collection exists
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📁 Available collections:', collections.map(c => c.name).join(', '))

    // Count websites
    const Website = mongoose.connection.collection('websites')
    const count = await Website.countDocuments()
    console.log(`\n🏪 Total websites in database: ${count}`)

    // List all websites
    if (count > 0) {
      const websites = await Website.find({}).toArray()
      console.log('\n📋 Websites:')
      websites.forEach((site, i) => {
        console.log(`\n${i + 1}. ${site.siteName}`)
        console.log(`   Slug: ${site.slug}`)
        console.log(`   Template ID: ${site.templateId}`)
        console.log(`   Active: ${site.isActive}`)
        console.log(`   Views: ${site.views || 0}`)
        console.log(`   Created: ${site.createdAt}`)
      })
    } else {
      console.log('\n⚠️  No websites found in database')
    }

    await mongoose.disconnect()
    console.log('\n✅ Test completed')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testStoreCreation()
