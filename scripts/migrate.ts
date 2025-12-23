import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nebs-backend');
    console.log('✅ Connected to MongoDB');

    // Add your migration logic here
    // Example: Add new fields, update existing data, etc.

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

migrateDatabase();




