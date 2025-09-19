import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await prisma.user.findMany({ take: 1 });
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();