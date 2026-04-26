#!/usr/bin/env node
/**
 * Script to fix templateId field type in existing Website documents
 * Run: node scripts/fix-templateid.js
 */

const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

async function fixTemplateIds() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    const collection = db.collection('websites')

    // Find all documents where templateId is not an ObjectId
    const docs = await collection.find({}).toArray()
    
    console.log(`\n📊 Found ${docs.length} total documents`)

    let fixed = 0
    let errors = 0

    for (const doc of docs) {
      try {
        // Check if templateId exists and is not already an ObjectId
        if (doc.templateId) {
          let newTemplateId

          // If it's a string, convert to ObjectId
          if (typeof doc.templateId === 'string') {
            newTemplateId = new mongoose.Types.ObjectId(doc.templateId)
          }
          // If it's a number, we can't convert it - need to set a default or delete
          else if (typeof doc.templateId === 'number') {
            console.log(`⚠️  Document ${doc._id} has numeric templateId: ${doc.templateId}`)
            // You might want to set a default template here
            // For now, we'll skip these
            errors++
            continue
          }
          // If it's already an ObjectId, skip
          else if (doc.templateId instanceof mongoose.Types.ObjectId) {
            continue
          }

          // Update the document
          if (newTemplateId) {
            await collection.updateOne(
              { _id: doc._id },
              { $set: { templateId: newTemplateId } }
            )
            fixed++
            console.log(`✅ Fixed document ${doc._id}`)
          }
        }
      } catch (err) {
        console.error(`❌ Error fixing document ${doc._id}:`, err.message)
        errors++
      }
    }

    console.log(`\n📈 Summary:`)
    console.log(`   ✅ Fixed: ${fixed}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`   📝 Total: ${docs.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

fixTemplateIds()
