const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function checkTemplates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Template = mongoose.model('Template', new mongoose.Schema({}, { strict: false }));
    const templates = await Template.find({});
    
    console.log(`\n📊 Found ${templates.length} templates in database:\n`);
    
    templates.forEach((t, i) => {
      console.log(`${i + 1}. ${t.name} (${t.category}) - ${t.templateType || 'general'} ${t.popular ? '⭐' : ''}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTemplates();
