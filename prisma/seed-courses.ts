import { PrismaClient, CourseVisibility, Role } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

/**
 * Creates categories if they don't exist
 */
async function createCategories() {
  const categoriesData = [
    { name: 'Physical Training', slug: 'physical-training' },
    { name: 'Nutrition', slug: 'nutrition' },
    { name: 'Diving', slug: 'diving' },
    { name: 'Physics', slug: 'physics' },
    { name: 'Sports Training', slug: 'sports-training' },
    { name: 'Wellness', slug: 'wellness' },
  ];

  const categories = [];
  for (const categoryData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
      },
    });
    categories.push(category);
    console.log(`Category created: ${category.name}`);
  }

  return categories;
}

/**
 * Creates professors if they don't exist
 */
async function createProfessors() {
  const professorsData = [
    {
      username: 'coach_anderson',
      firstName: 'James',
      lastName: 'Anderson',
      phoneNumber: '+1987654321',
      role: 'PROFESSOR',
    },
    {
      username: 'dr_martinez',
      firstName: 'Maria',
      lastName: 'Martinez',
      phoneNumber: '+1555123456',
      role: 'PROFESSOR',
    },
    {
      username: 'prof_wilson',
      firstName: 'Robert',
      lastName: 'Wilson',
      phoneNumber: '+1555234567',
      role: 'PROFESSOR',
    },
    {
      username: 'coach_thompson',
      firstName: 'Lisa',
      lastName: 'Thompson',
      phoneNumber: '+1555345678',
      role: 'PROFESSOR',
    },
    {
      username: 'dr_clark',
      firstName: 'Thomas',
      lastName: 'Clark',
      phoneNumber: '+1555456789',
      role: 'PROFESSOR',
    },
  ];

  const professors = [];
  for (const profData of professorsData) {
    // Hash a default password
    const password = await import('bcryptjs').then(bcrypt => bcrypt.hash('prof123', 10));
    
    const professor = await prisma.user.upsert({
      where: { username: profData.username },
      update: {},
      create: {
        username: profData.username,
        password,
        firstName: profData.firstName,
        lastName: profData.lastName,
        phoneNumber: profData.phoneNumber,
        role: Role.PROFESSOR,
        isActive: true,
      },
    });
    professors.push(professor);
    console.log(`Professor created: ${professor.firstName} ${professor.lastName}`);
  }

  return professors;
}

/**
 * Creates courses with realistic data
 */
async function createCourses(categories: any[], professors: any[]) {
  // Get the professors and categories by ID for reference
  const [physicalTrainingCat, nutritionCat, divingCat, physicsCat, sportsTrainingCat, wellnessCat] = categories;
  const [coachAnderson, drMartinez, profWilson, coachThompson, drClark] = professors;

  const coursesData = [
    {
      title: 'Advanced Physical Training Techniques',
      description: 'Master cutting-edge training methodologies, periodization, and performance optimization for athletes and fitness enthusiasts.',
      price: 129.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: coachAnderson,
      category: physicalTrainingCat,
      rating: 4.8,
      ratingCount: 1245,
    },
    {
      title: 'Sports Nutrition for Peak Performance',
      description: 'Learn how to fuel your body for optimal athletic performance through evidence-based nutrition strategies tailored to different sports.',
      price: 149.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: drMartinez,
      category: nutritionCat,
      rating: 4.7,
      ratingCount: 987,
    },
    {
      title: 'Professional Diving Techniques and Safety',
      description: 'Comprehensive scuba diving course covering advanced techniques, safety protocols, and underwater navigation for recreational and professional divers.',
      price: 99.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: profWilson,
      category: divingCat,
      rating: 4.6,
      ratingCount: 756,
    },
    {
      title: 'Physics of Human Movement',
      description: 'Explore the principles of biomechanics and physics applied to human movement, sports, and exercise. Understand forces, motion, and energy transfer.',
      price: 89.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: drClark,
      category: physicsCat,
      rating: 4.9,
      ratingCount: 1024,
    },
    {
      title: 'Sports-Specific Training Programs',
      description: 'Design and implement training programs specific to football, basketball, tennis, and other sports with proven methodologies.',
      price: 119.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: coachThompson,
      category: sportsTrainingCat,
      rating: 4.5,
      ratingCount: 642,
    },
    {
      title: 'Functional Fitness for Daily Living',
      description: 'Develop strength, flexibility, and mobility patterns that enhance everyday activities and prevent injury through functional movement patterns.',
      price: 79.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: coachAnderson,
      category: physicalTrainingCat,
      rating: 4.7,
      ratingCount: 876,
    },
    {
      title: 'Mindful Eating and Nutrition Habits',
      description: 'Learn to develop a healthy relationship with food and establish sustainable nutrition habits for long-term wellness.',
      price: 0, // Free course
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: drMartinez,
      category: nutritionCat,
      rating: 4.4,
      ratingCount: 1324,
    },
    {
      title: 'Diving Equipment Maintenance and Troubleshooting',
      description: 'Learn how to properly maintain, repair, and troubleshoot common scuba diving equipment to ensure safety and extend gear life.',
      price: 99.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: profWilson,
      category: divingCat,
      rating: 4.6,
      ratingCount: 1112,
    },
    {
      title: 'Biomechanics of Swimming',
      description: 'Analyze swimming techniques through the lens of biomechanics and physics to improve efficiency and performance in the water.',
      price: 79.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: drClark,
      category: physicsCat,
      rating: 4.3,
      ratingCount: 543,
    },
    {
      title: 'Recovery and Regeneration for Athletes',
      description: 'Learn evidence-based recovery techniques including sleep optimization, active recovery, and therapeutic interventions to enhance performance.',
      price: 109.99,
      language: 'English',
      visibility: CourseVisibility.PUBLISHED,
      professor: coachThompson,
      category: wellnessCat,
      rating: 4.7,
      ratingCount: 912,
    },
  ];

  const courses = [];
  for (const courseData of coursesData) {
    // Create a unique slug
    const slug = `${courseData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${nanoid(6)}`;
    
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug,
        description: courseData.description,
        price: courseData.price,
        language: courseData.language,
        visibility: courseData.visibility,
        rating: courseData.rating,
        ratingCount: courseData.ratingCount,
        professor: {
          connect: { id: courseData.professor.id }
        },
        category: {
          connect: { id: courseData.category.id }
        }
      },
    });
    courses.push(course);
    console.log(`Course created: ${course.title}`);
  }

  return courses;
}

export {
  createCategories,
  createProfessors,
  createCourses
};