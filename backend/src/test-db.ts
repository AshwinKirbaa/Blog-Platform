import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to PostgreSQL database via Prisma...");
  const usersCount = await prisma.user.count();
  const postsCount = await prisma.post.count();
  const commentsCount = await prisma.comment.count();
  console.log("Database connection confirmed successfully!");
  console.log({ usersCount, postsCount, commentsCount });
}

main()
  .catch((e) => {
    console.error("Database connection error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
