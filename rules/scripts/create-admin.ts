import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  const prisma = new PrismaClient();
  
  try {
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

    console.log('✅ Admin user created/updated successfully!');
    console.log('Username:', adminUser.username);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();