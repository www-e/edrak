import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with complete data structure...');

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
      categoryPreference: 'Sports Science',
      referralSource: 'Official Website',
      role: 'ADMIN',
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
      categoryPreference: 'Sports Science',
      referralSource: 'University Network',
      role: 'PROFESSOR',
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
      categoryPreference: 'Sports Science',
      referralSource: 'Google Search',
    },
    {
      username: 'student2',
      email: 'fatima.ali@edraak.com',
      firstName: 'Fatima',
      lastName: 'Ali',
      phoneNumber: '+20123456782',
      secondPhoneNumber: '+20123456785',
      categoryPreference: 'Nutrition',
      referralSource: 'Social Media',
    },
    {
      username: 'student3',
      email: 'mohamed.sayed@edraak.com',
      firstName: 'Mohamed',
      lastName: 'Sayed',
      phoneNumber: '+20123456783',
      secondPhoneNumber: '+20123456786',
      categoryPreference: 'Training',
      referralSource: 'Friend Recommendation',
    },
  ];

  const createdStudents = [];

  for (const studentData of studentUsers) {
    const student = await prisma.user.upsert({
      where: { username: studentData.username },
      update: {},
      create: {
        ...studentData,
        password: studentPassword,
        role: 'STUDENT',
        isActive: true,
      },
    });
    console.log('✅ Created student user:', student.username);
    createdStudents.push(student);
  }

    // Create categories
    const categories = [
      {
        name: 'التغذية',
        slug: 'nutrition',
        description: 'تعلم التغذية الرياضية واتباع نمط حياة صحي'
      },
      {
        name: 'التأهيل و الاصابات',
        slug: 'rehabilitation-and-injuries',
        description: 'تعلم كيفية التعامل مع الاصابات الرياضية'
      },
      {
        name: 'علم النفس الرياضي',
        slug: 'sports-psychology',
        description: 'فهم الجوانب النفسية للرياضيين'
      },
      {
        name: 'الميكانيكا و علم الحركه الرياضيه',
        slug: 'sports-mechanics-kinesiology',
        description: 'دراسة حركة الجسم وتحليلها'
      },
      {
        name: 'الرياضات التخصصية',
        slug: 'specialized-sports',
        description: 'الرياضات المختلفة وتقنياتها'
      },
      {
        name: 'التدريب و الاحمال الرياضية',
        slug: 'sports-training-and-loading',
        description: 'التدريب الرياضي وادارة الاحمال'
      },
      {
        name: 'الادارة الرياضية',
        slug: 'sports-management',
        description: 'ادارة الفرق الرياضية'
      },
      {
        name: 'القياسات البدنية و الفسيولوجية',
        slug: 'physical-and-physiological-measurements',
        description: 'القياسات والفحوصات البدنية والفيزيولوجية'
      }
    ];

    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData,
      });
      console.log('✅ Created category:', category.name);
    }

    // Create sample courses
    const nutritionCategory = await prisma.category.findUnique({ where: { slug: 'nutrition' } });

    const courses = [
      {
        title: 'Complete Sports Nutrition Guide',
        slug: 'complete-sports-nutrition-guide',
        description: 'Learn everything about sports nutrition including meal planning, supplements, and hydration strategies to maximize athletic performance. This comprehensive course covers everything from basic nutrition to advanced topics.',
        price: 299.99,
        language: 'English',
        visibility: 'PUBLISHED' as const,
        professorId: professorUser.id,
        categoryId: nutritionCategory?.id,
      },
      {
        title: 'Data Analysis for Athletes',
        slug: 'data-analysis-for-athletes',
        description: 'Master data analysis techniques for athlete performance metrics, training optimization, and improvement tracking. Learn how to use data for better performance.',
        price: 199.99,
        language: 'English',
        visibility: 'PUBLISHED' as const,
        professorId: professorUser.id,
        categoryId: nutritionCategory?.id,
      }
    ];

    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: {},
        create: courseData,
      });
      console.log('✅ Created course:', course.title);

      // Create sample lessons for each course
      const lessons = [
        {
          title: 'Introduction and Setup',
          order: 1,
          content: 'Welcome to the course! In this lesson, we will cover the basics and help you set up your development environment.',
          isVisible: true,
        },
        {
          title: 'Core Concepts',
          order: 2,
          content: 'Let\'s dive into the core concepts that form the foundation of this topic. We\'ll explore key principles and best practices.',
          isVisible: true,
        },
        {
          title: 'Hands-on Practice',
          order: 3,
          content: 'Time to apply what you\'ve learned! This lesson includes practical exercises and real-world examples.',
          isVisible: true,
        }
      ];

      for (const lessonData of lessons) {
        const lesson = await prisma.lesson.upsert({
          where: {
            id: `${course.id}-lesson-${lessonData.order}`
          },
          update: {},
          create: {
            ...lessonData,
            courseId: course.id,
          },
        });
        console.log('  ✅ Created lesson:', lesson.title);
      }
    }

    // Enroll students in courses
    const course = await prisma.course.findFirst({ where: { slug: 'complete-web-development-bootcamp' } });

    if (course) {
      for (const student of [adminUser, ...createdStudents]) {
        const enrollment = await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: student.id,
              courseId: course.id
            }
          },
          update: {},
          create: {
            userId: student.id,
            courseId: course.id,
            status: 'ACTIVE',
          },
        });
        console.log('✅ Enrolled student:', student.username, 'in course:', course.title);
      }
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
  console.log('      Interest: Sports Science');
  console.log('');
  console.log('   2. student2 - student123');
  console.log('      Email: fatima.ali@edraak.com');
  console.log('      Name: Fatima Ali');
  console.log('      Phone: +20123456782');
  console.log('      Interest: Nutrition');
  console.log('');
  console.log('   3. student3 - student123');
  console.log('      Email: mohamed.sayed@edraak.com');
  console.log('      Name: Mohamed Sayed');
  console.log('      Phone: +20123456783');
  console.log('      Interest: Training');
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