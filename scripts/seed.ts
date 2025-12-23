import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Notice } from '../src/models/notice.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nebs-backend');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Notice.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create notices
    const notices = await Notice.create([
      {
        targetDepartmentOrIndividual: 'IT Department',
        targetType: 'department',
        noticeTitle: 'System Maintenance Notice',
        noticeType: 'Maintenance',
        publishDate: new Date(),
        noticeBody: 'The system will undergo maintenance on December 25, 2024 from 2 AM to 4 AM.',
        status: 'published',
        createdBy: 'system',
      },
      {
        targetDepartmentOrIndividual: 'John Doe',
        targetType: 'individual',
        noticeTitle: 'Employee Recognition',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        position: 'Senior Developer',
        noticeType: 'Recognition',
        publishDate: new Date(),
        noticeBody: 'Congratulations to John Doe for outstanding performance this quarter.',
        status: 'published',
        createdBy: 'system',
      },
      {
        targetDepartmentOrIndividual: 'HR Department',
        targetType: 'department',
        noticeTitle: 'Holiday Schedule',
        noticeType: 'Announcement',
        publishDate: new Date(),
        noticeBody: 'Please note the holiday schedule for the upcoming month.',
        status: 'draft',
        createdBy: 'system',
      },
    ]);
    console.log('✅ Created notices');

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


