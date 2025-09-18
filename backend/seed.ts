import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  
  // Create sample sweets
  const sweets = await prisma.sweet.createMany({
    data: [
      {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 15.99,
        quantity: 50,
        description: 'Delicious chocolate cake with rich cocoa flavor'
      },
      {
        name: 'Vanilla Ice Cream',
        category: 'Ice Cream',
        price: 8.50,
        quantity: 30,
        description: 'Creamy vanilla ice cream made with real vanilla beans'
      },
      {
        name: 'Strawberry Cupcake',
        category: 'Cupcakes',
        price: 4.25,
        quantity: 25,
        description: 'Fresh strawberry cupcake with cream cheese frosting'
      },
      {
        name: 'Chocolate Cookies',
        category: 'Cookies',
        price: 12.00,
        quantity: 40,
        description: 'Crispy chocolate chip cookies baked to perfection'
      },
      {
        name: 'Lemon Tart',
        category: 'Tarts',
        price: 6.75,
        quantity: 20,
        description: 'Tangy lemon tart with buttery pastry crust'
      },
      {
        name: 'Red Velvet Cake',
        category: 'Cakes',
        price: 18.50,
        quantity: 15,
        description: 'Classic red velvet cake with cream cheese frosting'
      }
    ]
  });

  console.log(`Created ${sweets.count} sweets successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });