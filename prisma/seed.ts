import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with test users...');

  // Create admin user with complete profile
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@edraak.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '+20123456789',
      secondPhoneNumber: '+20123456788',
      categoryPreference: 'Technology',
      referralSource: 'Official Website',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', adminUser.username);

  // Create professor user with complete profile
  const professorPassword = await bcrypt.hash('prof123', 10);
  const professorUser = await prisma.user.upsert({
    where: { username: 'professor1' },
    update: {},
    create: {
      username: 'professor1',
      email: 'professor.smith@edraak.com',
      password: professorPassword,
      firstName: 'Dr. John',
      lastName: 'Smith',
      phoneNumber: '+20123456780',
      secondPhoneNumber: '+20123456779',
      categoryPreference: 'Programming',
      referralSource: 'University Network',
      role: Role.PROFESSOR,
      isActive: true,
    },
  });
  console.log('✅ Created professor user:', professorUser.username);

  // Create student users with complete profiles
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUsers = [
    {
      username: 'student1',
      email: 'ahmed.hassan@edraak.com',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      phoneNumber: '+20123456781',
      secondPhoneNumber: '+20123456784',
      categoryPreference: 'Programming',
      referralSource: 'Google Search',
    },
    {
      username: 'student2',
      email: 'fatima.ali@edraak.com',
      firstName: 'Fatima',
      lastName: 'Ali',
      phoneNumber: '+20123456782',
      secondPhoneNumber: '+20123456785',
      categoryPreference: 'Data Science',
      referralSource: 'Social Media',
    },
    {
      username: 'student3',
      email: 'mohamed.sayed@edraak.com',
      firstName: 'Mohamed',
      lastName: 'Sayed',
      phoneNumber: '+20123456783',
      secondPhoneNumber: '+20123456786',
      categoryPreference: 'Business',
      referralSource: 'Friend Recommendation',
    },
  ];

  for (const studentData of studentUsers) {
    const student = await prisma.user.upsert({
      where: { username: studentData.username },
      update: {},
      create: {
        ...studentData,
        password: studentPassword,
        role: Role.STUDENT,
        isActive: true,
      },
    });
    console.log('✅ Created student user:', student.username);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test User Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin User:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Email: admin@edraak.com');
  console.log('   Full Name: System Administrator');
  console.log('   Phone: +20123456789');
  console.log('   Role: ADMIN');
  console.log('');
  console.log('👨‍🏫 Professor User:');
  console.log('   Username: professor1');
  console.log('   Password: prof123');
  console.log('   Email: professor.smith@edraak.com');
  console.log('   Full Name: Dr. John Smith');
  console.log('   Phone: +20123456780');
  console.log('   Role: PROFESSOR');
  console.log('');
  console.log('🎓 Student Users:');
  console.log('   1. student1 - student123');
  console.log('      Email: ahmed.hassan@edraak.com');
  console.log('      Name: Ahmed Hassan');
  console.log('      Phone: +20123456781');
  console.log('      Interest: Programming');
  console.log('');
  console.log('   2. student2 - student123');
  console.log('      Email: fatima.ali@edraak.com');
  console.log('      Name: Fatima Ali');
  console.log('      Phone: +20123456782');
  console.log('      Interest: Data Science');
  console.log('');
  console.log('   3. student3 - student123');
  console.log('      Email: mohamed.sayed@edraak.com');
  console.log('      Name: Mohamed Sayed');
  console.log('      Phone: +20123456783');
  console.log('      Interest: Business');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💳 PayMob Ready: All users have complete billing information!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });