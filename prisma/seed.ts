import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding services...');

  // Create services if they don't exist
  const nutritionService = await prisma.service.upsert({
    where: { slug: 'nutrition' },
    update: {},
    create: {
      name: 'Nutrition',
      slug: 'nutrition',
      description: 'Professional nutrition programs designed specifically for athletes with personalized meal plans and continuous support.',
    },
  });

  const psychologyService = await prisma.service.upsert({
    where: { slug: 'psychology' },
    update: {},
    create: {
      name: 'Psychology',
      slug: 'psychology',
      description: 'Sports psychology consultations to support you psychologically in your sports journey with specialized experts.',
    },
  });

  const trainingService = await prisma.service.upsert({
    where: { slug: 'training' },
    update: {},
    create: {
      name: 'Training',
      slug: 'training',
      description: 'Personalized training programs designed by certified trainers for all levels, from beginners to professional athletes.',
    },
  });

  // Create service tiers for Nutrition
  const nutritionSilver = await prisma.serviceTier.create({
    data: {
      name: 'Silver',
      order: 1,
      service: { connect: { id: nutritionService.id } },
    },
  });

  const nutritionGold = await prisma.serviceTier.create({
    data: {
      name: 'Gold',
      order: 2,
      isPopular: true,
      service: { connect: { id: nutritionService.id } },
    },
  });

  const nutritionDiamond = await prisma.serviceTier.create({
    data: {
      name: 'Diamond',
      order: 3,
      service: { connect: { id: nutritionService.id } },
    },
  });

  // Create service tiers for Psychology
  const psychologySilver = await prisma.serviceTier.create({
    data: {
      name: 'Silver',
      order: 1,
      service: { connect: { id: psychologyService.id } },
    },
  });

  const psychologyGold = await prisma.serviceTier.create({
    data: {
      name: 'Gold',
      order: 2,
      isPopular: true,
      service: { connect: { id: psychologyService.id } },
    },
  });

  const psychologyDiamond = await prisma.serviceTier.create({
    data: {
      name: 'Diamond',
      order: 3,
      service: { connect: { id: psychologyService.id } },
    },
  });

  // Create service tiers for Training
  const trainingSilver = await prisma.serviceTier.create({
    data: {
      name: 'Silver',
      order: 1,
      service: { connect: { id: trainingService.id } },
    },
  });

  const trainingGold = await prisma.serviceTier.create({
    data: {
      name: 'Gold',
      order: 2,
      isPopular: true,
      service: { connect: { id: trainingService.id } },
    },
  });

  const trainingDiamond = await prisma.serviceTier.create({
    data: {
      name: 'Diamond',
      order: 3,
      service: { connect: { id: trainingService.id } },
    },
  });

  // Create service prices for Nutrition
  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 495,
      tier: { connect: { id: nutritionSilver.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 995,
      tier: { connect: { id: nutritionGold.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 1495,
      tier: { connect: { id: nutritionDiamond.id } },
    },
  });

  // Create service prices for Psychology
  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 495,
      tier: { connect: { id: psychologySilver.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 995,
      tier: { connect: { id: psychologyGold.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 1495,
      tier: { connect: { id: psychologyDiamond.id } },
    },
  });

  // Create service prices for Training
  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 495,
      tier: { connect: { id: trainingSilver.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 995,
      tier: { connect: { id: trainingGold.id } },
    },
  });

  await prisma.servicePrice.create({
    data: {
      duration: 'monthly',
      price: 1495,
      tier: { connect: { id: trainingDiamond.id } },
    },
  });

  console.log('Services and pricing created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });