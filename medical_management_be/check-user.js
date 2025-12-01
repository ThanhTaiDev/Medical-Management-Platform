require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const phoneNumber = '0901000000';
    const password = '123123';
    
    console.log('Checking user:', phoneNumber);
    
    const user = await prisma.user.findFirst({
      where: { phoneNumber }
    });
    
    if (!user) {
      console.log('❌ User NOT FOUND in database');
      console.log('Available users:');
      const allUsers = await prisma.user.findMany({
        select: { phoneNumber: true, fullName: true, role: true },
        take: 5
      });
      allUsers.forEach(u => console.log(`  - ${u.phoneNumber}: ${u.fullName} (${u.role})`));
      return;
    }
    
    console.log('✅ User found:');
    console.log('  - Phone:', user.phoneNumber);
    console.log('  - Name:', user.fullName);
    console.log('  - Role:', user.role);
    console.log('  - Status:', user.status);
    console.log('  - Has password:', !!user.password);
    
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('  - Password match:', isMatch ? '✅ YES' : '❌ NO');
      
      if (!isMatch) {
        console.log('\n⚠️  Password does not match!');
        console.log('Expected password: 123123');
        console.log('Try re-seeding the database:');
        console.log('  FORCE_SEED=true yarn db:seed');
      }
    } else {
      console.log('  - ⚠️  User has no password!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();

