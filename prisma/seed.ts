import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createCategories, createProfessors, createCourses } from './seed-courses';
import { createLessons } from './seed-lessons';

const prisma = new PrismaClient();

async function main() {
  // Create the default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '+1234567890',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created/updated:', adminUser.username);

  // Create categories
  const categories = await createCategories();

  // Create professors
  const professors = await createProfessors();

  // Create courses
  const courses = await createCourses(categories, professors);

  // Create lessons for each course
  await createLessons(courses);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });