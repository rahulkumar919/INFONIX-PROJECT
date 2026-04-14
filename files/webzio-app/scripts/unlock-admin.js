const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rahulkumar9508548671_db_user:Rahul9142517255@ecommersewebsite.wbadeko.mongodb.net/EcommerseWebsite?retryWrites=true&w=majority&appName=EcommerseWebsite';

async function unlockAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find admin user
    const adminEmail = 'rahulkumar9508548671@gmail.com';
    const user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      console.log('ℹ️  No user found with email:', adminEmail);
      console.log('✅ Super admin login from .env.local will work directly!');
    } else {
      console.log('👤 Found user:', user.email);
      console.log('🔒 Lock status:', user.lockUntil ? 'LOCKED' : 'UNLOCKED');
      console.log('🔢 Login attempts:', user.loginAttempts || 0);
      
      if (user.lockUntil || user.loginAttempts > 0) {
        // Reset lock and attempts
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
        console.log('\n✅ Account unlocked and login attempts reset!');
      } else {
        console.log('\n✅ Account is already unlocked!');
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    console.log('\n🎯 Now you can login at: http://localhost:3001/admin/login');
    console.log('📧 Email: rahulkumar9508548671@gmail.com');
    console.log('🔑 Password: rahul123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

unlockAdmin();
