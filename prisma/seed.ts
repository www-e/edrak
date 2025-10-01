import { PrismaClient, Role, CourseVisibility } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '+20123456789',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', adminUser.username);

  // Create professor user
  const professorPassword = await bcrypt.hash('prof123', 10);
  const professorUser = await prisma.user.upsert({
    where: { username: 'professor1' },
    update: {},
    create: {
      username: 'professor1',
      email: 'professor1@example.com',
      password: professorPassword,
      firstName: 'Dr. John',
      lastName: 'Smith',
      phoneNumber: '+20123456780',
      role: Role.PROFESSOR,
      isActive: true,
    },
  });
  console.log('✅ Created professor user:', professorUser.username);

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUsers = [
    {
      username: 'student1',
      email: 'student1@example.com',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      phoneNumber: '+20123456781',
    },
    {
      username: 'student2',
      email: 'student2@example.com',
      firstName: 'Fatima',
      lastName: 'Ali',
      phoneNumber: '+20123456782',
    },
    {
      username: 'student3',
      email: 'student3@example.com',
      firstName: 'Mohamed',
      lastName: 'Sayed',
      phoneNumber: '+20123456783',
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

  // Create categories
  const categories = [
    {
      name: 'Programming',
      slug: 'programming',
      description: 'Learn programming languages and software development',
    },
    {
      name: 'Data Science',
      slug: 'data-science',
      description: 'Master data analysis, machine learning, and AI',
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX design, graphic design, and creative skills',
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Business management, entrepreneurship, and leadership',
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log('✅ Created category:', category.name);
  }

  // Get programming category for courses
  const programmingCategory = await prisma.category.findUnique({
    where: { slug: 'programming' },
  });

  // Create sample courses
  const courses = [
    {
      title: 'Complete React.js Developer Course',
      slug: 'complete-react-js-developer-course',
      description: 'Master React.js from basics to advanced concepts including hooks, context, and performance optimization.',
      price: 299.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professorId: professorUser.id,
      categoryId: programmingCategory?.id,
    },
    {
      title: 'Python for Data Science and Machine Learning',
      slug: 'python-data-science-ml',
      description: 'Learn Python programming for data analysis, visualization, and machine learning with real-world projects.',
      price: 399.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professorId: professorUser.id,
      categoryId: programmingCategory?.id,
    },
    {
      title: 'Advanced JavaScript Concepts',
      slug: 'advanced-javascript-concepts',
      description: 'Deep dive into advanced JavaScript topics including closures, prototypes, async programming, and ES6+ features.',
      price: 199.99,
      language: 'English',
      visibility: CourseVisibility.DRAFT,
      professorId: professorUser.id,
      categoryId: programmingCategory?.id,
    },
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
        content: 'Welcome to the course! In this lesson, we will cover the basics and setup requirements.',
        isVisible: true,
      },
      {
        title: 'Core Concepts',
        order: 2,
        content: 'Let\'s dive into the core concepts that form the foundation of this topic.',
        isVisible: true,
      },
      {
        title: 'Hands-on Practice',
        order: 3,
        content: 'Time to apply what you\'ve learned with practical exercises and projects.',
        isVisible: true,
      },
    ];

    for (const lessonData of lessons) {
      // Check if lesson already exists
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          courseId: course.id,
          order: lessonData.order,
        },
      });

      let lesson;
      if (existingLesson) {
        lesson = existingLesson;
      } else {
        lesson = await prisma.lesson.create({
          data: {
            ...lessonData,
            courseId: course.id,
          },
        });
      }
      console.log('  📚 Created lesson:', lesson.title);
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin / admin123');
  console.log('Professor: professor1 / prof123');
  console.log('Students: student1/student2/student3 / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });