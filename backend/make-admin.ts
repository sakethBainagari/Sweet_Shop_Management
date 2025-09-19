import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function makeUserAdmin() {
  try {
    // Update the existing admin@sweetshop.com user to be ADMIN
    const admin = await prisma.user.update({
      where: { email: 'admin@sweetshop.com' },
      data: { role: 'ADMIN' }
    });

    console.log('✅ User updated to admin successfully!');
    console.log('Email: admin@sweetshop.com');
    console.log('Role:', admin.role);
    console.log('User ID:', admin.id);
  } catch (error) {
    console.error('❌ Error updating user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin();